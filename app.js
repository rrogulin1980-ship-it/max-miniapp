// MAX Bridge интеграция
const MAX = window.WebApp || {};
let maxUser = null;

// Инициализация MAX
if (MAX.initDataUnsafe && MAX.initDataUnsafe.user) {
  maxUser = MAX.initDataUnsafe.user;
  console.log('MAX user:', maxUser);
}

// Сообщить MAX о готовности
if (MAX.ready) {
  MAX.ready();
}

// Настройка кнопки «Назад»
if (MAX.BackButton) {
  MAX.BackButton.onClick(() => {
    if (state.step !== 'start') {
      backToServices();
    }
  });
}

// Данные о услугах ООО Геолог
const SERVICES = {
  tech: {
    emoji: '🏗️',
    name: 'Техническое обследование',
    description: 'Оценка состояния конструкций, составление дефектных ведомостей, анализ несущей способности.',
    items: [
      { name: 'Обследование до 100 кв.м', price: '8 000 ₽' },
      { name: 'Обследование 100–500 кв.м', price: '15 000 ₽' },
      { name: 'Обследование свыше 500 кв.м', price: '30 000 ₽' }
    ],
    note: 'Включая фотофиксацию, схемы повреждений, рекомендации по ГОСТ 31937-2024, составление технического заключения.'
  },
  recognitionliving: {
    emoji: '🏠',
    name: 'Признание жилым',
    description: 'Подтверждение соответствия жилых помещений, реконструкций, узаконивание перепланировок.',
    items: [
      { name: 'Квартира', price: '6 000 ₽' },
      { name: 'Загородный дом', price: '8 000 ₽' },
      { name: 'Дом с реконструкцией', price: '12 000 ₽' }
    ],
    note: 'Экспертиза по СП 47, СНиП, соответствие СЭС, МЧС, заключение для Росреестра.'
  },
  emergency: {
    emoji: '⚠️',
    name: 'Аварийность',
    description: 'Установление статуса аварийности, подготовка документов для переселения.',
    items: [
      { name: 'Квартира', price: '8 000 ₽' },
      { name: 'Многоквартирный дом до 5 подъездов', price: '20 000 ₽' },
      { name: 'Многоквартирный дом свыше 5 подъездов', price: '35 000 ₽' }
    ],
    note: 'Заключение для МВК, с расчётами несущей способности, оценкой износа, рекомендациями.'
  },
  judicial: {
    emoji: '⚖️',
    name: 'Судебная экспертиза',
    description: 'Независимая оценка для судебных споров — ущерб, дефекты, причины аварий.',
    items: [
      { name: 'Экспертиза по договору залива/повреждения', price: '12 000 ₽' },
      { name: 'Экспертиза для арбитражного суда', price: '20 000 ₽' },
      { name: 'Рецензирование чужого заключения', price: '8 000 ₽' }
    ],
    note: 'Официальное заключение по СК РФ, фотографии, акт осмотра, заверение экспертом.'
  },
  design: {
    emoji: '📐',
    name: 'Проектирование',
    description: 'Разработка проектов на реконструкцию, усиление, проектов вентиляции.',
    items: [
      { name: 'Проект вентиляции до 150 кв.м', price: '25 000 ₽' },
      { name: 'Проект усиления конструкций', price: '50 000 ₽' },
      { name: 'Разработка проектной документации на реконструкцию', price: '15 000 ₽ за раздел' }
    ],
    note: 'Полный комплект проектной документации, согласование, авторский надзор.'
  },
  constructionlab: {
    emoji: '🧱',
    name: 'Строительная лаборатория',
    description: 'Испытания материалов, грунтов, контроль качества работ.',
    items: [
      { name: 'Испытание кирпича', price: '3 500 ₽' },
      { name: 'Испытание бетона', price: '4 000 ₽' },
      { name: 'Прочность кладки', price: '2 500 ₽' },
      { name: 'Грунтовые испытания', price: '15 000 ₽' }
    ],
    note: 'Лабораторные протоколы, аттестованное оборудование, соответствие ГОСТ.'
  },
  testinglab: {
    emoji: '🔬',
    name: 'Испытательная лаборатория',
    description: 'Акустика, теплотехника, освещённость, климатические параметры.',
    items: [
      { name: 'Акустические измерения звукоизоляции', price: '5 000 ₽' },
      { name: 'Теплотехнические испытания ограждений', price: '3 500 ₽' },
      { name: 'Измерение освещённости', price: '4 000 ₽' },
      { name: 'Комплексные климатические измерения', price: '20 000 ₽' }
    ],
    note: 'Протоколы аккредитованной лаборатории. Результаты для СЭС, проектировщиков.'
  }
};

// Состояние диалога
let state = {
  step: 'start',
  service: null,
  name: '',
  phone: '',
  address: ''
};

const messages = document.getElementById('chatMessages');
const inputArea = document.getElementById('inputArea');
const userInput = document.getElementById('userInput');

// Автопрокрутка вниз
function scrollToBottom() {
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 100);
}

// Добавление сообщения
function addMessage(text, sender = 'bot', buttons = null) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;
  msg.appendChild(bubble);
  
  if (buttons) {
    const btnGroup = document.createElement('div');
    btnGroup.className = 'buttons-group';
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = btn.type === 'back' ? 'btn-back' : 'btn-choice';
      button.textContent = btn.label;
      button.onclick = btn.action;
      btnGroup.appendChild(button);
    });
    msg.appendChild(btnGroup);
  }
  
  messages.appendChild(msg);
  scrollToBottom();
}

// Индикатор набора
function showTyping() {
  const msg = document.createElement('div');
  msg.className = 'message bot';
  msg.id = 'typing';
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<span></span><span></span><span></span>';
  msg.appendChild(indicator);
  messages.appendChild(msg);
  scrollToBottom();
}

function hideTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}

// Старт диалога
function startChat() {
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage('Здравствуйте! Я помогу подобрать услугу для вашего объекта. Выберите интересующее направление:');
    showServiceButtons();
  }, 600);
}

// Кнопки выбора услуг
function showServiceButtons() {
  const btns = Object.keys(SERVICES).map(key => ({
    label: `${SERVICES[key].emoji} ${SERVICES[key].name}`,
    action: () => selectService(key),
    type: 'choice'
  }));
  addMessage('', 'bot', btns);
}

// Выбор услуги
function selectService(key) {
  state.service = key;
  const service = SERVICES[key];
  
  let text = `${service.emoji} ${service.name}\n\n${service.description}\n\nЦены:`;
    // Виброотклик
  if (MAX.HapticFeedback) {
    MAX.HapticFeedback.impactOccurred('light');
  }
  service.items.forEach(item => {
    text += `\n• ${item.name} — ${item.price}`;
requestName  text += `\n\n${service.note}`;
  
  addMessage(text, 'bot', [
    { label: '✅ Оформить заявку', action: requestName, type: 'choice' },
    { label: '📞 Позвонить', action: callPhone, type: 'choice' },
    { label: '↩️ Назад к услугам', action: backToServices, type: 'back' }
  ]);
}

// Звонок
function callPhone() {
  window.location.href = 'tel:+78632000000';
}

// Возврат к услугам
function backToServices() {
  state = { step: 'start', service: null, name: '', phone: '', address: '' };
  addMessage('Выберите услугу:', 'bot');
  showServiceButtons();
}
    // Скрыть кнопку «Назад»
  if (MAX.BackButton) {
    MAX.BackButton.hide();
  }

// Запрос имени
function requestName() {
  state.step = 'name';
  addMessage('Введите ваше имя:', 'bot');
  inputArea.style.display = 'flex';
  userInput.focus();
    // Показать кнопку «Назад» в MAX
  if (MAX.BackButton) {
    MAX.BackButton.show();
  }
}

// Запрос телефона
function requestPhone() {
  state.step = 'phone';
  addMessage('Введите ваш телефон (например, +7 XXX XXX-XX-XX):', 'bot');
}

// Запрос адреса
function requestAddress() {
  state.step = 'address';
  addMessage('Введите адрес объекта:', 'bot');
}

// Отправка текста
function sendText() {
  const text = userInput.value.trim();
  if (!text) return;
  
  addMessage(text, 'user');
  userInput.value = '';
  
  if (state.step === 'name') {
    state.name = text;
    requestPhone();
  } else if (state.step === 'phone') {
    state.phone = text;
    requestAddress();
  } else if (state.step === 'address') {
    state.address = text;
    finishRequest();
  }
}

// Завершение заявки
function finishRequest() {
  inputArea.style.display = 'none';
  const service = SERVICES[state.service];
  
  const summary = `Отлично, ${state.name}!\n\nВаша заявка принята:\n• Услуга: ${service.name}\n• Телефон: ${state.phone}\n• Адрес: ${state.address}\n\nМы свяжемся с вами в ближайшее время для уточнения деталей и согласования выезда специалиста.`;
  
  showTyping();
  
  // Эмуляция отправки на сервер
  setTimeout(() => {
    hideTyping();
        // Успешный виброотклик
    if (MAX.HapticFeedback) {
      MAX.HapticFeedback.notificationOccurred('success');
    }
    const msg = document.createElement('div');
    msg.className = 'message bot';
    const banner = document.createElement('div');
    banner.className = 'success-banner';
    banner.textContent = summary;
    msg.appendChild(banner);
    messages.appendChild(msg);
    scrollToBottom();
    
    // Предложение новой услуги
    setTimeout(() => {
      addMessage('Хотите узнать о других наших услугах?', 'bot', [
        { label: '✅ Да, показать услуги', action: backToServices, type: 'choice' },
        { label: '📞 Позвонить напрямую', action: callPhone, type: 'choice' },
        { label: '❌ Нет, спасибо', action: () => addMessage('Благодарим за обращение! До связи! 👋', 'bot'), type: 'back' }
      ]);
    }, 1200);
  }, 900);
}

// Обработка Enter
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendText();
});

// Запуск при загрузке
startChat();
