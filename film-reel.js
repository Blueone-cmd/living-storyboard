/*
 * Native, offline curved film reel for the one-screen portfolio.
 * Usage (after content.js and this file have loaded):
 *   const reel = initFilmReel(
 *     document.querySelector('#reel-track'),
 *     PORTFOLIO_CONTENT.works.filter(work => work.type === 'shot'),
 *     (work, button) => openTheMatchingArchiveShot(work, button)
 *   );
 * Clicking a clip selects the matching archive shot. Returns { destroy(), pause(), resume(),
 * refresh(nextWorks) }.
 *
 * User-supplied shot clips play muted and loop in the moving reel. The selected
 * item opens the matching real video from the archive, with no second reel dialog.
 * Continuous scroll is measured in pixels and wrapped modulo the exact clip
 * count and frame pitch. Recycled cells cover both edges without a reset.
 */
(function () {
  'use strict';

  const LOCAL_DEMO_POSTERS = [
    'assets/concept-dragon-city.webp',
    'assets/concept-sky-leviathan.webp',
    'assets/concept-island-survivors.webp'
  ];
  // The film cells are cropped thumbnail windows; the dialog preserves 9:16.
  const FRAME_POSITIONS = ['50% 38%', '50% 45%', '50% 54%', '46% 44%', '54% 49%'];
  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const mod = (value, period) => ((value % period) + period) % period;

  function attachLocalClips(sourceWorks) {
    const archiveWorks = Array.isArray(sourceWorks) ? sourceWorks.filter(work => work?.type === 'shot' && work.video) : [];
    return archiveWorks.map((work, index) => ({
      ...work,
      reelClip: work.reelPreview || work.video,
      reelPoster: work.poster,
      reelClipTitle: work.title,
      reelPosition: FRAME_POSITIONS[index % FRAME_POSITIONS.length]
    }));
  }

  function initFilmReel(reelElement, initialWorks, openViewer) {
    if (!(reelElement instanceof HTMLElement)) {
      throw new TypeError('initFilmReel requires a reel HTMLElement.');
    }

    let works = attachLocalClips(initialWorks);
    let viewport = reelElement.parentElement || reelElement;
    let cells = [];
    let viewportWidth = 1;
    let viewportHeight = 1;
    let frameWidth = 100;
    let frameHeight = 60;
    let pitch = 104;
    let waveAmplitude = 15;
    let offset = 0;
    let renderedWhole = null;
    let lastFrame = 0;
    let raf = 0;
    let destroyed = false;
    let manuallyPaused = false;
    let hovered = false;
    let focused = false;
    let reducedMotion = false;
    let pointer = null;
    let flingSpeed = 0;
    let suppressClickUntil = 0;
    let lastVideoSync = 0;
    let clipDialog = null;
    let clipDialogVideo = null;
    let clipOpener = null;
    let currentClipIndex = 0;
    const cruiseSpeed = 34; // px per second, moving toward the left.
    const events = new AbortController();
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    reducedMotion = !!motionQuery?.matches;
    (reelElement.parentElement || reelElement).setAttribute('aria-label', `${works.length} 条精彩片段在胶片带中自动循环播放`);

    // Override the previous max-content flex marquee without depending on its CSS.
    Object.assign(reelElement.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block',
      padding: '0',
      animation: 'none',
      transform: 'none',
      touchAction: 'pan-y'
    });

    // A continuous dark carrier bridges the small gaps between moving frames.
    // The cells and their sprocket holes move; this follows the same wave.
    const svgNS = 'http://www.w3.org/2000/svg';
    const carrier = document.createElementNS(svgNS, 'svg');
    carrier.setAttribute('aria-hidden', 'true');
    Object.assign(carrier.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      overflow: 'visible', pointerEvents: 'none', zIndex: '1'
    });
    const carrierBand = document.createElementNS(svgNS, 'path');
    carrierBand.setAttribute('fill', 'none');
    carrierBand.setAttribute('stroke', '#070d11');
    carrierBand.setAttribute('stroke-linejoin', 'round');
    const carrierTop = document.createElementNS(svgNS, 'path');
    const carrierBottom = document.createElementNS(svgNS, 'path');
    for (const edge of [carrierTop, carrierBottom]) {
      edge.setAttribute('fill', 'none');
      edge.setAttribute('stroke', '#b8c6c2');
      edge.setAttribute('stroke-width', '2');
      edge.setAttribute('stroke-dasharray', '8 13');
      edge.setAttribute('opacity', '.55');
    }
    carrier.append(carrierBand, carrierTop, carrierBottom);
    reelElement.prepend(carrier);

    function drawCarrier() {
      carrier.setAttribute('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`);
      carrierBand.setAttribute('stroke-width', String(frameHeight + 17));
      const center = (viewportHeight - frameHeight) / 2 + frameHeight / 2;
      const strokeEdge = frameHeight / 2 + 6;
      const bands = [[], [], []];
      for (let x = -40; x <= viewportWidth + 40; x += 22) {
        const phase = (x / viewportWidth) * Math.PI * 2 * 1.25 + .2;
        const y = center - waveAmplitude * Math.sin(phase);
        bands[0].push(`${bands[0].length ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`);
        bands[1].push(`${bands[1].length ? 'L' : 'M'}${x.toFixed(1)} ${(y - strokeEdge).toFixed(1)}`);
        bands[2].push(`${bands[2].length ? 'L' : 'M'}${x.toFixed(1)} ${(y + strokeEdge).toFixed(1)}`);
      }
      carrierBand.setAttribute('d', bands[0].join(' '));
      carrierTop.setAttribute('d', bands[1].join(' '));
      carrierBottom.setAttribute('d', bands[2].join(' '));
    }

    function stopPreview(cell) {
      const video = cell?.querySelector('video');
      if (!video) return;
      if (!video.paused) video.pause();
    }

    function startPreview(cell) {
      const video = cell?.querySelector('video');
      if (!video || !video.paused || video.dataset.playPending === 'true' || cell.dataset.videoFailed === 'true') return;
      video.muted = true;
      video.dataset.playPending = 'true';
      const result = video.play();
      if (result?.then) result.then(() => {
        delete video.dataset.playPending;
        if (cell.dataset.reelVisible === 'true' && !document.hidden && !document.querySelector('dialog[open]')) {
          video.style.opacity = '1';
        } else stopPreview(cell);
      }).catch(() => {
        delete video.dataset.playPending;
        cell.dataset.videoFailed = 'true';
        video.style.opacity = '0';
      });
      else {
        delete video.dataset.playPending;
        video.style.opacity = '1';
      }
    }

    function syncVisiblePreviews() {
      const canPlay = !document.hidden && !document.querySelector('dialog[open]');
      for (const cell of cells) {
        if (canPlay && cell.dataset.reelVisible === 'true') startPreview(cell);
        else stopPreview(cell);
      }
    }

    function fitClipDialog() {
      if (!clipDialog) return;
      const scale = Math.max(.01, Math.min(window.innerWidth * .94 / 590, window.innerHeight * .94 / 900));
      clipDialog.style.setProperty('--reel-dialog-scale', String(scale));
    }

    function ensureClipDialog() {
      if (clipDialog) return;
      clipDialog = document.createElement('dialog');
      clipDialog.className = 'reel-clip-dialog';
      clipDialog.setAttribute('aria-label', '精彩片段观影窗口');
      clipDialog.innerHTML = `
        <div class="reel-clip-shell">
          <header class="reel-clip-header">
            <div class="reel-clip-brand"><span class="reel-clip-mark">LS<span>·</span></span><span>DIRECTOR'S CUT<br>PUBLIC EDITION</span></div>
            <div class="reel-clip-heading"><small>SELECTED SCENE</small><strong class="reel-clip-title">精彩片段</strong></div>
            <button type="button" class="reel-clip-close" aria-label="关闭片段">×</button>
          </header>
          <div class="reel-clip-player"><video controls playsinline loop preload="metadata"></video></div>
          <footer class="reel-clip-footer">
            <button type="button" class="reel-clip-prev" aria-label="上一条片段">← <span>PREV</span></button>
            <span class="reel-clip-count">01 / 11</span>
            <button type="button" class="reel-clip-next" aria-label="下一条片段"><span>NEXT</span> →</button>
          </footer>
        </div>`;
      document.body.append(clipDialog);
      fitClipDialog();
      window.addEventListener('resize', fitClipDialog, { signal: events.signal, passive: true });
      clipDialogVideo = clipDialog.querySelector('video');
      clipDialog.querySelector('.reel-clip-close').addEventListener('click', () => clipDialog.close(), { signal: events.signal });
      clipDialog.querySelector('.reel-clip-prev').addEventListener('click', () => showClipAt(currentClipIndex - 1), { signal: events.signal });
      clipDialog.querySelector('.reel-clip-next').addEventListener('click', () => showClipAt(currentClipIndex + 1), { signal: events.signal });
      clipDialog.addEventListener('click', event => {
        if (event.target === clipDialog) clipDialog.close();
      }, { signal: events.signal });
      clipDialog.addEventListener('close', () => {
        clipDialogVideo.pause();
        clipDialogVideo.removeAttribute('src');
        clipDialogVideo.load();
        syncVisiblePreviews();
        clipOpener?.focus?.({ preventScroll: true });
        clipOpener = null;
      }, { signal: events.signal });
    }

    function showClipAt(index, opener) {
      if (!works.length) return;
      ensureClipDialog();
      currentClipIndex = mod(index, works.length);
      const work = works[currentClipIndex];
      if (!work?.reelFullVideo) return;
      if (opener) clipOpener = opener;
      clipDialogVideo.pause();
      clipDialogVideo.src = work.reelFullVideo;
      clipDialogVideo.poster = work.reelPoster || '';
      clipDialogVideo.muted = true;
      clipDialogVideo.loop = true;
      clipDialogVideo.load();
      clipDialog.querySelector('.reel-clip-title').textContent = work.reelClipTitle;
      clipDialog.querySelector('.reel-clip-count').textContent = `${String(currentClipIndex + 1).padStart(2, '0')} / ${String(works.length).padStart(2, '0')}`;
      fitClipDialog();
      if (!clipDialog.open) clipDialog.showModal();
      syncVisiblePreviews();
      clipDialogVideo.play().catch(() => {});
    }

    function makeMedia(cell, workIndex) {
      const work = works[workIndex];
      if (!work) return;
      stopPreview(cell);
      cell.replaceChildren();
      cell.dataset.open = String(work.id || '');
      delete cell.dataset.reelClipIndex;
      cell.dataset.reelWorkIndex = String(workIndex);
      delete cell.dataset.videoFailed;
      cell.setAttribute('aria-label', `${work.reelClipTitle || `精彩片段 ${workIndex + 1}`}，点击前往精彩镜头播放`);

      const poster = work.reelPoster || work.poster || LOCAL_DEMO_POSTERS[workIndex % LOCAL_DEMO_POSTERS.length];
      const visual = document.createElement('div');
      visual.className = 'reel-visual';
      Object.assign(visual.style, {
        position: 'relative', display: 'block', width: '100%', height: '100%',
        overflow: 'hidden', background: '#111d23', pointerEvents: 'none'
      });

      const frame = document.createElement('img');
      frame.className = 'reel-frame-image';
      frame.alt = '';
      frame.loading = 'lazy';
      frame.src = poster;
      Object.assign(frame.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: work.reelPosition || FRAME_POSITIONS[workIndex % FRAME_POSITIONS.length],
        pointerEvents: 'none'
      });
      visual.append(frame);

      if (work.reelClip) {
        const video = document.createElement('video');
        video.className = 'reel-live-video';
        video.src = work.reelClip;
        video.poster = poster;
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = 'metadata';
        video.controls = false;
        video.disablePictureInPicture = true;
        video.tabIndex = -1;
        video.setAttribute('aria-hidden', 'true');
        Object.assign(video.style, {
          position: 'absolute', inset: '0', width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: work.reelPosition || '50% 50%',
          opacity: '0', pointerEvents: 'none'
        });
        video.addEventListener('error', () => {
          cell.dataset.videoFailed = 'true';
          video.style.opacity = '0';
          video.pause();
        });
        video.addEventListener('loadeddata', () => {
          if (!video.paused) video.style.opacity = '1';
        });
        visual.append(video);
      }

      const index = document.createElement('span');
      index.className = 'reel-index';
      index.textContent = String(workIndex + 1).padStart(2, '0');

      const badge = document.createElement('small');
      badge.className = 'reel-demo';
      badge.textContent = work.reelClip ? 'CLIP' : (work.poster ? (work.concept ? 'CONCEPT' : '') : 'PENDING');
      if (!badge.textContent) badge.hidden = true;

      cell.append(visual, index, badge);
    }

    function makeCell() {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'reel-item';
      cell.style.position = 'absolute';
      cell.style.left = '0';
      cell.style.top = '0';
      cell.style.display = 'block';
      cell.style.margin = '0';
      cell.style.padding = '8px 3px';
      cell.style.transformOrigin = '50% 50%';
      cell.style.willChange = 'transform';
      cell.style.backfaceVisibility = 'hidden';
      cell.tabIndex = -1;
      return cell;
    }

    function measure() {
      if (destroyed) return;
      // The whole cinema canvas scales as one unit. Client dimensions retain
      // its design coordinates; getBoundingClientRect would include that scale.
      const localWidth = viewport.clientWidth;
      const localHeight = viewport.clientHeight;
      if (!localWidth || !localHeight || !works.length) return;
      const oldPitch = pitch;
      viewportWidth = localWidth;
      viewportHeight = localHeight;
      // Larger picture windows make the moving film legible at the fixed
      // cinema scale while still keeping a continuous run of many frames.
      frameWidth = clamp(viewportWidth / 10.45, 166, 184);
      const gap = clamp(viewportWidth * .0038, 5, 8);
      pitch = frameWidth + gap;
      waveAmplitude = clamp(viewportHeight * .16, 26, 34);
      frameHeight = clamp(viewportHeight * .68, 120, 145);
      offset = mod((offset / oldPitch) * pitch, works.length * pitch);
      drawCarrier();

      // One item beyond each end remains offscreen while virtual cells recycle.
      const needed = Math.ceil((viewportWidth + frameWidth) / pitch) + 5;
      while (cells.length < needed) {
        const cell = makeCell();
        cells.push(cell);
        reelElement.append(cell);
      }
      while (cells.length > needed) {
        const cell = cells.pop();
        stopPreview(cell);
        cell.remove();
      }
      for (const cell of cells) {
        cell.style.width = `${frameWidth}px`;
        cell.style.height = `${frameHeight}px`;
      }
      render();
    }

    function render() {
      if (!works.length || !cells.length) return;
      const whole = Math.floor(offset / pitch);
      const fraction = offset - whole * pitch;

      // Keep a video's DOM node attached to the frame while it crosses the
      // viewport. A frame boundary used to remap every slot and restart every
      // visible clip after only pitch / cruiseSpeed seconds. Rotate the pool
      // instead: only cells that have already left an edge get new media.
      if (renderedWhole !== null && renderedWhole !== whole) {
        let steps = whole - renderedWhole;
        if (steps > works.length / 2) steps -= works.length;
        if (steps < -works.length / 2) steps += works.length;
        if (Math.abs(steps) >= cells.length) {
          cells.forEach(cell => delete cell.dataset.reelWorkIndex);
        } else if (steps > 0) {
          for (let step = 0; step < steps; step++) cells.push(cells.shift());
        } else {
          for (let step = 0; step > steps; step--) cells.unshift(cells.pop());
        }
      }
      renderedWhole = whole;
      const seenAccessible = new Set();
      const baseY = (viewportHeight - frameHeight) / 2;

      for (let slot = 0; slot < cells.length; slot++) {
        const cell = cells[slot];
        const workIndex = mod(whole + slot - 1, works.length);
        if (cell.dataset.reelWorkIndex !== String(workIndex)) makeMedia(cell, workIndex);

        const x = (slot - 1) * pitch - fraction;
        const centerX = x + frameWidth / 2;
        const unit = clamp((centerX - viewportWidth / 2) / (viewportWidth / 2), -1, 1);
        // A shallow, continuous wave reads as one running film strip. Its
        // shape is tied to screen position; modulo recycling has no jump.
        const phase = (centerX / viewportWidth) * Math.PI * 2 * 1.25 + .2;
        const y = baseY - waveAmplitude * Math.sin(phase);
        const tangent = Math.atan(-waveAmplitude * Math.cos(phase) * Math.PI * 2 * 1.25 / viewportWidth) * 180 / Math.PI;
        const depth = 1 - .035 * Math.abs(unit);
        const yaw = -unit * 6;
        cell.style.transform = `translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0) rotate(${tangent.toFixed(3)}deg) rotateY(${yaw.toFixed(3)}deg) scale(${depth.toFixed(4)})`;
        cell.style.zIndex = String(Math.round(30 - Math.abs(unit) * 10));

        const visible = x < viewportWidth && x + frameWidth > 0;
        cell.dataset.reelVisible = visible ? 'true' : 'false';
        const accessible = visible && !seenAccessible.has(workIndex);
        if (accessible) seenAccessible.add(workIndex);
        if (cell.tabIndex !== (accessible ? 0 : -1)) cell.tabIndex = accessible ? 0 : -1;
        const ariaHidden = accessible ? 'false' : 'true';
        if (cell.getAttribute('aria-hidden') !== ariaHidden) cell.setAttribute('aria-hidden', ariaHidden);
      }
      syncVisiblePreviews();
    }

    function tick(now) {
      raf = 0;
      if (destroyed || document.hidden) return;
      const delta = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : 0;
      lastFrame = now;
      const dialogOpen = !!document.querySelector('dialog[open]');
      const paused = reducedMotion || manuallyPaused || hovered || focused || !!pointer || dialogOpen;
      if (!paused && delta && works.length) {
        offset = mod(offset + (cruiseSpeed + flingSpeed) * delta, works.length * pitch);
        flingSpeed *= Math.exp(-delta * 4.4);
        if (Math.abs(flingSpeed) < 1) flingSpeed = 0;
        render();
      }
      if (now - lastVideoSync > 300) {
        syncVisiblePreviews();
        lastVideoSync = now;
      }
      raf = requestAnimationFrame(tick);
    }

    function wake() {
      if (destroyed || document.hidden || raf) return;
      lastFrame = 0;
      raf = requestAnimationFrame(tick);
    }

    function onPointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const target = event.target.closest?.('.reel-item') || reelElement;
      pointer = {
        id: event.pointerId,
        startX: event.clientX,
        lastX: event.clientX,
        lastTime: performance.now(),
        moved: false,
        target
      };
      flingSpeed = 0;
      try { target.setPointerCapture(event.pointerId); } catch (_) { /* Capture is optional. */ }
    }

    function onPointerMove(event) {
      if (!pointer || pointer.id !== event.pointerId || !works.length) return;
      const stageScale = Number.parseFloat(reelElement.closest('.screen')?.style.getPropertyValue('--stage-scale')) || 1;
      const movedBy = (event.clientX - pointer.lastX) / stageScale;
      const now = performance.now();
      const elapsed = Math.max((now - pointer.lastTime) / 1000, .008);
      if (Math.abs(event.clientX - pointer.startX) > 5) pointer.moved = true;
      if (pointer.moved) {
        event.preventDefault();
        offset = mod(offset - movedBy, works.length * pitch);
        flingSpeed = clamp(-movedBy / elapsed, -900, 900) * .32;
        render();
      }
      pointer.lastX = event.clientX;
      pointer.lastTime = now;
    }

    function onPointerEnd(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (pointer.moved) suppressClickUntil = performance.now() + 250;
      try { pointer.target.releasePointerCapture(event.pointerId); } catch (_) { /* Safe after cancel. */ }
      pointer = null;
    }

    function onClickCapture(event) {
      if (performance.now() < suppressClickUntil) {
        suppressClickUntil = 0;
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const cell = event.target.closest?.('.reel-item');
      if (!cell) return;
      if (typeof openViewer !== 'function') return;
      const work = works.find(item => String(item.id) === cell.dataset.open);
      if (!work) return;
      event.preventDefault();
      event.stopPropagation();
      openViewer(work, cell);
    }

    function onKeyDown(event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      offset = mod(offset + (event.key === 'ArrowRight' ? pitch : -pitch), works.length * pitch);
      flingSpeed = 0;
      render();
    }

    reelElement.addEventListener('pointerdown', onPointerDown, { signal: events.signal });
    reelElement.addEventListener('pointermove', onPointerMove, { signal: events.signal });
    reelElement.addEventListener('pointerup', onPointerEnd, { signal: events.signal });
    reelElement.addEventListener('pointercancel', onPointerEnd, { signal: events.signal });
    reelElement.addEventListener('pointerenter', () => { hovered = true; }, { signal: events.signal });
    reelElement.addEventListener('pointerleave', () => { hovered = false; }, { signal: events.signal });
    reelElement.addEventListener('focusin', event => {
      focused = true;
    }, { signal: events.signal });
    reelElement.addEventListener('focusout', event => {
      focused = reelElement.contains(event.relatedTarget);
    }, { signal: events.signal });
    reelElement.addEventListener('keydown', onKeyDown, { signal: events.signal });
    reelElement.addEventListener('click', onClickCapture, { signal: events.signal, capture: true });
    document.addEventListener('visibilitychange', () => {
      syncVisiblePreviews();
      wake();
    }, { signal: events.signal });
    motionQuery?.addEventListener?.('change', event => { reducedMotion = event.matches; }, { signal: events.signal });

    let resizeObserver = null;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(viewport);
    } else {
      window.addEventListener('resize', measure, { signal: events.signal });
    }
    measure();
    wake();

    return {
      pause() { manuallyPaused = true; },
      resume() { manuallyPaused = false; wake(); },
      refresh(nextWorks) {
        if (Array.isArray(nextWorks)) works = attachLocalClips(nextWorks);
        cells.forEach(cell => { stopPreview(cell); delete cell.dataset.reelWorkIndex; });
        renderedWhole = null;
        if (!works.length) {
          if (clipDialog?.open) clipDialog.close();
          cells.forEach(cell => cell.remove());
          cells = [];
          return;
        }
        offset = mod(offset, works.length * pitch);
        measure();
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        clipDialogVideo?.pause();
        clipDialogVideo?.removeAttribute('src');
        clipDialogVideo?.load();
        if (clipDialog?.open) clipDialog.close();
        events.abort();
        resizeObserver?.disconnect();
        cancelAnimationFrame(raf);
        cells.forEach(cell => { stopPreview(cell); cell.remove(); });
        cells = [];
        carrier.remove();
        clipDialog?.remove();
      }
    };
  }

  window.initFilmReel = initFilmReel;
})();
