import createWorkoutsMarkup from './markup/workoutsMarkup';
import { exerciseRequest } from './api-service';

let workoutsContainer = document.querySelector('.workouts-container');

async function renderWorkoutsByCategory(bodypart = '', muscles = '' , equipment = '', keyword = '', page = 1, limit = 10) {
  try {
    const requestUrl = exerciseRequest(bodypart, muscles,equipment,keyword, page, limit);
    console.log(requestUrl)

    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }
    
    const data = await response.json();

    workoutsContainer.innerHTML = createWorkoutsMarkup(data.results);

    console.log(workoutsContainer)

  } catch (error) {
    console.error('Error loading workouts:', error);
  }
}

export default renderWorkoutsByCategory;
