function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

// Отримання посилання на кнопку та span
const changeColorButton = document.querySelector('button.change-color');
const colorValueSpan = document.querySelector('span.color');

// Додавання обробника події click на кнопку
changeColorButton.addEventListener('click', () => {
  // Генерування випадкового кольору
  const randomColor = getRandomHexColor();

  // Зміна фону body
  document.body.style.backgroundColor = randomColor;

  // Вивід значення кольору у span
  colorValueSpan.textContent = randomColor;
});
