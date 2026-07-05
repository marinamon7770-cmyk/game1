window.Game = window.Game || {};

Game.engine = {
  makeCard: function (data) {
    return {
      uid: Game.state.cardUid++,
      data: data,
      removed: false,
      isOpen: false,
      backStyle: Game.utils.pickBack()
    };
  },

  buildStacks: function () {
    var cfg = Game.state.rounds[Game.state.roundIdx];
    Game.state.pairsInRound = cfg.pairs;
    var pool = Game.utils.shuffle(Game.PAIRS).slice(0, cfg.pairs);
    var pairGroups = [];

    pool.forEach(function (p) {
      pairGroups.push([
        { pairId: p.id, type: "product", category: p.category, title: p.title, fact: p.fact, emoji: p.emoji },
        { pairId: p.id, type: "purpose", category: p.category, purpose: p.purpose, fact: p.fact, emoji: p.emoji }
      ]);
    });
    pairGroups = Game.utils.shuffle(pairGroups);

    Game.state.stacks = [];
    for (var i = 0; i < cfg.stacks; i++) Game.state.stacks.push([]);

    pairGroups.forEach(function (pair, pi) {
      var s1 = pi % cfg.stacks;
      var s2 = (s1 + 1 + Math.floor(Math.random() * Math.max(1, cfg.stacks - 1))) % cfg.stacks;
      if (cfg.stacks > 1) {
        while (s2 === s1) s2 = (s2 + 1) % cfg.stacks;
      }
      Game.state.stacks[s1].push(Game.engine.makeCard(pair[0]));
      Game.state.stacks[s2].push(Game.engine.makeCard(pair[1]));
    });

    Game.state.matchedTotal = 0;
    Game.state.flipped = [];
    Game.state.locked = false;
    Game.state.endgameBusy = false;
  },

  countRemaining: function () {
    var n = 0;
    Game.state.stacks.forEach(function (s) {
      s.forEach(function (c) { if (!c.removed) n++; });
    });
    return n;
  },

  getRemainingCards: function () {
    var list = [];
    Game.state.stacks.forEach(function (s, si) {
      s.forEach(function (c) {
        if (!c.removed) list.push({ stackIdx: si, card: c });
      });
    });
    return list;
  },

  findCard: function (uid) {
    for (var si = 0; si < Game.state.stacks.length; si++) {
      for (var i = 0; i < Game.state.stacks[si].length; i++) {
        if (Game.state.stacks[si][i].uid === uid && !Game.state.stacks[si][i].removed) {
          return { stackIdx: si, card: Game.state.stacks[si][i] };
        }
      }
    }
    return null;
  },

  topCard: function (stackIdx) {
    var st = Game.state.stacks[stackIdx];
    for (var i = st.length - 1; i >= 0; i--) {
      if (!st[i].removed) return { card: st[i], index: i };
    }
    return null;
  },

  canClickCard: function (stackIdx, uid) {
    var found = Game.engine.findCard(uid);
    if (!found || found.card.removed || found.card.isOpen) return false;
    if (Game.engine.countRemaining() <= 2) return true;
    var t = Game.engine.topCard(stackIdx);
    return t && t.card.uid === uid;
  },

  syncFlippedFromState: function () {
    Game.state.flipped = [];
    Game.state.stacks.forEach(function (stack, si) {
      stack.forEach(function (item) {
        if (!item.removed && item.isOpen) {
          var el = Game.render.getCardEl(item.uid);
          if (el) {
            el.classList.add("is-open");
            Game.state.flipped.push({ stackIdx: si, uid: item.uid, el: el, data: item.data });
          }
        }
      });
    });
  },

  refreshPlayable: function () {
    if (Game.engine.countRemaining() <= 2) return;
    document.querySelectorAll(".stack-card").forEach(function (el) {
      el.classList.remove("playable");
    });
    Game.state.stacks.forEach(function (stack, si) {
      stack.forEach(function (item) {
        if (item.removed || item.isOpen) return;
        var isTop = Game.engine.topCard(si) && Game.engine.topCard(si).card.uid === item.uid;
        if (isTop) {
          var el = Game.render.getCardEl(item.uid);
          if (el && !el.classList.contains("matched")) el.classList.add("playable");
        }
      });
    });
  },

  finishLastPair: function () {
    if (Game.state.endgameBusy || Game.engine.countRemaining() !== 2) return;
    var left = Game.engine.getRemainingCards();
    if (left.length !== 2) return;

    Game.state.endgameBusy = true;
    Game.state.locked = true;

    left.forEach(function (entry) { entry.card.isOpen = true; });

    var board = Game.$("stacks-board");
    board.innerHTML = "";
    Game.render.renderEndgame(board);

    Game.state.flipped = left.map(function (entry) {
      return {
        stackIdx: entry.stackIdx,
        uid: entry.card.uid,
        el: Game.render.getCardEl(entry.card.uid),
        data: entry.card.data
      };
    });

    Game.state.moves++;
    Game.hud.update();

    setTimeout(function () {
      Game.state.endgameBusy = false;
      Game.state.locked = false;
      Game.engine.handleMatch();
    }, 900);
  },

  onCardClick: function (stackIdx, uid, el) {
    if (Game.state.locked && Game.engine.countRemaining() > 2) return;
    if (Game.engine.countRemaining() <= 2) {
      Game.engine.finishLastPair();
      return;
    }
    if (!Game.engine.canClickCard(stackIdx, uid)) return;

    var found = Game.engine.findCard(uid);
    if (!found) return;
    if (!el) el = Game.render.getCardEl(uid);
    if (!el) return;

    found.card.isOpen = true;
    el.classList.remove("playable");
    el.classList.add("is-open");
    if (Game.effects && Game.effects.onFlip) Game.effects.onFlip();
    Game.state.flipped.push({ stackIdx: stackIdx, uid: uid, el: el, data: found.card.data });
    Game.engine.refreshPlayable();

    if (Game.state.flipped.length < 2) return;

    Game.state.moves++;
    Game.hud.update();

    var a = Game.state.flipped[0].data;
    var b = Game.state.flipped[1].data;
    var ok = a.pairId === b.pairId && a.type !== b.type;

    if (ok) setTimeout(function () { Game.engine.handleMatch(); }, 400);
    else setTimeout(function () { Game.engine.handleMiss(); }, 450);
  },

  handleMatch: function () {
    if (Game.effects && Game.effects.onMatch) Game.effects.onMatch();
    Game.state.locked = true;
    var bonus = 100 + Game.state.combo * 25;

    Game.state.flipped.forEach(function (f) {
      if (f.el) f.el.classList.add("matched");
      var found = Game.engine.findCard(f.uid);
      if (found) found.card.removed = true;
    });

    if (Game.state.flipped.length && Game.state.flipped[0].data) {
      Game.facts.showMatch(Game.state.flipped[0].data);
    }

    Game.state.combo++;
    Game.state.score += bonus;
    Game.state.matchedTotal++;
    Game.state.flipped = [];
    Game.hud.update();

    setTimeout(function () {
      document.querySelectorAll(".stack-card.matched").forEach(function (el) {
        el.classList.add("removing");
      });
      setTimeout(function () {
        Game.state.locked = false;
        Game.state.endgameBusy = false;
        Game.render.renderStacks();
        if (Game.state.matchedTotal >= Game.state.pairsInRound) {
          setTimeout(function () { Game.ui.onRoundDone(); }, 400);
        }
      }, 520);
    }, 400);
  },

  handleMiss: function () {
    if (Game.effects && Game.effects.onMiss) Game.effects.onMiss();
    Game.state.locked = true;
    Game.state.combo = 0;
    Game.state.misses++;

    if (Game.state.shieldActive) {
      Game.state.shieldActive = false;
      Game.$("patience-chip").classList.remove("shield-active");
      Game.tools.toast("🔧 Защита сработала — терпение сохранено");
    } else {
      Game.state.patience--;
      if (Game.state.patience <= 0) {
        Game.hud.update();
        setTimeout(function () {
          Game.state.flipped.forEach(function (f) {
            var found = Game.engine.findCard(f.uid);
            if (found) found.card.isOpen = false;
          });
          Game.state.flipped = [];
          Game.state.locked = false;
          Game.render.renderStacks();
          Game.ui.gameOver();
        }, 1000);
        return;
      }
    }

    Game.hud.update();
    setTimeout(function () {
      Game.state.flipped.forEach(function (f) {
        var found = Game.engine.findCard(f.uid);
        if (found) found.card.isOpen = false;
      });
      Game.state.flipped = [];
      Game.state.locked = false;
      Game.render.renderStacks();
    }, 1000);
  }
};
