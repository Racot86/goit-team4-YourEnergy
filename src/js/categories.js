import createCategoriesMarkup from './markup/categoriesMarkup';
import renderWorkoutsByCategory from './workouts';

import { getCategories } from './api-requests';

let categoriesList = document.querySelector('.categories-list');
let workoutsContainer = document.querySelector('.workouts-container');


async function loadCategories(currentCategoryName) {
  //параметри для фільтру, відображення
  try {
    const data = await getCategories();

    //логіка if для відображення сітки з фільтрами

    categoriesList.innerHTML = createCategoriesMarkup(data.results); // малюємо сітку без фільтрів

    let categoriesItem = document.querySelectorAll('.categories-item');
    categoriesItem.forEach((item, index) => {
      item.style.backgroundImage = `url(${data.results[index].imgURL})`;
      item.style.backgroundSize = 'cover';
      item.style.backgroundRepeat = 'no-repeat';
      item.style.backgroundPosition = 'center';
      item.addEventListener('click', openCategory); // логіка відкриття вправ по категорії
    });
  } catch (error) {
    console.error('Error loading categories:', error); //логіка помилок
  }
}

// логіка відкриття вправ по категорії
function openCategory(e) {
  e.target.removeEventListener('click', openCategory);
  categoriesList.style.display = 'none';
  let categoryName = e.target.dataset.name;
  let categoryFilter = e.target.dataset.filter;

  switch (categoryFilter) {
    case 'Muscles':
      renderWorkoutsByCategory('', encodeURIComponent(categoryName), '', '', 1, 10);
      break;
    case 'Body parts':
      renderWorkoutsByCategory(encodeURIComponent(categoryName), '', '', '', 1, 10);
      break;
    case 'Equipment':
      renderWorkoutsByCategory('', '', encodeURIComponent(categoryName), '', 1, 10);
      break;
  } 

  workoutsContainer.style.display = 'flex';  
}

loadCategories();
