(() => {
  "use strict";

  // Home scene only. The character archive keeps its original, static reference art.
  // Each slice follows an outer garment edge; the face, hands and torso stay fixed.
  const cloth = [
    [
      { clip: "polygon(44% 46%, 78% 48%, 100% 71%, 100% 81%, 68% 79%, 48% 68%)", axis: "right" },
      { clip: "polygon(17% 48%, 42% 44%, 45% 66%, 33% 79%, 11% 75%)", axis: "left" }
    ],
    [
      { clip: "polygon(29% 36%, 48% 39%, 48% 87%, 21% 91%, 0 73%, 7% 61%)", axis: "left" },
      { clip: "polygon(60% 35%, 83% 40%, 100% 64%, 100% 86%, 70% 88%, 57% 66%)", axis: "right" }
    ],
    [
      { clip: "polygon(37% 47%, 55% 49%, 52% 75%, 27% 91%, 0 72%, 8% 63%)", axis: "left" },
      { clip: "polygon(61% 52%, 78% 57%, 100% 69%, 100% 83%, 72% 78%, 60% 68%)", axis: "right" }
    ],
    [
      { clip: "polygon(22% 53%, 50% 51%, 52% 72%, 26% 81%, 0 75%, 4% 65%)", axis: "left" },
      { clip: "polygon(64% 51%, 88% 56%, 100% 74%, 92% 83%, 64% 82%, 58% 66%)", axis: "right" }
    ],
    [
      { clip: "polygon(37% 47%, 52% 52%, 53% 100%, 0 100%, 0 71%, 14% 58%)", axis: "left" },
      { clip: "polygon(58% 49%, 78% 53%, 100% 77%, 100% 100%, 55% 100%)", axis: "right" }
    ],
    [
      { clip: "polygon(53% 27%, 89% 33%, 100% 48%, 100% 75%, 69% 74%, 54% 56%)", axis: "right" },
      { clip: "polygon(25% 54%, 55% 49%, 81% 72%, 73% 85%, 24% 87%, 15% 76%)", axis: "left" }
    ],
    [
      { clip: "polygon(55% 22%, 88% 34%, 100% 48%, 100% 85%, 75% 88%, 60% 68%)", axis: "right" },
      { clip: "polygon(24% 43%, 54% 42%, 57% 81%, 27% 88%, 15% 73%)", axis: "left" }
    ]
  ];

  const clothGusts = [
    [8, 9], [11, 12], [9, 8], [12, 11], [13, 10], [11, 14], [11, 14]
  ];

  const weaponMarks = {
    2: {
      className: "fx-spear",
      path: "M25 25 C88 84 163 168 263 285",
      points: [[4, 2], [9, 8], [15, 16], [23, 22]]
    },
    5: {
      className: "fx-sword",
      path: "M275 681 C420 773 555 878 687 997 S903 1184 1000 1260",
      points: [[31, 48], [45, 58], [61, 69], [82, 82]]
    }
  };

  const ns = "http://www.w3.org/2000/svg";

  function addCloth(cut, sourceUrl, slices, index) {
    slices.forEach((slice, layer) => {
      const duplicate = document.createElement("img");
      duplicate.src = sourceUrl;
      duplicate.alt = "";
      duplicate.setAttribute("aria-hidden", "true");
      duplicate.decoding = "async";
      duplicate.draggable = false;
      duplicate.className = `cast-cloth-slice cloth-${slice.axis}`;
      duplicate.style.setProperty("--cloth-clip", slice.clip);
      const direction = slice.axis === "left" ? -1 : 1;
      const distance = clothGusts[index][layer];
      duplicate.style.setProperty("--cloth-start", `${direction * 1.5}px`);
      duplicate.style.setProperty("--cloth-swing", `${direction * distance}px`);
      duplicate.style.setProperty("--cloth-middle", `${direction * distance * .42}px`);
      duplicate.style.setProperty("--cloth-start-turn", `${direction * .2}deg`);
      duplicate.style.setProperty("--cloth-turn", `${direction * Math.min(2.6, distance * .21)}deg`);
      duplicate.style.setProperty("--cloth-middle-turn", `${direction * Math.min(1.25, distance * .09)}deg`);
      duplicate.style.setProperty("--cloth-origin", slice.axis === "left" ? "62% 37%" : "38% 37%");
      duplicate.style.setProperty("--cloth-rise", `${-(2.5 + layer)}px`);
      duplicate.style.setProperty("--cloth-delay", `${-((index * 1.1 + layer * 2.6) % 7).toFixed(2)}s`);
      duplicate.style.setProperty("--cloth-duration", `${(6.2 + (index % 3) * .65 + layer * 1.35).toFixed(2)}s`);
      cut.appendChild(duplicate);
    });
  }

  function addWeaponFx(cut, mark, spot) {
    const fx = document.createElement("span");
    fx.className = `cast-weapon-fx ${mark.className}`;
    fx.setAttribute("aria-hidden", "true");
    fx.style.width = `${Math.round(parseFloat(spot.style.getPropertyValue("--cast-source-height")) * 2 / 3)}px`;
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 1024 1536");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("focusable", "false");
    ["energy-halo", "energy-main", "energy-core"].forEach(className => {
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", mark.path);
      path.setAttribute("class", className);
      svg.appendChild(path);
    });
    fx.appendChild(svg);
    mark.points.forEach(([x, y], index) => {
      const mote = document.createElement("i");
      mote.className = "cast-energy-mote";
      mote.style.left = `${x}%`;
      mote.style.top = `${y}%`;
      mote.style.setProperty("--mote-delay", `${-((index * 1.14 + Number(spot.dataset.character) * .27) % 4).toFixed(2)}s`);
      mote.style.setProperty("--mote-duration", `${(3.35 + index * .32).toFixed(2)}s`);
      mote.style.setProperty("--mote-drift", `${index % 2 ? -5 : 6}px`);
      fx.appendChild(mote);
    });
    cut.appendChild(fx);
  }

  function addExactAxeGlow(cut, axe) {
    // The glowing duplicate shares the exact axe image and transform. CSS limits
    // the light to the original blade and leaves the grip as dark forged steel.
    const aura = axe.cloneNode(false);
    aura.removeAttribute("id");
    aura.alt = "";
    aura.setAttribute("aria-hidden", "true");
    aura.classList.add("cast-axe-aura");
    aura.draggable = false;
    cut.insertBefore(aura, axe.nextSibling);
  }

  function init() {
    const spots = document.querySelectorAll("#cast-figures > .cast-spot");
    spots.forEach((spot, index) => {
      const cut = spot.querySelector(".cast-cut");
      const source = cut?.querySelector(".cast-standalone");
      if (!cut || !source || !cloth[index]) return;
      // Kael's approved portrait includes the axe. Animate cloth from the
      // matching axe-free body so the weapon does not acquire a ghost copy.
      const clothSource = index === 3
        ? "assets/cast/04-kyle-home-left-grip.webp"
        : (source.currentSrc || source.src);
      addCloth(cut, clothSource, cloth[index], index);
      const exactAxe = index === 3 ? cut.querySelector(".cast-axe-exact:not(.cast-axe-aura)") : null;
      if (exactAxe) addExactAxeGlow(cut, exactAxe);
      else if (weaponMarks[index]) addWeaponFx(cut, weaponMarks[index], spot);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
