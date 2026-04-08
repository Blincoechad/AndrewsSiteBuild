/* ============================================================
   Andy Seely Portfolio — Global JavaScript
   Handles: dropdown nav, mobile menu, active link detection
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Dropdown navigation ── */
  const dropdownTriggers = document.querySelectorAll("[data-dropdown]");

  dropdownTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const li = btn.closest("li");
      const isOpen = li.classList.contains("open");

      // Close all other dropdowns
      document
        .querySelectorAll("li.open")
        .forEach((el) => el.classList.remove("open"));

      if (!isOpen) li.classList.add("open");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    document
      .querySelectorAll("li.open")
      .forEach((el) => el.classList.remove("open"));
  });

  /* ── Mobile menu toggle ── */
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.textContent = isOpen ? "✕" : "☰";
      toggle.setAttribute("aria-expanded", isOpen);
    });
  }

  /* ── Mark active link based on current URL ── */
  const currentPath = window.location.pathname;
  document.querySelectorAll(".navbar__nav a, .sub-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      currentPath.endsWith(href.replace("../", "").replace("./", ""))
    ) {
      link.classList.add("active");
    }
  });

  /* ── Sub-nav smooth scroll to sections ── */
  document.querySelectorAll('.sub-nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        const offset = 64 + 48; // navbar + subnav height
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ── Intersection observer for sub-nav active states ── */
  const sections = document.querySelectorAll("section[id]");
  const subLinks = document.querySelectorAll('.sub-nav a[href^="#"]');

  if (sections.length && subLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            subLinks.forEach((l) => l.classList.remove("active"));
            const active = document.querySelector(
              `.sub-nav a[href="#${entry.target.id}"]`,
            );
            if (active) active.classList.add("active");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ── Fade-in animation on scroll ── */
  const fadeEls = document.querySelectorAll(
    ".card, .timeline-item, .content-block",
  );
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    fadeObserver.observe(el);
  });
});
