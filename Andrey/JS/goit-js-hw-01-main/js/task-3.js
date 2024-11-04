// Задача 3. Ширина елемента

function getElementWidth(content, padding, border) {
  // Видалення одиниць вимірювання (px) і перетворення значень в числа
  const contentWidth = parseFloat(content);
  const paddingWidth = parseFloat(padding) * 2; // х2, оскільки падінг зліва і справа
  const borderWidth = parseFloat(border) * 2; // х2, оскільки бордер зліва і справа

  // Загальна ширина
  const totalWidth = contentWidth + paddingWidth + borderWidth;

  return totalWidth;
}


console.log(getElementWidth("50px", "8px", "4px")); // 74
console.log(getElementWidth("60px", "12px", "8.5px")); // 101
console.log(getElementWidth("200px", "0px", "0px")); // 200
