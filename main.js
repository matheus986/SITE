(() => {
  "use strict";
  const hero = document.querySelector("#hero-video");
  const toggle = document.querySelector("#video-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  let manuallyPaused = false;
  let heroVisible = true;
  function loadHero() {
    if (hero.hasAttribute("src")) return;
    hero.src = window.matchMedia("(max-width: 760px)").matches
      ? "hero-mobile.mp4"
      : "hero-desktop.mp4";
    hero.load();
  }
  function reflectPlayback() {
    const playing = !hero.paused;
    toggle.setAttribute(
      "aria-label",
      playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo",
    );
    toggle.querySelector(".video-symbol").textContent = playing ? "Ⅱ" : "▶";
    toggle.querySelector(".video-state").textContent = playing
      ? "Pausar fundo"
      : "Reproduzir fundo";
  }
  function playHero() {
    loadHero();
    hero.play().catch(reflectPlayback);
  }
  hero.addEventListener("playing", () => {
    hero.classList.add("is-playing");
    reflectPlayback();
  });
  hero.addEventListener("pause", reflectPlayback);
  hero.addEventListener("error", () => {
    hero.classList.remove("is-playing");
    toggle.hidden = true;
  });
  toggle.addEventListener("click", () => {
    if (hero.paused) {
      manuallyPaused = false;
      playHero();
    } else {
      manuallyPaused = true;
      hero.pause();
    }
  });
  if (!reduceMotion.matches && !connection?.saveData)
    window.addEventListener(
      "load",
      () => {
        if (heroVisible && !document.hidden && !manuallyPaused) playHero();
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
  let returnFocus;
  let resumeHero = false;
  function resumeBackground() {
    if (
      heroVisible &&
      !manuallyPaused &&
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
