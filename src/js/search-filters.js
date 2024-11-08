import { getCategories } from './api-requests';
import createCategoriesMarkup from './markup/categoriesMarkup';
import renderWorkoutsByCategory from './workouts';

// Ініціалізація основних змінних
let allCategories = [];
const selectedCategoryElement = document.querySelector('.selected-category');
const categoriesList = document.querySelector('.categories-list');
const filterButtons = document.querySelectorAll('.filter-button');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');
const workoutsContainer = document.querySelector('.workouts-container');
let activeFilter = 'Muscles'; // встановимо початкове значення за замовчуванням


// Функція для початкового завантаження категорій
// Функція для початкового завантаження категорій
async function loadCategories(filterType = activeFilter) {
  try {
    const data = await getCategories(filterType);
    console.log("Отримані категорії з API:", data.results);

    // Перевіряємо кожен об'єкт на наявність ключів
    data.results.forEach(category => {
      if (!category.name || !category.imgURL || !category.filter) {
        console.warn("Відсутнє поле у категорії:", category);
      }
    });

    allCategories = data.results.map(category => ({
      name: category.name,
      imgURL: category.imgURL,
      filter: category.filter,
    }));
    displayCategories(allCategories); // Викликаємо displayCategories для оновлення інтерфейсу

  } catch (error) {
    console.error('Error loading categories:', error);
  }
}


// Функція для фільтрації категорій за вибраним типом
async function loadAndFilterCategories(filterType) {
  console.log("Значення фільтра:", filterType);

  try {
    console.log("Виконуємо запит до API з фільтром:", filterType); // Додаємо логування
    const data = await getCategories(filterType);

    console.log("Категорії після фільтрації:", data.results); // Лог для перевірки результату

    displayCategories(data.results);

  } catch (error) {
    console.error("Error loading filtered categories:", error);
  }
}


// Функція для відображення категорій
function displayCategories(categories) {
  if (!categories || categories.length === 0) {
    console.warn("Категорії відсутні для відображення.");
    categoriesList.innerHTML = '<p>Категорії не знайдено.</p>';
    return;
  }

  const markup = createCategoriesMarkup(categories);
  console.log("Згенерований HTML для категорій:", markup);

  categoriesList.innerHTML = markup;
  attachCategoryListeners();
}


// Додаємо обробники подій до кнопок фільтрів
filterButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const filterType = e.target.getAttribute('data-filter');
    loadAndFilterCategories(filterType);

    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    activeFilter = filterType;
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
