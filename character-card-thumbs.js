/* Generated card thumbnails; original art remains available for detail views. */
(() => {
  const thumbnails = {
  "character-01": "assets/character-thumbs/character-01.webp",
  "character-02": "assets/character-thumbs/character-02.webp",
  "character-03": "assets/character-thumbs/character-03.webp",
  "character-04": "assets/character-thumbs/character-04.webp",
  "character-05": "assets/character-thumbs/character-05.webp",
  "character-06": "assets/character-thumbs/character-06.webp",
  "character-07": "assets/character-thumbs/character-07.webp",
  "fantasy-08": "assets/character-thumbs/fantasy-08.webp",
  "fantasy-09": "assets/character-thumbs/fantasy-09.webp",
  "fantasy-10": "assets/character-thumbs/fantasy-10.webp",
  "fantasy-11": "assets/character-thumbs/fantasy-11.webp",
  "old-01": "assets/character-thumbs/old-01.webp",
  "old-02": "assets/character-thumbs/old-02.webp",
  "old-03": "assets/character-thumbs/old-03.webp",
  "old-04": "assets/character-thumbs/old-04.webp",
  "old-05": "assets/character-thumbs/old-05.webp",
  "old-06": "assets/character-thumbs/old-06.webp",
  "old-08": "assets/character-thumbs/old-08.webp",
  "old-09": "assets/character-thumbs/old-09.webp",
  "modern-01": "assets/character-thumbs/modern-01.webp",
  "modern-02": "assets/character-thumbs/modern-02.webp",
  "modern-03": "assets/character-thumbs/modern-03.webp",
  "modern-06": "assets/character-thumbs/modern-06.webp",
  "modern-07": "assets/character-thumbs/modern-07.webp",
  "modern-08": "assets/character-thumbs/modern-08.webp",
  "modern-09": "assets/character-thumbs/modern-09.webp",
  "modern-10": "assets/character-thumbs/modern-10.webp",
  "modern-11": "assets/character-thumbs/modern-11.webp",
  "modern-12": "assets/character-thumbs/modern-12.webp",
  "modern-13": "assets/character-thumbs/modern-13.webp",
  "modern-14": "assets/character-thumbs/modern-14.webp",
  "modern-15": "assets/character-thumbs/modern-15.webp",
  "modern-17": "assets/character-thumbs/modern-17.webp",
  "modern-19": "assets/character-thumbs/modern-19.webp",
  "modern-20": "assets/character-thumbs/modern-20.webp",
  "modern-21": "assets/character-thumbs/modern-21.webp"
};
  for (const character of window.PORTFOLIO_CONTENT?.characters || []) {
    character.cardImage = thumbnails[character.id] || character.castImage;
  }
})();
