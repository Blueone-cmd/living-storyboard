/* Old-money right-panel references: front, side and back belong to the
   corresponding three-view source, never the action poster. Some supplied
   montages contain an opaque studio gradient; source-map.json records which
   clean cutout or source-pixel transfer is used for each angle. */
(() => {
  const characters = window.PORTFOLIO_CONTENT?.characters;
  if (!Array.isArray(characters)) return;
  const views = {
  "old-01": {
    "front": "assets/old-money-threeview-v3/01-front.webp",
    "side": "assets/old-money-threeview-v3/01-side.webp",
    "back": "assets/old-money-threeview-v3/01-back.webp"
  },
  "old-02": {
    "front": "assets/old-money-threeview-v3/02-front.webp",
    "side": "assets/old-money-threeview-v3/02-side.webp",
    "back": "assets/old-money-threeview-v3/02-back.webp"
  },
  "old-03": {
    "front": "assets/old-money-threeview-v3/03-front.webp",
    "side": "assets/old-money-threeview-v3/03-side.webp",
    "back": "assets/old-money-threeview-v3/03-back.webp"
  },
  "old-04": {
    "front": "assets/old-money-threeview-v3/04-front.webp",
    "side": "assets/old-money-threeview-v3/04-side.webp",
    "back": "assets/old-money-threeview-v3/04-back.webp"
  },
  "old-05": {
    "front": "assets/old-money-threeview-v3/05-front.webp",
    "side": "assets/old-money-threeview-v3/05-side.webp",
    "back": "assets/old-money-threeview-v3/05-back.webp"
  },
  "old-06": {
    "front": "assets/old-money-threeview-v3/06-front.webp",
    "side": "assets/old-money-threeview-v3/06-side.webp",
    "back": "assets/old-money-threeview-v3/06-back.webp"
  },
  "old-08": {
    "front": "assets/old-money-threeview-v3/08-front.webp",
    "side": "assets/old-money-threeview-v3/08-side.webp",
    "back": "assets/old-money-threeview-v3/08-back.webp"
  },
  "old-09": {
    "front": "assets/old-money-threeview-v3/09-front.webp",
    "side": "assets/old-money-threeview-v3/09-side.webp",
    "back": "assets/old-money-threeview-v3/09-back.webp"
  }
};
  const bounds = {
  "old-01": {
    "front": [
      0.325,
      0.0469,
      0.6828,
      0.9531
    ],
    "side": [
      0.3766,
      0.0531,
      0.6234,
      0.9469
    ],
    "back": [
      0.3281,
      0.0531,
      0.6719,
      0.9469
    ]
  },
  "old-02": {
    "front": [
      0.2797,
      0.0469,
      0.7188,
      0.9531
    ],
    "side": [
      0.3234,
      0.049,
      0.6312,
      0.951
    ],
    "back": [
      0.2891,
      0.049,
      0.7125,
      0.951
    ]
  },
  "old-03": {
    "front": [
      0.2891,
      0.0469,
      0.7141,
      0.9531
    ],
    "side": [
      0.3594,
      0.0531,
      0.6406,
      0.9469
    ],
    "back": [
      0.2953,
      0.0531,
      0.7047,
      0.9469
    ]
  },
  "old-04": {
    "front": [
      0.2219,
      0.0469,
      0.7563,
      0.9531
    ],
    "side": [
      0.2906,
      0.0531,
      0.7078,
      0.9469
    ],
    "back": [
      0.2859,
      0.0479,
      0.7766,
      0.9521
    ]
  },
  "old-05": {
    "front": [
      0.2406,
      0.0469,
      0.7344,
      0.9531
    ],
    "side": [
      0.2766,
      0.0479,
      0.6625,
      0.951
    ],
    "back": [
      0.2687,
      0.0479,
      0.7453,
      0.951
    ]
  },
  "old-06": {
    "front": [
      0.2297,
      0.0469,
      0.7641,
      0.9531
    ],
    "side": [
      0.2984,
      0.049,
      0.7875,
      0.951
    ],
    "back": [
      0.2687,
      0.0479,
      0.7406,
      0.9521
    ]
  },
  "old-08": {
    "front": [
      0.3141,
      0.0469,
      0.6859,
      0.9531
    ],
    "side": [
      0.3688,
      0.049,
      0.6422,
      0.9521
    ],
    "back": [
      0.3125,
      0.0479,
      0.6875,
      0.9521
    ]
  },
  "old-09": {
    "front": [
      0.2969,
      0.0469,
      0.7969,
      0.9531
    ],
    "side": [
      0.2891,
      0.0479,
      0.7688,
      0.9521
    ],
    "back": [
      0.2562,
      0.0479,
      0.7672,
      0.9521
    ]
  }
};
  const framing = window.PORTFOLIO_REFERENCE_FRAMING ||= {};
  for (const character of characters) {
    if (character.category !== 'old-money' || !views[character.id]) continue;
    character.views = {...character.views, ...views[character.id]};
    character.subjectAnchor = {...character.subjectAnchor, front: .5, side: .5, back: .5};
    character.referenceFrame = {visibleHeight: .87, centerY: .5};
    character.frontReferenceKind = '原三视图';
    framing[character.id] = {...framing[character.id], ...bounds[character.id]};
  }
})();
