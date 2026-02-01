(function () {
  // Name: set here or via URL ?name=YourName (e.g. ?name=Neha)
  var LVR_NAME = 'Neha';
  var q = new URLSearchParams(window.location.search);
  if (q.has('name')) LVR_NAME = q.get('name').trim() || LVR_NAME;

  const card = document.getElementById('proposal-card');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const noWrap = document.querySelector('.no-wrap');
  const buttonsWrap = document.querySelector('.buttons-wrap');
  const celebration = document.getElementById('celebration');
  const confettiWrap = document.getElementById('confetti-wrap');
  const sparklesEl = document.getElementById('sparkles');
  const nameEl = document.getElementById('lvr-name');

  if (nameEl) nameEl.textContent = LVR_NAME;

  // ----- Evasive "No": move away from cursor so it's not clickable -----
  noWrap.style.position = 'absolute';
  noWrap.style.left = '50%';
  noWrap.style.top = '60%';
  noWrap.style.transform = 'translate(-50%, -50%)';
  noWrap.style.transition = 'left 0.15s ease-out, top 0.15s ease-out';

  let cardRect = function () { return card.getBoundingClientRect(); };
  let btnYesRect = function () { return btnYes.getBoundingClientRect(); };

  function updateNoPosition(clientX, clientY) {
    const rect = cardRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const padding = 30;
    const moveAwayX = clientX > centerX ? 0.15 : 0.75;
    const moveAwayY = clientY > centerY ? 0.2 : 0.7;
    const leftPct = moveAwayX * 100;
    const topPct = moveAwayY * 100;
    noWrap.style.left = leftPct + '%';
    noWrap.style.top = topPct + '%';
    noWrap.style.transform = 'translate(-50%, -50%)';

    const noRect = noWrap.getBoundingClientRect();
    const yesRect = btnYesRect();
    if (noRect.top + noRect.height / 2 < yesRect.top + yesRect.height / 2) {
      btnYes.classList.add('big');
    } else {
      btnYes.classList.remove('big');
    }
  }

  document.addEventListener('mousemove', function (e) {
    updateNoPosition(e.clientX, e.clientY);
  });

  document.addEventListener('touchmove', function (e) {
    if (e.touches.length) {
      const t = e.touches[0];
      updateNoPosition(t.clientX, t.clientY);
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    const noRect = noWrap.getBoundingClientRect();
    const yesRect = btnYesRect();
    if (noRect.top + noRect.height / 2 < yesRect.top + yesRect.height / 2) {
      btnYes.classList.add('big');
    } else {
      btnYes.classList.remove('big');
    }
  });

  // ----- Yes: celebration with yay, congrats, confetti, sparkles -----
  const COLORS = ['#e91e8c', '#ff69b4', '#ffb6c1', '#c2185b', '#ff8c42', '#ffd700'];
  const CONFETTI_COUNT = 80;
  const SPARKLE_COUNT = 20;

  function createConfetti() {
    confettiWrap.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'confetti';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      el.style.width = (6 + Math.random() * 8) + 'px';
      el.style.height = (6 + Math.random() * 8) + 'px';
      el.style.animationDuration = (2 + Math.random() * 2) + 's';
      el.style.animationDelay = Math.random() * 0.5 + 's';
      fragment.appendChild(el);
    }
    confettiWrap.appendChild(fragment);
  }

  function createSparkles() {
    sparklesEl.innerHTML = '';
    const chars = ['✨', '🌟', '💖', '⭐', '💕'];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'sparkle';
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = Math.random() * 100 + 'vh';
      el.style.animationDelay = Math.random() * 1.5 + 's';
      el.style.animationDuration = (1.5 + Math.random() * 1) + 's';
      sparklesEl.appendChild(el);
    }
  }

  btnYes.addEventListener('click', function () {
    card.classList.add('hidden');
    celebration.classList.remove('hidden');
    createConfetti();
    createSparkles();
  });

  btnNo.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
  btnNo.setAttribute('tabindex', '-1');
})();
