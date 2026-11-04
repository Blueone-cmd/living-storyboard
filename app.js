(() => {
  "use strict";
  const data = window.PORTFOLIO_CONTENT;
  if (!data || !Array.isArray(data.works)) return;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const pad2 = (n) => String(Math.floor(n)).padStart(2, "0");
  const timecode = (seconds) => `${pad2(seconds / 60)}:${pad2(seconds % 60)}`;
  const typeLabel = { film: "成片视频", shot: "镜头片段", frame: "画面帧", prompt: "提示词片段拆分" };
  const typeCode = { film: "FILM", shot: "SHOT", frame: "FRAME", prompt: "PROMPT" };
  const filters = [
    { key: "film", label: "成片视频" }, { key: "shot", label: "精彩镜头" },
    { key: "frame", label: "画面帧" }, { key: "prompt", label: "提示词片段拆分" }
  ];
  const filmCategories = [
    { key: "thor", name: "雷神系列", english: "THOR SERIES" },
    { key: "island", name: "荒岛系列", english: "ISLAND SERIES", cover: "assets/film-category-island-promo.webp" },
    { key: "other", name: "其他类型", english: "OTHER WORKS", cover: "assets/film-category-other.webp" }
  ];
  const projectIntroductions = {
    thor: {
      title: "My Bloodline Is a Thunder God", name: "雷神之子",
      metrics: ["TikTok累计播放2000万+", "40集", "约50分钟"],
      evidence: ["assets/evidence/thor-data-01.png", "assets/evidence/thor-data-02.png", "assets/evidence/thor-ai.png", "assets/evidence/thor-production.png"],
      synopsis: "男频逆袭叙事与西方雷神神话的融合。故事围绕雷神血脉带来的身份转折与能力成长展开，通过不断升级的冲突、能力体系与奇幻视觉，形成节奏紧凑的高燃成长体验。",
      roleTitle: "执行导演｜制作流程与重点集落地",
      role: "从前期样片验证进入正片批量落地，统筹40集内容排期与任务分配，协调3名AI生成制作和2名剪辑并行推进。重点负责高燃集数的镜头呈现、奇幻视效、关键资产及成片质量审核，并将项目经验沉淀为标准化制作SOP，支持团队在约两周内完成交付。",
      watchUrl: "https://www.tiktok.com/shortdrama/episode/7651616570741101584/1?is_from_webapp=1&sender_device=pc"
    },
    island: {
      title: "Treasure Island Stranding: Five Goddess-Level Beauties Rely on Me Alone", name: "荒岛求生",
      metrics: ["TikTok累计播放4500万+", "重点集单集播放破1000万", "30集｜约45分钟"],
      evidence: ["assets/evidence/island-data-01.png", "assets/evidence/island-data-02.png", "assets/evidence/island-ai.png", "assets/evidence/island-production.png"],
      synopsis: "一场突如其来的海难，让男主与多位女性角色流落荒岛。故事围绕资源获取、环境危机和人物关系展开，在不断升级的生存压力中推动角色从分歧走向协作，形成冒险、悬念与情感关系并行的生存故事。",
      roleTitle: "执行导演｜样片制作与成片交付",
      role: "负责前期样片制作，并通过样片确定项目的视觉方向与镜头标准；统筹30集内容排期、任务分配及重点集落地，协调2—3名AI生成制作与2名剪辑并行推进。同时负责关键资产、镜头质量与成片审核，在约两周内完成整体交付。",
      watchUrl: "https://www.tiktok.com/shortdrama/episode/7688606550029571080/2?is_from_webapp=1&sender_device=pc"
    }
  };
  const featuredOrder = ["film-01", "shot-01", "prompt-thor-01", "film-07", "shot-11", "film-10"];
  const STAGE_WIDTH = 1672;
  const STAGE_HEIGHT = 940;
  let filmReel = null;
  let currentFilter = "film";
  let selectedFilmCategory = null;
  let evidenceViewer = null;
  let evidenceOpener = null;
  let evidenceImages = [];
  let evidenceIndex = 0;
  let evidenceObserver = null;
  let galleryList = [];
  let viewerList = [];
  let activeWork = null;
  let demoPlaying = false;
  let demoClock = 0;
  let demoStart = 0;
  let demoFrame = 0;
  let soundOn = true;
  let videoFailed = false;
  let pendingSeek = null;
  let toastTimer = 0;
  let panelOpener = null;
  let viewerOpener = null;
  let inlineFilmVideo = null;
  let inlineWorkId = null;
  let selectedCharacter = 0;
  let selectedView = "front";
  let selectedCategory = "fantasy";
  const characterCategories = [
    { key: "fantasy", name: "奇幻冒险类角色", short: "FANTASY ADVENTURE" },
    { key: "old-money", name: "美式老钱风", short: "OLD MONEY" },
    { key: "modern", name: "现代都市类", short: "MODERN CITY" },
  ];

  const panelInfo = {
    works: { label: "THE FILM ARCHIVE", title: "作品档案" },
    characters: { label: "CHARACTER UNIVERSE", title: "角色宇宙" },
    about: { label: "ABOUT THE DIRECTOR", title: "关于导演" }
  };

  function fitStage() {
    // Always preserve the authored cinema composition. A narrow browser sees
    // the same 1672 × 940 frame, fitted uniformly inside the viewport.
    const viewport = window.visualViewport;
    const width = viewport?.width || window.innerWidth;
    const height = viewport?.height || window.innerHeight;
    const scale = Math.max(.05, Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT));
    const screen = $("#screen");
    screen.style.setProperty("--stage-scale", scale.toFixed(5));
    screen.classList.add("stage-ready");
  }

  function renderHomeCast() {
    const host = $("#cast-figures");
    if (!host) return;
    const characters = (data.characters || []).slice(0, 7);
    // Individual positions let weapons and capes overlap without losing the ensemble.
    // The final two characters exchange places on the home scene only.
    const placements = [
      { x: 246, width: 246, height: 335, bottom: -12 },
      { x: 440, width: 244, height: 335, bottom: -8 },
      { x: 612, width: 244, height: 342, bottom: -12 },
      { x: 822, width: 229, height: 320, bottom: 8 },
      { x: 1003, width: 248, height: 336, bottom: -12 },
      { x: 1431, width: 248, height: 344, bottom: -10 },
      { x: 1238, width: 244, height: 340, bottom: -14 }
    ];
    host.innerHTML = characters.map((character, index) => {
      const placement = placements[index];
      // Kael's approved left-hand axe portrait appears on the landing scene only.
      // Character archive images still come from content.js.
      const castImage = index === 3 ? "assets/cast/04-kyle-home-axe-v2.webp" : (character.castImage || character.views?.front || "");
      const style = `--cast-x:${placement.x}px;--cast-width:${placement.width}px;--cast-visible-height:278px;--cast-bottom:${placement.bottom}px;--cast-source-height:${placement.height}px`;
      const visual = castImage
        ? `<span class="cast-cut"><img class="cast-standalone" src="${escapeHTML(castImage)}" alt="">${index === 3 ? '<span class="cast-kyle-glow" aria-hidden="true"></span>' : ''}</span>`
        : '<span class="cast-standin" aria-hidden="true"></span>';
      return `<button type="button" class="cast-spot" data-character="${index}" style="${style}" aria-label="查看${escapeHTML(character.name)}">${visual}<span class="cast-hit" aria-hidden="true"></span><span class="cast-name">${escapeHTML(character.name)} ↗</span></button>`;
    }).join("");
  }

  function showToast(message) {
    let toast = $("#toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function mediaImage(work) {
    return work.poster ? `<img src="${escapeHTML(work.poster)}" alt="${escapeHTML(work.title)} 作品画面" loading="lazy">` : "";
  }

  function renderStatistics() {
    (data.statistics || []).slice(0, 2).forEach((statistic, index) => {
      const value = $(`[data-metric-value="${index}"]`);
      const label = $(`[data-metric-label="${index}"]`);
      if (!value || !label) return;
      const parts = String(statistic.value || "").match(/^(\d+)(.*)$/);
      value.innerHTML = parts ? `${escapeHTML(parts[1])}<span>${escapeHTML(parts[2])}</span>` : escapeHTML(statistic.value || "");
      label.textContent = statistic.label || "";
    });
  }

  function renderHero() {
    const hero = $("#hero-composite-video");
    if (!window.PORTFOLIO_LIGHT_MEDIA_MODE) {
      hero.muted = true;
      hero.defaultMuted = true;
      hero.loop = true;
      hero.playsInline = true;
      // Begin just before the synchronized dragon, leviathan and wave impact.
      // The 30-second loop still passes through every frame of all three clips.
      const revealAt = 10.5;
      const seekToReveal = () => { if (hero.duration > revealAt) hero.currentTime = revealAt; };
      if (hero.readyState >= 1) seekToReveal();
      else hero.addEventListener("loadedmetadata", seekToReveal, { once: true });
      const screen = $("#screen");
      const updateImpactBeat = () => {
        const t = hero.currentTime;
        screen.classList.toggle("impact-beat", (t >= 10.95 && t < 11.70) || (t >= 26.02 && t < 26.75));
      };
      hero.addEventListener("seeked", updateImpactBeat);
      if (typeof hero.requestVideoFrameCallback === "function") {
        const onHeroFrame = () => { updateImpactBeat(); hero.requestVideoFrameCallback(onHeroFrame); };
        hero.requestVideoFrameCallback(onHeroFrame);
      } else hero.addEventListener("timeupdate", updateImpactBeat);
      hero.addEventListener("playing", () => hero.parentElement.classList.add("is-playing"));
      hero.addEventListener("error", () => hero.parentElement.classList.remove("is-playing"));
      hero.play().catch(() => {});
    }
    const shots = data.works.filter((work) => work.type === "shot");
    filmReel = window.initFilmReel($("#reel-track"), shots, (work, opener) => {
      openPanel("works", opener, "shot");
      const archiveCard = $$("#works-grid [data-open]").find((button) => button.dataset.open === work.id);
      openArchiveVideo(work.id, archiveCard || opener);
    });
  }

  function syncBackgroundVideo() {
    const hero = $("#hero-composite-video");
    if (!hero) return;
    if (window.PORTFOLIO_LIGHT_MEDIA_MODE) return;
    if (document.hidden || document.querySelector("dialog[open]")) {
      if (!hero.paused) hero.pause();
    } else if (hero.paused) hero.play().catch(() => {});
  }

  function orderedWorks() {
    return data.works.filter((work) => work.type === currentFilter &&
      (currentFilter !== "film" || !selectedFilmCategory || filmCategoryOf(work) === selectedFilmCategory));
  }

  function filmCategoryOf(work) {
    if (filmCategories.some((category) => category.key === work.category)) return work.category;
    if (/^雷神/.test(work.title || "")) return "thor";
    if (/^荒岛/.test(work.title || "")) return "island";
    return "other";
  }

  function renderFilters() {
    $("#filters").innerHTML = filters.map((filter) => {
      const count = data.works.filter((work) => work.type === filter.key).length;
      return `<button type="button" class="filter-btn ${currentFilter === filter.key ? "active" : ""}" data-filter="${filter.key}" aria-pressed="${currentFilter === filter.key}">${filter.label}<small>${count}</small></button>`;
    }).join("");
  }

  function renderProjectStory(project, categoryKey) {
    const evidence = (project.evidence || []).map((src, index) =>
      `<button type="button" class="project-evidence-item" data-evidence-project="${escapeHTML(categoryKey)}" data-evidence-index="${index}" aria-label="放大查看${escapeHTML(project.name)}项目记录第${index + 1}张"><img data-evidence-src="${escapeHTML(src)}" alt="${escapeHTML(project.name)}项目记录${index + 1}" decoding="async"><span aria-hidden="true">↗</span></button>`
    ).join("");
    return `<aside class="film-category-story" data-project-style="${escapeHTML(categoryKey)}" aria-label="${escapeHTML(project.name)}项目介绍">
      <div class="project-story-header"><div class="project-story-eyebrow"><span class="project-story-kicker">PROJECT FILE / 项目介绍</span><span class="project-story-edition">DIRECTED WORK</span></div><h3 class="project-story-title">${escapeHTML(project.title)}</h3><p class="project-story-name">${escapeHTML(project.name)}</p></div>
      <div class="project-story-metrics">${project.metrics.map((metric) => `<span>${escapeHTML(metric)}</span>`).join("")}</div>
      <div class="project-story-copy"><section class="project-story-section"><h4><span>01</span> 项目简介</h4><p>${escapeHTML(project.synopsis)}</p></section><section class="project-story-section"><h4><span>02</span> ${escapeHTML(project.roleTitle)}</h4><p>${escapeHTML(project.role)}</p></section></div>
      <a class="project-story-link" href="${escapeHTML(project.watchUrl)}" target="_blank" rel="noopener noreferrer">观看正片 <span aria-hidden="true">↗</span></a><p class="project-story-tip">观看提示：TikTok链接需使用魔法网络访问。</p>
      <div class="project-evidence-divider" aria-hidden="true"><span>PROJECT EVIDENCE</span><span>↓</span></div><div class="project-evidence-grid">${evidence}</div>
    </aside>`;
  }

  function observeProjectEvidence(story) {
    evidenceObserver?.disconnect();
    const images = $$('img[data-evidence-src]', story);
    const loadImage = (image) => {
      image.src = image.dataset.evidenceSrc;
      delete image.dataset.evidenceSrc;
    };
    if (!("IntersectionObserver" in window)) { images.forEach(loadImage); return; }
    evidenceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        evidenceObserver.unobserve(entry.target);
      });
    }, { root: story, rootMargin: "0px 0px 80px 0px" });
    images.forEach((image) => evidenceObserver.observe(image));
  }

  function openEvidenceViewer(projectKey, index, opener) {
    const project = projectIntroductions[projectKey];
    if (!project?.evidence?.[index]) return;
    evidenceImages = project.evidence;
    evidenceIndex = index;
    evidenceOpener = opener;
    if (!evidenceViewer) {
      evidenceViewer = document.createElement("dialog");
      evidenceViewer.className = "project-evidence-dialog";
      evidenceViewer.setAttribute("aria-label", "项目记录图片查看器");
      evidenceViewer.innerHTML = `<div class="project-evidence-viewer"><div class="project-evidence-viewer-top"><span>PROJECT EVIDENCE <b data-evidence-count></b></span><button type="button" data-evidence-close aria-label="关闭图片">关闭 ×</button></div><div class="project-evidence-viewer-body"><button type="button" data-evidence-step="-1" aria-label="上一张图片">←</button><img alt="项目记录放大图"><button type="button" data-evidence-step="1" aria-label="下一张图片">→</button></div></div>`;
      document.body.appendChild(evidenceViewer);
      evidenceViewer.addEventListener("click", (event) => {
        if (event.target === evidenceViewer || event.target.closest("[data-evidence-close]")) { evidenceViewer.close(); return; }
        const step = event.target.closest("[data-evidence-step]");
        if (step) { evidenceIndex = (evidenceIndex + Number(step.dataset.evidenceStep) + evidenceImages.length) % evidenceImages.length; showEvidenceImage(); }
      });
      evidenceViewer.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        evidenceIndex = (evidenceIndex + (event.key === "ArrowLeft" ? -1 : 1) + evidenceImages.length) % evidenceImages.length;
        showEvidenceImage();
      });
      evidenceViewer.addEventListener("close", () => {
        evidenceViewer.querySelector("img").removeAttribute("src");
        syncBackgroundVideo();
        restoreFocus(evidenceOpener);
        evidenceOpener = null;
      });
    }
    showEvidenceImage();
    evidenceViewer.showModal();
    syncBackgroundVideo();
    evidenceViewer.querySelector("[data-evidence-close]").focus({ preventScroll: true });
  }

  function showEvidenceImage() {
    if (!evidenceViewer || !evidenceImages[evidenceIndex]) return;
    const image = evidenceViewer.querySelector("img");
    image.src = evidenceImages[evidenceIndex];
    image.alt = `项目记录第${evidenceIndex + 1}张放大图`;
    evidenceViewer.querySelector("[data-evidence-count]").textContent = `${pad2(evidenceIndex + 1)} / ${pad2(evidenceImages.length)}`;
  }

  function renderFilmCategories() {
    const host = $("#film-categories");
    if (!host) return;
    evidenceObserver?.disconnect();
    host.hidden = currentFilter !== "film";
    if (currentFilter !== "film") { host.innerHTML = ""; return; }
    if (selectedFilmCategory) {
      const category = filmCategories.find((item) => item.key === selectedFilmCategory);
      const project = projectIntroductions[selectedFilmCategory];
      const story = project ? renderProjectStory(project, selectedFilmCategory) : "";
      host.innerHTML = `<div class="film-category-heading"><button type="button" data-film-category-back aria-label="返回成片分类">← 返回分类</button><div><span>SELECTED COLLECTION</span><h3>${escapeHTML(category?.name || "成片视频")}</h3></div></div>${story}`;
      if (project) observeProjectEvidence(host.querySelector(".film-category-story"));
      return;
    }
    host.innerHTML = `<div class="film-category-grid">${filmCategories.map((category) => {
      const works = data.works.filter((work) => work.type === "film" && filmCategoryOf(work) === category.key);
      const poster = category.cover || works.find((work) => work.poster)?.poster || "";
      return `<button type="button" class="film-category-card" data-film-category="${category.key}" aria-label="查看${escapeHTML(category.name)}，${works.length}部视频"><span class="film-category-art">${poster ? `<img src="${escapeHTML(poster)}" alt="" loading="lazy">` : ""}</span><span class="film-category-shade"></span><span class="film-category-copy"><small>${escapeHTML(category.english)} / ${pad2(works.length)}</small><strong>${escapeHTML(category.name)}</strong><em>进入片单 ↗</em></span></button>`;
    }).join("")}</div>`;
  }

  function renderWorks() {
    galleryList = orderedWorks();
    $("#panel").dataset.archiveFilter = currentFilter;
    $("#archive-count").textContent = pad2(currentFilter === "film" && !selectedFilmCategory ? data.works.filter((work) => work.type === "film").length : galleryList.length);
    renderFilmCategories();
    if (currentFilter === "film" && !selectedFilmCategory) { $("#works-grid").innerHTML = ""; return; }
    if (currentFilter === "shot") {
      $("#works-grid").innerHTML = `<div class="shot-carousel"><div class="shot-carousel-heading"><div><span>精彩镜头 / ${pad2(galleryList.length)}</span><small>左右拖动或使用滚轮浏览，点击画面即可播放</small></div><div class="shot-carousel-controls"><button type="button" data-shot-scroll="-1" aria-label="向左浏览精彩镜头">←</button><button type="button" data-shot-scroll="1" aria-label="向右浏览精彩镜头">→</button></div></div><div class="shot-carousel-track" role="region" aria-label="精彩镜头横向列表" tabindex="0">${galleryList.map((work, index) => `<article class="work-card work-card--shot shot-carousel-card ${work.poster ? "" : "placeholder"}" data-shot-id="${escapeHTML(work.id)}"><button type="button" data-open="${escapeHTML(work.id)}" aria-label="播放第 ${index + 1} 个精彩镜头"><div class="work-thumb">${work.poster ? `<img src="${escapeHTML(work.poster)}" alt="${escapeHTML(work.title)} 作品画面" loading="${index < 2 ? "eager" : "lazy"}" fetchpriority="${index < 2 ? "high" : "low"}" decoding="async" draggable="false">` : ""}<div class="film-top"><span>SHOT / ${pad2(index + 1)}</span><span>${escapeHTML(work.aspect || "")}</span></div><span class="work-index">${pad2(index + 1)}</span><span class="work-arrow">▶</span></div></button></article>`).join("")}</div><div class="shot-carousel-progress"><span class="shot-carousel-percent">00%</span><input class="shot-carousel-range" type="range" min="0" max="1000" value="0" aria-label="精彩镜头浏览进度"><span class="shot-carousel-hint">DRAG / SCROLL</span></div></div>`;
      const track = $(".shot-carousel-track", $("#works-grid"));
      let pendingWheel = 0;
      let wheelFrame = 0;
      track.addEventListener("wheel", (event) => {
        if (event.ctrlKey || !event.deltaY && !event.deltaX) return;
        event.preventDefault();
        const scale = track.getBoundingClientRect().width / (track.clientWidth || 1);
        pendingWheel += (event.deltaX || event.deltaY) / (scale || 1);
        if (wheelFrame) return;
        wheelFrame = requestAnimationFrame(() => {
          track.scrollLeft += pendingWheel;
          pendingWheel = 0;
          wheelFrame = 0;
        });
      }, { passive: false });
      initShotProgress(track);
      initShotDrag(track);
      requestAnimationFrame(() => $$(".shot-carousel-card", track).forEach((card) => card.classList.add("visible")));
      return;
    }
    $("#works-grid").innerHTML = galleryList.map((work, index) => {
      const [mediaWidth, mediaHeight] = String(work.aspect || "").split(":").map(Number);
      const aspectBadge = work.concept ? "概念演示" : mediaWidth && mediaHeight ? (mediaWidth > mediaHeight ? "16:9" : "9:16") : "";
      const text = work.type === "shot" ? "" : `<div class="work-title"><h3>${escapeHTML(work.title)}</h3><span>${escapeHTML(typeLabel[work.type] || "作品")}</span></div><p>${escapeHTML(work.subtitle || "")}</p>`;
      return `<article class="work-card ${work.type === "shot" ? "work-card--shot" : ""} ${work.poster ? "" : "placeholder"}"><button type="button" data-open="${escapeHTML(work.id)}" aria-label="播放${escapeHTML(work.title)}"><div class="work-thumb">${mediaImage(work)}<div class="film-top"><span>${escapeHTML(typeCode[work.type] || "WORK")} / ${pad2(index + 1)}</span><span>${aspectBadge}</span></div><span class="work-index">${pad2(index + 1)}</span><span class="work-arrow">↗</span></div>${text}</button></article>`;
    }).join("");
    requestAnimationFrame(() => $$(".work-card").forEach((card, index) => setTimeout(() => card.classList.add("visible"), Math.min(index * 38, 350))));
  }

  let suppressShotClickUntil = 0;
  function initShotProgress(track) {
    const carousel = track.closest(".shot-carousel");
    const range = $(".shot-carousel-range", carousel);
    const percent = $(".shot-carousel-percent", carousel);
    let frame = 0;
    const sync = () => {
      frame = 0;
      const limit = Math.max(0, track.scrollWidth - track.clientWidth);
      const value = limit ? Math.round(track.scrollLeft / limit * 1000) : 0;
      const percentage = Math.round(value / 10);
      range.value = String(value);
      range.style.setProperty("--shot-progress", `${percentage}%`);
      percent.textContent = `${String(percentage).padStart(2, "0")}%`;
    };
    track.addEventListener("scroll", () => {
      if (!frame) frame = requestAnimationFrame(sync);
    }, { passive: true });
    range.addEventListener("input", () => {
      track.scrollLeft = (track.scrollWidth - track.clientWidth) * Number(range.value) / 1000;
    });
    sync();
  }
  function initShotDrag(track) {
    let startX = null;
    let startScroll = 0;
    let dragging = false;
    const move = (event) => {
      if (startX === null || event.pointerType !== "mouse") return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 6) dragging = true;
      if (!dragging) return;
      event.preventDefault();
      const scale = track.getBoundingClientRect().width / (track.clientWidth || 1);
      track.scrollLeft = startScroll - distance / (scale || 1);
    };
    const stop = () => {
      if (dragging) suppressShotClickUntil = Date.now() + 90;
      startX = null;
      dragging = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest("video,.shot-playback-close")) return;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      dragging = false;
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    });
    track.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      track.scrollBy({ left: event.key === "ArrowLeft" ? -260 : 260, behavior: "smooth" });
    });
  }

  function setFilter(key) {
    if (!filters.some((filter) => filter.key === key)) return;
    closeInlineFilm();
    selectedFilmCategory = null;
    currentFilter = key;
    renderFilters();
    renderWorks();
  }

  function openPanel(key, opener, filterTarget, characterIndex) {
    if (!panelInfo[key]) return;
    if (key === "works") setFilter(filters.some((filter) => filter.key === filterTarget) ? filterTarget : "film");
    const panel = $("#panel");
    panel.dataset.view = key;
    for (const sectionKey of Object.keys(panelInfo)) {
      const section = $(`#panel-${sectionKey}`);
      section.hidden = sectionKey !== key;
      section.style.display = sectionKey === key ? "" : "none";
    }
    $("#panel-label").textContent = panelInfo[key].label;
    $("#panel-title").textContent = panelInfo[key].title;
    panel.scrollTop = 0;
    if (!panel.open) {
      panelOpener = opener || document.activeElement;
      panel.showModal();
    }
    syncBackgroundVideo();
    document.body.classList.add("dialog-open");
    if (key === "characters") setCharacter(Number.isInteger(characterIndex) ? characterIndex : selectedCharacter, Number.isInteger(characterIndex) ? "front" : selectedView);
    $("#panel-close").focus({ preventScroll: true });
    panel.querySelector('.panel-body').scrollTop = 0;
  }

  function closePanel() {
    closeInlineFilm();
    if ($("#panel").open) $("#panel").close();
  }

  function closeInlineFilm() {
    if (inlineFilmVideo) {
      inlineFilmVideo.pause();
      inlineFilmVideo.removeAttribute("src");
      inlineFilmVideo.load();
      inlineFilmVideo = null;
    }
    inlineWorkId = null;
    $(".inline-film-player")?.remove();
    const activeShot = $(".shot-carousel-card.is-playing");
    if (activeShot) {
      activeShot.classList.remove("is-playing");
      $(".shot-inline-stage", activeShot)?.remove();
    }
  }

  function openShotInCarousel(work) {
    const card = $(`.shot-carousel-card[data-shot-id="${CSS.escape(work.id)}"]`);
    if (!card) return;
    closeInlineFilm();
    const stage = document.createElement("div");
    stage.className = "shot-inline-stage";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "shot-playback-close";
    close.setAttribute("aria-label", "收起当前精彩镜头");
    close.textContent = "×";
    close.addEventListener("click", closeInlineFilm);
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = work.video;
    video.poster = work.poster || "";
    video.muted = !soundOn;
    video.disablePictureInPicture = true;
    video.disableRemotePlayback = true;
    video.setAttribute("controlsList", "nodownload noremoteplayback");
    video.setAttribute("aria-label", `精彩镜头播放器：${work.title}`);
    video.addEventListener("contextmenu", (event) => event.preventDefault());
    video.addEventListener("error", () => showToast("视频暂时无法播放，请稍后重试。"));
    stage.append(video, close);
    card.append(stage);
    card.classList.add("is-playing");
    inlineFilmVideo = video;
    inlineWorkId = work.id;
    const track = card.closest(".shot-carousel-track");
    requestAnimationFrame(() => {
      if (!track || !card.isConnected) return;
      const scale = track.getBoundingClientRect().width / (track.clientWidth || 1);
      const left = track.scrollLeft + (card.getBoundingClientRect().left - track.getBoundingClientRect().left) / (scale || 1) - (track.clientWidth - card.clientWidth) / 2;
      track.scrollTo({ left, behavior: "smooth" });
    });
    video.play().catch(() => {});
  }

  function openArchiveVideo(id, opener) {
    const work = data.works.find((item) => item.id === id && (item.type === "film" || item.type === "shot"));
    if (!work?.video) return;
    if (!$("#panel").open || $("#panel").dataset.view !== "works" || currentFilter !== work.type) {
      openPanel("works", opener, work.type);
    }
    if (work.type === "shot") { openShotInCarousel(work); return; }
    const categoryKey = work.type === "film" ? filmCategoryOf(work) : null;
    if (work.type === "film" && selectedFilmCategory !== categoryKey) {
      selectedFilmCategory = categoryKey;
      renderWorks();
    }
    closeInlineFilm();
    const collection = galleryList.filter((item) => item.type === work.type);
    const currentIndex = collection.findIndex((item) => item.id === work.id);
    const previous = collection[(currentIndex - 1 + collection.length) % collection.length];
    const next = collection[(currentIndex + 1) % collection.length];
    const player = document.createElement("div");
    player.className = "inline-film-player is-film";
    player.dataset.workId = work.id;
    player.innerHTML = '<div class="inline-film-toolbar"><div class="inline-film-heading"><small></small><span class="inline-film-title"></span></div><div class="inline-film-actions"><button type="button" class="inline-film-prev" data-inline-step="-1">← 上一条</button><span class="inline-film-position"></span><button type="button" class="inline-film-next" data-inline-step="1">下一条 →</button><button type="button" class="inline-film-close" aria-label="收起视频">收起 ×</button></div></div><div class="inline-film-content"><div class="inline-film-screen"></div></div>';
    $(".inline-film-heading small", player).textContent = work.type === "shot" ? "SELECTED SHOT" : `${filmCategories.find((item) => item.key === categoryKey)?.name || "成片视频"} / FINISHED FILM`;
    $(".inline-film-title", player).textContent = work.type === "shot" ? `精彩镜头 ${pad2(currentIndex + 1)} / ${pad2(collection.length)}` : work.title;
    $(".inline-film-position", player).textContent = work.type === "shot" ? "" : `${pad2(currentIndex + 1)} / ${pad2(collection.length)}`;
    $(".inline-film-prev", player).setAttribute("aria-label", `播放上一条：${previous?.title || work.title}`);
    $(".inline-film-next", player).setAttribute("aria-label", `播放下一条：${next?.title || work.title}`);
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = work.video;
    video.poster = work.poster || "";
    video.muted = !soundOn;
    video.disablePictureInPicture = true;
    video.disableRemotePlayback = true;
    video.setAttribute("controlsList", "nodownload noremoteplayback");
    video.setAttribute("aria-label", `${work.title} 播放器`);
    video.addEventListener("contextmenu", (event) => event.preventDefault());
    video.addEventListener("error", () => showToast("视频暂时无法播放，请稍后重试。"));
    $(".inline-film-screen", player).append(video);
    $(".inline-film-close", player).addEventListener("click", closeInlineFilm);
    $("#works-grid").before(player);
    inlineFilmVideo = video;
    inlineWorkId = work.id;
    requestAnimationFrame(() => {
      const body = $("#panel .panel-body");
      const scale = body.getBoundingClientRect().height / (body.clientHeight || 1);
      body.scrollTop += (player.getBoundingClientRect().top - body.getBoundingClientRect().top) / (scale || 1) - 8;
    });
    video.play().catch(() => {});
  }

  function restoreFocus(element) {
    if (element?.isConnected && typeof element.focus === "function") element.focus({ preventScroll: true });
  }

  function syncDialogState() {
    document.body.classList.toggle("dialog-open", $("#panel").open || $("#viewer").open);
  }

  function currentDuration() {
    const video = $("#viewer-video");
    return activeWork?.video && !videoFailed && Number.isFinite(video.duration) ? video.duration : Number(activeWork?.duration || 0);
  }

  function currentTime() {
    const video = $("#viewer-video");
    return activeWork?.video && !videoFailed ? video.currentTime || 0 : demoClock;
  }

  function setViewerTime(seconds) {
    if (!activeWork) return;
    const video = $("#viewer-video");
    if (activeWork.video && !videoFailed && video.readyState < 1) {
      pendingSeek = Math.max(0, Number(seconds) || 0);
      return;
    }
    const duration = currentDuration();
    const time = Math.max(0, Math.min(seconds, duration));
    if (activeWork.video && !videoFailed) {
      try { video.currentTime = time; }
      catch { /* Metadata has not loaded yet; the next timeupdate will resync. */ }
    }
    else { demoClock = time; if (demoPlaying) demoStart = performance.now() - time * 1000; }
    syncViewer();
  }

  function syncViewer() {
    if (!activeWork) return;
    const duration = currentDuration();
    const time = currentTime();
    $("#viewer-range").value = duration > 0 ? Math.round((time / duration) * 1000) : 0;
    $("#viewer-time").textContent = `${timecode(time)} / ${timecode(duration)}`;
    const chapters = activeWork.chapters || [];
    const activeIndex = chapters.reduce((result, chapter, index) => time >= chapter.at ? index : result, 0);
    $$(".chapter", $("#chapter-list")).forEach((element, index) => { element.classList.toggle("active", index === activeIndex); if (index === activeIndex) element.setAttribute("aria-current", "true"); else element.removeAttribute("aria-current"); });
    const chapter = chapters[activeIndex];
    $("#viewer-prompt-text").textContent = chapter?.prompt || "收到真实镜头提示词后，这里会按视频时间码自动显示对应版本。";
    $("#viewer-rationale").textContent = chapter?.rationale || "可同时展示导演意图、画面约束与迭代理由。";
    const image = $("#viewer-image");
    if (!image.hidden && duration > 0) {
      const fraction = time / duration;
      image.style.transform = `scale(${(1.04 + fraction * .13).toFixed(3)}) translate(${(-fraction * 2).toFixed(2)}%,${(-fraction * 1.5).toFixed(2)}%)`;
    }
  }

  function stopDemo() {
    demoPlaying = false;
    cancelAnimationFrame(demoFrame);
    $("#viewer-play").textContent = "▶";
  }

  function demoTick(now) {
    if (!demoPlaying || !activeWork) return;
    const duration = currentDuration();
    demoClock = Math.min(duration, (now - demoStart) / 1000);
    syncViewer();
    if (demoClock >= duration) { stopDemo(); return; }
    demoFrame = requestAnimationFrame(demoTick);
  }

  function toggleViewerPlay() {
    if (!activeWork) return;
    if (videoFailed) { showToast("视频暂时无法播放，请稍后重试。"); return; }
    const video = $("#viewer-video");
    if (activeWork.video) {
      if (video.paused) video.play().catch(() => showToast("浏览器阻止了播放，请使用视频控件播放。"));
      else video.pause();
      return;
    }
    if (!currentDuration()) { showToast("这部作品的视频尚未导入。"); return; }
    if (demoPlaying) { stopDemo(); return; }
    if (demoClock >= currentDuration()) demoClock = 0;
    demoPlaying = true;
    demoStart = performance.now() - demoClock * 1000;
    $("#viewer-play").textContent = "Ⅱ";
    demoFrame = requestAnimationFrame(demoTick);
  }

  function openViewer(id, opener, listOverride) {
    const work = data.works.find((item) => item.id === id);
    if (!work) return;
    if (work.type === "film" || work.type === "shot") { openArchiveVideo(id, opener); return; }
    closeInlineFilm();
    stopDemo();
    $$("#reel-track video").forEach((preview) => preview.pause());
    const video = $("#viewer-video");
    video.pause();
    activeWork = null;
    video.removeAttribute("src");
    video.load();
    activeWork = work;
    demoClock = 0;
    videoFailed = false;
    pendingSeek = null;
    const list = Array.isArray(listOverride) && listOverride.some((item) => item.id === id)
      ? listOverride : data.works.filter((item) => item.type === work.type);
    viewerList = list.length ? list.slice() : [work];
    $("#viewer-index").textContent = String(viewerList.findIndex((item) => item.id === id) + 1).padStart(3, "0");
    $("#viewer-title").textContent = work.title;
    $("#viewer-summary").textContent = work.description || "";
    $("#viewer-type").textContent = typeCode[work.type] || "WORK";
    const dialog = $("#viewer");
    dialog.dataset.workType = work.type;
    const [mediaWidth, mediaHeight] = String(work.aspect || "").split(":").map(Number);
    dialog.dataset.mediaOrientation = mediaWidth > mediaHeight ? "landscape" : "portrait";
    const promptTitle = $("#viewer-prompt-title") || $(".viewer-prompt-title");
    if (promptTitle) promptTitle.textContent = work.title;
    const promptCopy = $("#viewer-prompt-copy");
    if (promptCopy) promptCopy.textContent = work.promptText || "";
    $("#viewer-demo-badge").hidden = !work.concept;
    $("#viewer-demo-badge").textContent = work.concept ? (work.video ? "概念演示素材" : work.duration ? "静帧动效预演 / 非实际视频" : "概念画面 / 待接入真实素材") : "";
    $("#chapter-count").textContent = `${pad2((work.chapters || []).length)} NODES`;
    $("#chapter-list").innerHTML = (work.chapters || []).length ? work.chapters.map((chapter) => `<button class="chapter" type="button" data-chapter="${Number(chapter.at) || 0}"><span class="chapter-time">${timecode(chapter.at)}</span><span>${escapeHTML(chapter.title)}</span><span class="chapter-arrow">↗</span></button>`).join("") : `<p class="empty-chapters">提示词时间轴待接入。导入真实视频与时间码后会自动联动。</p>`;
    const image = $("#viewer-image");
    image.style.transform = "";
    image.hidden = !work.poster || !!work.video;
    if (work.poster) { image.src = work.poster; image.alt = `${work.title}画面`; }
    video.hidden = !work.video;
    if (work.video) { video.src = work.video; video.poster = work.poster || ""; video.muted = !soundOn; video.load(); }
    $("#viewer-placeholder").hidden = !!work.poster || !!work.video;
    $("#viewer-range").disabled = !(work.video || work.duration);
    $("#viewer-play").disabled = !(work.video || work.duration);
    $("#viewer-play").setAttribute("aria-label", work.video ? "播放或暂停视频" : "播放或暂停镜头结构预演");
    syncViewer();
    if (!dialog.open) {
      viewerOpener = opener || document.activeElement;
      dialog.showModal();
    }
    syncBackgroundVideo();
    document.body.classList.add("dialog-open");
    $("#viewer-close").focus({ preventScroll: true });
    if (work.video) video.play().catch(() => {});
  }

  function closeViewer() {
    stopDemo();
    const video = $("#viewer-video");
    video.pause();
    if ($("#viewer").open) $("#viewer").close();
  }

  function navigateViewer(direction) {
    if (!activeWork || !viewerList.length) return;
    const index = viewerList.findIndex((item) => item.id === activeWork.id);
    const next = (index + direction + viewerList.length) % viewerList.length;
    openViewer(viewerList[next].id, null, viewerList);
  }

  const characterReferenceCache = new Map();
  let characterReferenceToken = 0;
  let characterReferencePaint = null;
  let characterReferenceResizeObserver = null;
  const characterViewNames = { front: "正面", side: "侧面", back: "背面" };
  function requestCharacterReference(path, priority = "auto") {
    if (!path) return null;
    let image = characterReferenceCache.get(path);
    if (image?.complete && !image.naturalWidth) image = null;
    if (image) characterReferenceCache.delete(path);
    else {
      image = new Image();
      image.decoding = "async";
      image.fetchPriority = priority;
      image.src = path;
    }
    characterReferenceCache.set(path, image);
    while (characterReferenceCache.size > 18) characterReferenceCache.delete(characterReferenceCache.keys().next().value);
    if (priority === "high") image.fetchPriority = "high";
    return image;
  }
  function prefetchCharacterReferences(character, activeView, token) {
    if (navigator.connection?.saveData) return;
    setTimeout(() => {
      if (token !== characterReferenceToken || !$("#panel").open || $("#panel").dataset.view !== "characters") return;
      for (const view of ["front", "side", "back"]) {
        if (view !== activeView) requestCharacterReference(character.views?.[view], "low");
      }
    }, 120);
    setTimeout(() => {
      if (token !== characterReferenceToken || !$("#panel").open || $("#panel").dataset.view !== "characters") return;
      const members = orderedCategoryCharacters(selectedCategory);
      const current = members.findIndex(({ character: member }) => member.id === character.id);
      for (const offset of [-1, 1]) {
        const neighbor = members[(current + offset + members.length) % members.length]?.character;
        if (neighbor?.id !== character.id) requestCharacterReference(neighbor?.views?.front, "low");
      }
    }, 700);
  }
  let characterRailPointer = null;
  let characterRailDragged = false;

  function characterRailCycle(track) {
    const first = $$('.character-card[data-copy="0"]', track).find((card) => card.offsetWidth > 0);
    const second = first ? track.querySelector(`.character-card[data-copy="1"][data-character="${first.dataset.character}"]`) : null;
    return first && second ? second.offsetLeft - first.offsetLeft : 0;
  }

  function normalizeCharacterRail() {
    const rail = $("#character-cards");
    const track = $("#character-track");
    if (!rail || !track || !rail.clientWidth) return;
    const cycle = characterRailCycle(track);
    if (!cycle) return;
    if (rail.scrollLeft < cycle * .5) {
      rail.scrollLeft += cycle;
      if (characterRailPointer) characterRailPointer.scrollLeft += cycle;
    } else if (rail.scrollLeft >= cycle * 1.5) {
      rail.scrollLeft -= cycle;
      if (characterRailPointer) characterRailPointer.scrollLeft -= cycle;
    }
  }

  function revealCharacter(index) {
    const rail = $("#character-cards");
    const track = $("#character-track");
    if (!rail || !track || !rail.clientWidth) return;
    const cycle = characterRailCycle(track);
    if (!cycle) return;
    if (rail.scrollLeft < cycle * .5 || rail.scrollLeft >= cycle * 1.5) rail.scrollLeft = cycle;
    const currentCenter = rail.scrollLeft + rail.clientWidth / 2;
    const candidates = $$(`.character-card[data-character="${index}"]`, track).filter((card) => card.offsetWidth > 0);
    const nearest = candidates.reduce((best, card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      return !best || Math.abs(cardCenter - currentCenter) < Math.abs(best.offsetLeft + best.offsetWidth / 2 - currentCenter) ? card : best;
    }, null);
    if (!nearest) return;
    rail.scrollTo({ left: nearest.offsetLeft + nearest.offsetWidth / 2 - rail.clientWidth / 2, behavior: "smooth" });
  }

  function stepCharacter(direction) {
    const indices = orderedCategoryCharacters(selectedCategory).map(({ index }) => index);
    if (!indices.length) return;
    const current = Math.max(0, indices.indexOf(selectedCharacter));
    setCharacter(indices[(current + direction + indices.length) % indices.length], "front");
  }

  function orderedCategoryCharacters(category) {
    const members = (data.characters || []).map((character, index) => ({ character, index })).filter(({ character }) => (character.category || "fantasy") === category);
    const men = members.filter(({ character }) => character.gender === "male");
    const women = members.filter(({ character }) => character.gender === "female");
    const unspecified = members.filter(({ character }) => !["male", "female"].includes(character.gender));
    if (!men.length || !women.length) return members;
    const larger = men.length >= women.length ? men : women;
    const smaller = larger === men ? women : men;
    const ordered = [];
    const slots = smaller.length + 1;
    const totalLarger = larger.length;
    for (let slot = 0; slot < slots; slot++) {
      const take = Math.floor(totalLarger / slots) + (slot < totalLarger % slots ? 1 : 0);
      ordered.push(...larger.splice(0, take));
      if (slot < smaller.length) ordered.push(smaller[slot]);
    }
    if (category === "modern") {
      // Open the modern collection on Emma's white-shirt portrait while
      // keeping the existing distribution of men and women in the rail.
      const featured = ordered.findIndex(({ character }) => character.id === "modern-06");
      if (featured > 0) ordered.unshift(...ordered.splice(featured, 1));
    }
    return ordered.concat(unspecified);
  }

  function renderCharacterCategories() {
    const host = $("#character-categories");
    host.innerHTML = characterCategories.map(({ key, name, short }) => {
      const count = orderedCategoryCharacters(key).length;
      const active = key === selectedCategory;
      return `<button class="character-category ${active ? "active" : ""}" type="button" role="tab" data-character-category="${key}" aria-selected="${active}" ${count ? "" : "disabled"}><span>${escapeHTML(name)}</span><small>${short} <b>${pad2(count)}</b></small></button>`;
    }).join("");
    $("#panel-characters").dataset.category = selectedCategory;
  }

  function selectCharacterCategory(category) {
    if (!characterCategories.some((item) => item.key === category)) return;
    const members = orderedCategoryCharacters(category);
    if (!members.length) return;
    selectedCategory = category;
    selectedCharacter = members[0].index;
    selectedView = "front";
    renderCharacters();
    $("#character-cards").scrollLeft = characterRailCycle($("#character-track"));
  }

  function renderCharacters() {
    const characters = orderedCategoryCharacters(selectedCategory);
    const cards = $("#character-cards");
    renderCharacterCategories();
    $("#panel-characters > .panel-intro")?.remove();
    // The archive presents the original three-view reference as its sole detail visual.
    $("#panel-characters .character-action-preview")?.remove();
    if (!cards.parentElement.classList.contains("character-carousel")) {
      const carousel = document.createElement("div");
      carousel.className = "character-carousel";
      cards.before(carousel);
      carousel.innerHTML = `<div class="character-rail-head"><div><span>THE CAST / 01 — ${pad2(characters.length)}</span><small>左右拖动探索角色</small></div><div class="character-rail-controls"><button type="button" data-character-step="-1" aria-label="上一位角色">←</button><span id="character-rail-position" aria-live="polite">01 / ${pad2(characters.length)}</span><button type="button" data-character-step="1" aria-label="下一位角色">→</button></div></div>`;
      carousel.append(cards);
    }
    $("#panel-characters .character-rail-head > div > span").textContent = `THE CAST / 01 — ${pad2(characters.length)}`;
    const cardHTML = ({ character, index }, ordinal, copy) => {
      const cardImage = character.cardImage || character.castImage;
      const image = cardImage ? `<img class="character-render" src="${escapeHTML(cardImage)}" alt="" loading="lazy" decoding="async">` : `<img class="character-render" alt="" hidden>`;
      const cloneAttributes = copy === 1 ? "" : ' tabindex="-1" aria-hidden="true"';
      const sourceNumber = Number(character.id?.match(/(\d+)$/)?.[1]) || ordinal + 1;
      return `<button class="character-card ${index === selectedCharacter ? "active" : ""}" type="button" data-character="${index}" data-copy="${copy}" aria-label="查看${escapeHTML(character.name)}角色档案" aria-pressed="${index === selectedCharacter}"${cloneAttributes}><span class="character-halo"></span><span class="character-shadow"></span><span class="character-figure" ${cardImage ? "hidden" : ""}></span>${image}<span class="character-pending" ${cardImage ? "hidden" : ""}>图像读取失败</span><span class="character-number">${pad2(sourceNumber)}</span><span class="character-action-tag">${escapeHTML(character.action || "")}</span><span class="character-name">${escapeHTML(character.name)}</span></button>`;
    };
    cards.innerHTML = `<div class="character-track" id="character-track">${Array.from({ length: 3 }, (_, copy) => characters.map((entry, ordinal) => cardHTML(entry, ordinal, copy)).join("")).join("")}</div>`;
    if (!characters.some(({ index }) => index === selectedCharacter)) selectedCharacter = characters[0]?.index ?? 0;
    setCharacter(selectedCharacter, selectedView);
    window.dispatchEvent(new Event("portfolio:characters-rendered"));
  }

  function setCharacter(index, view) {
    const character = data.characters?.[index];
    if (!character) return;
    const category = character.category || "fantasy";
    if (category !== selectedCategory) {
      selectedCategory = category;
      selectedCharacter = index;
      selectedView = view;
      renderCharacters();
      return;
    }
    const availableView = character.views?.[view] ? view : "front";
    selectedCharacter = index;
    selectedView = availableView;
    $$(".character-card", $("#character-cards")).forEach((card) => {
      const active = Number(card.dataset.character) === index;
      card.classList.toggle("active", active);
      card.setAttribute("aria-pressed", String(active));
    });
    const position = $("#character-rail-position");
    const categoryMembers = orderedCategoryCharacters(selectedCategory);
    if (position) position.textContent = `${pad2(categoryMembers.findIndex((entry) => entry.index === index) + 1)} / ${pad2(categoryMembers.length)}`;
    if ($("#panel").open && $("#panel").dataset.view === "characters") requestAnimationFrame(() => revealCharacter(index));
    $("#character-name").textContent = character.name;
    $$("#view-switch button").forEach((button) => {
      const isAvailable = !!character.views?.[button.dataset.view];
      const isActive = button.dataset.view === availableView;
      button.disabled = !isAvailable;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.title = isAvailable ? `${character.name}·${characterViewNames[button.dataset.view]}原设定` : "原素材未提供此视角";
    });

    if (!$("#panel").open || $("#panel").dataset.view !== "characters") return;
    const referencePath = character.views?.[availableView] || "";
    const sourceImage = $("#character-reference-image");
    const sourceCanvas = $("#character-reference-canvas");
    const sourceNote = $("#character-source-note");
    const crop = character.viewCrop?.[availableView];
    const requestToken = ++characterReferenceToken;
    sourceNote.textContent = availableView === "front" && character.frontReferenceKind
      ? `正面造型 · ${character.frontReferenceKind}`
      : `${characterViewNames[availableView]}原设定${character.views?.side ? " · 原三视图" : " · 当前仅提供正面"}`;
    if (referencePath) {
      sourceImage.hidden = true;
      sourceCanvas.hidden = false;
      sourceCanvas.setAttribute("aria-label", `${character.name}${characterViewNames[availableView]}原设定`);
      const sourceMedia = sourceCanvas.parentElement;
      sourceMedia.classList.add("is-loading");
      sourceMedia.classList.remove("is-error");
      // Keep the previous angle visible until the replacement is decoded.
      // A different person's portrait must be cleared immediately.
      if (!sourceCanvas.dataset.paintedView?.startsWith(`${character.id}:`)) {
        sourceCanvas.getContext("2d")?.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
        delete sourceCanvas.dataset.paintedView;
      }
      if (!characterReferenceResizeObserver && "ResizeObserver" in window) {
        characterReferenceResizeObserver = new ResizeObserver(() => characterReferencePaint?.());
        characterReferenceResizeObserver.observe(sourceMedia);
      }
      const referenceImage = requestCharacterReference(referencePath, "high");
      const paint = () => {
        if (requestToken !== characterReferenceToken || !referenceImage.naturalWidth) return;
        const context = sourceCanvas.getContext("2d");
        if (!context) return;
        // Keep reference art crisp when the browser is zoomed out and the
        // whole portfolio is scaled down to fit a smaller window.
        const pixelRatio = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
        sourceCanvas.width = Math.max(1, Math.round((sourceMedia.clientWidth || 320) * pixelRatio));
        sourceCanvas.height = Math.max(1, Math.round((sourceMedia.clientHeight || 470) * pixelRatio));
        const sourceX = crop ? referenceImage.naturalWidth * crop[0] : 0;
        const sourceY = crop ? referenceImage.naturalHeight * crop[1] : 0;
        const sourceWidth = crop ? referenceImage.naturalWidth * crop[2] : referenceImage.naturalWidth;
        const sourceHeight = crop ? referenceImage.naturalHeight * crop[3] : referenceImage.naturalHeight;
        const preparedAnchor = window.PORTFOLIO_REFERENCE_ANCHORS?.[character.id]?.[availableView];
        const preparedBounds = window.PORTFOLIO_REFERENCE_FRAMING?.[character.id]?.[availableView];
        const subjectAnchor = character.subjectAnchor?.[availableView] ?? preparedAnchor;
        const bodyCenter = Math.max(.1, Math.min(.9, Number.isFinite(subjectAnchor) ? subjectAnchor : .5));
        const bounds = Array.isArray(preparedBounds) && preparedBounds.length === 4 ? preparedBounds : [0, 0, 1, 1];
        const [left, top, right, bottom] = bounds;
        const figureHeight = Math.max(.01, bottom - top) * sourceHeight;
        const horizontalReach = Math.max(bodyCenter - left, right - bodyCenter, .01) * sourceWidth;
        // Center the person, not an asymmetrical weapon. A long weapon may
        // need a taller overall frame so the human body keeps the same scale.
        const visibleHeight = Math.max(.75, Math.min(.96, character.referenceFrame?.visibleHeight ?? .87));
        const frameCenterY = Math.max(.48, Math.min(.52, character.referenceFrame?.centerY ?? .52));
        const targetScale = sourceCanvas.height * visibleHeight / figureHeight;
        const safeHorizontalScale = sourceCanvas.width * .46 / horizontalReach;
        const scale = Math.min(targetScale, safeHorizontalScale);
        const drawWidth = sourceWidth * scale;
        const drawHeight = sourceHeight * scale;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
        context.drawImage(referenceImage, sourceX, sourceY, sourceWidth, sourceHeight, sourceCanvas.width / 2 - bodyCenter * drawWidth, sourceCanvas.height * frameCenterY - (top + bottom) / 2 * drawHeight, drawWidth, drawHeight);
        sourceCanvas.dataset.paintedView = `${character.id}:${availableView}`;
        sourceMedia.classList.remove("is-loading", "is-error");
      };
      characterReferencePaint = paint;
      const showReference = () => {
        if (requestToken !== characterReferenceToken) return;
        const ready = referenceImage.decode?.();
        Promise.resolve(ready).catch(() => {}).then(() => {
          if (requestToken !== characterReferenceToken) return;
          paint();
          prefetchCharacterReferences(character, availableView, requestToken);
        });
      };
      const showReferenceError = () => {
        if (requestToken !== characterReferenceToken) return;
        sourceMedia.classList.remove("is-loading");
        sourceMedia.classList.add("is-error");
      };
      if (referenceImage.complete) {
        if (referenceImage.naturalWidth) showReference();
        else showReferenceError();
      } else {
        referenceImage.addEventListener("load", showReference, { once: true });
        referenceImage.addEventListener("error", showReferenceError, { once: true });
      }
    } else {
      characterReferencePaint = null;
      sourceCanvas.hidden = true;
      delete sourceCanvas.dataset.paintedView;
      sourceCanvas.parentElement.classList.remove("is-loading", "is-error");
      sourceImage.hidden = !referencePath;
      sourceImage.src = referencePath;
      sourceImage.alt = `${character.name}${characterViewNames[availableView]}原设定图`;
    }

    const weapon = $("#character-weapon");
    weapon.hidden = !character.weaponReference;
    weapon.open = false;
    $("#character-weapon-image").src = character.weaponReference || "";
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("visible")); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
    }, { threshold: .08 });
    $$(".reveal").forEach((element) => observer.observe(element));
  }

  function initEvents() {
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const shotScroll = target.closest("[data-shot-scroll]");
      if (shotScroll) {
        const track = $(".shot-carousel-track");
        if (track) track.scrollBy({ left: Number(shotScroll.dataset.shotScroll) * Math.round(track.clientWidth * .72), behavior: "smooth" });
        return;
      }
      const evidence = target.closest("[data-evidence-project][data-evidence-index]");
      if (evidence) {
        openEvidenceViewer(evidence.dataset.evidenceProject, Number(evidence.dataset.evidenceIndex), evidence);
        return;
      }
      const open = target.closest("[data-open]");
      if (open) {
        event.preventDefault();
        if (open.closest(".shot-carousel") && Date.now() < suppressShotClickUntil) return;
        const fromArchive = !!open.closest("#works-grid");
        const work = data.works.find((item) => item.id === open.dataset.open);
        if (work?.type === "film" || work?.type === "shot") openArchiveVideo(work.id, open);
        else openViewer(open.dataset.open, open, fromArchive ? galleryList : null);
        return;
      }
      const filmCategory = target.closest("[data-film-category]");
      if (filmCategory) {
        selectedFilmCategory = filmCategory.dataset.filmCategory;
        closeInlineFilm();
        renderWorks();
        $("#panel").querySelector(".panel-body").scrollTop = 0;
        return;
      }
      if (target.closest("[data-film-category-back]")) {
        selectedFilmCategory = null;
        closeInlineFilm();
        renderWorks();
        return;
      }
      const inlineStep = target.closest("[data-inline-step]");
      if (inlineStep && inlineWorkId) {
        const index = galleryList.findIndex((item) => item.id === inlineWorkId);
        const nextIndex = (index + Number(inlineStep.dataset.inlineStep) + galleryList.length) % galleryList.length;
        if (galleryList[nextIndex]) openArchiveVideo(galleryList[nextIndex].id, inlineStep);
        return;
      }
      const castSpot = target.closest(".cast-spot[data-character]");
      if (castSpot) {
        event.preventDefault();
        const index = Number(castSpot.dataset.character);
        openPanel("characters", castSpot, null, index);
        return;
      }
      const panelTrigger = target.closest("[data-panel]");
      if (panelTrigger) {
        event.preventDefault();
        openPanel(panelTrigger.dataset.panel, panelTrigger, panelTrigger.dataset.filterTarget);
        const projectKey = panelTrigger.dataset.filmCategoryTarget;
        if (panelTrigger.dataset.panel === "works" && filmCategories.some((item) => item.key === projectKey)) {
          selectedFilmCategory = projectKey;
          renderWorks();
          $("#panel").querySelector(".panel-body").scrollTop = 0;
        }
        return;
      }
      const filter = event.target.closest("[data-filter]");
      if (filter) { setFilter(filter.dataset.filter); return; }
      const chapter = event.target.closest("[data-chapter]");
      if (chapter) { setViewerTime(Number(chapter.dataset.chapter)); return; }
      const characterStep = event.target.closest("[data-character-step]");
      if (characterStep) { stepCharacter(Number(characterStep.dataset.characterStep)); return; }
      const category = event.target.closest("[data-character-category]");
      if (category) { selectCharacterCategory(category.dataset.characterCategory); return; }
      const character = event.target.closest("[data-character]");
      if (character) { setCharacter(Number(character.dataset.character), selectedView); return; }
      const view = event.target.closest("[data-view]");
      if (view) { setCharacter(selectedCharacter, view.dataset.view); return; }
    });
    $("#panel-close").addEventListener("click", closePanel);
    $("#panel").addEventListener("close", () => {
      closeInlineFilm();
      syncDialogState();
      syncBackgroundVideo();
      if (!$("#viewer").open) restoreFocus(panelOpener);
      panelOpener = null;
    });
    $("#panel").addEventListener("click", (event) => { if (event.target === $("#panel")) closePanel(); });
    $("#viewer-close").addEventListener("click", closeViewer);
    $("#viewer").addEventListener("close", () => {
      stopDemo();
      const video = $("#viewer-video");
      video.pause();
      activeWork = null;
      pendingSeek = null;
      video.removeAttribute("src");
      video.load();
      viewerList = [];
      syncDialogState();
      syncBackgroundVideo();
      restoreFocus(viewerOpener);
      viewerOpener = null;
    });
    document.addEventListener("visibilitychange", () => {
      syncBackgroundVideo();
    });
    $("#viewer").addEventListener("click", (event) => { if (event.target === $("#viewer")) closeViewer(); });
    $("#viewer-prev").addEventListener("click", () => navigateViewer(-1));
    $("#viewer-next").addEventListener("click", () => navigateViewer(1));
    $("#viewer-play").addEventListener("click", toggleViewerPlay);
    $("#viewer-range").addEventListener("input", (event) => setViewerTime((Number(event.target.value) / 1000) * currentDuration()));
    $("#viewer-video").addEventListener("timeupdate", syncViewer);
    $("#viewer-video").setAttribute("controlsList", "nodownload noremoteplayback");
    $("#viewer-video").disablePictureInPicture = true;
    $("#viewer-video").disableRemotePlayback = true;
    $("#viewer-video").addEventListener("contextmenu", (event) => event.preventDefault());
    $("#viewer-video").addEventListener("loadedmetadata", () => {
      const loadedVideo = $("#viewer-video");
      if (activeWork?.type === "prompt") {
        $("#viewer").dataset.mediaOrientation = loadedVideo.videoWidth > loadedVideo.videoHeight ? "landscape" : "portrait";
      }
      if (pendingSeek !== null) {
        const seconds = pendingSeek;
        pendingSeek = null;
        setViewerTime(seconds);
      } else syncViewer();
    });
    $("#viewer-video").addEventListener("durationchange", syncViewer);
    $("#viewer-video").addEventListener("play", () => $("#viewer-play").textContent = "Ⅱ");
    $("#viewer-video").addEventListener("pause", () => $("#viewer-play").textContent = "▶");
    $("#viewer-video").addEventListener("error", () => {
      if (!activeWork?.video) return;
      const expectedURL = new URL(activeWork.video, document.baseURI).href;
      if ($("#viewer-video").src !== expectedURL) return;
      videoFailed = true;
      $("#viewer-video").hidden = true;
      $("#viewer-image").hidden = !activeWork.poster;
      $("#viewer-placeholder").hidden = !!activeWork.poster;
      $("#viewer-demo-badge").hidden = false;
      $("#viewer-demo-badge").textContent = "视频未能读取 / 封面预览";
      $("#viewer-range").disabled = true;
      $("#viewer-play").disabled = true;
      showToast("视频暂时无法播放，请稍后重试。");
    });
    $("#sound-toggle").addEventListener("click", () => {
      soundOn = !soundOn;
      $("#viewer-video").muted = !soundOn;
      if (inlineFilmVideo) inlineFilmVideo.muted = !soundOn;
      $("#sound-toggle").setAttribute("aria-pressed", String(soundOn));
      $("#sound-toggle").setAttribute("aria-label", soundOn ? "关闭作品声音" : "开启作品声音");
      $("#sound-label").textContent = soundOn ? "SOUND ON" : "SOUND OFF";
      const icon = $(".sound-ring");
      if (icon) icon.textContent = soundOn ? "◖" : "◖̸";
    });
    const characterRail = $("#character-cards");
    characterRail.addEventListener("scroll", normalizeCharacterRail, { passive: true });
    characterRail.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      characterRailPointer = { id: event.pointerId, x: event.clientX, scrollLeft: characterRail.scrollLeft };
      characterRailDragged = false;
    });
    characterRail.addEventListener("pointermove", (event) => {
      if (!characterRailPointer || characterRailPointer.id !== event.pointerId) return;
      const movement = event.clientX - characterRailPointer.x;
      const visualScale = characterRail.offsetWidth
        ? characterRail.getBoundingClientRect().width / characterRail.offsetWidth
        : 1;
      const localMovement = movement / (visualScale || 1);
      if (Math.abs(localMovement) > 5 && !characterRailDragged) {
        characterRailDragged = true;
        characterRail.setPointerCapture(event.pointerId);
      }
      if (characterRailDragged) {
        event.preventDefault();
        characterRail.classList.add("is-dragging");
        characterRail.scrollLeft = characterRailPointer.scrollLeft - localMovement;
      }
    });
    const releaseCharacterRail = () => {
      characterRailPointer = null;
      characterRail.classList.remove("is-dragging");
      setTimeout(() => { characterRailDragged = false; }, 0);
    };
    characterRail.addEventListener("pointerup", releaseCharacterRail);
    characterRail.addEventListener("pointercancel", releaseCharacterRail);
    characterRail.addEventListener("click", (event) => {
      if (!characterRailDragged) return;
      event.preventDefault();
      event.stopPropagation();
      characterRailDragged = false;
    }, true);
    characterRail.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        stepCharacter(event.key === "ArrowRight" ? 1 : -1);
      }
    });
    $("#character-cards").addEventListener("error", (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || !image.classList.contains("character-render")) return;
      const card = image.closest(".character-card");
      image.hidden = true;
      card.querySelector(".character-figure").hidden = false;
      card.querySelector(".character-pending").hidden = false;
    }, true);
    document.addEventListener("keydown", (event) => { if (!$("#viewer").open || event.target.closest("input,video,[contenteditable]")) return; if (event.key === "ArrowRight") { event.preventDefault(); navigateViewer(1); } if (event.key === "ArrowLeft") { event.preventDefault(); navigateViewer(-1); } });
    window.addEventListener("pointermove", (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      const x = (event.clientX / window.innerWidth - .5) * 12;
      const y = (event.clientY / window.innerHeight - .5) * 8;
      const screen = $("#screen");
      screen.style.setProperty("--hero-pan-x", `${(-x * .28).toFixed(2)}px`);
      screen.style.setProperty("--hero-pan-y", `${(-y * .22).toFixed(2)}px`);
    }, { passive: true });
  }

  function init() {
    fitStage();
    selectedCharacter = orderedCategoryCharacters(selectedCategory)[0]?.index ?? 0;
    $("#director-name").textContent = data.directorName || "钟冲锋";
    renderStatistics();
    renderHero();
    renderFilters();
    renderWorks();
    renderCharacters();
    renderHomeCast();
    initReveal();
    initEvents();
    window.addEventListener("resize", fitStage, { passive: true });
    window.visualViewport?.addEventListener("resize", fitStage, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
