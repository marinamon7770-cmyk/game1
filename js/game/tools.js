window.Game = window.Game || {};

/* Инструменты мастерской — подсказки и помощь */
Game.TOOLS = {
  hint: {
    icon: "✂️",
    name: "Подсказка",
    tip: "Подсветить верную пару на столе",
    scope: "round"
  },
  peek: {
    icon: "🪡",
    name: "Всмотреться",
    tip: "На секунду показать верхние карты всех стопок",
    scope: "round"
  },
  mend: {
    icon: "🧵",
    name: "Укрепить",
    tip: "Вернуть 1 терпение (1 раз за игру)",
    scope: "game"
  },
  pause: {
    icon: "🌾",
    name: "Передышка",
    tip: "Остановить таймер на 20 секунд",
    scope: "round"
  },
  shield: {
    icon: "🔧",
    name: "Защита",
    tip: "Следующий промах не отнимет терпение",
    scope: "round"
  },
  wisdom: {
    icon: "🫙",
    name: "Мудрость",
    tip: "Показать факт о случайном изделии",
    scope: "cooldown",
    cooldownSec: 12
  }
};

Game.tools = {
  init: function () {
    if (!Game.tools._bound) {
      document.querySelectorAll(".tool-item[data-tool]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          Game.tools.use(btn.dataset.tool);
        });
      });
      Game.tools._bound = true;
    }
    Game.tools.resetRoundUses();
  },

  resetRoundUses: function () {
    var s = Game.state;
    s.toolUses = s.toolUses || {};
    Object.keys(Game.TOOLS).forEach(function (id) {
      if (Game.TOOLS[id].scope === "round") s.toolUses[id] = false;
    });
    Game.tools.updateButtons();
  },

  resetGameUses: function () {
    Game.state.toolUses = {};
    Game.state.toolUses.mend = false;
    Game.state.toolUses.wisdomAt = 0;
    Game.tools.resetRoundUses();
  },

  canUse: function (id) {
    if (Game.state.locked || Game.state.endgameBusy) return false;
    var tool = Game.TOOLS[id];
    if (!tool) return false;
    var u = Game.state.toolUses;
    if (tool.scope === "game") return !u[id];
    if (tool.scope === "round") return !u[id];
    if (tool.scope === "cooldown") {
      return Date.now() - (u.wisdomAt || 0) >= tool.cooldownSec * 1000;
    }
    return true;
  },

  markUsed: function (id) {
    var tool = Game.TOOLS[id];
    if (tool.scope === "cooldown") {
      Game.state.toolUses.wisdomAt = Date.now();
    } else {
      Game.state.toolUses[id] = true;
    }
    Game.tools.updateButtons();
  },

  updateButtons: function () {
    document.querySelectorAll(".tool-item[data-tool]").forEach(function (btn) {
      var id = btn.dataset.tool;
      var tool = Game.TOOLS[id];
      var ok = Game.tools.canUse(id);
      btn.classList.toggle("tool-spent", !ok);
      btn.title = tool.name + " — " + tool.tip + (ok ? "" : " (использовано)");
      btn.setAttribute("aria-label", btn.title);
    });
  },

  toast: function (msg) {
    var el = Game.$("tool-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(Game.tools._toastTimer);
    Game.tools._toastTimer = setTimeout(function () {
      el.classList.remove("show");
    }, 2200);
  },

  use: function (id) {
    if (!Game.tools.canUse(id)) {
      Game.tools.toast("Инструмент уже использован");
      return;
    }
    var fn = Game.tools.actions[id];
    if (fn && fn()) {
      Game.tools.markUsed(id);
    }
  },

  findHintPair: function () {
    var tops = [];
    Game.state.stacks.forEach(function (stack, si) {
      var t = Game.engine.topCard(si);
      if (t && !t.card.isOpen && !t.card.removed) {
        tops.push({ stackIdx: si, card: t.card });
      }
    });
    for (var i = 0; i < tops.length; i++) {
      for (var j = i + 1; j < tops.length; j++) {
        var a = tops[i].card.data;
        var b = tops[j].card.data;
        if (a.pairId === b.pairId && a.type !== b.type) {
          return [tops[i].card.uid, tops[j].card.uid];
        }
      }
    }
    var remaining = Game.engine.getRemainingCards();
    var byPair = {};
    remaining.forEach(function (entry) {
      if (!byPair[entry.card.data.pairId]) byPair[entry.card.data.pairId] = [];
      byPair[entry.card.data.pairId].push(entry.card.uid);
    });
    var keys = Object.keys(byPair);
    for (var k = 0; k < keys.length; k++) {
      if (byPair[keys[k]].length >= 2) {
        return [byPair[keys[k]][0], byPair[keys[k]][1]];
      }
    }
    return null;
  },

  actions: {
    hint: function () {
      var pair = Game.tools.findHintPair();
      if (!pair) {
        Game.tools.toast("Нет доступных пар для подсказки");
        return false;
      }
      pair.forEach(function (uid) {
        var el = Game.render.getCardEl(uid);
        if (el) el.classList.add("hint-glow");
      });
      Game.tools.toast("✂️ Пара подсвечена!");
      setTimeout(function () {
        document.querySelectorAll(".hint-glow").forEach(function (el) {
          el.classList.remove("hint-glow");
        });
      }, 2500);
      return true;
    },

    peek: function () {
      Game.state.stacks.forEach(function (stack, si) {
        var t = Game.engine.topCard(si);
        if (t && !t.card.isOpen) {
          var el = Game.render.getCardEl(t.card.uid);
          if (el) el.classList.add("peek-flash");
        }
      });
      Game.tools.toast("🪡 Верхние карты открыты...");
      setTimeout(function () {
        document.querySelectorAll(".peek-flash").forEach(function (el) {
          el.classList.remove("peek-flash");
        });
      }, 1400);
      return true;
    },

    mend: function () {
      var s = Game.state;
      if (s.patience >= s.maxPatience) {
        Game.tools.toast("Терпение уже полное");
        return false;
      }
      s.patience++;
      Game.hud.update();
      Game.tools.toast("🧵 +1 терпение");
      return true;
    },

    pause: function () {
      Game.state.timerPausedUntil = Date.now() + Game.CONFIG.PAUSE_TOOL_SEC * 1000;
      Game.tools.toast("🌾 Таймер на паузе 20 сек");
      Game.hud.update();
      return true;
    },

    shield: function () {
      Game.state.shieldActive = true;
      Game.$("patience-chip").classList.add("shield-active");
      Game.tools.toast("🔧 Защита от следующего промаха");
      return true;
    },

    wisdom: function () {
      var p = Game.PAIRS[Math.floor(Math.random() * Game.PAIRS.length)];
      Game.facts.showProduct(p, true);
      Game.tools.toast("🫙 " + p.title);
      return true;
    }
  }
};
