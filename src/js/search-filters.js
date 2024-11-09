
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
let activeFilter = 'Muscles';

// Додаємо обробники подій до кнопок фільтрів
filterButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        let filterType = e.target.getAttribute('data-filter').replace('-', ' ');
        activeFilter = filterType;

      await loadCategories(filterType);
      // attachCategoryListeners();
        // Робимо кнопку активною
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      updateHeaderTitle(); //clear breadcrumbs
      toggleSearchForm(false);
    });
});

// Обробник події для форми пошуку
searchForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchKeyword = searchInput.value.trim();
  const category = selectedCategoryElement.textContent.trim().split(' / ')[1]; // Беремо поточну категорію
  try {
    //закоментувала бо робить ще раз запит і ламає картки
    //const exercises = await renderWorkoutsByCategory(category, searchKeyword);
    //displayExercises(exercises); // Виклик функції для відображення знайдених вправ
  } catch (error) {
    console.error('Error loading exercises:', error);
  }
});

// Функція для показу або приховування пошукової форми
function toggleSearchForm(isCategory) {
  if (isCategory) {
    searchForm.style.display = 'none'; // Показуємо форму пошуку
  } else {
    searchForm.style.display = 'block'; // Приховуємо форму пошуку
  }
}


// Функція для оновлення заголовка з вибраною категорією
function openCategory(e) {
  const categoryName = e.currentTarget.dataset.name;
  updateHeaderTitle(categoryName);
  selectedCategoryElement.textContent = ` / <span class="breadcrumbs">${categoryName}</span>`;
  categoriesList.style.display = 'none';
  toggleSearchForm(true);
  loadExercises(categoryName);
}

// Функція для оновлення заголовка з обраним фільтром і категорією
export function updateHeaderTitle(categoryName = '') {
  selectedCategoryElement.textContent = categoryName ? ` / ${categoryName}` : '';
}

function attachCategoryListeners() {
  const categoriesItems = document.querySelectorAll('.categories-item');
  categoriesItems.forEach(item => {
    // item.removeEventListener('click', openCategory);
    item.addEventListener('click', openCategory);
  });
}

// Викликаємо `attachCategoryListeners` після завантаження сторінки
document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories(activeFilter);
  attachCategoryListeners(); // Додаємо обробники подій для існуючих категорій
  toggleSearchForm(false); // Приховуємо форму пошуку
});

// Функція для завантаження вправ на основі категорії та ключового слова
async function loadExercises(categoryName, keyword = '') {
  try {
    //закоментувала бо робить ще раз запит і ламає картки
    //const exercises = await renderWorkoutsByCategory(categoryName, keyword);
    //displayExercises(exercises); // Викликаємо функцію відображення знайдених вправ
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
// loadCategories(activeFilter);