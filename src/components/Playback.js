window.VF = window.VF || {};

VF.createPlaybackBar = function () {
    const el = document.createElement("div");
    el.className = "playback";

    el.innerHTML = `
        <div class="time">00:00</div>
        <div class="playback-track">
            <div class="playback-fill">
                <div class="playback-thumb"></div>
            </div>
        </div>
    `;

    const track = el.querySelector(".playback-track");
    const fill = el.querySelector(".playback-fill");
    const thumb = el.querySelector(".playback-thumb");
    const time = el.querySelector(".time");

    let video = null;
    let rafId = null;
    let dragging = false;

    function formatTime(sec) {
        sec = Math.floor(sec);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${String(s).padStart(2, "0")}`;
    }

    function render() {
        if (!video || !video.duration) return;

        const progress = video.currentTime / video.duration;

        fill.style.width = `${progress * 100}%`;

        time.textContent =
            `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
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

        video.addEventListener("loadedmetadata", render);
        video.addEventListener("play", startLoop);
        video.addEventListener("pause", stopLoop);

        video.addEventListener("ended", () => {
            render();
            stopLoop();
        });
    }

    function seek(clientX) {
        if (!video || !video.duration) return;

        const rect = track.getBoundingClientRect();

        const ratio = Math.max(
            0,
            Math.min((clientX - rect.left) / rect.width, 1)
        );

        video.currentTime = ratio * video.duration;

        render();
    }

    function onPointerMove(e) {
        if (!dragging) return;

        e.preventDefault();
        seek(e.clientX);
    }

    function stopDrag() {
        dragging = false;

        el.classList.remove("dragging");

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stopDrag);
        window.removeEventListener("pointercancel", stopDrag);
    }

    function startDrag(e) {
        e.preventDefault();
        e.stopPropagation();

        dragging = true;

        el.classList.add("dragging");

        seek(e.clientX);

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", stopDrag);
        window.addEventListener("pointercancel", stopDrag);
    }

    track.addEventListener("pointerdown", startDrag);
    thumb.addEventListener("pointerdown", startDrag);

    return {
        el,
        bind,
        update: render,
    };
};