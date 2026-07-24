window.VF = window.VF || {};

VF.createVolumeSlider = function ({ initial = 0, onChange } = {}) {
  const el = document.createElement('div');
  el.id = 'volume-control';
  el.innerHTML = `
    <div class="volume">
      <button class="vol-icon" type="button" aria-label="Off/On volume"></button>
      <input class="vol-range" type="range" min="0" max="100" value="${initial}" aria-label="Vodume">
    </div>
  `;

  const icon = el.querySelector('.vol-icon');
  const range = el.querySelector('.vol-range');
  let lastNonZero = initial > 0 ? initial : 55;

  function iconFor(v) {
    if (v === 0) return '🔇';
    if (v < 50) return '🔉';
    return '🔊';
  }

  function apply(v, notify) {
    range.value = v;
    icon.textContent = iconFor(v);
    if (v > 0) lastNonZero = v;
    if (notify) onChange?.(v / 100);
  }

  apply(initial, false);

  range.addEventListener('input', () => apply(Number(range.value), true));

  icon.addEventListener('click', () => {
    const current = Number(range.value);
    apply(current > 0 ? 0 : lastNonZero, true);
  });

  return {
    el,
    get value() { return Number(range.value) / 100; },
    set(v) { apply(Math.round(v * 100), false); }
  };
};
