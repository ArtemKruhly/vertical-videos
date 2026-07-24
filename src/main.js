(function () {
  const app = document.getElementById('app');

  const topBar = VF.createTopBar();
  const feeds = VF.createFeed(VF.REELS);
  const volume = VF.createVolumeSlider({
    initial: 0,
    onChange: (v) => feeds.setVolume(v)
  });
  const options = VF.createOptionsMenu({
    qualities: ['Original'],
    onSpeedChange: (v) => feeds.setSpeed(v),
    onQualityChange: (q) => {
      feeds.slides?.forEach((s) => s.setQuality(q));
    }
  });

  topBar.el.insertBefore(volume.el, topBar.el.firstChild);
  topBar.el.appendChild(options.el);

  app.appendChild(topBar.el);
  app.appendChild(feeds.el);

  feeds.setActive(0);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      feeds.next();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      feeds.prev();
    }
  });
})();
