/* GitHub Pages + Cloudflare R2 发布配置。这里只填写公开访问地址，不填写密钥。 */
(() => {
  'use strict';

  // 试用时填写 R2 存储桶的公开地址，例如 https://pub-example.r2.dev。
  // 留空则保留本地相对路径，方便用含视频的本地目录预览。
  const R2_PUBLIC_BASE_URL = 'https://pub-0774e10c01994b08aefd51661ebaa368.r2.dev';
  const base = R2_PUBLIC_BASE_URL.trim().replace(/\/+$/, '');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const lightMediaMode = window.matchMedia('(max-width: 700px)').matches ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !!connection?.saveData || /^(?:slow-2g|2g)$/.test(connection?.effectiveType || '');
  window.PORTFOLIO_LIGHT_MEDIA_MODE = lightMediaMode;

  const videoURL = (path) => {
    if (!path || /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path)) return path;
    const relativePath = String(path).replace(/^\.\//, '').replace(/^\/+/, '');
    return base ? `${base}/${relativePath}` : path;
  };

  window.PORTFOLIO_VIDEO_BASE_URL = base;
  window.PORTFOLIO_VIDEO_URL = videoURL;

  for (const work of window.PORTFOLIO_CONTENT?.works || []) {
    if (work.video) work.video = videoURL(work.video);
    if (work.reelPreview) work.reelPreview = videoURL(work.reelPreview);
  }

  const hero = document.getElementById('hero-composite-video');
  if (hero) {
    hero.preload = lightMediaMode ? 'none' : 'auto';
    if (!lightMediaMode && hero.dataset.videoSrc) hero.src = videoURL(hero.dataset.videoSrc);
  }
})();
