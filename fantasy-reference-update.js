/* User-supplied transparent three-view fantasy references, installed at native resolution. */
(() => {
  const characters = window.PORTFOLIO_CONTENT?.characters;
  if (!characters) return;
  const views = {
  "character-01": {
    "front": "assets/fantasy-reference-v2/01-front.webp",
    "side": "assets/fantasy-reference-v2/01-side.webp",
    "back": "assets/fantasy-reference-v2/01-back.webp"
  },
  "character-02": {
    "front": "assets/fantasy-reference-v2/02-front.webp",
    "side": "assets/fantasy-reference-v2/02-side.webp",
    "back": "assets/fantasy-reference-v2/02-back.webp"
  },
  "character-03": {
    "front": "assets/fantasy-reference-v2/03-front.webp",
    "side": "assets/fantasy-reference-v2/03-side.webp",
    "back": "assets/fantasy-reference-v2/03-back.webp"
  },
  "character-04": {
    "front": "assets/fantasy-reference-v2/04-front.webp",
    "side": "assets/fantasy-reference-v2/04-side.webp",
    "back": "assets/fantasy-reference-v2/04-back.webp"
  },
  "character-05": {
    "front": "assets/fantasy-reference-v2/05-front.webp",
    "side": "assets/fantasy-reference-v2/05-side.webp",
    "back": "assets/fantasy-reference-v2/05-back.webp"
  },
  "character-06": {
    "front": "assets/fantasy-reference-v2/06-front.webp",
    "side": "assets/fantasy-reference-v2/06-side.webp",
    "back": "assets/fantasy-reference-v2/06-back.webp"
  },
  "character-07": {
    "front": "assets/fantasy-reference-v2/07-front.webp",
    "side": "assets/fantasy-reference-v2/07-side.webp",
    "back": "assets/fantasy-reference-v2/07-back.webp"
  },
  "fantasy-08": {
    "front": "assets/fantasy-reference-v2/08-front.webp",
    "side": "assets/fantasy-reference-v2/08-side.webp",
    "back": "assets/fantasy-reference-v2/08-back.webp"
  },
  "fantasy-09": {
    "front": "assets/fantasy-reference-v2/09-front.webp",
    "side": "assets/fantasy-reference-v2/09-side.webp",
    "back": "assets/fantasy-reference-v2/09-back.webp"
  },
  "fantasy-10": {
    "front": "assets/fantasy-reference-v2/10-front.webp",
    "side": "assets/fantasy-reference-v2/10-side.webp",
    "back": "assets/fantasy-reference-v2/10-back.webp"
  },
  "fantasy-11": {
    "front": "assets/fantasy-reference-v2/11-front.webp",
    "side": "assets/fantasy-reference-v2/11-side.webp",
    "back": "assets/fantasy-reference-v2/11-back.webp"
  }
};
  const bodyCenters = {
  "character-01": {
    "front": 0.534,
    "side": 0.463,
    "back": 0.491
  },
  "character-02": {
    "front": 0.494,
    "side": 0.489,
    "back": 0.527
  },
  "character-03": {
    "front": 0.591,
    "side": 0.533,
    "back": 0.546
  },
  "character-04": {
    "front": 0.533,
    "side": 0.515,
    "back": 0.553
  },
  "character-05": {
    "front": 0.495,
    "side": 0.498,
    "back": 0.537
  },
  "character-06": {
    "front": 0.568,
    "side": 0.573,
    "back": 0.495
  },
  "character-07": {
    "front": 0.475,
    "side": 0.517,
    "back": 0.497
  },
  "fantasy-08": {
    "front": 0.492,
    "side": 0.483,
    "back": 0.505
  },
  "fantasy-09": {
    "front": 0.478,
    "side": 0.465,
    "back": 0.496
  },
  "fantasy-10": {
    "front": 0.501,
    "side": 0.483,
    "back": 0.509
  },
  "fantasy-11": {
    "front": 0.511,
    "side": 0.453,
    "back": 0.478
  }
};
  const alphaBounds = {
  "character-01": {
    "front": [
      0.0112,
      0.0556,
      0.9106,
      0.8907
    ],
    "side": [
      0.1352,
      0.0527,
      0.8934,
      0.8966
    ],
    "back": [
      0.0762,
      0.0546,
      1.0,
      0.9541
    ]
  },
  "character-02": {
    "front": [
      0.019,
      0.0127,
      0.9454,
      0.9443
    ],
    "side": [
      0.0902,
      0.0234,
      0.9436,
      0.9463
    ],
    "back": [
      0.0446,
      0.0225,
      1.0,
      0.9561
    ]
  },
  "character-03": {
    "front": [
      0.0759,
      0.023,
      0.9892,
      0.9558
    ],
    "side": [
      0.0181,
      0.023,
      0.913,
      0.9622
    ],
    "back": [
      0.0847,
      0.0221,
      1.0,
      1.0
    ]
  },
  "character-04": {
    "front": [
      0.1609,
      0.0664,
      0.9103,
      0.9082
    ],
    "side": [
      0.1538,
      0.0645,
      0.9269,
      0.9199
    ],
    "back": [
      0.0638,
      0.0645,
      1.0,
      0.9111
    ]
  },
  "character-05": {
    "front": [
      0.0,
      0.0459,
      1.0,
      0.9297
    ],
    "side": [
      0.0,
      0.042,
      1.0,
      0.9355
    ],
    "back": [
      0.0,
      0.0439,
      1.0,
      0.9443
    ]
  },
  "character-06": {
    "front": [
      0.0,
      0.0245,
      1.0,
      0.9734
    ],
    "side": [
      0.0,
      0.0266,
      0.9751,
      0.9745
    ],
    "back": [
      0.0232,
      0.0245,
      0.9768,
      0.9713
    ]
  },
  "character-07": {
    "front": [
      0.042,
      0.1095,
      0.9501,
      0.897
    ],
    "side": [
      0.076,
      0.1104,
      1.0,
      0.9006
    ],
    "back": [
      0.0,
      0.1095,
      1.0,
      0.896
    ]
  },
  "fantasy-08": {
    "front": [
      0.0,
      0.0525,
      1.0,
      0.9263
    ],
    "side": [
      0.0,
      0.0571,
      1.0,
      0.9153
    ],
    "back": [
      0.0,
      0.0525,
      0.9918,
      0.919
    ]
  },
  "fantasy-09": {
    "front": [
      0.0028,
      0.0414,
      0.9917,
      0.9751
    ],
    "side": [
      0.0117,
      0.0433,
      0.9805,
      0.9549
    ],
    "back": [
      0.0176,
      0.047,
      0.9765,
      0.953
    ]
  },
  "fantasy-10": {
    "front": [
      0.0554,
      0.0534,
      0.9525,
      0.9245
    ],
    "side": [
      0.0714,
      0.0589,
      0.9916,
      0.9227
    ],
    "back": [
      0.009,
      0.0516,
      1.0,
      1.0
    ]
  },
  "fantasy-11": {
    "front": [
      0.014,
      0.0396,
      0.986,
      0.9383
    ],
    "side": [
      0.0073,
      0.0442,
      1.0,
      0.9383
    ],
    "back": [
      0.0,
      0.0433,
      0.9911,
      0.9374
    ]
  }
};
  window.PORTFOLIO_REFERENCE_ANCHORS ||= {};
  window.PORTFOLIO_REFERENCE_FRAMING ||= {};
  for (const character of characters) {
    if (!views[character.id]) continue;
    character.views = views[character.id];
    delete character.viewCrop;
    character.subjectAnchor = bodyCenters[character.id];
    window.PORTFOLIO_REFERENCE_ANCHORS[character.id] = bodyCenters[character.id];
    window.PORTFOLIO_REFERENCE_FRAMING[character.id] = alphaBounds[character.id];
    if (character.id === "character-04") character.weaponReference = "assets/fantasy-reference-v2/04-weapon-thunder-axe.webp";
  }
})();
