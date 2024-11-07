//import { getCategories} from './api-requests';
//import {getExercises} from '';
//import createCategoriesMarkup from './markup/categoriesMarkup';


// Ініціалізація основних змінних
let allCategories = [];
const selectedCategoryElement = document.querySelector('.selected-category');
const categoriesList = document.querySelector('.categories-list');
const filterButtons = document.querySelectorAll('.filter-button');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

// Функція для початкового завантаження категорій
async function loadCategories() {
  try {
    const data = await getCategories();
    categoriesList.innerHTML = createCategoriesMarkup(data.results);
    allCategories = data.results.map(category => ({
      name: category.name,
      imgURL: category.imgURL,
      filter: category.filter,
    }));

    let categoriesItems = document.querySelectorAll('.categories-item');
    categoriesItems.forEach(item => {
      item.addEventListener('click', openCategory);
    });
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}


   // Функція для фільтрації категорій за вибраним типом
function loadAndFilterCategories(filterType = 'all') {
  const filteredCategories = filterType === 'all'
    ? allCategories
    : allCategories.filter(category => category.filter === filterType);

  displayCategories(filteredCategories);
}
  // Функція для відображення категорій
function displayCategories(categories) {
  categoriesList.innerHTML = createCategoriesMarkup(categories);
  const categoriesItems = document.querySelectorAll('.categories-item');
  categoriesItems.forEach(item => {
    item.addEventListener('click', openCategory);
  });
}

// Додаємо обробники подій до кнопок фільтрів
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const filterType = e.target.getAttribute('data-filter');
        loadAndFilterCategories(filterType);

        // Робимо кнопку активною
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// Обробник події для форми пошуку
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchKeyword = searchInput.value.trim();
  const category = selectedCategoryElement.textContent.trim().split(' / ')[1]; // Беремо поточну категорію
  try {
    const exercises = await getExercises(category, searchKeyword);
    displayExercises(exercises); // Виклик функції для відображення знайдених вправ
  } catch (error) {
    console.error('Error loading exercises:', error);
  }
});

// Функція для оновлення заголовка з вибраною категорією
function openCategory(e) {
  const categoryName = e.currentTarget.dataset.name;
  selectedCategoryElement.textContent = ` / ${categoryName}`;
  categoriesList.style.display = 'none';
  loadExercises(categoryName);
}
// Функція для завантаження вправ на основі категорії та ключового слова
async function loadExercises(categoryName, keyword = '') {
  try {
    const exercises = await getExercises(categoryName, keyword);
    displayExercises(exercises); // Викликаємо функцію відображення знайдених вправ
  } catch (error) {
    console.error('Error loading exercises:', error);
  }
}

// Функція для відображення вправ
function displayExercises(exercises) {
  // Тут додайте розмітку та стилі для відображення знайдених вправ
  console.log('Exercises found:', exercises); // Лог для тестування
}

// Ініціалізація: Завантажуємо всі категорії на старті
loadCategories();

