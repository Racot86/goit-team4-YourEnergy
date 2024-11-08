import createWorkoutsMarkup from './markup/workoutsMarkup';
import { exerciseRequest, exerciseUrl } from './api-service';
import { generatePages } from '../partials/components/pagination/PaginationComponent';
import { ModalWindow } from './modal-window';

let workoutsContainer = document.querySelector('.workouts-container-list');
const paginationCatList = document.querySelector('.workouts-pagination');

let currentFilters = {
  bodypart: '',
  muscles: '',
  equipment: '',
  keyword: '',
};

async function renderWorkoutsByCategory(
  bodypart = '',
  muscles = '',
  equipment = '',
  keyword = '',
  page = 1,
  limit = 8
) {
  currentFilters = { bodypart, muscles, equipment, keyword };

  try {
    const requestUrl = exerciseRequest(
      bodypart,
      muscles,
      equipment,
      keyword,
      page,
      (limit = 8)
    );
    console.log(`Request URL: ${requestUrl}`);

    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }

    const data = await response.json();
    workoutsContainer.innerHTML = createWorkoutsMarkup(data.results);
    setupPagination(data.totalPages, page);

    // Додаємо обробники для кнопок Start
    const startButtons = document.querySelectorAll('.workouts-item-start');
    startButtons.forEach(button => {
      button.addEventListener('click', openModalWindow);
    });
  } catch (error) {
    console.error('Error loading workouts:', error);
  }
}

function setupPagination(totalPages, currentPage) {
  paginationCatList.innerHTML = '';

  // оновлення атрибутів пагінації
  paginationCatList.setAttribute('data-total', totalPages);
  paginationCatList.setAttribute('data-current', currentPage - 1);

  // створення та додавання елементів пагінації
  paginationCatList.appendChild(generatePages(totalPages, currentPage - 1));

  paginationCatList
    .querySelectorAll('.pagination-page')
    .forEach(pageElement => {
      pageElement.addEventListener('click', e => {
        const selectedPage =
          parseInt(pageElement.getAttribute('data-index')) + 1;

        // ререндеринг тренувань для вибраної сторінки, використовуючи збережені фільтри
        renderWorkoutsByCategory(
          currentFilters.bodypart,
          currentFilters.muscles,
          currentFilters.equipment,
          currentFilters.keyword,
          selectedPage
        );
      });
    });
}

async function openModalWindow(e) {
  e.preventDefault(); // Запобігаємо стандартній поведінці кнопки

  try {
    // Отримуємо ID вправи з батьківського елемента
    const workoutItem = e.target.closest('.workouts-item');
    const exerciseId = workoutItem.dataset.id;

    // Отримуємо дані про вправу з API
    const response = await fetch(`${exerciseUrl()}/${exerciseId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exercise details');
    }

    const exerciseData = await response.json();

    // Створюємо екземпляр модального вікна, якщо він ще не створений
    if (!window.modalWindow) {
      window.modalWindow = new ModalWindow();
    }

    // Відкриваємо модальне вікно з отриманими даними
    window.modalWindow.open(exerciseData);
  } catch (error) {
    console.error('Error opening modal window:', error);
  }
}

export default renderWorkoutsByCategory;
