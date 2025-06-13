// Анимация фоновых шариков
const canvas = document.getElementById('backgroundCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  class Ball {
    constructor() { this.reset(); }
    getPastelColor() {
      const r = Math.floor(Math.random() * 55 + 200);
      const g = Math.floor(Math.random() * 55 + 200);
      const b = Math.floor(Math.random() * 55 + 200);
      return `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 6 + 2;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
      this.opacity = Math.random() * 0.4 + 0.2;
      const pastelColors = [
        `rgba(255, 209, 220, ${this.opacity})`,
        `rgba(208, 242, 255, ${this.opacity})`,
        `rgba(219, 255, 208, ${this.opacity})`,
        `rgba(255, 236, 208, ${this.opacity})`,
        `rgba(236, 208, 255, ${this.opacity})`,
        `rgba(255, 255, 208, ${this.opacity})`,
        `rgba(208, 255, 249, ${this.opacity})`,
        this.getPastelColor()
      ];
      this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      this.originalOpacity = this.opacity;
      this.fadeDirection = Math.random() > 0.5 ? 0.001 : -0.001;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      if (this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) this.reset();
      this.opacity += this.fadeDirection;
      if (this.opacity <= this.originalOpacity - 0.2 || this.opacity >= this.originalOpacity + 0.2) {
        this.fadeDirection *= -1;
      }
      this.color = this.color.replace(/[\d.]+\)$/g, `${this.opacity})`);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  const isMobile = window.innerWidth < 768;
  const balls = Array(isMobile ? 30 : 75).fill().map(() => new Ball());
  function animate() {
    ctx.fillStyle = 'rgba(248, 255, 255, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => { ball.update(); ball.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}
// === Универсальная инициализация модальных окон и кнопок ===
document.addEventListener('DOMContentLoaded', function() {
  // === Потеря соединения ===
  const errorBanner = document.createElement('div');
  errorBanner.id = 'systemErrorBanner';
  errorBanner.textContent = 'Нет соединения с интернетом. Некоторые функции могут быть недоступны.';
  document.body.appendChild(errorBanner);

  window.addEventListener('offline', () => {
    errorBanner.style.display = 'block';
  });
  window.addEventListener('online', () => {
    errorBanner.style.display = 'none';
  });

  // Открытие модального окна анкеты
  const openFormBtn = document.getElementById('openForm');
  if (openFormBtn) {
    openFormBtn.addEventListener('click', function() {
      const modal = document.getElementById('modal');
      if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
      }
    });
  }

  // Открытие модального окна консультации (плавающая кнопка и кнопка в анкете)
  const consultButtons = [
    document.getElementById('floatingConsultButton'),
    document.getElementById('scheduleConsultation')
  ];
  consultButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', function() {
        const modal = document.getElementById('scheduleModal');
        if (modal) {
          modal.style.display = 'flex';
          document.body.classList.add('modal-open');
        }
      });
      // Анимация для плавающей кнопки
      if (button.id === 'floatingConsultButton') {
        button.addEventListener('mouseenter', () => {
          button.style.transform = 'translateY(-5px)';
          button.style.boxShadow = '0 8px 20px rgba(75,174,167,0.3)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.transform = 'translateY(0)';
          button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
      }
    }
  });

  // Открытие калькуляторов (модальных окон расчета стоимости)
  document.querySelectorAll('.calculate-button').forEach(button => {
    button.addEventListener('click', function() {
      const service = button.dataset.service;
      const modalId = `calculate-${service}`;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
      }
    });
  });

  // Закрытие модальных окон по крестику и клику вне окна
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      });
    }
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
    });
  });

  // Открытие модального окна авторизации
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeLoginModal = document.getElementById('closeLoginModal');
  if (loginBtn && loginModal && closeLoginModal) {
    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'flex';
      document.body.classList.add('modal-open');
    });
    closeLoginModal.addEventListener('click', () => {
      loginModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      document.getElementById('loginForm').reset();
      document.getElementById('phoneStep').style.display = '';
      document.getElementById('codeStep').style.display = 'none';
    });
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.getElementById('loginForm').reset();
        document.getElementById('phoneStep').style.display = '';
        document.getElementById('codeStep').style.display = 'none';
      }
    });
  }
  // Логика шагов формы авторизации
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const phoneStep = document.getElementById('phoneStep');
      const codeStep = document.getElementById('codeStep');
      if (phoneStep.style.display !== 'none') {
        phoneStep.style.display = 'none';
        codeStep.style.display = '';
      } else {
        loginModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        loginForm.reset();
        phoneStep.style.display = '';
        codeStep.style.display = 'none';
        alert('Вход выполнен (симуляция)');
      }
    });
  }

  // В конце DOMContentLoaded добавить автозаполнение scheduleDate
  const dateInput = document.getElementById('scheduleDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // === Кастомная валидация и автосохранение для #scheduleForm ===
  const form = document.getElementById('scheduleForm');
  if (!form) return;
  const requiredFields = [
    {id: 'scheduleName', msg: 'Введите имя'},
    {id: 'schedulePhone', msg: 'Введите телефон'},
    {id: 'scheduleDate', msg: 'Выберите дату'},
    {id: 'scheduleTime', msg: 'Выберите время'}
  ];
  // Автосохранение
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(i => {
    if (i.id) i.value = localStorage.getItem(i.id) || i.value;
    i.addEventListener('input', () => {
      if (i.id) localStorage.setItem(i.id, i.value);
      i.classList.remove('error');
      const err = i.parentElement.querySelector('.form-error');
      if (err) err.remove();
    });
  });
  // Показ ошибки
  function showFormError(input, message) {
    input.classList.add('error');
    let error = input.parentElement.querySelector('.form-error');
    if (!error) {
      error = document.createElement('div');
      error.className = 'form-error';
      input.parentElement.appendChild(error);
    }
    error.textContent = message;
  }
  // Submit
  form.addEventListener('submit', async function(e) {
    let valid = true;
    requiredFields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el.value.trim()) {
        showFormError(el, f.msg);
        valid = false;
      }
    });
    // Проверка radio
    const contactMethod = form.querySelector('input[name="contactMethod"]:checked');
    const messenger = form.querySelector('input[name="messenger"]:checked');
    if (!contactMethod) {
      const radios = form.querySelectorAll('input[name="contactMethod"]');
      radios.forEach(r => r.classList.add('error'));
      showFormError(radios[0], 'Выберите способ связи');
      valid = false;
    }
    if (!messenger) {
      const radios = form.querySelectorAll('input[name="messenger"]');
      radios.forEach(r => r.classList.add('error'));
      showFormError(radios[0], 'Выберите мессенджер');
      valid = false;
    }
    if (!valid) {
      e.preventDefault();
      return false;
    }
    // Если всё ок — очищаем localStorage для этих полей
    inputs.forEach(i => { if (i.id) localStorage.removeItem(i.id); });

    // --- Отправка на backend ---
    e.preventDefault();
    const payload = {
      name: document.getElementById('scheduleName').value,
      phone: document.getElementById('schedulePhone').value,
      email: document.getElementById('scheduleEmail').value,
      date: document.getElementById('scheduleDate').value,
      time: document.getElementById('scheduleTime').value,
      contactMethod: form.querySelector('input[name="contactMethod"]:checked').value,
      messenger: form.querySelector('input[name="messenger"]:checked').value,
      comment: document.getElementById('scheduleComment').value
    };
    try {
      const res = await fetch('https://stlogy.onrender.com/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      alert(data.message || 'Заявка отправлена!');
      // Закрыть модалку и сбросить форму
      document.getElementById('scheduleModal').style.display = 'none';
      form.reset();
      document.body.classList.remove('modal-open');
    } catch (err) {
      alert('Ошибка при отправке');
      console.error(err);
    }
  });

  // === Превью выбранных файлов для mainImages и secondaryImages (multiple, ограничение по количеству) ===
  function handleFileInput(className, previewId, getTotalFiles) {
    const input = document.querySelector('input.' + className);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;
    input.addEventListener('change', function() {
      preview.innerHTML = '';
      const files = input.files;
      const totalFiles = getTotalFiles(className, files.length);
      if (files.length > 3) {
        preview.innerHTML = '<div style="color:#c62828; text-align:center; margin:10px 0;">Можно выбрать не более 3 файлов</div>';
        input.value = '';
        return;
      }
      if (totalFiles > 6) {
        preview.innerHTML = '<div style="color:#c62828; text-align:center; margin:10px 0;">Всего можно выбрать не более 6 файлов</div>';
        input.value = '';
        return;
      }
      if (files && files.length > 0) {
        Array.from(files).forEach(file => {
          if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            img.style.display = 'block';
            img.style.margin = '10px auto';
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
          }
          const name = document.createElement('div');
          name.textContent = 'Файл выбран: ' + file.name;
          name.style.fontSize = '0.95em';
          name.style.color = 'var(--accent-color)';
          name.style.textAlign = 'center';
          preview.appendChild(name);
        });
      }
    });
  }
  function getTotalFiles(className, currentCount) {
    const mainInput = document.querySelector('input.mainImages');
    const secondaryInput = document.querySelector('input.secondaryImages');
    let mainCount = mainInput && mainInput.files ? mainInput.files.length : 0;
    let secondaryCount = secondaryInput && secondaryInput.files ? secondaryInput.files.length : 0;
    if (className === 'mainImages') mainCount = currentCount;
    if (className === 'secondaryImages') secondaryCount = currentCount;
    return mainCount + secondaryCount;
  }
  handleFileInput('mainImages', 'mainImagePreview', getTotalFiles);
  handleFileInput('secondaryImages', 'secondaryImagePreview', getTotalFiles);
});

// === Глобальная функция безопасного fetch ===
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Ошибка сервера");
    return await response.json();
  } catch (e) {
    console.error("Ошибка запроса:", e);
    showErrorModal("Не удалось отправить данные. Попробуйте позже или свяжитесь через Telegram.");
    throw e;
  }
}

// === Глобальная функция показа error modal ===
function showErrorModal(msg = "Ошибка") {
  const modal = document.getElementById('globalErrorModal');
  if (!modal) return;
  const p = modal.querySelector('p');
  if (p) p.textContent = msg;
  modal.style.display = 'flex';
} 