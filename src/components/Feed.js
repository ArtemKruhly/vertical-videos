window.VF = window.VF || {};

VF.createFeed = function (reels) {
  const el = document.createElement('div');
  el.id = 'feed';

  const slides = reels.map((reel, i) => VF.createVideoSlide(reel, i));
  slides.forEach((s) => el.appendChild(s.el));

  let current = 0;
  let volume = 0;
  let speed = 1;

  function setActive(index) {
    current = index;
    slides.forEach((s, i) => {
      if (i === index) {
        s.setVolume(volume);
        s.setSpeed(speed);
        s.play();
      } else {
        s.pause();
      }
    });
  }

  function setSpeed(v) {
    speed = v;
    slides[current]?.setSpeed(v);
  }

  function setVolume(v) {
    volume = v;
    slides[current]?.setVolume(v);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          const idx = Number(entry.target.dataset.index);
          if (idx !== current) setActive(idx);
        }
      });
    },
    { threshold: [0.6] }
  );

  slides.forEach((s) => observer.observe(s.el));

  function next() {
    if (current < slides.length - 1) {
      slides[current + 1].el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function prev() {
    if (current > 0) {
      slides[current - 1].el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return {
    el,
    setActive,
    setVolume,
    setSpeed,
    next,
    prev,
    slides,
    get current() { return current; }
  };
};
