import { getCategories } from './api-requests';
import createCategoriesMarkup from './markup/categoriesMarkup';
import { loadCategories } from './categories';
import renderWorkoutsByCategory from './workouts';

// Ініціалізація основних змінних
const selectedCategoryElement = document.querySelector('.selected-category');
const categoriesList = document.querySelector('.categories-list');
const filterButtons = document.querySelectorAll('.filter-button');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');
let activeFilter = 'Muscles'; // початкове значення фільтра за замовчуванням

// 1. Додаємо обробники подій до кнопок фільтрів
filterButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        let filterType = e.target.getAttribute('data-filter');
        if (filterType === 'Body-parts') {
            filterType = 'Body parts';
        }

        console.log("Filter selected:", filterType);

        // Приховуємо пошукову форму і очищаємо вибрану категорію при зміні фільтра
        toggleSearchForm(false);
        selectedCategoryElement.textContent = ''; // Очищаємо вибрану категорію
        categoriesList.style.display = 'block'; // Показуємо список категорій знову

        // Завантажуємо категорії з новим фільтром
        await loadCategoriesForFilter(filterType);

        // Змінюємо активну кнопку
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        activeFilter = filterType;
    });
});

// 2. Функція для завантаження категорій для обраного фільтра
async function loadCategoriesForFilter(filterType) {
    try {
        const data = await getCategories(filterType);
        displayCategories(data.results); // Відображаємо категорії
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Функція для відображення категорій та додавання обробників подій
function displayCategories(categories) {
    categoriesList.innerHTML = createCategoriesMarkup(categories);
    attachCategoryListeners(); // Додаємо обробники подій до кожної картки категорії
}

// Додає обробники подій до кожної категорії
function attachCategoryListeners() {
    const categoriesItems = document.querySelectorAll('.categories-item');
    categoriesItems.forEach(item => {
        item.addEventListener('click', openCategory);
    });
}

// 3. Обробник події для натискання на категорію
function openCategory(e) {
    const categoryName = e.currentTarget.dataset.name;
    selectedCategoryElement.textContent = ` / ${categoryName}`;
    console.log("Selected category:", categoryName);

    categoriesList.style.display = 'none'; // Приховуємо список категорій

    // Завантажуємо вправи для вибраної категорії
    loadExercises(categoryName);
}

// 4. Функція для показу або приховування пошукової форми
function toggleSearchForm(show) {
    if (show) {
        searchForm.style.display = 'block';
        document.querySelector('.filters-panel').classList.add('search-active');
    } else {
        searchForm.style.display = 'none';
        document.querySelector('.filters-panel').classList.remove('search-active');
    }
    console.log("Search form visibility toggled:", show);
}

// 5. Функція для завантаження вправ на основі категорії та ключового слова
async function loadExercises(categoryName, keyword = '') {
    try {
        console.log(`Loading exercises for category: ${categoryName} with keyword: ${keyword}`);

        // Викликаємо renderWorkoutsByCategory і чекаємо на результат
        await renderWorkoutsByCategory(categoryName, '', '', keyword);

        console.log("Exercises loaded successfully");

        toggleSearchForm(true); // Показуємо поле пошуку після успішного завантаження вправ

    } catch (error) {
        console.error('Error loading exercises:', error);
        toggleSearchForm(false);
    }
}

// 6. Ініціалізація: Завантажуємо всі категорії для початкового фільтра на старті
loadCategoriesForFilter(activeFilter);

// 7. Обробник події для форми пошуку
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
