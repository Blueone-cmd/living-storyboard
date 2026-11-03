/* The scrolling old-money cards use the supplied single-person posters.
   All eight poster files have been cut out into transparent PNGs. */
(() => {
  const characters = window.PORTFOLIO_CONTENT?.characters;
  if (!Array.isArray(characters)) return;
  const posters = {
    'old-01': ['01', '藏蓝丝绒礼服'],
    'old-02': ['02', '灰色三件套'],
    'old-03': ['03', '深蓝礼服大衣'],
    'old-04': ['04', '象牙白婚纱'],
    'old-05': ['05', '棕灰三件套'],
    'old-06': ['06', '酒红蕾丝礼服'],
    'old-08': ['08', '墨绿连衣裙'],
    'old-09': ['09', '深蓝礼帽造型'],
  };
  for (const character of characters) {
    const poster = posters[character.id];
    if (!poster) continue;
    character.castImage = `assets/old-money-reference-v2/${poster[0]}-poster-front.webp`;
    character.action = poster[1];
  }
})();
