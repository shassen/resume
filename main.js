(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll-reveal via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Active nav link tracking ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[data-nav]');

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navAnchors.forEach((a) => {
              a.classList.toggle("active", a.dataset.nav === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Timeline draw-on-scroll ---------- */
  const timeline = document.querySelector(".timeline");

  if (timeline && !prefersReducedMotion) {
    const updateTimelineProgress = () => {
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const start = viewportH * 0.85;
      const total = rect.height + viewportH * 0.3;
      const progressed = Math.min(Math.max(start - rect.top, 0), total);
      const pct = total > 0 ? (progressed / total) * 100 : 0;
      timeline.style.setProperty("--timeline-progress", `${pct}%`);
    };

    document.addEventListener("scroll", updateTimelineProgress, { passive: true });
    window.addEventListener("resize", updateTimelineProgress);
    updateTimelineProgress();
  } else if (timeline) {
    timeline.style.setProperty("--timeline-progress", "100%");
  }

  /* ---------- Hero mouse-reactive glow (desktop, motion allowed) ---------- */
  const hero = document.querySelector(".hero");

  if (hero && isFinePointer && !prefersReducedMotion) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mx", `${x}%`);
      hero.style.setProperty("--my", `${y}%`);
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      const strength = 0.25;

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Cursor glow (desktop, motion allowed) ---------- */
  const glowCursor = document.querySelector(".glow-cursor");

  if (glowCursor && isFinePointer && !prefersReducedMotion) {
    document.addEventListener("mousemove", (e) => {
      glowCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      glowCursor.classList.add("active");
    });

    document.addEventListener("mouseleave", () => {
      glowCursor.classList.remove("active");
    });
  }
})();
