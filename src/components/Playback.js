window.VF = window.VF || {};

VF.createPlaybackBar = function () {
    const el = document.createElement('div');
    el.className = 'playback';
    el.innerHTML = `
    <div class="time">00:00</div>
    <div class="playback-track">
      <div class="playback-fill"></div>
    </div>
  `;

    const fill = el.querySelector('.playback-fill');
    const time = el.querySelector('.time');
    let video = null;
    let rafId = null;

    function formatTime(sec) {
        sec = Math.floor(sec);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    }

    function render() {
        if (!video || !video.duration) return;
        const progress = video.currentTime / video.duration;
        fill.style.width = progress * 100 + "%";
        time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }

    function startLoop() {
        if (rafId) return;
        const step = () => {
            render();
            rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
    }

    function stopLoop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function bind(videoEl) {
        video = videoEl;
        video.addEventListener('loadedmetadata', render);
        video.addEventListener('play', startLoop);
        video.addEventListener('pause', stopLoop);
        video.addEventListener('ended', () => { render(); stopLoop(); });
    }

    function seek(clientX) {
        if (!video || !video.duration) return;
        const rect = el.getBoundingClientRect();
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        video.currentTime = ratio * video.duration;
        render();
    }

    el.addEventListener('click', (e) => {
        e.stopPropagation();
        seek(e.clientX);
    });

    let dragging = false;

    el.addEventListener("pointerdown", e => {
        dragging = true;
        el.classList.add("dragging");
        seek(e.clientX);
        el.setPointerCapture(e.pointerId);
    });

    el.addEventListener("pointermove", e => {
        if (!dragging) return;
        seek(e.clientX);
    });

    el.addEventListener("pointerup", e => {
        dragging = false;
        el.classList.remove("dragging");
        el.releasePointerCapture(e.pointerId);
    });

    return { el, bind, update: render };
};