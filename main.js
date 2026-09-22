(() => {
  "use strict";
  const hero = document.querySelector("#hero-video");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  let heroVisible = true;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => document.body.classList.add("is-ready")),
  );
  const revealTargets = document.querySelectorAll(
    ".clients-bar, .portfolio .section-heading, .portfolio-reel, .service, .pilot-grid, .contact-image, .contact-content",
  );
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-revealed"));
  } else {
    revealTargets.forEach((target, index) => {
      target.classList.add("reveal-on-scroll");
      target.style.transitionDelay = `${Math.min(index % 6, 4) * 70}ms`;
    });
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    revealTargets.forEach((target) => revealObserver.observe(target));
  }
  function loadHero() {
    if (hero.hasAttribute("src")) return;
    hero.src = window.matchMedia("(max-width: 760px)").matches
      ? "hero-mobile.mp4"
      : "hero-desktop.mp4";
    hero.load();
  }
  function playHero() {
    loadHero();
    hero.play().catch(() => {
      /* O poster continua sendo exibido se a reprodução automática for bloqueada. */
    });
  }
  hero.addEventListener("playing", () => hero.classList.add("is-playing"));
  hero.addEventListener("error", () => {
    hero.classList.remove("is-playing");
  });
  if (!reduceMotion.matches && !connection?.saveData)
    window.addEventListener(
      "load",
      () => {
        if (heroVisible && !document.hidden) playHero();
      },
      { once: true },
    );
  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) hero.pause();
  });
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    mobileNav.hidden = open;
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
  });
  mobileNav
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  window
    .matchMedia("(min-width: 761px)")
    .addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
  const dialog = document.querySelector("#film-dialog");
  const film = document.querySelector("#showreel");
  const filmStrip = document.querySelector(".film-strip");
  const reelControls = document.querySelectorAll("[data-carousel]");
  const portfolioFilters = document.querySelectorAll(".portfolio-filter");
  function updateReelControls() {
    if (!filmStrip) return;
    const maxScroll = Math.max(0, filmStrip.scrollWidth - filmStrip.clientWidth);
    const visibleCards = filmStrip.querySelectorAll(".film-card:not([hidden])");
    const hasOverflow = visibleCards.length > 1 && maxScroll > 2;
    const canGoPrev = hasOverflow && filmStrip.scrollLeft > 2;
    const canGoNext = hasOverflow && filmStrip.scrollLeft < maxScroll - 2;
    reelControls.forEach((control) => {
      const isPrev = control.dataset.carousel === "prev";
      control.classList.toggle("is-available", isPrev ? canGoPrev : canGoNext);
    });
  }
  portfolioFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.category;
      portfolioFilters.forEach((button) => {
        const active = button === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      filmStrip.querySelectorAll(".film-card").forEach((card) => {
        card.hidden = category !== "all" && card.dataset.category !== category;
      });
      filmStrip.scrollTo({ left: 0, behavior: "auto" });
      requestAnimationFrame(() => requestAnimationFrame(updateReelControls));
    });
  });
  reelControls.forEach((control) => {
    control.addEventListener("click", () => {
      const direction = control.dataset.carousel === "prev" ? -1 : 1;
      const card = filmStrip.querySelector(".film-card:not([hidden])");
      if (!card) return;
      const gap = Number.parseFloat(getComputedStyle(filmStrip).gap) || 0;
      filmStrip.scrollBy({
        left: direction * ((card?.getBoundingClientRect().width || 320) + gap),
        behavior: "smooth",
      });
    });
  });
  filmStrip?.addEventListener("scroll", updateReelControls, { passive: true });
  window.addEventListener("resize", updateReelControls);
  updateReelControls();
  let returnFocus;
  let resumeHero = false;
  function resumeBackground() {
    if (
      heroVisible &&
      !reduceMotion.matches &&
      !connection?.saveData &&
      !document.hidden &&
      !dialog.open
    )
      playHero();
  }
  document.querySelectorAll("[data-film]").forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof dialog.showModal !== "function") {
        window.location.href = "showreel.mp4";
        return;
      }
      returnFocus = button;
      resumeHero = !hero.paused;
      hero.pause();
      dialog.showModal();
      document.body.classList.add("dialog-open");
      const source = film.querySelector("source");
      if (!source.hasAttribute("src")) {
        source.src =
          window.matchMedia("(max-width: 760px)").matches ||
          connection?.saveData
            ? "showreel.mp4"
            : source.dataset.src;
        film.load();
      }
      const start = Number(button.dataset.start) || 0;
      const seek = () => {
        film.currentTime = start;
      };
      if (film.readyState >= 1) seek();
      else film.addEventListener("loadedmetadata", seek, { once: true });
      film.play().catch(() => {
        /* Native controls stay available if autoplay is restricted. */
      });
    });
  });
  document
    .querySelector(".close-film")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    film.pause();
    document.body.classList.remove("dialog-open");
    returnFocus?.focus({ preventScroll: true });
    if (resumeHero) resumeBackground();
  });
  const sticky = document.querySelector(".mobile-cta");
  if ("IntersectionObserver" in window)
    new IntersectionObserver(
      (entries) => {
        heroVisible = entries[0].isIntersecting;
        sticky.classList.toggle("is-visible", !heroVisible);
        if (!heroVisible) hero.pause();
        else if (hero.hasAttribute("src")) resumeBackground();
      },
      { threshold: 0.1 },
    ).observe(document.querySelector(".hero"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hero.pause();
      film.pause();
    } else if (hero.hasAttribute("src")) resumeBackground();
  });
  document.querySelector("#year").textContent = String(
    new Date().getFullYear(),
  );
})();
