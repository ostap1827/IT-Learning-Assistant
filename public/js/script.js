document.addEventListener("DOMContentLoaded", function () {
  // Получаем элементы модальных окон и кнопки
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const closeRegisterModal = document.getElementById("closeRegisterModal");
  const showRegisterModal = document.getElementById("showRegisterModal");
  const showLoginModal = document.getElementById("showLoginModal");
  const startBtn = document.getElementById("startBtn");

  // Функция для открытия модального окна
  function openModal(modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Запрещаем прокрутку страницы
  }

  // Функция для закрытия модального окна
  function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Разрешаем прокрутку страницы
  }

  // Обработчики событий для кнопок
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal(loginModal);
  });

  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal(registerModal);
  });

  startBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal(registerModal);
  });

  closeLoginModal.addEventListener("click", function () {
    closeModal(loginModal);
  });

  closeRegisterModal.addEventListener("click", function () {
    closeModal(registerModal);
  });

  showRegisterModal.addEventListener("click", function (e) {
    e.preventDefault();
    closeModal(loginModal);
    openModal(registerModal);
  });

  showLoginModal.addEventListener("click", function (e) {
    e.preventDefault();
    closeModal(registerModal);
    openModal(loginModal);
  });

  // Закрытие модального окна при клике вне его
  window.addEventListener("click", function (e) {
    if (e.target === loginModal) {
      closeModal(loginModal);
    }
    if (e.target === registerModal) {
      closeModal(registerModal);
    }
  });

  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        closeModal(loginModal);
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Помилка входу');
      }
    } catch (error) {
      console.error('Помилка:', error);
      alert('Сталася помилка при вході');
    }
  });

  // document
  //   .getElementById("registerForm")
  //   .addEventListener("submit", function (e) {
  //     e.preventDefault();
  //     // Здесь должна быть логика регистрации
  //     closeModal(registerModal);
  //     // Показываем dashboard после регистрации
  //     window.location.href = "dashboard.html";
  //   });

  // Выход из системы
  document.getElementById("logoutBtn").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "index.html";
  });
});
