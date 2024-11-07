import createWorkoutsMarkup from './markup/workoutsMarkup';
import { exerciseRequest } from './api-service';

let workoutsContainer = document.querySelector('.workouts-container-list');

async function renderWorkoutsByCategory(bodypart = '', muscles = '' , equipment = '', keyword = '', page = 1, limit = 10) {
  try {
    const requestUrl = exerciseRequest(bodypart,muscles,equipment,keyword, page, limit);

    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }
    
    const data = await response.json();
    workoutsContainer.innerHTML = createWorkoutsMarkup(data.results);

    const workoutsItem = document.querySelectorAll('.workouts-item');
      
    workoutsItem.forEach((item) => {
      item.addEventListener('click', openModalWindow);
    });

  } catch (error) {
    console.error('Error loading workouts:', error);
  }
}

function openModalWindow(e) {
  e.target.removeEventListener('click', openModalWindow);
  /** Для модального вікна, щоб передати ІД */
  const clickedItem = e.target.closest('.workouts-item');
  const name = clickedItem.dataset.name;
  const id = clickedItem.dataset.id;

  console.log('name: ', name, '; id: ', id,);

}

export default renderWorkoutsByCategory;
