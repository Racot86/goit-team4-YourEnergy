export default function createWorkoutsMarkup(cards) {
  return cards
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      ({ _id, name, burnedCalories, bodyPart, target, gifUrl }) => `
        <li class='workouts-item' data-name='${name}' ' data-id='${_id}'> 
          <h4 class="workout-btn">workout</h4>
          <button class="workouts-item-start">Start</button>        
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
