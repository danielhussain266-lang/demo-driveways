#!/usr/bin/env python3
"""
Generates the 11 matched before/after pairs as photographic composites.

Each pair shares one real photographic plate and one surface quad, so the
before/after slider reveals a single photograph changing. Only the material
and the colour grade differ between the two frames.

    python3 tools/gen-photoreal.py
"""

import os
import sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from photoreal import composite_surface, apply_grade  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "images")
OUT = os.path.join(IMG, "scenes")
PLATES = "/tmp/src-photos"

# ── real photographic plates, with the ground quad in each ──────────
# quad order: far-left, far-right, near-right, near-left
PLATE = {
    "villa":   dict(file="hero-after.jpg",
                    quad=[(0, 372), (800, 364), (880, 600), (-80, 600)]),
    "house":   dict(file="hero-before.jpg",
                    quad=[(96, 430), (742, 410), (860, 600), (-60, 600)]),
    "terrace": dict(file="proj-patio2-after.jpg",
                    quad=[(20, 474), (782, 462), (860, 600), (-60, 600)]),
    "arch":    dict(file="proj-patio1-after.jpg",
                    quad=[(30, 474), (770, 474), (840, 600), (-40, 600)]),
}

# ── materials (all real photographs of real surfaces) ──────────────
# tile_px is deliberately large: the perspective warp minifies hard toward
# the far edge, and a finely-tiled texture aliases into visual static there.
TEX = {
    "tarmac":    ("svc-tarmac.jpg", 340),
    "block":     ("svc-block.jpg", 240),
    "resin":     ("svc-resin.jpg", 250),
    "granite":   ("svc-stone.jpg", 430),
    "sandstone": ("proj-stone1-after.jpg", 320),
    "porcelain": ("proj-stone1-before.jpg", 360),
    "caramel":   ("proj-resin2-after.jpg", 260),
}

# Worn surfaces tile tighter so the cracking actually reads as damage.
WORN = {
    "cracked": ("proj-resin1-before.jpg", 230),
    "crazed":  ("proj-resin2-before.jpg", 250),
    "slab":    ("proj-tarmac1-before.jpg", 240),
    "bare":    ("proj-block1-before.jpg", 270),
}

# after: bright, saturated, freshly laid
AFTER = dict(saturation=1.10, contrast=1.05, brightness=1.02,
             warm=(1.03, 1.005, 0.97), vignette=0.34, grain=0.30)
# before: overcast, flat, tired
BEFORE = dict(saturation=0.62, contrast=0.93, brightness=0.90,
              warm=(0.97, 0.99, 1.05), vignette=0.42, grain=0.42)

# name -> (plate, mirrored, after-material, worn-material)
SCENES = [
    ("hero",    "villa",   False, "block",     "cracked"),
    ("tarmac1", "house",   False, "tarmac",    "cracked"),
    ("block1",  "villa",   True,  "block",     "bare"),
    ("resin1",  "house",   True,  "resin",     "crazed"),
    ("patio1",  "terrace", False, "sandstone", "slab"),
    ("tarmac2", "villa",   True,  "tarmac",    "slab"),
    ("block2",  "house",   False, "block",     "crazed"),
    ("stone1",  "villa",   False, "granite",   "crazed"),
    ("patio2",  "arch",    False, "porcelain", "bare"),
    ("resin2",  "house",   True,  "caramel",   "slab"),
    ("stone2",  "terrace", True,  "sandstone", "cracked"),
]

TMP = "/tmp/_plate.jpg"


def plate_for(key, mirror):
    """Return (path, quad), mirroring the plate and its quad together."""
    p = PLATE[key]
    path = os.path.join(PLATES, p["file"])
    quad = list(p["quad"])
    if not mirror:
        return path, quad
    im = Image.open(path).convert("RGB").transpose(Image.FLIP_LEFT_RIGHT)
    im.save(TMP, quality=95)
    W = im.size[0]
    # mirror x and reverse winding so the quad stays far-left → near-left
    m = [(W - x, y) for (x, y) in quad]
    return TMP, [m[1], m[0], m[3], m[2]]


def build(name, plate_key, mirror, after_key, worn_key):
    path, quad = plate_for(plate_key, mirror)

    tex, tile = TEX[after_key]
    composite_surface(path, os.path.join(IMG, tex), quad, tile_px=tile,
                      grade=AFTER, wet=0.055).save(
        os.path.join(OUT, f"{name}-after.jpg"), quality=90)

    wtex, wtile = WORN[worn_key]
    composite_surface(path, os.path.join(IMG, wtex), quad, tile_px=wtile,
                      grade=BEFORE, wet=0.0,
                      tint=(0.99, 1.02, 0.96)).save(   # faint mossy cast
        os.path.join(OUT, f"{name}-before.jpg"), quality=90)

    print(f"  ok {name:8s} {plate_key:8s}{' (mirrored)' if mirror else '':12s}"
          f" {after_key} / {worn_key}")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for spec in SCENES:
        if only and spec[0] != only:
            continue
        build(*spec)
    print(f"\nphotoreal scenes -> images/scenes/")
