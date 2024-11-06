import { getCategories } from './api-requests';
import createCategoriesMarkup from './markup/categoriesMarkup';


// Ініціалізація основних змінних
let allCategories = [];
const selectedCategoryElement = document.querySelector('.selected-category');
const categoriesList = document.querySelector('.categories-list');
const filterButtons = document.querySelectorAll('.filter-button');

// Функція для завантаження та фільтрації категорій
async function loadAndFilterCategories(filterType = 'all') {
    try {
        // Якщо категорії ще не завантажені, завантажуємо їх один раз
        if (allCategories.length === 0) {
            const { results } = await getCategories();
            allCategories = results;
        }

        // Фільтруємо категорії на основі вибраного типу фільтра
        let filteredCategories = filterType === 'all'
            ? allCategories
            : allCategories.filter(category => category.filter === filterType);

        // Оновлюємо відображення відфільтрованими категоріями
        displayCategories(filteredCategories);
    } catch (error) {
        console.error('Error loading or filtering categories:', error);
    }
}

// Функція для відображення категорій
function displayCategories(categories) {
    const categoriesContainer = document.querySelector('.categories-list');
    categoriesContainer.innerHTML = createCategoriesMarkup(categories);

    // Налаштовуємо стиль кожної картки категорії
  const categoriesItems = document.querySelectorAll('.categories-item');
  categoriesItems.forEach((item, index) => {
    item.style.backgroundImage = `url(${categories[index].imgURL})`;
    item.style.backgroundSize = 'cover';
    item.style.backgroundRepeat = 'no-repeat';
    item.style.backgroundPosition = 'center';
    item.addEventListener('click', openCategory); // Додаємо обробник події для відкриття категорії
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

// Завантажуємо всі категорії за замовчуванням
loadAndFilterCategories('all');

// Функція для оновлення заголовка з вибраною категорією
function updateCategoryTitle(categoryName) {
    selectedCategoryElement.textContent = ` / ${categoryName}`;
}

// Виклик функції для оновлення заголовка при виборі категорії
function openCategory(e) {
  const categoryName = e.currentTarget.dataset.name;
  updateCategoryTitle(categoryName);
  categoriesList.style.display = 'none'; // Приховуємо список категорій
  // Тут можна додати виклик функції для завантаження вправ для вибраної категорії
  console.log(`Вибрана категорія: ${categoryName}`); // Додано для тестування
}

