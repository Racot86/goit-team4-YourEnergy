const loginForm = document.querySelector('.login-form');

// Додавання слухача події submit на форму
loginForm.addEventListener('submit', event => {
  // Запобігання перезавантаженню сторінки при сабміті
  event.preventDefault();

  // Одержання елементів форми
  const { email, password } = event.currentTarget.elements;

  // Очищення значеннь email і password від пробілів
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  // Перевірка, чи всі поля заповнені
  if (!emailValue || !passwordValue) {
    alert('All form fields must be filled in');
    return;
  }

  // Створення об'єкта з даними
  const formData = {
    email: emailValue,
    password: passwordValue,
  };

  // Виведення об'єкта у консоль
  console.log(formData);

  // Очищення поля форми
  loginForm.reset();
});
