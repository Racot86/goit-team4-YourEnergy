import { getCategories } from './api-requests';
import createCategoriesMarkup from './markup/categoriesMarkup';


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
    console.log("Отримані категорії з API:", data.results);

    // Перевіряємо кожен об'єкт на наявність ключів
    data.results.forEach(category => {
      if (!category.name || !category.imgURL || !category.filter) {
        console.warn("Відсутнє поле у категорії:", category);
      }
    });

    categoriesList.innerHTML = createCategoriesMarkup(data.results);
    allCategories = data.results.map(category => ({
      name: category.name,
      imgURL: category.imgURL,
      filter: category.filter,
    }));
    console.log("Збережені категорії в allCategories:", allCategories);

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
  console.log("Значення фільтра:", filterType); // Додаємо логування для перевірки значення фільтра

  const filteredCategories = filterType === 'all'
    ? allCategories
    : allCategories.filter(category =>
        category.filter.toLowerCase() === filterType.toLowerCase()
      );

  console.log("Категорії після фільтрації:", filteredCategories); // Додаємо логування для перевірки результату фільтрації
  displayCategories(filteredCategories);
}



 // Функція для відображення категорій
function displayCategories(categories) {
  console.log("Категорії для відображення:", categories); // Лог для діагностики

  const markup = createCategoriesMarkup(categories);
  console.log("Згенерований HTML для категорій:", markup); // Лог для діагностики

  categoriesList.innerHTML = markup;

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

