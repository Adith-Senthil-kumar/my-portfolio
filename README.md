# Adith Senthil Kumar — Portfolio

Personal portfolio for **Adith Senthil Kumar**, a Mobile Application Developer (Flutter & Firebase) from Chennai, India.

**Live:** https://adith-senthil-kumar.github.io/my-portfolio/

## Stack
- Static site — HTML, CSS, vanilla JS (no build step)
- [GSAP](https://gsap.com/) + ScrollTrigger for the animated sunset → night landscape (SVG art adapted from [isladjan](https://isladjan.com/work/4/))
- Google Fonts (Fraunces, Hanken Grotesk, JetBrains Mono); inline SVG tech icons

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure
- `index.html` — markup + the inline landscape SVG
- `style.css` — all styles (dusk glassmorphism, responsive)
- `script.js` — nav, scroll-reveal, and the scroll-driven parallax
- `icons/` — per-tech SVG logos
- `adith_resume.pdf` — résumé (linked from the Contact section)
