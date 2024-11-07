export default function createWorkoutsMarkup(cards) {
  return cards
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      ({ _id, filter, name, burnedCalories, bodyPart, target, gifUrl }) => `
        <li class='workouts-item' data-name='${name}' data-filter='${filter}' data-id='${_id}'> 
          <button class="workout-btn">workout</button>
          <p class="workouts-item-start">Start</p>        
          <h3 class="workouts-item-title">${name}</h3>
          <ul class='workouts-items-list'>
              <li class="workouts-items-calories">Calories: ${burnedCalories}</li>
              <li class="workouts-items-body-part">Body Part: ${bodyPart}</li>
              <li class="workouts-items-target">Target: ${target}</li>
          </ul>
        </li>`
    )
    .join('');
}
