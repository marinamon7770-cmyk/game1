window.Game = window.Game || {};

Game.hud = {
  update: function () {
    var s = Game.state;
    var cfg = s.rounds[s.roundIdx];
    Game.$("moves").textContent = s.moves;
    Game.$("score").textContent = s.score;
    Game.$("combo").textContent = s.combo > 1 ? "×" + s.combo : "—";
    Game.$("combo-chip").classList.toggle("combo-active", s.combo > 1);

    Game.$("patience").textContent = s.patience;
    Game.$("patience-max").textContent = s.maxPatience;
    Game.$("misses").textContent = s.misses;
    var pChip = Game.$("patience-chip");
    pChip.classList.toggle("patience-low", s.patience <= 2);
    pChip.classList.toggle("patience-critical", s.patience <= 1);

    var timerChip = Game.$("timer-chip");
    if (timerChip) {
      timerChip.classList.toggle("timer-paused", Date.now() < s.timerPausedUntil);
    }

    var diffLabel = Game.CONFIG.DIFFICULTIES[s.difficulty].label;
    Game.$("round-info").textContent =
      "Раунд " + (s.roundIdx + 1) + "/" + s.rounds.length + " · " + cfg.name;
    Game.$("pairs-info").textContent = s.matchedTotal + " / " + s.pairsInRound + " пар";
    Game.$("difficulty-badge").textContent = diffLabel;

    var pct = s.pairsInRound ? (s.matchedTotal / s.pairsInRound) * 100 : 0;
    Game.$("progress-fill").style.width = pct + "%";

    if (Game.tools && Game.tools.updateButtons) Game.tools.updateButtons();
  },

  updateTimer: function () {
    Game.$("timer").textContent = Game.utils.formatTime(Game.state.seconds);
  }
};

Game.timer = {
  start: function () {
    Game.timer.stop();
    Game.state.timerId = setInterval(function () {
      if (Date.now() < Game.state.timerPausedUntil) {
        Game.hud.update();
        return;
      }
      Game.state.seconds++;
      Game.hud.updateTimer();
    }, 1000);
  },
  stop: function () {
    if (Game.state.timerId) {
      clearInterval(Game.state.timerId);
      Game.state.timerId = null;
    }
  }
};

Game.ui = {
  showPopup: function (emoji, title, sub) {
    Game.$("pop-emoji").textContent = emoji;
    Game.$("pop-title").textContent = title;
    Game.$("pop-sub").textContent = sub;
    Game.$("overlay").classList.add("show");
  },

  hidePopup: function () {
    Game.$("overlay").classList.remove("show");
  },

  onRoundDone: function () {
    var s = Game.state;
    if (s.roundIdx < s.rounds.length - 1) {
      var cfg = s.rounds[s.roundIdx];
      Game.ui.showPopup("🎉", "Стопка разобрана!", "Раунд «" + cfg.name + "» пройден · +" + (s.pairsInRound * 50) + " очков");
      s.score += s.pairsInRound * 50;
      if (Game.effects && Game.effects.onRoundDone) Game.effects.onRoundDone();
      setTimeout(function () {
        s.roundIdx++;
        Game.ui.hidePopup();
        Game.engine.buildStacks();
        Game.tools.resetRoundUses();
        Game.render.renderStacks();
        Game.hud.update();
      }, 1600);
    } else {
      Game.ui.showPopup("🌟", "Все узоры раскрыты!", "Празднуем победу мастера...");
      setTimeout(function () { Game.ui.showWin(); }, 1300);
    }
  },

  showWin: function () {
    Game.ui.hidePopup();
    Game.timer.stop();
    Game.facts.stop();
    var s = Game.state;
    Game.$("win-moves").textContent = s.moves;
    Game.$("win-time").textContent = Game.utils.formatTime(s.seconds);
    Game.$("win-score").textContent = s.score;
    Game.$("win-rounds").textContent = s.rounds.length;

    var msg;
    if (s.moves <= 30) msg = "Вы настоящий мастер плетёных историй!";
    else if (s.moves <= 50) msg = "Отличный результат — вы хорошо знаете изделия мастерской!";
    else msg = "Уют найден, а мастерство приходит с практикой!";
    Game.$("win-msg").textContent = msg;

    Game.screens.show("win");
    Game.effects.launchConfetti();
  },

  gameOver: function () {
    Game.timer.stop();
    Game.facts.stop();
    var s = Game.state;
    Game.ui.showPopup(
      "😔",
      "Терпение иссякло",
      "Промахов: " + s.misses + " · Очки: " + s.score + " · «Заново» или «Выйти»"
    );
    setTimeout(function () {
      Game.ui.hidePopup();
    }, 4000);
  },

  exitToMenu: function () {
    var s = Game.state;
    var onGame = Game.screens.game && Game.screens.game.classList.contains("active");
    var inProgress = s.moves > 0 || s.matchedTotal > 0 || s.seconds > 3;
    if (onGame && inProgress && !confirm("Выйти в главное меню? Текущий прогресс будет потерян.")) {
      return;
    }

    Game.timer.stop();
    Game.facts.stop();
    Game.ui.hidePopup();
    if (Game.help && Game.help.closeModal) Game.help.closeModal();

    s.locked = false;
    s.endgameBusy = false;
    s.flipped = [];
    s.stacks = [];

    Game.$("confetti").innerHTML = "";
    var board = Game.$("stacks-board");
    if (board) board.innerHTML = "";

    Game.screens.show("start");
  },

  startGame: function () {
    var s = Game.state;
    var diff = Game.CONFIG.DIFFICULTIES[s.difficulty] || Game.CONFIG.DIFFICULTIES.normal;
    s.roundIdx = 0;
    s.moves = 0;
    s.score = 0;
    s.combo = 0;
    s.misses = 0;
    s.seconds = 0;
    s.cardUid = 0;
    s.locked = false;
    s.endgameBusy = false;
    s.shieldActive = false;
    s.timerPausedUntil = 0;
    s.maxPatience = diff.patience;
    s.patience = diff.patience;
    s.rounds = Game.getRounds(s.difficulty);

    Game.$("timer").textContent = "00:00";
    Game.$("patience-chip").classList.remove("shield-active", "patience-low", "patience-critical");
    Game.$("confetti").innerHTML = "";
    Game.ui.hidePopup();

    Game.tools.resetGameUses();
    Game.engine.buildStacks();
    Game.render.renderStacks();
    Game.hud.update();
    Game.timer.start();
    Game.facts.start();
    Game.tools.init();
    if (Game.sounds && Game.sounds.init) Game.sounds.init();
    Game.screens.show("game");
  },

  setDifficulty: function (level) {
    Game.state.difficulty = level;
    document.querySelectorAll(".btn-diff").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.diff === level);
    });
    var rounds = Game.getRounds(level);
    Game.$("stat-rounds").textContent = rounds.length;
    Game.$("stat-pairs").textContent = rounds[rounds.length - 1].pairs;
  },

  init: function () {
    Game.screens.init();
    Game.ui.setDifficulty("normal");
    Game.tools.init();
    Game.help.init();

    var btnStart = Game.$("btn-start");
    if (btnStart) btnStart.addEventListener("click", Game.ui.startGame);

    var btnRestart = Game.$("btn-restart");
    if (btnRestart) btnRestart.addEventListener("click", Game.ui.startGame);

    var btnAgain = Game.$("btn-again");
    if (btnAgain) btnAgain.addEventListener("click", Game.ui.startGame);

    var btnExit = Game.$("btn-exit");
    if (btnExit) btnExit.addEventListener("click", Game.ui.exitToMenu);

    var btnExitWin = Game.$("btn-exit-win");
    if (btnExitWin) btnExitWin.addEventListener("click", Game.ui.exitToMenu);

    document.querySelectorAll(".btn-diff").forEach(function (btn) {
      btn.addEventListener("click", function () {
        Game.ui.setDifficulty(btn.dataset.diff);
      });
    });

    var btnCatalog = Game.$("btn-catalog");
    if (btnCatalog) {
      btnCatalog.addEventListener("click", function () {
        var list = Game.PAIRS.map(function (p) {
          return p.emoji + " " + p.title;
        }).join("\n");
        alert("Каталог мастерской:\n\n" + list);
      });
    }
  }
};
