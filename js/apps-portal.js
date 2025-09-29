(function () {
  const grid = document.getElementById('apps-grid');
  const search = document.getElementById('apps-search');
  if (!grid) return;

  function createCard(app) {
    // create a button-like card that opens a modal instead of immediately navigating
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'app-card';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('data-app-name', app.name || '');

    const img = document.createElement('img');
    img.className = 'app-icon';
    img.src = app.icon || 'image/solar-system.png';
    img.alt = app.name + ' icon';

    const h3 = document.createElement('h3');
    h3.textContent = app.name;

    const p = document.createElement('p');
    p.textContent = app.description || '';

    btn.appendChild(img);
    btn.appendChild(h3);
    btn.appendChild(p);

    // open modal on click or Enter/Space keypress
    btn.addEventListener('click', () => openAppModal(app));
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openAppModal(app);
      }
    });

    return btn;
  }

  /* Modal helpers: create an overlay modal and functions to open/close it */
  let __appModalOverlay = null;
  function createModal() {
    if (document.getElementById('app-modal-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'app-modal-overlay';
    overlay.className = 'app-modal-overlay';
    overlay.innerHTML = `
      <div class="app-modal-panel" role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
        <button class="app-modal-close" aria-label="Close">×</button>
        <img class="app-modal-icon" src="" alt="app icon" />
        <h2 id="app-modal-title">App Title</h2>
        <p class="app-modal-desc"></p>
        <div class="app-modal-actions">
          <a class="app-modal-open btn" target="_blank" rel="noopener noreferrer">Open App</a>
          <button class="app-modal-close btn"></button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    __appModalOverlay = overlay;

    // attach close handlers
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    overlay.querySelectorAll('.app-modal-close').forEach(btn => btn.addEventListener('click', closeModal));
  }

  function openAppModal(app) {
    createModal();
    if (!__appModalOverlay) return;
    const icon = __appModalOverlay.querySelector('.app-modal-icon');
    const title = __appModalOverlay.querySelector('#app-modal-title');
    const desc = __appModalOverlay.querySelector('.app-modal-desc');
    const openBtn = __appModalOverlay.querySelector('.app-modal-open');

    icon.src = app.icon || 'image/solar-system.png';
    icon.alt = app.name + ' icon';
    title.textContent = app.name || 'App';
    desc.textContent = app.description || '';

    openBtn.href = app.url || '#';
    // if it's a local link, open same tab; else open new tab
    if (app.url && app.url.startsWith('http')) {
      openBtn.target = '_blank';
      openBtn.rel = 'noopener noreferrer';
    } else {
      openBtn.target = '_self';
      openBtn.rel = '';
    }

    __appModalOverlay.style.display = 'flex';
    // prevent background scrolling
    document.body.style.overflow = 'hidden';
    // focus the close button for accessibility
    const firstClose = __appModalOverlay.querySelector('.app-modal-close');
    firstClose && firstClose.focus();
  }

  function closeModal() {
    if (!__appModalOverlay) return;
    __appModalOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  function render(list) {
    grid.innerHTML = '';
    if (!list || list.length === 0) {
      grid.innerHTML = '<p style="color:#cfcfcf; text-align:center; width:100%;">No apps found.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(app => frag.appendChild(createCard(app)));
    grid.appendChild(frag);
  }

  function load() {
    fetch('data/apps.json')
      .then(r => r.json())
      .then(data => {
        window.__apps_list = data;
        render(data);
      })
      .catch(err => {
        console.error('Failed loading apps.json', err);
        grid.innerHTML = '<p style="color:#f88; text-align:center; width:100%;">Failed to load apps.</p>';
      });
  }

  function handleSearch() {
    const q = (search.value || '').trim().toLowerCase();
    const list = (window.__apps_list || []).filter(a => {
      return a.name.toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q);
    });
    render(list);
  }

  search && search.addEventListener('input', handleSearch);

  load();
})();
