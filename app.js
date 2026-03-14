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

function scrollToBottom() {
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 100);
}

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

function startChat() {
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage('Здравствуйте! Выберите интересующую вас услугу:');
    showServiceButtons();
  }, 800);
}

function showServiceButtons() {
  const btns = Object.keys(SERVICES).map(key => ({
    label: `${SERVICES[key].emoji} ${SERVICES[key].name}`,
    action: () => selectService(key),
    type: 'choice'
  }));
  
  addMessage('', 'bot', btns);
}

function selectService(key) {
  state.service = key;
  const service = SERVICES[key];
  
  let text = `${service.emoji} ${service.name}\n\n${service.description}\n\nЦены:`;
  service.items.forEach(item => {
    text += `\n• ${item.name} — ${item.price}`;
  });
  text += `\n\n${service.note}`;
  
  addMessage(text, 'bot', [
    { label: '✅ Оформить заявку', action: requestName, type: 'choice' },
    { label: '↩️ Назад к услугам', action: backToServices, type: 'back' }
  ]);
}

function backToServices() {
  state = { step: 'start', service: null, name: '', phone: '', address: '' };
  addMessage('Выберите услугу:', 'bot');
  showServiceButtons();
}

function requestName() {
  state.step = 'name';
  addMessage('Введите ваше имя:', 'bot');
  inputArea.style.display = 'flex';
  userInput.focus();
}

function requestPhone() {
  state.step = 'phone';
  addMessage('Введите ваш телефон:', 'bot');
}

function requestAddress() {
  state.step = 'address';
  addMessage('Введите адрес объекта:', 'bot');
}

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

function finishRequest() {
  inputArea.style.display = 'none';
  
  const service = SERVICES[state.service];
  const summary = `Спасибо, ${state.name}!\n\nВаша заявка принята:\n• Услуга: ${service.name}\n• Телефон: ${state.phone}\n• Адрес: ${state.address}\n\nМы свяжемся с вами в ближайшее время для уточнения деталей.`;
  
  showTyping();
  setTimeout(() => {
    hideTyping();
    const msg = document.createElement('div');
    msg.className = 'message bot';
    const banner = document.createElement('div');
    banner.className = 'success-banner';
    banner.textContent = summary;
    msg.appendChild(banner);
    messages.appendChild(msg);
    scrollToBottom();
    
    setTimeout(() => {
      addMessage('Хотите выбрать другую услугу?', 'bot', [
        { label: '✅ Да', action: backToServices, type: 'choice' },
        { label: '❌ Нет, спасибо', action: () => addMessage('Благодарим за обращение!', 'bot'), type: 'back' }
      ]);
    }, 1500);
  }, 1000);
}

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendText();
});

startChat();
