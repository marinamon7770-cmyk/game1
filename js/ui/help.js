window.Game = window.Game || {};

Game.help = {
  sections: [
    {
      title: "Цель игры",
      html: "<p>Найдите все пары: <strong>изделие</strong> (с рисунком) и его <strong>назначение</strong> (с текстом). Пройдите 5 раундов с возрастающей сложностью.</p>"
    },
    {
      title: "Как ходить",
      html:
        "<ol>" +
        "<li>Карточки лежат <strong>стопками</strong> — доступна только верхняя в каждой.</li>" +
        "<li>Нажмите на карту, чтобы перевернуть.</li>" +
        "<li>Откройте две карты за ход: если пара совпала — карты убираются.</li>" +
        "<li>Если не совпали — карты закроются, ход засчитывается.</li>" +
        "<li>Когда останется 2 карты — они откроются и завершат раунд сами.</li>" +
        "</ol>"
    },
    {
      title: "Терпение и промахи",
      html:
        "<p>За каждый <strong>промах</strong> (неверная пара) теряется 1 <strong>🧶 терпение</strong>:</p>" +
        "<ul>" +
        "<li>Мастер — 6 терпения</li>" +
        "<li>Виртуоз — 5</li>" +
        "<li>Легенда — 4</li>" +
        "</ul>" +
        "<p>Когда терпение закончится — игра окончена. Счётчик <strong>Промахи</strong> показывает число ошибок.</p>"
    },
    {
      title: "Очки и комбо",
      html:
        "<p>За каждую верную пару: <strong>100 очков + бонус за комбо</strong> (серия угадываний подряд).</p>" +
        "<p>За прохождение раунда — дополнительные очки. Меньше ходов и промахов — выше итоговый результат.</p>"
    },
    {
      title: "Инструменты мастера",
      html:
        "<ul class=\"help-tools-list\">" +
        "<li><span>✂️</span> <strong>Подсказка</strong> — подсветить верную пару на столе</li>" +
        "<li><span>🪡</span> <strong>Всмотреться</strong> — на секунду показать верхние карты всех стопок</li>" +
        "<li><span>🧵</span> <strong>Укрепить</strong> — вернуть 1 терпение <em>(1 раз за игру)</em></li>" +
        "<li><span>🌾</span> <strong>Передышка</strong> — остановить таймер на 20 сек</li>" +
        "<li><span>🔧</span> <strong>Защита</strong> — следующий промах не отнимет терпение</li>" +
        "<li><span>🫙</span> <strong>Мудрость</strong> — факт о случайном изделии</li>" +
        "</ul>" +
        "<p class=\"help-note\">Большинство инструментов — 1 раз за раунд. Использованные становятся тусклыми.</p>"
    },
    {
      title: "Категории карточек",
      html:
        "<p>Изделия разделены по категориям с цветной полоской: <strong>Дом</strong>, <strong>Декор</strong>, <strong>Кухня</strong>, <strong>Природа</strong>, <strong>Свет</strong>.</p>" +
        "<p>Рубашки карт бывают разных «материалов»: ива, тростник, лоза, лён.</p>"
    },
    {
      title: "Подсказки внизу экрана",
      html: "<p>Полоска «Знаете ли вы?» автоматически меняет факты о разных изделиях каждые несколько секунд. При угадывании пары показывается факт об этом предмете.</p>"
    }
  ],

  renderInto: function (container) {
    if (!container) return;
    container.innerHTML = "";
    var root = document.createElement("div");
    root.className = "help-accordion";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Инструкция к игре");

    Game.help.sections.forEach(function (sec, i) {
      var det = document.createElement("details");
      det.className = "help-item";
      if (i === 0) det.open = true;

      var sum = document.createElement("summary");
      sum.className = "help-summary";
      sum.textContent = sec.title;

      var body = document.createElement("div");
      body.className = "help-content";
      body.innerHTML = sec.html;

      det.appendChild(sum);
      det.appendChild(body);
      root.appendChild(det);
    });

    container.appendChild(root);
  },

  openModal: function () {
    var modal = Game.$("help-modal");
    if (modal) modal.classList.add("show");
  },

  closeModal: function () {
    var modal = Game.$("help-modal");
    if (modal) modal.classList.remove("show");
  },

  init: function () {
    Game.help.renderInto(Game.$("help-inline"));
    Game.help.renderInto(Game.$("help-modal-body"));

    var btnHelp = Game.$("btn-help");
    if (btnHelp) btnHelp.addEventListener("click", Game.help.openModal);

    var btnClose = Game.$("help-modal-close");
    if (btnClose) btnClose.addEventListener("click", Game.help.closeModal);

    var modal = Game.$("help-modal");
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) Game.help.closeModal();
      });
    }
  }
};
