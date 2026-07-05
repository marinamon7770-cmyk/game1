window.Game = window.Game || {};

Game.facts = {
  intervalId: null,
  pausedUntil: 0,
  idx: 0,

  start: function () {
    Game.facts.stop();
    Game.facts.idx = Math.floor(Math.random() * Game.PAIRS.length);
    Game.facts.showNext(false);
    Game.facts.intervalId = setInterval(function () {
      if (Date.now() < Game.facts.pausedUntil) return;
      Game.facts.idx = (Game.facts.idx + 1) % Game.PAIRS.length;
      Game.facts.showNext(true);
    }, Game.CONFIG.FACT_ROTATE_MS);
  },

  stop: function () {
    if (Game.facts.intervalId) {
      clearInterval(Game.facts.intervalId);
      Game.facts.intervalId = null;
    }
  },

  showNext: function (animate) {
    Game.facts.showProduct(Game.PAIRS[Game.facts.idx], animate);
  },

  showProduct: function (p, animate) {
    var box = Game.$("fact-box");
    var text = Game.$("fact-text");
    var label = Game.$("fact-label");
    if (!box || !text) return;

    var content = p.emoji + " " + p.title + ": " + p.fact;
    if (label) label.textContent = "Знаете ли вы?";

    function apply() {
      text.textContent = content;
      box.classList.remove("empty");
    }

    if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      box.classList.add("fact-changing");
      setTimeout(function () {
        apply();
        box.classList.remove("fact-changing");
      }, 280);
    } else {
      apply();
    }
  },

  showMatch: function (data) {
    Game.facts.pausedUntil = Date.now() + 6000;
    var meta = Game.getPairMeta(data.pairId);
    var box = Game.$("fact-box");
    var text = Game.$("fact-text");
    var label = Game.$("fact-label");
    if (label) label.textContent = "Верно! " + meta.emoji + " " + meta.title;
    text.textContent = data.fact;
    box.classList.remove("empty", "fact-changing");
  }
};
