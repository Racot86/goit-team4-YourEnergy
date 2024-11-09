export default function createWorkoutsMarkup(cards) {
  return cards
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      ({ _id, name, burnedCalories, bodyPart, target, gifUrl, rating }) => `
        <li class='workouts-card' data-name='${name}' data-id='${_id}'>
          <div class="card-header">
            <div class="card-header_left-side">
              <span class="label">workout</span>
              <div class="rating-container">
                <span class="rating">${rating}</span>
                <svg
                  class="star"
                  viewBox="0 0 16 16"
                  height="16"
                  width="16"
                  aria-hidden="true"
                >
                  <use x="0" y="0" href="./img/icons.svg#icon-Star"></use>
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
                <svg
                  viewBox="0 0 16 16"
                  height="16"
                  width="16"
                  aria-hidden="true"
                >
                  <use x="0" y="0" href="./img/icons.svg#icon-arrow"></use>
                </svg>
            </button>
          </div>
          <div class="card-content">
                <svg
                  class="card-icon"
                  viewBox="0 0 24 24"
                  height="20"
                  width="24"
                  aria-hidden="true"
                >
                  <use x="0" y="0" href="./img/icons.svg#icon-running"></use>
                </svg>
            <h3 class="title text-overflow">${name}</h3>
          </div>
          <div class="card-footer">
            <ul class="card-footer_items">
              <li class="card-footer_item">Burned calories:: <span class="strong text-overflow item-one">${burnedCalories}</span></li>
              <li class="card-footer_item">Body Part: <span class="strong text-overflow item-two">${bodyPart}</span></li>
              <li class="card-footer_item">Target: <span class="strong text-overflow item-three">${target}</span></li>
            </ul>
          </div>
        </li>`
    )
    .join('');
}
