// Simple flame particle system: small glowing blue circles that float up
(function () {
  const container = document.querySelector('.flame-container');
  if (!container) return;

  const maxParticles = 620; // max particles on screen
  const spawnInterval = 100; // ms between spawns
  const lifetimeMin = 3200; // ms
  const lifetimeMax = 5200; // ms

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFlame() {
    const el = document.createElement('div');
    el.className = 'flame';

  // random horizontal position across full viewport width
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const x = rand(0, vw);

  const size = Math.round(rand(2, 5)); // px - slightly larger for visibility
    el.style.width = size + 'px';
    el.style.height = size + 'px';

    el.style.left = Math.max(6, Math.min(vw - 6, x)) + 'px';

    // duration
    const life = rand(lifetimeMin, lifetimeMax);
    el.style.animationDuration = life + 'ms';

  // horizontal drift amount (pixels) while floating up
  const drift = rand(-vw * 0.25, vw * 0.25); // allow wider drift across screen
    el.style.setProperty('--drift-x', drift + 'px');

    container.appendChild(el);

    // clean up after animation
    setTimeout(() => {
      // fade out then remove
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, life + 100);
  }

  // spawn loop with max cap
  let particles = 0;
  const spawn = () => {
    // count current particles
    particles = container.children.length;
    if (particles < maxParticles) createFlame();
  };

  let spawner = setInterval(spawn, spawnInterval);

  // Pause on visibility hidden to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(spawner);
    } else {
      spawner = setInterval(spawn, spawnInterval);
    }
  });

  // Responsive: remove all particles on resize to avoid layout issues
  window.addEventListener('resize', () => {
    while (container.firstChild) container.removeChild(container.firstChild);
  });
})();
