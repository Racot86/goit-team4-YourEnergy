import { getCategories } from './api-requests';
import createCategoriesMarkup from './markup/categoriesMarkup';
import {loadCategories} from './categories'


// Ініціалізація основних змінних
let allCategories = [];
const selectedCategoryElement = document.querySelector('.selected-category');
const categoriesList = document.querySelector('.categories-list');
const filterButtons = document.querySelectorAll('.filter-button');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');
const workoutsContainer = document.querySelector('.workouts-container');
let activeFilter = 'Muscles'; // встановимо початкове значення за замовчуванням

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
    });
});

// Додає обробники подій до категорій
function attachCategoryListeners() {
  const categoriesItems = document.querySelectorAll('.categories-item');
  categoriesItems.forEach(item => {
    item.addEventListener('click', openCategory);
  });
}

// Обробник події для форми пошуку
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchKeyword = searchInput.value.trim();
  const category = selectedCategoryElement.textContent.trim().split(' / ')[1];
  try {
    await loadExercises(category, searchKeyword);
  } catch (error) {
    console.error('Error loading exercises:', error);
  }
});

// Функція для оновлення заголовка з вибраною категорією та відображення пошуку
function openCategory(e) {
  const categoryName = e.currentTarget.dataset.name;
  selectedCategoryElement.textContent = ` / ${categoryName}`;
  categoriesList.style.display = 'none';

  // Показуємо поле пошуку, коли обрано категорію
  toggleSearchForm(true);

  loadExercises(categoryName);
}

// Функція для показу або приховування поля пошуку
function toggleSearchForm(show) {
  if (show) {
    searchForm.classList.remove('hidden');
    searchForm.classList.add('visible');
    document.querySelector('.filters-panel').classList.add('search-active');
  } else {
    searchForm.classList.remove('visible');
    searchForm.classList.add('hidden');
    document.querySelector('.filters-panel').classList.remove('search-active');
  }
}

// Функція для завантаження вправ на основі категорії та ключового слова
async function loadExercises(categoryName, keyword = '') {
  try {
    await renderWorkoutsByCategory(categoryName, '', '', keyword);
  } catch (error) {
    console.error('Error loading exercises:', error);
  }
}

// Ініціалізація: Завантажуємо всі категорії на старті
loadCategories();
