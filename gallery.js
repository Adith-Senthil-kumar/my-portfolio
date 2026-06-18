/* ============================================================
   Screenshot lightbox — reusable across case-study pages.
   Collects every `.shot` button on the page (in document order)
   and opens it in a native <dialog>: prev/next, keyboard arrows,
   swipe, counter, caption, neighbour preloading. No dependencies.
   The native <dialog> gives focus-trapping + Esc-to-close for free,
   and returns focus to the triggering thumbnail on close.
   Reduced-motion is handled by the global rule in style.css.
   Theme-aware: if a [data-set-theme] toggle is present, crossfades
   each shot (and the open lightbox) between dark and light variants.
   ============================================================ */
(function () {
  "use strict";

  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  if (!shots.length || typeof HTMLDialogElement === "undefined") return;

  var themeContainer = document.querySelector(".shots");
  var theme = (themeContainer && themeContainer.getAttribute("data-theme")) || "dark";

  var slides = shots.map(function (btn) {
    var img = btn.querySelector("img");
    return {
      dark: btn.getAttribute("data-full"),
      light: btn.getAttribute("data-full-light") || btn.getAttribute("data-full"),
      caption: btn.getAttribute("data-caption") || (img ? img.alt : ""),
      alt: img ? img.alt : ""
    };
  });
  function fullFor(i) { return theme === "light" ? slides[i].light : slides[i].dark; }

  var dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Screenshot viewer");
  dlg.innerHTML =
    '<button class="lightbox__btn lightbox__close" type="button" aria-label="Close viewer">✕</button>' +
    '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous screenshot">‹</button>' +
    '<button class="lightbox__btn lightbox__next" type="button" aria-label="Next screenshot">›</button>' +
    '<img class="lightbox__img" alt="">' +
    '<p class="lightbox__caption"></p>' +
    '<span class="lightbox__counter" aria-hidden="true"></span>';
  document.body.appendChild(dlg);

  var imgEl = dlg.querySelector(".lightbox__img");
  var capEl = dlg.querySelector(".lightbox__caption");
  var countEl = dlg.querySelector(".lightbox__counter");
  var prevBtn = dlg.querySelector(".lightbox__prev");
  var nextBtn = dlg.querySelector(".lightbox__next");
  var closeBtn = dlg.querySelector(".lightbox__close");

  var current = 0;
  var multiple = slides.length > 1;
  prevBtn.hidden = !multiple;
  nextBtn.hidden = !multiple;
  countEl.hidden = !multiple;

  function preload(i) {
    var im = new Image();
    im.src = fullFor((i + slides.length) % slides.length);
  }

  function render() {
    var s = slides[current];
    imgEl.style.animation = "none";   // restart the pop animation each change
    imgEl.src = fullFor(current);
    imgEl.alt = s.alt;
    void imgEl.offsetWidth;           // force reflow
    imgEl.style.animation = "";
    capEl.textContent = s.caption;
    countEl.textContent = (current + 1) + " / " + slides.length;
    if (multiple) { preload(current + 1); preload(current - 1); }
  }

  function open(i) {
    current = i;
    render();
    if (!dlg.open) dlg.showModal();
    document.body.style.overflow = "hidden";
    (multiple ? nextBtn : closeBtn).focus();
  }

  function go(delta) {
    if (!multiple) return;
    current = (current + delta + slides.length) % slides.length;
    render();
  }

  function release() { document.body.style.overflow = ""; }
  function close() { dlg.close(); release(); }

  shots.forEach(function (btn, i) {
    btn.addEventListener("click", function () { open(i); });
  });
  prevBtn.addEventListener("click", function () { go(-1); });
  nextBtn.addEventListener("click", function () { go(1); });
  closeBtn.addEventListener("click", close);

  // Theme toggle (Dark / Light screenshots) — optional; no-ops if absent.
  var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-set-theme]"));
  function swapLightbox() {                 // crossfade the open full image
    var next = fullFor(current);
    if (imgEl.getAttribute("src") === next) return;
    function show() { imgEl.src = next; imgEl.style.opacity = "1"; }
    var pre = new Image();
    imgEl.style.opacity = "0";
    pre.onload = show;
    pre.onerror = show;
    pre.src = next;
  }

  function setTheme(t) {
    theme = t === "light" ? "light" : "dark";
    if (themeContainer) themeContainer.setAttribute("data-theme", theme);  // CSS crossfades the thumbnails
    toggles.forEach(function (b) {
      var on = b.getAttribute("data-set-theme") === theme;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (dlg.open) swapLightbox();
  }
  toggles.forEach(function (b) {
    b.addEventListener("click", function () { setTheme(b.getAttribute("data-set-theme")); });
  });

  // Click on the empty backdrop area closes (img/buttons are separate targets).
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg) close();
  });

  // Release the scroll lock on EVERY close path imperatively — the dialog
  // 'close'/'cancel' events aren't reliably dispatched across engines.
  dlg.addEventListener("cancel", release);
  dlg.addEventListener("close", release);

  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Escape") { release(); }   // native closes; we free scroll
  });

  // Swipe navigation on touch devices.
  var startX = 0, startY = 0, tracking = false;
  dlg.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
})();
