window.Game = window.Game || {};

Game.render = {
  buildCardBtn: function (si, item, opts) {
    opts = opts || {};
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "stack-card" + (opts.endgame ? " endgame-card" : "");
    btn.dataset.uid = String(item.uid);
    btn.style.setProperty("--layer", opts.layer != null ? opts.layer : 0);
    btn.style.zIndex = String(opts.zIndex != null ? opts.zIndex : 1);

    if (!item.isOpen) btn.classList.add("playable");
    if (item.isOpen) btn.classList.add("is-open");

    var d = item.data;
    var isProd = d.type === "product";
    var meta = Game.getPairMeta(d.pairId);
    var cat = d.category || meta.category;
    var catLabel = Game.CONFIG.CATEGORY_LABELS[cat] || "";
    var catEmoji = Game.CONFIG.CATEGORY_EMOJI[cat] || "✦";
    var gid = d.pairId + item.uid;
    var backClass = "back-" + (item.backStyle || "willow");

    var frontHtml;
    if (isProd) {
      frontHtml =
        '<div class="card-side card-front is-product cat-' + cat + '">' +
          '<span class="cat-badge">' + catLabel + '</span>' +
          '<div class="icon-wrap">' + Game.getSvg(d.pairId, gid) + '</div>' +
          '<span class="lbl">' + d.title + '</span>' +
        '</div>';
    } else {
      frontHtml =
        '<div class="card-side card-front is-purpose cat-' + cat + '">' +
          '<span class="cat-badge">' + catLabel + '</span>' +
          '<div class="purpose-head"><span>' + catEmoji + '</span></div>' +
          '<span class="lbl">' + d.purpose + '</span>' +
        '</div>';
    }

    btn.innerHTML =
      '<div class="card-body">' +
        '<div class="card-side card-back ' + backClass + '"><span class="card-back-mark">🧵</span></div>' +
        frontHtml +
      '</div>';

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      Game.engine.onCardClick(si, item.uid, btn);
    });
    return btn;
  },

  renderEndgame: function (board) {
    board.classList.add("endgame-board");
    var remaining = Game.engine.getRemainingCards();
    var cardH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--card-w")) * 1.34;

    remaining.forEach(function (entry, idx) {
      var col = document.createElement("div");
      col.className = "stack-col endgame-col";
      col.style.height = cardH + "px";
      col.appendChild(Game.render.buildCardBtn(entry.stackIdx, entry.card, { endgame: true, zIndex: 10 + idx }));
      board.appendChild(col);
    });
  },

  getPyramidRows: function (count) {
    /* Мобильная пирамида: 1 — 2 — 3 стопки в ряд */
    if (window.matchMedia("(max-width: 640px)").matches && count <= 6) {
      if (count === 6) return [1, 2, 3];
      if (count === 5) return [1, 2, 2];
      if (count === 4) return [1, 2, 1];
      if (count === 3) return [1, 2];
      if (count === 2) return [1, 1];
      return [1];
    }

    var rows = [];
    var remaining = count;
    var rowSize = 1;
    while (remaining > 0) {
      rows.push(Math.min(rowSize, remaining));
      remaining -= Math.min(rowSize, remaining);
      rowSize++;
    }
    return rows;
  },

  appendStackCol: function (si, offsetY) {
    var stack = Game.state.stacks[si];
    var col = document.createElement("div");
    col.className = "stack-col";
    var activeCards = stack.filter(function (c) { return !c.removed; });
    var cardH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--card-w")) * 1.34;
    col.style.height = (cardH + (activeCards.length - 1) * offsetY + 4) + "px";

    var visualLayer = 0;
    activeCards.forEach(function (item) {
      var btn = Game.render.buildCardBtn(si, item, { layer: visualLayer, zIndex: visualLayer + 1 });
      var isTop = Game.engine.topCard(si) && Game.engine.topCard(si).card.uid === item.uid;
      if (!item.isOpen && isTop) btn.classList.add("playable");
      else if (!item.isOpen) btn.classList.remove("playable");
      col.appendChild(btn);
      visualLayer++;
    });
    return col;
  },

  renderStacks: function () {
    var board = Game.$("stacks-board");
    board.innerHTML = "";
    var left = Game.engine.countRemaining();
    var cfg = Game.state.rounds[Game.state.roundIdx];
    if (cfg && cfg.flipMs) {
      document.documentElement.style.setProperty("--flip", (cfg.flipMs / 1000) + "s");
    }

    if (left <= 2 && left > 0) {
      board.classList.remove("stacks-board--pyramid");
      Game.render.renderEndgame(board);
      Game.engine.syncFlippedFromState();
      setTimeout(function () { Game.engine.finishLastPair(); }, 120);
      return;
    }

    board.classList.remove("endgame-board");
    var stackCount = Game.state.stacks.length;
    board.dataset.stacks = stackCount >= 7 ? "many" : String(stackCount);
    board.classList.add("stacks-board--pyramid");
    var offsetY = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--stack-y"))
      || Game.CONFIG.STACK_OFFSET_Y;
    var pyramid = Game.render.getPyramidRows(stackCount);
    var stackIdx = 0;

    pyramid.forEach(function (colsInRow) {
      var row = document.createElement("div");
      row.className = "stacks-row";
      for (var c = 0; c < colsInRow; c++) {
        row.appendChild(Game.render.appendStackCol(stackIdx, offsetY));
        stackIdx++;
      }
      board.appendChild(row);
    });

    Game.engine.syncFlippedFromState();
    Game.engine.refreshPlayable();
  },

  getCardEl: function (uid) {
    return document.querySelector('.stack-card[data-uid="' + uid + '"]');
  }
};
