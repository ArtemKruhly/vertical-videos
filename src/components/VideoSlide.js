window.VF = window.VF || {};

const VF_DOUBLE_TAP_MS = 280;

VF.createVideoSlide = function (reel, index) {
  const el = document.createElement('div');
  el.className = 'slide';
  el.dataset.index = index;

  el.innerHTML = `
    <video src="${reel.src}" loop playsinline preload="metadata"></video>
    <div class="buffering-spinner"></div>
    <div class="fallback" style="display:none">${reel.emoji}</div>
    <div class="scrim"></div>

    <div class="play-indicator">
      <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
    </div>

    <div class="heart-burst">
      <svg viewBox="0 0 24 24" fill="#ff3b6b"><path d="M12 21s-6.716-4.35-9.5-8.05C.6 10.4 1.1 6.9 4 5.2c2.2-1.3 4.9-.6 6.4 1.3l1.6 2 1.6-2c1.5-1.9 4.2-2.6 6.4-1.3 2.9 1.7 3.4 5.2 1.5 7.75C18.716 16.65 12 21 12 21z"/></svg>
    </div>

    <div class="meta">
      <div class="title">${reel.user}</div>
      <div class="caption">${reel.caption}</div>
      <div class="track">${reel.track}</div>
    </div>
  `;

  const video = el.querySelector('video');
  const fallback = el.querySelector('.fallback');
  const playIndicator = el.querySelector('.play-indicator');
  const heart = el.querySelector('.heart-burst');
  const spinner = el.querySelector('.buffering-spinner');

  video.addEventListener('waiting', () => spinner.classList.add('show'));
  video.addEventListener('playing', () => spinner.classList.remove('show'));
  video.addEventListener('canplay', () => spinner.classList.remove('show'));

  const playback = VF.createPlaybackBar();
  playback.bind(video);
  el.appendChild(playback.el);
  
  video.addEventListener('error', () => {
    video.style.display = 'none';
    fallback.style.display = 'flex';
  });

  const sidebar = VF.createSidebar(reel);
  el.appendChild(sidebar.el);

  function flashIcon(node) {
    node.classList.remove('show');
    void node.offsetWidth;
    node.classList.add('show');
  }

  function togglePlay() {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
    flashIcon(playIndicator);
    playIndicator.classList.toggle('is-paused', video.paused);
  }

  let lastTap = 0;
  let singleClickTimer = null;

  el.addEventListener('click', (e) => {
    if (e.target.closest('.side')) return;

    const now = Date.now();
    if (now - lastTap < VF_DOUBLE_TAP_MS) {
      clearTimeout(singleClickTimer);
      sidebar.likeOnly();
      flashIcon(heart);
    } else {
      singleClickTimer = setTimeout(() => {
        togglePlay();
      }, VF_DOUBLE_TAP_MS);
    }
    lastTap = now;
  });

  return {
    el,
    video,
    play() {
      video.play().catch(() => {});
      playIndicator.classList.remove('is-paused');
    },
    pause() {
      video.pause();
      video.currentTime = 0;
    },
    setVolume(v) {
      video.volume = v;
      video.muted = v === 0;
    },
    setSpeed(rate) {
      video.playbackRate = rate;
    },
    setQuality(qualityLabel) {
      if (!reel.sources) return;
      const source = reel.sources.find((s) => s.quality === qualityLabel);
      if (!source || source.src === video.currentSrc) return;

      const wasPlaying = !video.paused;
      const time = video.currentTime;
      video.src = source.src;
      video.currentTime = time;
      if (wasPlaying) video.play().catch(() => {});
    }
  };
};
