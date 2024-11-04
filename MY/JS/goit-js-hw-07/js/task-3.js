// Получаем ссылки на элементы
const nameInput = document.querySelector('#name-input');
const nameOutput = document.querySelector('#name-output');

// Добавляем слушатель события input
nameInput.addEventListener('input', event => {
  // Получаем значение из поля ввода и удаляем пробелы по краям
  const inputValue = event.target.value.trim();
  
  // Если поле пустое - выводим 'Anonymous', иначе - введенное значение
  nameOutput.textContent = inputValue === '' ? 'Anonymous' : inputValue;
});
