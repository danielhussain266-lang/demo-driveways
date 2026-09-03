#!/usr/bin/env python3
"""
GROUNDWORK STUDIOS — PHOTOREAL SURFACE COMPOSITOR

Replaces the ground surface inside a real photograph with a real
paving-material photograph, perspective-warped into the same quad.

The realism comes from one trick: the destination region's own
luminance is extracted and multiplied back over the new surface, so
the original photograph's shadows, highlights and falloff survive.
Before/after frames share a base plate and a quad, so they line up
exactly — the slider reveals one photo changing, not two photos.
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance


def find_coeffs(dst, src):
    """Perspective coefficients for PIL. dst/src are 4 (x, y) corners."""
    matrix = []
    for (dx, dy), (sx, sy) in zip(dst, src):
        matrix.append([dx, dy, 1, 0, 0, 0, -sx * dx, -sx * dy])
        matrix.append([0, 0, 0, dx, dy, 1, -sy * dx, -sy * dy])
    A = np.array(matrix, dtype=float)
    B = np.array(src, dtype=float).reshape(8)
    return np.linalg.solve(A, B)


def tiled(tex, tile_px, canvas):
    """Tile a texture to fill `canvas` (w, h) at tile_px resolution."""
    t = tex.convert("RGB").resize((tile_px, tile_px), Image.LANCZOS)
    w, h = canvas
    out = Image.new("RGB", canvas)
    for y in range(0, h, tile_px):
        for x in range(0, w, tile_px):
            out.paste(t, (x, y))
    return out


def quad_mask(size, quad, feather=6):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).polygon([tuple(p) for p in quad], fill=255)
    if feather:
        m = m.filter(ImageFilter.GaussianBlur(feather))
    return m


def luminance_field(base, mask, softness=9, strength=0.85, lift=0.5):
    """
    Shading field from the base photo: 1.0 = original brightness.
    Softened so material detail comes from the texture, while large-scale
    shadows and lighting falloff come from the photograph.
    """
    g = base.convert("L").filter(ImageFilter.GaussianBlur(softness))
    a = np.asarray(g, dtype=np.float32) / 255.0
    m = np.asarray(mask, dtype=np.float32) / 255.0
    inside = a[m > 0.35]
    if inside.size == 0:
        return np.ones_like(a)
    mean = float(inside.mean()) or 0.5
    field = a / max(mean, 1e-3)
    field = 1.0 + (field - 1.0) * strength
    return np.clip(field, lift, 1.0 / max(lift, 1e-3))


def composite_surface(base_path, texture_path, quad, tile_px=210,
                      grade=None, wet=0.0, tint=None):
    """
    base_path   real photograph (the plate)
    texture_path real material photograph
    quad        4 (x, y) corners of the surface, clockwise from far-left
    """
    base = Image.open(base_path).convert("RGB")
    W, H = base.size

    # 1. tile the material, then warp it into the quad
    src_w = src_h = 1400
    sheet = tiled(Image.open(texture_path), tile_px, (src_w, src_h))
    coeffs = find_coeffs(quad, [(0, 0), (src_w, 0), (src_w, src_h), (0, src_h)])
    warped = sheet.transform((W, H), Image.PERSPECTIVE, coeffs,
                             resample=Image.BICUBIC)

    # 2. carry the plate's own lighting onto the new surface
    mask = quad_mask((W, H), quad, feather=5)
    field = luminance_field(base, mask)
    arr = np.asarray(warped, dtype=np.float32)
    arr *= field[:, :, None]

    if tint is not None:
        arr = arr * np.array(tint, dtype=np.float32)[None, None, :]

    # 3. specular sheen for a freshly-laid / damp look
    if wet > 0:
        g = np.asarray(base.convert("L").filter(ImageFilter.GaussianBlur(14)),
                       dtype=np.float32) / 255.0
        hi = np.clip((g - 0.55) / 0.45, 0, 1) ** 2
        arr += hi[:, :, None] * 255.0 * wet

    surface = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

    out = base.copy()
    out.paste(surface, (0, 0), mask)

    # 4. contact shadow along the far edge, where surface meets the plate
    shade = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(shade)
    (x0, y0), (x1, y1) = quad[0], quad[1]
    depth = max(10, int(H * 0.055))
    d.polygon([(x0, y0), (x1, y1), (x1, y1 + depth), (x0, y0 + depth)], fill=150)
    shade = shade.filter(ImageFilter.GaussianBlur(depth * 0.55))
    shade = Image.composite(shade, Image.new("L", (W, H), 0), mask)
    out = Image.composite(Image.fromarray(
        (np.asarray(out, dtype=np.float32) * 0.42).astype(np.uint8)), out, shade)

    if grade:
        out = apply_grade(out, **grade)
    return out


def apply_grade(im, saturation=1.0, contrast=1.0, brightness=1.0,
                warm=None, vignette=0.0, grain=0.0, blur_top=0.0):
    if blur_top > 0:
        W, H = im.size
        blurred = im.filter(ImageFilter.GaussianBlur(blur_top))
        g = Image.new("L", (W, H), 0)
        ImageDraw.Draw(g).rectangle([0, 0, W, int(H * 0.52)], fill=255)
        g = g.filter(ImageFilter.GaussianBlur(H * 0.10))
        im = Image.composite(blurred, im, g)

    im = ImageEnhance.Color(im).enhance(saturation)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Brightness(im).enhance(brightness)

    arr = np.asarray(im, dtype=np.float32)
    if warm:
        arr *= np.array(warm, dtype=np.float32)[None, None, :]
    W, H = im.size
    if vignette > 0:
        yy, xx = np.mgrid[0:H, 0:W]
        cx, cy = W / 2, H * 0.46
        r = np.sqrt(((xx - cx) / (W * 0.72)) ** 2 + ((yy - cy) / (H * 0.78)) ** 2)
        arr *= (1.0 - np.clip(r - 0.62, 0, 1) * vignette)[:, :, None]
    if grain > 0:
        rng = np.random.default_rng(7)
        arr += rng.normal(0, grain * 255 * 0.055, arr.shape)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
