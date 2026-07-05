window.Game = window.Game || {};

Game.state = {
  roundIdx: 0,
  stacks: [],
  flipped: [],
  matchedTotal: 0,
  pairsInRound: 0,
  moves: 0,
  score: 0,
  combo: 0,
  locked: false,
  endgameBusy: false,
  timerId: null,
  seconds: 0,
  cardUid: 0,
  difficulty: "normal",
  rounds: [],
  patience: 6,
  maxPatience: 6,
  misses: 0,
  shieldActive: false,
  timerPausedUntil: 0,
  toolUses: {}
};

Game.$ = function (id) { return document.getElementById(id); };

Game.utils = {
  shuffle: function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  },

  formatTime: function (s) {
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  },

  pickBack: function () {
    var styles = Game.CONFIG.BACK_STYLES;
    return styles[Math.floor(Math.random() * styles.length)];
  }
};

Game.screens = {
  start: null,
  game: null,
  win: null,
  init: function () {
    this.start = Game.$("screen-start");
    this.game = Game.$("screen-game");
    this.win = Game.$("screen-win");
  },
  show: function (name) {
    [this.start, this.game, this.win].forEach(function (s) {
      if (s) s.classList.remove("active");
    });
    if (this[name]) this[name].classList.add("active");
  }
};
