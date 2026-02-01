(function () {
  // Name: set here or via URL ?name=YourName (e.g. ?name=Neha)
  var LVR_NAME = "Apple💙";
  var q = new URLSearchParams(window.location.search);
  if (q.has("name")) LVR_NAME = q.get("name").trim() || LVR_NAME;

  const card = document.getElementById("proposal-card");
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");
  const noWrap = document.querySelector(".no-wrap");
  const buttonsWrap = document.querySelector(".buttons-wrap");
  const celebration = document.getElementById("celebration");
  const confettiWrap = document.getElementById("confetti-wrap");
  const sparklesEl = document.getElementById("sparkles");
  const nameEl = document.getElementById("lvr-name");

  if (nameEl) nameEl.textContent = LVR_NAME;

  // ----- Hover on Yes: No stays, Yes clickable. Hover on No: No moves; chase it and it moves again (entire box). -----
  function pointInRect(x, y, rect) {
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  }

  function resetEvasive() {
    buttonsWrap.classList.remove("evasive");
    noWrap.style.left = "";
    noWrap.style.top = "";
    noWrap.style.transform = "";
  }

  function rectsOverlap(
    noCenterX,
    noCenterY,
    noW,
    noH,
    yesLeft,
    yesTop,
    yesRight,
    yesBottom
  ) {
    var noLeft = noCenterX - noW / 2,
      noRight = noCenterX + noW / 2;
    var noTop = noCenterY - noH / 2,
      noBottom = noCenterY + noH / 2;
    return !(
      noRight < yesLeft ||
      noLeft > yesRight ||
      noBottom < yesTop ||
      noTop > yesBottom
    );
  }

  var noMoveThrottle = 0;
  function updateNoPosition(clientX, clientY) {
    if (!buttonsWrap.classList.contains("evasive")) return;
    buttonsWrap._lastMove = { x: clientX, y: clientY };
    var now = Date.now();
    if (now - noMoveThrottle < 35) return;
    noMoveThrottle = now;
    const cardRect = card.getBoundingClientRect();
    const wrapRect = buttonsWrap.getBoundingClientRect();
    const yesRect = btnYes.getBoundingClientRect();
    const nw = noWrap.offsetWidth;
    const nh = noWrap.offsetHeight;
    var pad = 8;
    var yesLeft = yesRect.left - cardRect.left - pad,
      yesTop = yesRect.top - cardRect.top - pad;
    var yesRight = yesRect.right - cardRect.left + pad,
      yesBottom = yesRect.bottom - cardRect.top + pad;
    var x, y;
    for (var tries = 0; tries < 50; tries++) {
      x = nw / 2 + Math.random() * Math.max(0, cardRect.width - nw);
      y = nh / 2 + Math.random() * Math.max(0, cardRect.height - nh);
      if (!rectsOverlap(x, y, nw, nh, yesLeft, yesTop, yesRight, yesBottom))
        break;
    }
    noWrap.style.left = cardRect.left + x - wrapRect.left - nw / 2 + "px";
    noWrap.style.top = cardRect.top + y - wrapRect.top - nh / 2 + "px";
    noWrap.style.transform = "none";
  }

  document.addEventListener("mousemove", function (e) {
    const x = e.clientX;
    const y = e.clientY;
    const yesRect = btnYes.getBoundingClientRect();
    const noRect = noWrap.getBoundingClientRect();

    if (pointInRect(x, y, yesRect)) {
      return;
    }
    if (pointInRect(x, y, noRect)) {
      buttonsWrap.classList.add("evasive");
      updateNoPosition(x, y);
    }
  });

  document.addEventListener(
    "touchmove",
    function (e) {
      if (!e.touches.length) return;
      const t = e.touches[0];
      const x = t.clientX;
      const y = t.clientY;
      const yesRect = btnYes.getBoundingClientRect();
      const noRect = noWrap.getBoundingClientRect();

      if (pointInRect(x, y, yesRect)) return;
      if (pointInRect(x, y, noRect)) {
        buttonsWrap.classList.add("evasive");
        updateNoPosition(x, y);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    if (!buttonsWrap.classList.contains("evasive")) return;
    var lastMove = buttonsWrap._lastMove;
    if (lastMove) updateNoPosition(lastMove.x, lastMove.y);
  });

  // ----- Yes: celebration with yay, congrats, confetti, sparkles -----
  const COLORS = [
    "#e91e8c",
    "#ff69b4",
    "#ffb6c1",
    "#c2185b",
    "#ff8c42",
    "#ffd700",
  ];
  const CONFETTI_COUNT = 80;
  const SPARKLE_COUNT = 20;

  function createConfetti() {
    confettiWrap.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const el = document.createElement("div");
      el.className = "confetti";
      el.style.left = Math.random() * 100 + "vw";
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      el.style.width = 6 + Math.random() * 8 + "px";
      el.style.height = 6 + Math.random() * 8 + "px";
      el.style.animationDuration = 2 + Math.random() * 2 + "s";
      el.style.animationDelay = Math.random() * 0.5 + "s";
      fragment.appendChild(el);
    }
    confettiWrap.appendChild(fragment);
  }

  function createSparkles() {
    sparklesEl.innerHTML = "";
    const chars = ["✨", "🌟", "💖", "⭐", "💕"];
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const el = document.createElement("span");
      el.className = "sparkle";
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      el.style.left = Math.random() * 100 + "vw";
      el.style.top = Math.random() * 100 + "vh";
      el.style.animationDelay = Math.random() * 1.5 + "s";
      el.style.animationDuration = 1.5 + Math.random() * 1 + "s";
      sparklesEl.appendChild(el);
    }
  }

  btnYes.addEventListener("click", function () {
    card.classList.add("hidden");
    celebration.classList.remove("hidden");
    createConfetti();
    createSparkles();
  });

  btnNo.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
  btnNo.setAttribute("tabindex", "-1");
})();
