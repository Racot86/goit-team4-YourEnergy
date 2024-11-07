export default function createCategoriesMarkup(cards) {
    return cards
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(
        ({ filter, name }) =>
          `<li class='categories-item' data-name='${name}' data-filter='${filter}' tabindex="0">         
             <h3 class="categories-item-title">${name}</h3>
             <p class="categories-item-text">${filter}</p>   
          </li>`
      )
      .join('');
  }
  