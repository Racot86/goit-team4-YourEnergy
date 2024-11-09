import createWorkoutsMarkup from './markup/workoutsMarkup';
import { exerciseRequest, exerciseUrl } from './api-service';
import { generatePages } from './pagination';
import { ModalWindow } from './modal-window';

let workoutsContainer = document.querySelector('.workouts-container-list');
const workoutsPagination = document.querySelector('.m-workouts .workouts-pagination');

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
      limit
    );
    console.log(`Request URL: ${requestUrl}`);

    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }

    const data = await response.json();
    console.log('Received data:', data);
    
    if (workoutsContainer) {
      workoutsContainer.innerHTML = createWorkoutsMarkup(data.results);
    }

    const workoutsSection = document.querySelector('.workouts-container');
    if (workoutsSection) {
      workoutsSection.style.display = 'flex';
    }

    if (data.totalPages && data.totalPages > 0) {
      setupPagination(data.totalPages, page);
    }

    const startButtons = document.querySelectorAll('.workout-start-btn');
    startButtons.forEach(button => {
      button.addEventListener('click', async e => {
        e.preventDefault();
        const workoutCard = button.closest('.workouts-card');
        const exerciseId = workoutCard.dataset.id;

        try {
          const response = await fetch(`${exerciseUrl()}/${exerciseId}`);
          if (!response.ok) throw new Error('Failed to fetch exercise details');

          const exerciseData = await response.json();

          if (!window.modalWindow) {
            window.modalWindow = new ModalWindow();
          }
          window.modalWindow.open(exerciseData);
        } catch (error) {
          console.error('Error opening modal:', error);
        }
      });
    });

  } catch (error) {
    console.error('Error loading workouts:', error);
  }
}

function setupPagination(totalPages, currentPage) {
  console.log('Setting up pagination:', { totalPages, currentPage });
  
  if (!workoutsPagination) {
    console.error('Pagination container not found');
    return;
  }

  workoutsPagination.innerHTML = '';

  workoutsPagination.style.display = 'flex';

  workoutsPagination.setAttribute('data-total', totalPages);
  workoutsPagination.setAttribute('data-current', currentPage - 1);

  if (totalPages > 1) {
    const paginationElement = generatePages(totalPages, currentPage - 1);
    workoutsPagination.appendChild(paginationElement);

    workoutsPagination.querySelectorAll('.pagination-page').forEach(pageElement => {
      pageElement.addEventListener('click', e => {
        e.preventDefault();
        
        const selectedPage = parseInt(pageElement.getAttribute('data-index')) + 1;
        console.log('Pagination clicked, page:', selectedPage);

        renderWorkoutsByCategory(
          currentFilters.bodypart,
          currentFilters.muscles,
          currentFilters.equipment,
          currentFilters.keyword,
          selectedPage,
          8
        );
      });
    });
  }
}

export default renderWorkoutsByCategory;
