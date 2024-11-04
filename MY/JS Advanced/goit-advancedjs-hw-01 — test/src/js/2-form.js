// Об'єкт для збереження даних форми
let formData = {
  email: '',
  message: '',
};

// Елементи DOM
const form = document.querySelector('.feedback-form');
const emailInput = form.elements.email;
const messageInput = form.elements.message;

// Ключ для збереження у локальному сховищі
const STORAGE_KEY = 'feedback-form-state';

// Функція для збереження даних у локальне сховище
function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

// Функція для завантаження даних з локального сховища
function loadFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    formData = JSON.parse(savedData);
    emailInput.value = formData.email || '';
    messageInput.value = formData.message || '';
  }
}

// Функція для оновлення даних форми
function handleInput(event) {
  formData[event.target.name] = event.target.value.trim();
  saveToLocalStorage();
}

// Обробка сабміту форми
function handleSubmit(event) {
  event.preventDefault();

  if (!formData.email || !formData.message) {
    alert('Fill please all fields');
    return;
  }

  console.log('Form Data:', formData);

  // Очищення форми та локального сховища
  form.reset();
  formData = { email: '', message: '' };
  localStorage.removeItem(STORAGE_KEY);
}

// Прослуховування події input на формі
form.addEventListener('input', handleInput);

// Завантаження даних з локального сховища при завантаженні сторінки
window.addEventListener('load', loadFromLocalStorage);

// Обробка сабміту форми
form.addEventListener('submit', handleSubmit);
