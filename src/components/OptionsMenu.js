window.VF = window.VF || {};

VF.createOptionsMenu = function ({ qualities = ['Original'], onSpeedChange, onQualityChange } = {}) {
    const el = document.createElement('div');
    el.className = 'options-menu';
    el.innerHTML = `
    <button class="options-trigger" type="button" aria-label="Опции видео" aria-expanded="false">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
      </svg>
    </button>
    <div class="options-panel" hidden>
      <div class="options-group">
        <div class="options-label">Speed</div>
        <div class="options-list">
          ${[0.5, 0.75, 1, 1.25, 1.5, 2].map(s =>
        `<button type="button" class="opt-btn${s === 1 ? ' active' : ''}" data-speed="${s}">${s}x</button>`
    ).join('')}
        </div>
      </div>
      <div class="options-group">
        <div class="options-label">quality</div>
        <div class="options-list">
          ${qualities.map((q, i) =>
        `<button type="button" class="opt-btn${i === 0 ? ' active' : ''}" data-quality="${q}">${q}</button>`
    ).join('')}
        </div>
      </div>
    </div>
  `;

    const trigger = el.querySelector('.options-trigger');
    const panel = el.querySelector('.options-panel');
    const speedBtns = [...el.querySelectorAll('[data-speed]')];
    const qualityBtns = [...el.querySelectorAll('[data-quality]')];

    let open = false;

    function togglePanel(force) {
        open = force !== undefined ? force : !open;
        panel.hidden = !open;
        trigger.setAttribute('aria-expanded', String(open));
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel();
    });
    
    document.addEventListener('click', (e) => {
        if (open && !el.contains(e.target)) togglePanel(false);
    });

    speedBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            speedBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            onSpeedChange?.(Number(btn.dataset.speed));
        });
    });

    qualityBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            qualityBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            onQualityChange?.(btn.dataset.quality);
        });
    });

    return { el };
};