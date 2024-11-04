// Задача 1. Генератор slug

function slugify(title) {
  // Приведення рядка до нижнього регістру
  const lowerCaseTitle = title.toLowerCase();

  // Розбивка рядка на слова за пробілами
  const words = lowerCaseTitle.split(' ');

  // Об'єднання слів, розділяючи їх тире
  const slug = words.join('-');

  return slug;
}

console.log(slugify('Arrays for begginers')); // "arrays-for-begginers"
console.log(slugify('English for developer')); // "english-for-developer"
console.log(slugify('Ten secrets of JavaScript')); // "ten-secrets-of-javascript"
console.log(slugify('How to become a JUNIOR developer in TWO WEEKS')); // "how-to-become-a-junior-developer-in-two-weeks"
