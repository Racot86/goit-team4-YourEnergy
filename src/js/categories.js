import createCategoriesMarkup from './markup/categoriesMarkup';
import renderWorkoutsByCategory from './workouts';
import { getCategories } from './api-requests';
import { generatePages } from '../partials/components/pagination/PaginationComponent';


let categoriesList = document.querySelector('.categories-list');
let workoutsContainer = document.querySelector('.workouts-container');
const activeFilter = document.querySelector('.filter-button.active');
const paginationCatList = document.querySelector('.categories-pagination');

// console.log(activeFilter)

async function loadCategories(currentCategoryName) {
  //завантаження категорій
  try {
    const data = await getCategories();
    console.log(data);

    paginationCatList.innerHTML = '';
    if (data.totalPages > 1) {
      paginationCatList.appendChild(generatePages(data.totalPages, 0));
      const paginationPage = document.querySelectorAll('.pagination-page');
      paginationPage.forEach(btn =>
        btn.addEventListener('click', handlePagination)
      );
    }
    //логіка if для відображення сітки з фільтрами
    
    categoriesList.innerHTML = createCategoriesMarkup(data.results); // малюємо сітку без фільтрів

    let categoriesItem = document.querySelectorAll('.categories-item');
    categoriesItem.forEach(item => {
      item.addEventListener('click', openCategory); // логіка відкриття вправ по категорії
    });
  } catch (error) {
    console.error('Error loading categories:', error); //логіка помилок
  }
}

async function handlePagination(e) {
  const pageIndex = Number(e.target.dataset.index);
  const page = pageIndex + 1;
  // console.log(page); //получаем индекс нажатой страницы
  const filter = activeFilter.dataset.filter;
  try {
    const data = await getCategories(filter, page);
    categoriesList.innerHTML = createCategoriesMarkup(data.results);
  } catch (err) {
    console.log(err);
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

loadCategories('Musculs');
