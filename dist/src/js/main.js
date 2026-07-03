/* =====================================================
   GROUNDWORK STUDIOS — MAIN JS
   No dependencies. Vanilla JS only.
   ===================================================== */

(function () {
  "use strict";

  // ---- Mobile menu toggle ----
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open);
    });
    // Close on nav link click
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");
      // Close all
      document.querySelectorAll(".faq-item.open").forEach((el) => el.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  // ---- Contact form (Web3Forms) ----
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: new FormData(form),
        });
        const data = await res.json();
        if (data.success) {
          statusEl.textContent = "Thanks! We'll be in touch shortly.";
          statusEl.className = "form-status success";
          form.reset();
        } else {
          throw new Error("Submit failed");
        }
      } catch {
        statusEl.textContent = "Something went wrong — please call or email us directly.";
        statusEl.className = "form-status error";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Enquiry";
      }
    });
  }

  // ---- Lazy-load gallery images ----
  if ("IntersectionObserver" in window) {
    const lazyImgs = document.querySelectorAll("img[data-src]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: "200px" }
    );
    lazyImgs.forEach((img) => observer.observe(img));
  } else {
    // Fallback
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
    });
  }

  // ---- Sticky header shadow on scroll ----
  const header = document.getElementById("site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 10
        ? "0 2px 16px rgba(0,0,0,.18)"
        : "none";
    }, { passive: true });
  }

  // ---- Smooth anchor offset for sticky header ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 8;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    });
  });

})();
