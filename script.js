(function () {
  "use strict";

  // Carousel
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-track]");
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const btnPrev = carousel.querySelector("[data-prev]");
  const btnNext = carousel.querySelector("[data-next]");
  const dotsWrap = carousel.querySelector("[data-dots]");
  const label = carousel.querySelector("[data-slide-label]");
  const total = carousel.querySelector("[data-slide-total]");
  const viewport = carousel.querySelector("[data-viewport]");

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  total.textContent = String(slides.length);

  // Build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dot";
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function update() {
    track.style.transform = `translateX(${index * -100}%)`;
    label.textContent = String(index + 1);

    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));

    // Disable buttons at edges
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === slides.length - 1;
    btnPrev.style.opacity = btnPrev.disabled ? "0.55" : "1";
    btnNext.style.opacity = btnNext.disabled ? "0.55" : "1";
  }

  function goTo(i) {
    index = clamp(i, 0, slides.length - 1);
    update();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  // Keyboard support (only when carousel is visible)
  function isCarouselVisible() {
    const rect = carousel.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
  }

  window.addEventListener("keydown", (e) => {
    if (!isCarouselVisible()) return;
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Swipe support
  viewport.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    currentX = startX;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
  });

  viewport.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;

    const diff = currentX - startX;
    const threshold = 40;

    if (diff > threshold) prev();
    else if (diff < -threshold) next();
  });

  viewport.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  // Init
  update();
})();
