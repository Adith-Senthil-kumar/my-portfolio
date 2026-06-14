/* ============================================================
   Adith Senthil Kumar — Portfolio interactions
   - Mobile nav (hamburger), scrolled state, active-link tracking
   - Scroll-reveal via IntersectionObserver
   - Animated landscape parallax (scene art adapted from
     isladjan.com / https://isladjan.com/work/4/) re-mapped to the
     real page scroll so the sunrise→night arc works at any height.
   - All scroll-driven motion respects prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });
    Array.prototype.forEach.call(menu.querySelectorAll("a"), function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Nav scrolled state ---------- */
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Active link highlighting ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__menu a[href^="#"]')
  );
  var linkById = {};
  links.forEach(function (l) {
    linkById[l.getAttribute("href").slice(1)] = l;
  });

  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) { l.classList.remove("is-active"); });
          var active = linkById[en.target.id];
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Array.prototype.forEach.call(
      document.querySelectorAll("main section[id]"),
      function (s) { sectionObserver.observe(s); }
    );
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
  if (reduce || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var ioFired = false;
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        ioFired = true;
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-visible");
          obs.unobserve(en.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
    // Safety net: if the observer never delivers a callback (e.g. an
    // offscreen/non-painting renderer), make sure nothing stays invisible.
    setTimeout(function () {
      if (!ioFired) { revealObserver.disconnect(); revealAll(); }
    }, 1200);
  }

  /* ============================================================
     Landscape parallax
     ============================================================ */
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  if (window.history && "scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  var speed = 100;
  var svgEl = document.querySelector("svg.parallax");
  var height = svgEl ? svgEl.getBBox().height : 500;

  /* Initial scene state */
  gsap.set("#h2-1", { opacity: 0 });
  gsap.set("#bg_grad", { attr: { cy: "-50" } });
  gsap.set(["#dinoL", "#dinoR"], { y: 80 });
  gsap.set("#dinoL", { x: -10 });
  gsap.set("#scene3", { y: height - 40, visibility: "visible" });
  gsap.set("#fstar", { y: -400 });

  var mm = gsap.matchMedia();
  mm.add("(max-width: 1922px)", function () {
    gsap.set(["#cloudStart-L", "#cloudStart-R"], { x: 10, opacity: 1 });
  });

  /* Reduced motion: present a calm, static evening scene. */
  if (reduce) {
    gsap.set("#bg_grad", { attr: { cy: "300" } });
    gsap.set("#h2-1", { opacity: 1 });
    gsap.set("#stars", { opacity: 0.5 });
    return;
  }

  /* All timelines are scrubbed against the whole page scroll, expressed as
     percentages of the document body, so the choreography spans whatever
     height the content produces — desktop or mobile. */
  var page = document.body;

  /* SCENE 1 — hills */
  var scene1 = gsap.timeline();
  ScrollTrigger.create({ animation: scene1, trigger: page, start: "top top", end: "42% top", scrub: 3 });
  scene1.to("#h1-1", { y: 3 * speed, x: 1 * speed, scale: 0.9, ease: "power1.in" }, 0);
  scene1.to("#h1-2", { y: 2.6 * speed, x: -0.6 * speed, ease: "power1.in" }, 0);
  scene1.to("#h1-3", { y: 1.7 * speed, x: 1.2 * speed }, 0.03);
  scene1.to("#h1-4", { y: 3 * speed, x: 1 * speed }, 0.03);
  scene1.to("#h1-5", { y: 2 * speed, x: 1 * speed }, 0.03);
  scene1.to("#h1-6", { y: 2.3 * speed, x: -2.5 * speed }, 0);
  scene1.to("#h1-7", { y: 5 * speed, x: 1.6 * speed }, 0);
  scene1.to("#h1-8", { y: 3.5 * speed, x: 0.2 * speed }, 0);
  scene1.to("#h1-9", { y: 3.5 * speed, x: -0.2 * speed }, 0);
  scene1.to("#cloudsBig-L", { y: 4.5 * speed, x: -0.2 * speed }, 0);
  scene1.to("#cloudsBig-R", { y: 4.5 * speed, x: -0.2 * speed }, 0);
  scene1.to("#cloudStart-L", { x: -300 }, 0);
  scene1.to("#cloudStart-R", { x: 300 }, 0);

  /* Bird */
  gsap.fromTo(
    "#bird",
    { opacity: 1 },
    {
      y: -250,
      x: 800,
      ease: "power2.out",
      scrollTrigger: {
        trigger: page,
        start: "12% top",
        end: "58% top",
        scrub: 4,
        onEnter: function () { gsap.to("#bird", { scaleX: 1, rotation: 0 }); },
        onLeave: function () { gsap.to("#bird", { scaleX: -1, rotation: -15 }); }
      }
    }
  );

  /* Clouds */
  var clouds = gsap.timeline();
  ScrollTrigger.create({ animation: clouds, trigger: page, start: "top top", end: "68% top", scrub: 1 });
  clouds.to("#cloud1", { x: 500 }, 0);
  clouds.to("#cloud2", { x: 1000 }, 0);
  clouds.to("#cloud3", { x: -1000 }, 0);
  clouds.to("#cloud4", { x: -700, y: 25 }, 0);

  /* Sun motion */
  var sun = gsap.timeline();
  ScrollTrigger.create({ animation: sun, trigger: page, start: "top top", end: "36% top", scrub: 2 });
  sun.fromTo("#bg_grad", { attr: { cy: "-50" } }, { attr: { cy: "330" } }, 0);
  sun.to("#bg_grad stop:nth-child(2)", { attr: { offset: "0.15" } }, 0);
  sun.to("#bg_grad stop:nth-child(3)", { attr: { offset: "0.18" } }, 0);
  sun.to("#bg_grad stop:nth-child(4)", { attr: { offset: "0.25" } }, 0);
  sun.to("#bg_grad stop:nth-child(5)", { attr: { offset: "0.46" } }, 0);
  sun.to("#bg_grad stop:nth-child(6)", { attr: { "stop-color": "#FF9171" } }, 0);

  /* SCENE 2 — text rise */
  var scene2 = gsap.timeline();
  ScrollTrigger.create({ animation: scene2, trigger: page, start: "13% top", end: "40% top", scrub: 3 });
  scene2.fromTo("#h2-1", { y: 500, opacity: 0 }, { y: 0, opacity: 1 }, 0);
  scene2.fromTo("#h2-2", { y: 500 }, { y: 0 }, 0.1);
  scene2.fromTo("#h2-3", { y: 700 }, { y: 0 }, 0.1);
  scene2.fromTo("#h2-4", { y: 700 }, { y: 0 }, 0.2);
  scene2.fromTo("#h2-5", { y: 800 }, { y: 0 }, 0.3);
  scene2.fromTo("#h2-6", { y: 900 }, { y: 0 }, 0.3);

  /* Bats */
  gsap.set("#bats", { transformOrigin: "50% 50%" });
  gsap.fromTo(
    "#bats",
    { opacity: 1, y: 400, scale: 0 },
    {
      y: 20,
      scale: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: page,
        start: "38% top",
        end: "66% top",
        scrub: 3,
        onEnter: function () {
          gsap.utils.toArray("#bats path").forEach(function (item, i) {
            gsap.to(item, {
              scaleX: 0.5,
              yoyo: true,
              repeat: 9,
              transformOrigin: "50% 50%",
              duration: 0.15,
              delay: 0.7 + i / 10
            });
          });
          gsap.set("#bats", { opacity: 1 });
        }
      }
    }
  );

  /* Sun increase / sky darkening */
  var sun2 = gsap.timeline();
  ScrollTrigger.create({ animation: sun2, trigger: page, start: "33% top", end: "82% top", scrub: 2 });
  sun2.to("#sun", { attr: { offset: "1.4" } }, 0);
  sun2.to("#bg_grad stop:nth-child(2)", { attr: { offset: "0.7" } }, 0);
  sun2.to("#sun", { attr: { "stop-color": "#ffff00" } }, 0);
  sun2.to("#lg4 stop:nth-child(1)", { attr: { "stop-color": "#623951" } }, 0);
  sun2.to("#lg4 stop:nth-child(2)", { attr: { "stop-color": "#261F36" } }, 0);
  sun2.to("#bg_grad stop:nth-child(6)", { attr: { "stop-color": "#45224A" } }, 0);

  /* Transition (Scene 2 → Scene 3) */
  var sceneTransition = gsap.timeline();
  ScrollTrigger.create({ animation: sceneTransition, trigger: page, start: "58% top", end: "bottom bottom", scrub: 3 });
  sceneTransition.to("#h2-1", { y: -height - 100, scale: 1.5, transformOrigin: "50% 50%" }, 0);
  sceneTransition.to("#bg_grad", { attr: { cy: "-80" } }, 0);
  sceneTransition.to("#bg2", { y: 0 }, 0);

  /* Scene 3 — night hills + stars */
  var scene3 = gsap.timeline();
  ScrollTrigger.create({ animation: scene3, trigger: page, start: "68% top", end: "bottom bottom", scrub: 3 });
  scene3.fromTo("#h3-1", { y: 300 }, { y: -550 }, 0);
  scene3.fromTo("#h3-2", { y: 800 }, { y: -550 }, 0.03);
  scene3.fromTo("#h3-3", { y: 600 }, { y: -550 }, 0.06);
  scene3.fromTo("#h3-4", { y: 800 }, { y: -550 }, 0.09);
  scene3.fromTo("#h3-5", { y: 1000 }, { y: -550 }, 0.12);
  scene3.fromTo("#stars", { opacity: 0 }, { opacity: 0.5, y: -500 }, 0);
  scene3.to("#bg2-grad", { attr: { cy: 600 } }, 0);
  scene3.to("#bg2-grad", { attr: { r: 500 } }, 0);

  /* Falling star */
  var fstarTL = gsap.timeline();
  ScrollTrigger.create({
    animation: fstarTL,
    trigger: page,
    start: "70% top",
    end: "bottom bottom",
    scrub: 2,
    onEnter: function () { gsap.set("#fstar", { opacity: 1 }); },
    onLeave: function () { gsap.set("#fstar", { opacity: 0 }); }
  });
  fstarTL.to("#fstar", { x: -700, y: -250, ease: "power2.out" }, 0);

  /* Twinkling stars */
  [1, 3, 5, 8, 11, 15, 17, 18, 25, 28, 30, 35, 40, 45, 48].forEach(function (n, i) {
    var delays = [0.8, 1.8, 1, 1.2, 0.5, 2, 1.1, 1.4, 1.1, 0.9, 1.3, 2, 0.8, 1.8, 1];
    gsap.fromTo(
      "#stars path:nth-of-type(" + n + ")",
      { opacity: 0.3 },
      { opacity: 1, duration: 0.3, repeat: -1, repeatDelay: delays[i] }
    );
  });

  /* Recalculate trigger positions once everything (fonts/images) settles. */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
