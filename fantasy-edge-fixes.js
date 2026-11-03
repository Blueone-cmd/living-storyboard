/* Recover local reference views whose sheet seams clipped a silhouette. */
(() => {
  const characters = window.PORTFOLIO_CONTENT?.characters;
  if (!characters) return;
  window.PORTFOLIO_REFERENCE_ANCHORS ||= {};
  window.PORTFOLIO_REFERENCE_FRAMING ||= {};
  const fixes = [
    { id: "character-03", view: "back", file: "assets/fantasy-edge-fixes/03-back.webp",
      anchor: .458, bounds: [.0716, .0184, .8462, .9521] },
    { id: "character-04", view: "back", file: "assets/fantasy-edge-fixes/04-back.webp",
      anchor: .519, bounds: [.0722, .0645, .9722, .9111] },
    { id: "fantasy-08", view: "front", file: "assets/fantasy-edge-fixes/08-front.webp",
      anchor: .462, bounds: [.0405, .0534, .9270, .9263] },
    { id: "fantasy-10", view: "back", file: "assets/fantasy-edge-fixes/10-back.webp",
      anchor: .489, bounds: [.0278, .0525, .9611, .9153] },
    { id: "character-05", view: "front", file: "assets/fantasy-edge-fixes/05-front.webp",
      anchor: .4954, bounds: [.0381, .0459, .9619, .9297] },
    { id: "character-05", view: "side", file: "assets/fantasy-edge-fixes/05-side.webp",
      anchor: .4982, bounds: [.1223, .0420, .9511, .9355] },
    { id: "character-05", view: "back", file: "assets/fantasy-edge-fixes/05-back.webp",
      anchor: .5338, bounds: [.0436, .0439, .9564, .9434] },
    { id: "character-06", view: "front", file: "assets/fantasy-edge-fixes/06-front.webp",
      anchor: .5630, bounds: [.0368, .0245, .9632, .9734] },
    { id: "character-06", view: "side", file: "assets/fantasy-edge-fixes/06-side.webp",
      anchor: .5664, bounds: [.0453, .0266, .9263, .9745] }
  ];
  for (const { id, ...fix } of fixes) {
    const character = characters.find(item => item.id === id);
    if (!character) continue;
    character.views[fix.view] = fix.file;
    character.subjectAnchor ||= {};
    character.subjectAnchor[fix.view] = fix.anchor;
    window.PORTFOLIO_REFERENCE_ANCHORS[id] ||= {};
    window.PORTFOLIO_REFERENCE_ANCHORS[id][fix.view] = fix.anchor;
    window.PORTFOLIO_REFERENCE_FRAMING[id] ||= {};
    window.PORTFOLIO_REFERENCE_FRAMING[id][fix.view] = fix.bounds;
  }
})();
