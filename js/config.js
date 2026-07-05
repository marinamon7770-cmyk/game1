window.Game = window.Game || {};

Game.CONFIG = {
  STACK_OFFSET_Y: 12,
  BACK_STYLES: ["willow", "reed", "vine", "linen"],
  CATEGORY_LABELS: {
    home: "Дом",
    decor: "Декор",
    kitchen: "Кухня",
    outdoor: "Природа",
    light: "Свет"
  },
  CATEGORY_EMOJI: {
    home: "🏠",
    decor: "🎨",
    kitchen: "🍞",
    outdoor: "🌿",
    light: "💡"
  },

  /* Сложность: множитель пар и стопок */
  FACT_ROTATE_MS: 8000,
  PAUSE_TOOL_SEC: 20,

  DIFFICULTIES: {
    normal: { label: "Мастер", roundsMul: 1, stacksExtra: 0, flipBonus: 0, patience: 6 },
    hard: { label: "Виртуоз", roundsMul: 1.2, stacksExtra: 1, flipBonus: -0.06, patience: 5 },
    expert: { label: "Легенда", roundsMul: 1.4, stacksExtra: 2, flipBonus: -0.12, patience: 4 }
  },

  BASE_ROUNDS: [
    { pairs: 4, stacks: 5, name: "Ученик", flipMs: 520 },
    { pairs: 6, stacks: 6, name: "Подмастерье", flipMs: 480 },
    { pairs: 8, stacks: 7, name: "Мастер", flipMs: 450 },
    { pairs: 10, stacks: 8, name: "Виртуоз", flipMs: 420 },
    { pairs: 12, stacks: 9, name: "Легенда", flipMs: 390 }
  ]
};

Game.getRounds = function (difficulty) {
  var d = Game.CONFIG.DIFFICULTIES[difficulty] || Game.CONFIG.DIFFICULTIES.normal;
  return Game.CONFIG.BASE_ROUNDS.map(function (r, i) {
    var mul = d.roundsMul;
    var pairs = Math.min(12, Math.round(r.pairs * (i < 2 ? 1 : mul)));
    return {
      pairs: pairs,
      stacks: r.stacks + d.stacksExtra,
      name: r.name,
      flipMs: Math.max(320, r.flipMs + d.flipBonus * 1000)
    };
  });
};
