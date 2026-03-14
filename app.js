document.addEventListener("DOMContentLoaded", () => {
  const serviceButtons = document.querySelectorAll(".service-btn");
  const problemInput = document.getElementById("problem");
  const contactInput = document.getElementById("contact");
  const sendBtn = document.getElementById("sendBtn");
  const statusEl = document.getElementById("status");

  let selectedServiceKey = null;
  let selectedServiceTitle = null;

  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      serviceButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedServiceKey = btn.dataset.service;
      selectedServiceTitle = btn.textContent.trim();
    });
  });

  sendBtn.addEventListener("click", () => {
    statusEl.textContent = "";

    if (!selectedServiceKey) {
      statusEl.textContent = "Пожалуйста, выберите услугу.";
      statusEl.style.color = "red";
      return;
    }

    if (!problemInput.value.trim()) {
      statusEl.textContent = "Опишите задачу.";
      statusEl.style.color = "red";
      return;
    }

    if (!contactInput.value.trim()) {
      statusEl.textContent = "Укажите телефон для связи.";
      statusEl.style.color = "red";
      return;
    }

    // Здесь потом будет реальный запрос на ваш backend через fetch
    statusEl.textContent = "Заявка отправлена (демо). Мы свяжемся с вами.";
    statusEl.style.color = "green";

    // Можно очистить форму
    // problemInput.value = "";
    // contactInput.value = "";
  });
});
