function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

// Отримання посилань на необхідні елементи
const inputEl = document.querySelector('#controls input');
const createBtn = document.querySelector('[data-create]');
const destroyBtn = document.querySelector('[data-destroy]');
const boxesContainer = document.querySelector('#boxes');

// Функція для створення коробок
function createBoxes(amount) {
  // Очищення попередніх елементів
  boxesContainer.innerHTML = '';

  const boxes = [];
  let boxSize = 30;

  for (let i = 0; i < amount; i += 1) {
    const box = document.createElement('div');
    box.style.width = `${boxSize}px`;
    box.style.height = `${boxSize}px`;
    box.style.backgroundColor = getRandomHexColor();
    boxSize += 10;
    boxes.push(box);
  }

  // Додавання нових елементів у DOM
  boxesContainer.append(...boxes);
}

// Функція для очищення контейнера з коробками
function destroyBoxes() {
  boxesContainer.innerHTML = '';
}

// Додавання слухачів подій на кнопки
createBtn.addEventListener('click', () => {
  const amount = Number(inputEl.value);

  // Валідація кількості елементів (від 1 до 100)
  if (amount >= 1 && amount <= 100) {
    createBoxes(amount);
  } else {
    alert('Please enter a number between 1 and 100.');
  }

  // Очищення значення інпуту після створення елементів
  inputEl.value = '';
});

destroyBtn.addEventListener('click', destroyBoxes);
