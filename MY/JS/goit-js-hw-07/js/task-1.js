// Елемент ul#categories
const categoriesList = document.querySelector('#categories');

// Всі елементи li з класом item всередині ul#categories
const categoryItems = categoriesList.querySelectorAll('.item');

// Виводимо кількість категорій
console.log(`Number of categories: ${categoryItems.length}`);

// Заголовок і кількість елементів для кожної категорії
categoryItems.forEach(item => {
  const categoryTitle = item.querySelector('h2').textContent;
  const categoryElementsCount = item.querySelectorAll('ul li').length;

  // Виводимо назву категорії і кількість елементів в ній
  console.log(`Category: ${categoryTitle}`);
  console.log(`Elements: ${categoryElementsCount}`);
});