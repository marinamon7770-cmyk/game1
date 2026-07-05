window.Game = window.Game || {};

Game.sounds = {
  ctx: null,
  muted: false,

  init: function () {
    if (Game.sounds.ctx) return;
    try {
      Game.sounds.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { /* без звука */ }
  },

  tone: function (freq, duration, type, vol) {
    if (Game.sounds.muted || !Game.sounds.ctx) return;
    var ctx = Game.sounds.ctx;
    if (ctx.state === "suspended") ctx.resume();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol || 0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  },

  play: function (name) {
    Game.sounds.init();
    if (name === "flip") {
      Game.sounds.tone(520, 0.06, "sine", 0.04);
    } else if (name === "match") {
      Game.sounds.tone(523, 0.12, "sine", 0.07);
      setTimeout(function () { Game.sounds.tone(659, 0.12, "sine", 0.07); }, 80);
      setTimeout(function () { Game.sounds.tone(784, 0.18, "sine", 0.06); }, 160);
    } else if (name === "miss") {
      Game.sounds.tone(220, 0.2, "triangle", 0.06);
      setTimeout(function () { Game.sounds.tone(180, 0.25, "triangle", 0.05); }, 100);
    } else if (name === "win") {
      [523, 659, 784, 1047].forEach(function (f, i) {
        setTimeout(function () { Game.sounds.tone(f, 0.2, "sine", 0.06); }, i * 120);
      });
    } else if (name === "round") {
      Game.sounds.tone(440, 0.15, "sine", 0.05);
      setTimeout(function () { Game.sounds.tone(554, 0.2, "sine", 0.05); }, 100);
    }
  }
};

Game.effects = {
  colors: ["#D4A853", "#C4704A", "#7A8450", "#FAF6F0", "#A85A38", "#6B9A58", "#E8D5B5"],

  burst: function (kind, count) {
    var layer = Game.$("fx-layer");
    if (!layer) return;
    count = count || (kind === "match" ? 24 : 12);
    for (var i = 0; i < count; i++) {
      var p = document.createElement("div");
      p.className = "fx-spark fx-spark-" + kind;
      p.style.left = (40 + Math.random() * 20) + "%";
      p.style.top = (35 + Math.random() * 25) + "%";
      p.style.background = Game.effects.colors[i % Game.effects.colors.length];
      p.style.setProperty("--dx", (Math.random() - 0.5) * 120 + "px");
      p.style.setProperty("--dy", (-40 - Math.random() * 80) + "px");
      p.style.animationDuration = (0.5 + Math.random() * 0.4) + "s";
      layer.appendChild(p);
      setTimeout(function (el) { el.remove(); }, 900, p);
    }
  },

  screenPulse: function (className, ms) {
    var screen = Game.$("screen-game");
    if (!screen) return;
    screen.classList.add(className);
    setTimeout(function () { screen.classList.remove(className); }, ms || 600);
  },

  onFlip: function () {
    Game.sounds.play("flip");
  },

  onMatch: function () {
    Game.sounds.play("match");
    Game.effects.burst("match", 28);
    Game.effects.screenPulse("fx-match", 500);
  },

  onMiss: function () {
    Game.sounds.play("miss");
    Game.effects.burst("miss", 8);
    Game.effects.screenPulse("fx-miss", 700);
  },

  onRoundDone: function () {
    Game.sounds.play("round");
    Game.effects.burst("match", 40);
  },

  launchConfetti: function () {
    Game.sounds.play("win");
    var layer = Game.$("confetti");
    if (!layer) return;
    layer.innerHTML = "";
    for (var i = 0; i < 100; i++) {
      var p = document.createElement("div");
      p.className = "confetti-bit";
      p.style.left = Math.random() * 100 + "%";
      p.style.background = Game.effects.colors[i % Game.effects.colors.length];
      p.style.width = (4 + Math.random() * 8) + "px";
      p.style.height = (4 + Math.random() * 8) + "px";
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      p.style.animationDuration = (1.6 + Math.random() * 2.2) + "s";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      layer.appendChild(p);
    }
  }
};
