export default function createWorkoutsMarkup(cards) {
  return cards
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      ({ _id, name, burnedCalories, bodyPart, target, gifUrl }) => `
        <li class='workouts-card' data-name='${name}' data-id='${_id}'>
          <div class="card-header">
            <div class="card-header_left-side">
              <span class="label">workout</span>
              <div class="rating-container">
                <span class="rating">5.0</span>
                <svg class="star" width="16" height="16">
                  <use href="./img/icons.svg#icon-Star"></use>
                </svg>
              </div>
              <div class="trash-container hide">
                <svg width="16" height="16">
                  <use href="./img/icons.svg#icon-trash"></use>
                </svg>
              </div>

             </div>
            <button type="button" class="workout-start-btn">
              Start
              <svg width="16" height="16">
                <use href="./img/icons.svg#icon-arrow"></use>
              </svg>
            </button>
          </div>
          <div class="card-content">
            <img class="card-icon" src="./img/running.svg" alt="Card icon">
            <h3 class="title text-overflow">${name}</h3>
          </div>
          <div class="card-footer">
            <ul class="card-footer_items">
              <li class="card-footer_item">Calories: <span class="strong text-overflow item-one">${burnedCalories}</span></li>
              <li class="card-footer_item">Body Part: <span class="strong text-overflow item-two">${bodyPart}</span></li>
              <li class="card-footer_item">Target: <span class="strong text-overflow item-three">${target}</span></li>
            </ul>
          </div>
        </li>`
    )
    .join('');
}
