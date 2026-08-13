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
  const timelineItems = timeline
    ? Array.from(timeline.querySelectorAll(".timeline-item"))
    : [];

  const syncTimelineDots = (progressPx) => {
    let lastReachedIndex = -1;

    timelineItems.forEach((item, index) => {
      const dotCenter = item.offsetTop + 14;
      const reached = progressPx + 14 >= dotCenter;
      item.classList.toggle("reached", reached);
      if (reached) lastReachedIndex = index;
    });

    timelineItems.forEach((item, index) => {
      item.classList.toggle("current", index === lastReachedIndex);
    });

    // Fill segment rails between dots (from bottom of this dot to center of next)
    timelineItems.forEach((item, index) => {
      if (index >= timelineItems.length - 1) return;

      const segmentStart = item.offsetTop + 22;
      const segmentEnd = timelineItems[index + 1].offsetTop + 14;
      const segmentLen = segmentEnd - segmentStart;
      const fill = Math.min(Math.max(progressPx + 14 - segmentStart, 0), segmentLen);

      item.style.setProperty("--segment-fill", `${fill}px`);
    });
  };

  if (timeline && !prefersReducedMotion) {
    const updateTimelineProgress = () => {
      const rect = timeline.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const start = viewportH * 0.85;
      const railStart = 14;
      const lastDotCenter =
        timelineItems.length > 0
          ? timelineItems[timelineItems.length - 1].offsetTop + 14
          : railStart;
      const railLength = Math.max(lastDotCenter - railStart, 1);
      const total = railLength + viewportH * 0.3;
      const progressed = Math.min(Math.max(start - rect.top, 0), total);
      const progressPx = Math.min(
        Math.max(((progressed / total) * railLength), 0),
        railLength
      );

      syncTimelineDots(progressPx);
    };

    document.addEventListener("scroll", updateTimelineProgress, { passive: true });
    window.addEventListener("resize", updateTimelineProgress);
    updateTimelineProgress();
  } else if (timeline) {
    timelineItems.forEach((item, index) => {
      item.classList.add("reached");
      item.classList.toggle("current", index === timelineItems.length - 1);

      if (index < timelineItems.length - 1) {
        const segmentStart = item.offsetTop + 22;
        const segmentEnd = timelineItems[index + 1].offsetTop + 14;
        item.style.setProperty("--segment-fill", `${segmentEnd - segmentStart}px`);
      }
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

    // The glow only repositions on mousemove, so scrolling the page with a
    // stationary pointer (trackpad/wheel) leaves it glued to a stale screen
    // position while content scrolls underneath it. Fade it out during
    // scroll; it reappears on the next real mousemove once scrolling settles.
    window.addEventListener(
      "scroll",
      () => {
        glowCursor.classList.remove("active");
      },
      { passive: true }
    );
  }
})();
