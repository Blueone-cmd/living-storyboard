(() => {
  "use strict";

  // Keep every dialog on its fixed design canvas as the viewport changes.
  const panel = document.querySelector("#panel");
  const viewer = document.querySelector("#viewer");
  const CHARACTER_WIDTH = 1720;
  const CHARACTER_HEIGHT = 1040;
  const SECONDARY_WIDTH = 1360;
  const SECONDARY_HEIGHT = 850;

  function fit(node, width, height, widthLimit, heightLimit) {
    if (!node) return;
    const scale = Math.max(.01, Math.min(
      window.innerWidth * widthLimit / width,
      window.innerHeight * heightLimit / height,
    ));
    node.style.setProperty("--dialog-scale", String(scale));
  }

  function fitDialogs() {
    if (panel?.dataset.view === "characters") {
      fit(panel, CHARACTER_WIDTH, CHARACTER_HEIGHT, .90, .845);
    } else {
      fit(panel, SECONDARY_WIDTH, SECONDARY_HEIGHT, .94, .94);
    }
    fit(viewer, SECONDARY_WIDTH, SECONDARY_HEIGHT, .94, .94);
  }

  fitDialogs();
  window.addEventListener("resize", fitDialogs, { passive: true });
  if (panel) {
    new MutationObserver(fitDialogs).observe(panel, {
      attributes: true,
      attributeFilter: ["data-view", "open"],
    });
  }
})();
