/* ============================================================
   Promo reel controller — reusable across case-study pages.
   Each <video data-reel> autoplays (muted, looped) only while
   in view, pauses off-screen, and exposes a pause/play toggle.
   prefers-reduced-motion: no autoplay — native controls instead.
   The file isn't fetched until the reel scrolls near view
   (preload="none" + play-on-intersect), protecting page load.
   ============================================================ */
(function () {
  "use strict";

  var videos = [].slice.call(document.querySelectorAll("video[data-reel]"));
  if (!videos.length) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  videos.forEach(function (v) {
    v.muted = true;
    v.setAttribute("playsinline", "");
    var toggle = v.parentElement.querySelector(".reel__toggle");

    // Reduced motion: never autoplay — give the user native controls instead.
    if (reduce) {
      v.controls = true;
      if (toggle) toggle.remove();
      return;
    }

    var manualPause = false;

    function sync() {
      if (!toggle) return;
      var playing = !v.paused && !v.ended;
      toggle.textContent = playing ? "⏸" : "▶";   // pause / play
      toggle.setAttribute("aria-label", playing ? "Pause reel" : "Play reel");
    }

    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", function () {
        if (v.paused) { manualPause = false; v.play().catch(function () {}); }
        else { manualPause = true; v.pause(); }
      });
    }
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !manualPause) v.play().catch(function () {});
          else if (!e.isIntersecting) v.pause();
        });
      }, { threshold: 0.35 }).observe(v);
    } else {
      v.play().catch(function () {});
    }

    sync();
  });
})();
