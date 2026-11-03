(() => {
  "use strict";
  function init() {
    const viewer = document.getElementById("viewer");
    const index = document.getElementById("viewer-index");
    const position = document.getElementById("prompt-quick-position");
    const copy = document.getElementById("viewer-prompt-copy");
    const prev = document.getElementById("prompt-quick-prev");
    const next = document.getElementById("prompt-quick-next");
    if (!viewer || !index || !position || !copy || !prev || !next) return;

    const total = window.PORTFOLIO_CONTENT?.works?.filter((work) => work.type === "prompt").length || 0;
    const sync = () => {
      if (viewer.dataset.workType !== "prompt") return;
      const current = Number.parseInt(index.textContent, 10) || 1;
      position.textContent = `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    };
    const step = (direction) => {
      document.getElementById(direction < 0 ? "viewer-prev" : "viewer-next")?.click();
      copy.scrollTop = 0;
      sync();
    };

    prev.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));
    new MutationObserver(() => { copy.scrollTop = 0; sync(); }).observe(index, { childList: true, characterData: true, subtree: true });
    new MutationObserver(sync).observe(viewer, { attributes: true, attributeFilter: ["data-work-type"] });
    sync();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
