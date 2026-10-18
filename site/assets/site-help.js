const en = new URLSearchParams(location.search).get('lang') === 'en' || /\/en\//.test(location.pathname);
const words = en ? {
  title: 'Explore history on the map', eyebrow: 'A quick guide', intro: 'Choose a time, explore a place, and discover what happened elsewhere in the world.',
  open: 'How to use this site', close: 'Close the guide', start: 'Start exploring', note: 'You can open this guide again with the ? button beside the site title.',
  cards: [
    ['Move around the world', 'Drag the globe or map to move it. Use the mouse wheel, a pinch gesture or + / − to zoom. The view buttons at the top switch between the globe, flat map and rulers. If 3D is unavailable, use the flat map.'],
    ['Choose a time', 'Drag the timeline at the bottom left or right to change the year. The Millennia, Centuries, Decades and Years buttons change its scale. ▶ advances time automatically; press it again to pause. It does not play a video.'],
    ['Open events and people', 'Click a marker on the map or an item in the right panel to open its card. Select a country to see information about it at that time. Close the card with × or Escape.'],
    ['Find what interests you', 'Use the magnifying glass or / to search for an event, person or country. The right-panel filters select topics. The ±10, ±25, ±50 and ±100 buttons control which nearby years appear together.'],
    ['Take a historical tour', 'Open Tours at the top and click Start on a story. A panel explains each step while the year and map position change automatically. Use Pause, Previous and Next, or click a step dot. These are text-and-map stories, without recorded narration.'],
    ['Make the atlas yours', 'The theme buttons change the appearance; the language button switches Russian and English. The gear opens personal settings. The Suggestions for improvement button opens Telegram.']
  ]
} : {
  title: 'Как пользоваться историческим глобусом', eyebrow: 'Быстрое знакомство', intro: 'Выбирайте время, изучайте места и узнавайте, что в тот же момент происходило в других частях мира.',
  open: 'Как пользоваться сайтом', close: 'Закрыть инструкцию', start: 'Начать изучение', note: 'Инструкцию всегда можно открыть кнопкой ? рядом с названием сайта.',
  cards: [
    ['Перемещайтесь по миру', 'Зажмите карту или глобус и потяните в нужную сторону. Масштаб меняется колёсиком мыши, жестом двумя пальцами или кнопками + / −. Кнопки вида сверху переключают глобус, плоскую карту и правителей. Если 3D недоступен, выберите плоскую карту.'],
    ['Выбирайте время', 'Перетаскивайте нижнюю шкалу влево или вправо, чтобы менять год. Кнопки «Тысячелетия», «Века», «Десятилетия» и «Годы» меняют её масштаб. ▶ автоматически продвигает время; повторное нажатие ставит его на паузу. Это не запуск видеоролика.'],
    ['Открывайте события и людей', 'Нажмите на метку на карте или запись в правой панели: откроется карточка с описанием. Нажмите на государство, чтобы изучить его в выбранный момент. Карточка закрывается крестиком × или клавишей Esc.'],
    ['Находите нужное', 'Лупа сверху или клавиша / открывают поиск событий, людей и государств. Фильтры справа позволяют выбрать темы. Кнопки ±10, ±25, ±50 и ±100 задают, за сколько лет до и после выбранного года показывать события.'],
    ['Запускайте исторические туры', 'Откройте «Туры» сверху и нажмите «Начать» на интересующей истории. Появится панель с пояснениями, а год и положение карты будут меняться автоматически. Можно поставить паузу, перейти назад или вперёд, нажать на точку нужного шага. Туры состоят из текста и карты, без записанной озвучки.'],
    ['Настройте сайт под себя', 'Кнопки темы меняют оформление, EN / RU — язык. Шестерёнка открывает персональные настройки. Через «Предложения по улучшению» можно написать в Telegram.']
  ]
};

const seenKey = 'histoglobus.help.seen.v1';
const dialog = document.createElement('dialog');
dialog.className = 'hg-help';
dialog.setAttribute('aria-labelledby', 'hg-help-title');
dialog.innerHTML = `<header class="hg-help-head"><div><span class="hg-help-eyebrow">${words.eyebrow}</span><h1 id="hg-help-title">${words.title}</h1></div><button type="button" class="hg-help-close" aria-label="${words.close}">×</button></header><p class="hg-help-intro">${words.intro}</p><div class="hg-help-grid">${words.cards.map(([title, text], i) => `<section><span class="hg-help-number">${String(i + 1).padStart(2, '0')}</span><h2>${title}</h2><p>${text}</p></section>`).join('')}</div><footer class="hg-help-footer"><p>${words.note}</p><button type="button" class="hg-help-start">${words.start}</button></footer>`;
document.body.append(dialog);

let opener;
let returnFocus;
function showHelp(manual = false) {
  if (dialog.open) return;
  returnFocus = manual ? opener : document.activeElement;
  dialog.showModal();
  dialog.scrollTop = 0;
  dialog.querySelector('.hg-help-close').focus();
}
function closeHelp() { dialog.close(); }
dialog.querySelector('.hg-help-close').addEventListener('click', closeHelp);
dialog.querySelector('.hg-help-start').addEventListener('click', closeHelp);
dialog.addEventListener('close', () => {
  try { localStorage.setItem(seenKey, '1'); } catch {}
  if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeHelp();
});

function attachGuide() {
  const brand = document.querySelector('.brand');
  if (!brand) return false;
  opener = document.createElement('button');
  opener.type = 'button';
  opener.className = 'hg-help-open';
  opener.textContent = '?';
  opener.title = words.open;
  opener.setAttribute('aria-label', words.open);
  opener.setAttribute('aria-haspopup', 'dialog');
  opener.addEventListener('click', () => showHelp(true));
  brand.append(opener);
  let seen = false;
  try { seen = localStorage.getItem(seenKey) === '1'; } catch {}
  // Shared tour links should begin with the selected story rather than an overlay.
  if (!seen && !new URLSearchParams(location.search).has('tour')) showHelp();
  return true;
}
if (!attachGuide()) {
  const observer = new MutationObserver(() => {
    if (attachGuide()) observer.disconnect();
  });
  observer.observe(document.getElementById('root'), {childList: true, subtree: true});
}
