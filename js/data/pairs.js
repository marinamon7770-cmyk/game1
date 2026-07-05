window.Game = window.Game || {};

Game.PAIRS = [
  { id: "storage", category: "home", title: "Корзина для хранения", purpose: "Для пледов, игрушек и домашних мелочей", fact: "Плетёные корзины организуют хранение и добавляют интерьеру тепла.", emoji: "🧺" },
  { id: "bag", category: "outdoor", title: "Сумка-шопер", purpose: "Для покупок, прогулок и поездок", fact: "Сумки из лозы прочнее пакетов и удобны в дороге.", emoji: "👜" },
  { id: "panel", category: "decor", title: "Настенное панно", purpose: "Для уюта и декора стены", fact: "Панно превращает пустую стену в уютный акцент.", emoji: "🖼️" },
  { id: "breadbox", category: "kitchen", title: "Хлебница", purpose: "Для хранения хлеба и выпечки", fact: "Хлебница из лозы сохраняет свежесть выпечки.", emoji: "🥖" },
  { id: "tray", category: "kitchen", title: "Плетёный поднос", purpose: "Для красивой сервировки и завтраков", fact: "Поднос делает завтрак особенным.", emoji: "☕" },
  { id: "organizer", category: "home", title: "Органайзер", purpose: "Для порядка на рабочем столе", fact: "Органайзер собирает канцелярию в одном месте.", emoji: "📋" },
  { id: "picnic", category: "outdoor", title: "Корзина для пикника", purpose: "Для отдыха на природе и пикников", fact: "Пикниковая корзина — must-have для дачи.", emoji: "🧺" },
  { id: "planter", category: "outdoor", title: "Кашпо", purpose: "Для комнатных растений и зелени", fact: "Плетёное кашпо подчёркивает красоту растений.", emoji: "🪴" },
  { id: "lamp", category: "light", title: "Плетёный абажур", purpose: "Для мягкого света и атмосферы", fact: "Абажур из натуральных материалов даёт тёплый рассеянный свет.", emoji: "💡" },
  { id: "coaster", category: "kitchen", title: "Подставки под чашки", purpose: "Для чайной церемонии и кофе", fact: "Плетёные подставки защищают стол и украшают чаепитие.", emoji: "🍵" },
  { id: "mirror", category: "decor", title: "Зеркало в оправе", purpose: "Для света и визуального простора", fact: "Плетёная оправа делает зеркало декоративным акцентом.", emoji: "🪞" },
  { id: "magazine", category: "home", title: "Короб для журналов", purpose: "Для аккуратного хранения книг и журналов", fact: "Короб из лозы убирает беспорядок в гостиной.", emoji: "📚" }
];

Game.SVG = {
  storage: '<svg viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F5E6CC"/><stop offset="100%" stop-color="#A08058"/></linearGradient><filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity=".25"/></filter></defs><ellipse cx="32" cy="54" rx="22" ry="4" fill="#2a1810" opacity=".2"/><rect x="10" y="22" width="44" height="30" rx="4" fill="url(#g)" stroke="#6B4423" stroke-width="1.2" filter="url(#sh)"/><path d="M16 22 Q16 10 32 7 Q48 10 48 22" fill="none" stroke="#5C3820" stroke-width="1.8"/></svg>',
  bag: '<svg viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FAF0E0"/><stop offset="100%" stop-color="#C4A070"/></linearGradient></defs><ellipse cx="32" cy="56" rx="18" ry="3" fill="#2a1810" opacity=".2"/><path d="M20 28 L17 52 Q32 57 47 52 L44 28 Z" fill="url(#g)" stroke="#6B4423" stroke-width="1.2"/><path d="M22 26 Q32 14 42 26" fill="none" stroke="#5C3820" stroke-width="1.6"/></svg>',
  panel: '<svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="38" rx="3" fill="#F3E8D8" stroke="#6B4423" stroke-width="1.2"/><circle cx="32" cy="10" r="2.5" fill="#D4A853"/><path d="M14 26 Q32 32 50 26" stroke="#C4704A" stroke-width="2" fill="none"/><path d="M14 36 Q32 42 50 36" stroke="#7A8450" stroke-width="2" fill="none"/><path d="M14 46 Q32 50 50 46" stroke="#A08058" stroke-width="1.5" fill="none"/></svg>',
  breadbox: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="54" rx="20" ry="3" fill="#2a1810" opacity=".15"/><path d="M14 34 Q14 50 32 52 Q50 50 50 34" fill="#C4704A" stroke="#6B4423" stroke-width="1.2"/><ellipse cx="32" cy="32" rx="18" ry="6" fill="#F3E8D8" stroke="#6B4423" stroke-width="1"/><path d="M20 30 Q32 26 44 30" stroke="#A08058" stroke-width="1" fill="none"/></svg>',
  tray: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="26" ry="14" fill="#D4BC96" stroke="#6B4423" stroke-width="1.2"/><ellipse cx="32" cy="37" rx="20" ry="9" fill="#E8D5B5" stroke="#A85A38" stroke-width=".8" opacity=".6"/><ellipse cx="32" cy="54" rx="22" ry="3" fill="#2a1810" opacity=".15"/></svg>',
  organizer: '<svg viewBox="0 0 64 64"><rect x="10" y="22" width="44" height="30" rx="3" fill="#F3E8D8" stroke="#6B4423" stroke-width="1.2"/><line x1="10" y1="32" x2="54" y2="32" stroke="#6B4423" stroke-width="1"/><line x1="10" y1="42" x2="54" y2="42" stroke="#6B4423" stroke-width="1"/><line x1="30" y1="22" x2="30" y2="52" stroke="#6B4423" stroke-width="1"/></svg>',
  picnic: '<svg viewBox="0 0 64 64"><path d="M12 30 Q12 48 32 50 Q52 48 52 30" fill="#D4BC96" stroke="#6B4423" stroke-width="1.2"/><path d="M12 30 Q32 36 52 30" fill="#C4704A" stroke="#6B4423"/><path d="M22 30 Q22 16 32 12 Q42 16 42 30" fill="none" stroke="#5C3820" stroke-width="1.6"/></svg>',
  planter: '<svg viewBox="0 0 64 64"><path d="M18 38 L14 50 Q32 55 50 50 L46 38 Z" fill="#D4BC96" stroke="#6B4423" stroke-width="1.2"/><ellipse cx="32" cy="34" rx="12" ry="8" fill="#5A7A4A"/><circle cx="28" cy="28" r="5" fill="#7A9A5A"/><circle cx="38" cy="26" r="6" fill="#4A6A3A"/></svg>',
  lamp: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="50" rx="16" ry="5" fill="#D4BC96" stroke="#6B4423" stroke-width="1"/><path d="M24 50 L27 22 Q32 18 37 22 L40 50 Z" fill="#F3E8D8" stroke="#6B4423" stroke-width="1.2"/><ellipse cx="32" cy="22" rx="9" ry="3" fill="#FFF8E8" stroke="#D4A853" stroke-width=".8"/><circle cx="32" cy="30" r="6" fill="#D4A853" opacity=".35"/></svg>',
  coaster: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="24" ry="10" fill="#E8D5B5" stroke="#6B4423" stroke-width="1.2"/><ellipse cx="32" cy="36" rx="16" ry="6" fill="none" stroke="#C4704A" stroke-width="1" opacity=".5"/><circle cx="32" cy="36" r="5" fill="#C4704A" opacity=".25"/></svg>',
  mirror: '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="20" ry="24" fill="#E8EEF5" stroke="#6B4423" stroke-width="2"/><ellipse cx="32" cy="34" rx="14" ry="17" fill="#D0DCE8" opacity=".6"/><path d="M28 58 L32 52 L36 58" fill="#A08058" stroke="#6B4423"/></svg>',
  magazine: '<svg viewBox="0 0 64 64"><rect x="14" y="18" width="36" height="32" rx="2" fill="#D4BC96" stroke="#6B4423" stroke-width="1.2"/><rect x="18" y="22" width="8" height="24" rx="1" fill="#F3E8D8" stroke="#A08058"/><rect x="28" y="22" width="8" height="24" rx="1" fill="#E8D5B5" stroke="#A08058"/><rect x="38" y="22" width="8" height="24" rx="1" fill="#F3E8D8" stroke="#A08058"/></svg>'
};

Game.getSvg = function (pairId, uid) {
  var raw = Game.SVG[pairId] || Game.SVG.storage;
  return raw.replace(/id="([^"]+)"/g, 'id="$1-' + uid + '"')
    .replace(/url\(#([^)]+)\)/g, 'url(#$1-' + uid + ')');
};

Game.getPairMeta = function (pairId) {
  for (var i = 0; i < Game.PAIRS.length; i++) {
    if (Game.PAIRS[i].id === pairId) return Game.PAIRS[i];
  }
  return Game.PAIRS[0];
};
