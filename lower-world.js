/* Local canvas light pass for the storm coast beneath the film strip. */
(function () {
  'use strict';

  const canvas = document.getElementById('lower-world-motion');
  if (!canvas) return;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;

  const width = 1672;
  const height = 348;
  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reducedMotion = !!motionQuery?.matches;
  let frame = 0;
  let lastDraw = 0;

  // A fixed seed keeps the pattern stable when the tab is reopened.
  let seed = 2881;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const mist = Array.from({ length: 8 }, (_, index) => ({
    x: random() * (width + 280) - 140,
    y: 28 + random() * 175,
    radiusX: 150 + random() * 220,
    radiusY: 23 + random() * 44,
    speed: (index % 2 ? -1 : 1) * (1.5 + random() * 4),
    phase: random() * Math.PI * 2,
    alpha: .028 + random() * .038
  }));
  const surf = Array.from({ length: 110 }, () => ({
    x: random() * width,
    y: 35 + random() * 135,
    length: 7 + random() * 56,
    speed: 4 + random() * 18,
    phase: random() * Math.PI * 2,
    alpha: .035 + random() * .095,
    warm: random() > .75
  }));
  const sparks = Array.from({ length: 30 }, () => ({
    x: random() > .5 ? width - random() * 280 : random() * 300,
    y: 130 + random() * 240,
    radius: .65 + random() * 1.35,
    speed: 3 + random() * 8,
    phase: random() * Math.PI * 2
  }));

  function setResolution() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function glow(x, y, radius, color) {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function draw(now) {
    const seconds = now * .001;
    context.clearRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = 'screen';

    // Long, low clouds cross the ruins and coastline at different speeds.
    for (const cloud of mist) {
      const x = ((cloud.x + seconds * cloud.speed + 380) % (width + 760)) - 380;
      const y = cloud.y + Math.sin(seconds * .31 + cloud.phase) * 7;
      context.save();
      context.translate(x, y);
      context.scale(cloud.radiusX, cloud.radiusY);
      const gradient = context.createRadialGradient(0, 0, .08, 0, 0, 1);
      gradient.addColorStop(0, `rgba(190,216,222,${cloud.alpha})`);
      gradient.addColorStop(.5, `rgba(131,174,190,${cloud.alpha * .42})`);
      gradient.addColorStop(1, 'rgba(86,128,145,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    // Uneven horizontal reflections travel over the water, not over the cast.
    context.lineCap = 'round';
    for (const fleck of surf) {
      const x = (fleck.x + seconds * fleck.speed) % (width + 130) - 65;
      const y = fleck.y + Math.sin(seconds * 1.25 + fleck.phase) * 2.8;
      const shimmer = .45 + .55 * Math.sin(seconds * 2.2 + fleck.phase) ** 2;
      context.strokeStyle = fleck.warm
        ? `rgba(255,201,139,${fleck.alpha * shimmer})`
        : `rgba(185,221,226,${fleck.alpha * shimmer})`;
      context.lineWidth = .55 + (y / 170) * .7;
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(x + fleck.length * .48, y - 1.5, x + fleck.length, y + .6);
      context.stroke();
    }

    // The source painting has blue lightning on the left and a warm horizon
    // on the right. Light in those exact regions breathes through the scene.
    const lightningPhase = seconds % 13.7;
    const flash = lightningPhase < .11 ? .48 : lightningPhase > .17 && lightningPhase < .24 ? .27 : 0;
    glow(172, -18, 375, `rgba(92,173,236,${.07 + flash})`);
    glow(1510, 66, 365, `rgba(245,157,88,${.065 + .025 * Math.sin(seconds * .7)})`);

    // Small distant embers rise around the rocky sides of the foreground.
    for (const spark of sparks) {
      const y = ((spark.y - seconds * spark.speed) % 390 + 390) % 390;
      const x = spark.x + Math.sin(seconds * .75 + spark.phase) * 9;
      const alpha = Math.max(0, Math.min(1, (y - 55) / 80, (348 - y) / 50)) *
        (.12 + .13 * Math.sin(seconds * 1.7 + spark.phase) ** 2);
      context.fillStyle = `rgba(255,168,100,${alpha})`;
      context.beginPath();
      context.arc(x, y, spark.radius, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  function tick(now) {
    frame = 0;
    if (document.hidden) return;
    if (now - lastDraw >= 32 || !lastDraw) {
      draw(now);
      lastDraw = now;
    }
    if (!reducedMotion) frame = requestAnimationFrame(tick);
  }

  function wake() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastDraw = 0;
    if (!document.hidden) frame = requestAnimationFrame(tick);
  }

  setResolution();
  window.addEventListener('resize', setResolution, { passive: true });
  document.addEventListener('visibilitychange', wake);
  motionQuery?.addEventListener?.('change', event => {
    reducedMotion = event.matches;
    wake();
  });
  wake();
})();
