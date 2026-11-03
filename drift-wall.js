(() => {
  "use strict";

  const IMAGE_COUNT = 41;
  const images = Array.from({ length: IMAGE_COUNT }, (_, index) => `assets/stills-drift/still-${String(index + 1).padStart(2, "0")}.webp`);
  // The optimized copies are 1200px high. Most are 675px wide; these nine
  // retain their slightly different source proportions after resizing.
  const imageWidths = Array(IMAGE_COUNT).fill(675);
  for (const [number, width] of [[3, 676], [5, 676], [14, 676], [22, 676], [28, 673], [32, 673], [34, 676], [36, 676], [37, 676]]) imageWidths[number - 1] = width;
  const order = images.map((_, index) => index);
  let seed = 1609;
  for (let index = order.length - 1; index > 0; index--) {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    const target = seed % (index + 1);
    [order[index], order[target]] = [order[target], order[index]];
  }

  function init() {
    const panel = document.getElementById("panel");
    const filters = document.getElementById("filters");
    const worksGrid = document.getElementById("works-grid");
    if (!panel || !filters || !worksGrid) return;

    const wall = document.createElement("div");
    wall.id = "drift-wall";
    wall.className = "drift-wall";
    wall.setAttribute("aria-label", "电影剧照图库，向下滚动浏览，鼠标悬浮可轻微放大画面");
    wall.hidden = true;
    const scene = document.createElement("div");
    scene.className = "drift-scene";
    wall.append(scene);
    worksGrid.before(wall);

    for (const imageIndex of order) {
      const tile = document.createElement("div");
      tile.className = "drift-tile";
      tile.style.setProperty("--still-aspect", `${imageWidths[imageIndex]} / 1200`);
      const image = document.createElement("img");
      image.src = images[imageIndex];
      image.alt = `电影剧照画面 ${imageIndex + 1}`;
      image.loading = "lazy";
      image.decoding = "async";
      tile.append(image);
      scene.append(tile);
    }

    const sync = () => {
      const frameFilter = filters.querySelector('[data-filter="frame"]');
      const label = frameFilter?.querySelector("small");
      if (label && label.textContent !== String(IMAGE_COUNT)) label.textContent = String(IMAGE_COUNT);
      const active = panel.dataset.view === "works" && !!frameFilter?.classList.contains("active");
      panel.classList.toggle("is-drift-view", active);
      wall.hidden = !active;
      if (active) {
        panel.querySelector(".panel-body").scrollTop = 0;
        document.getElementById("archive-count").textContent = String(IMAGE_COUNT).padStart(2, "0");
      }
    };
    new MutationObserver(sync).observe(filters, { childList: true });
    new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ["data-view"] });
    sync();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
