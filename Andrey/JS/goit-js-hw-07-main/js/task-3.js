// Отримання елементів input і span
const nameInput = document.querySelector('#name-input');
const nameOutput = document.querySelector('#name-output');

// Додавання слухача події input
nameInput.addEventListener('input', () => {
  // Очищення значення від пробілів по краях
  const trimmedValue = nameInput.value.trim();

  // Якщо значення порожнє, тоді підставляється 'Anonymous', інакше - trimmedValue
  nameOutput.textContent = trimmedValue === '' ? 'Anonymous' : trimmedValue;
});
