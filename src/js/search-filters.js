
import renderWorkoutsByCategory from './workouts';
import { getCategories } from './api-requests';
import createCategoriesMarkup from './markup/categoriesMarkup';
import {loadCategories} from './categories'


// Ініціалізація основних змінних
let allCategories = [];
const selectedCategoryElement = document.querySelector('.selected-category');
const categoriesList = document.querySelector('.categories-list');
const filterButtons = document.querySelectorAll('.filter-button');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

// Додаємо обробники подій до кнопок фільтрів
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        let filterType = e.target.getAttribute('data-filter');
        if (filterType === 'Body-parts') {
          filterType = 'Body parts';
        }

        loadCategories(filterType)
        // Робимо кнопку активною
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        updateHeaderTitle();
    });
});

// Обробник події для форми пошуку
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchKeyword = searchInput.value.trim();
  const category = selectedCategoryElement.textContent.trim().split(' / ')[1]; // Беремо поточну категорію
  try {
    const exercises = await renderWorkoutsByCategory(category, searchKeyword);
    displayExercises(exercises); // Виклик функції для відображення знайдених вправ
  } catch (error) {
    console.error('Error loading exercises:', error);
  }
});

// Функція для оновлення заголовка з вибраною категорією
function openCategory(e) {
  const categoryName = e.currentTarget.dataset.name;
  updateHeaderTitle(categoryName);
  selectedCategoryElement.textContent = ` / ${categoryName}`;
  categoriesList.style.display = 'none';
  loadExercises(categoryName);
}

// Функція для оновлення заголовка з обраним фільтром і категорією
function updateHeaderTitle(categoryName = '') {
  selectedCategoryElement.textContent = categoryName ? ` / ${categoryName}` : '';
}

function attachCategoryListeners() {
  const categoriesItems = document.querySelectorAll('.categories-item');
  categoriesItems.forEach(item => {
    item.addEventListener('click', openCategory);
  });
}

// Викликаємо `attachCategoryListeners` після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
  attachCategoryListeners(); // Додаємо обробники подій для існуючих категорій
});

// Функція для завантаження вправ на основі категорії та ключового слова
async function loadExercises(categoryName, keyword = '') {
  try {
    const exercises = await renderWorkoutsByCategory(categoryName, keyword);
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