
import createWorkoutsMarkup from './markup/workoutsMarkup';
import { exerciseRequest } from './api-service';
import { generatePages } from '../partials/components/pagination/PaginationComponent';

let workoutsContainer = document.querySelector('.workouts-container-list');
const paginationCatList = document.querySelector('.workouts-pagination');

let currentFilters = {
  bodypart: '',
  muscles: '',
  equipment: '',
  keyword: '',
};

async function renderWorkoutsByCategory(bodypart = '', muscles = '', equipment = '', keyword = '', page = 1, limit = 8) {
  currentFilters = { bodypart, muscles, equipment, keyword };

  try {
    // генерування URL з усіма фільтрами
    const requestUrl = exerciseRequest(bodypart,muscles,equipment,keyword, page, limit = 8);
    console.log(`Request URL: ${requestUrl}`);

    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }

    const data = await response.json();
    workoutsContainer.innerHTML = createWorkoutsMarkup(data.results);
    console.log(data.totalPages, page)
    setupPagination(data.totalPages, page);

    
    const workoutsItems = document.querySelectorAll('.workouts-item');
    workoutsItems.forEach((item) => {
      item.addEventListener('click', openModalWindow);
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

  paginationCatList.querySelectorAll('.pagination-page').forEach(pageElement => {
    pageElement.addEventListener('click', (e) => {
      const selectedPage = parseInt(pageElement.getAttribute('data-index')) + 1;

      // ререндеринг тренувань для вибраної сторінки, використовуючи збережені фільтри
      renderWorkoutsByCategory(currentFilters.bodypart, currentFilters.muscles, currentFilters.equipment, currentFilters.keyword, selectedPage);
    });
  });
}

function openModalWindow(e) {
  e.target.removeEventListener('click', openModalWindow);
    // Для модального вікна, щоб передати ІД 
  const clickedItem = e.target.closest('.workouts-item');
  const name = clickedItem.dataset.name;
  const id = clickedItem.dataset.id;
  console.log('name:', name, '; id:', id);
}

export default renderWorkoutsByCategory;