/* ============================================================
   Promo reel controller — reusable across case-study pages.
   Each <video data-reel> autoplays (muted, looped) only while
   in view, pauses off-screen, and exposes pause/play + mute/unmute.
   Reels carry audio, but autoplay must start muted (browser policy);
   the speaker button reveals the sound on demand.
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

    // Mute / unmute — created here so existing case-page markup needs no edit.
    var SPK_ON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.6a4 4 0 010 6.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    var SPK_OFF = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    var mute = document.createElement("button");
    mute.type = "button";
    mute.className = "reel__mute";
    function syncMute() {
      mute.innerHTML = v.muted ? SPK_OFF : SPK_ON;
      mute.setAttribute("aria-label", v.muted ? "Unmute reel" : "Mute reel");
      mute.setAttribute("aria-pressed", v.muted ? "false" : "true");
    }
    mute.addEventListener("click", function () {
      v.muted = !v.muted;
      if (!v.muted) v.volume = 1;
      syncMute();
    });
    v.parentElement.appendChild(mute);
    syncMute();

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
