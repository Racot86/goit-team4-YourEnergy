import createCategoriesMarkup from './markup/categoriesMarkup';
import renderWorkoutsByCategory from './workouts';
import { getCategories } from './api-requests';
import { generatePages } from './pagination';

let categoriesList = document.querySelector('.categories-list');
let workoutsContainer = document.querySelector('.workouts-container');
const categoriesPagination = document.querySelector('.m-categories .categories-pagination');

export async function loadCategories(currentCategoryName) {
  const categoriesContainer = document.querySelector('.m-categories');
  
  if (categoriesContainer) {
    categoriesContainer.style.display = 'flex';
  }

  try {
    const data = await getCategories(currentCategoryName);
    console.log('Categories data:', data);

    if (categoriesPagination) {
      categoriesPagination.innerHTML = '';
      if (data.totalPages > 1) {
        categoriesPagination.style.display = 'flex';
        categoriesPagination.setAttribute('data-total', data.totalPages);
        categoriesPagination.setAttribute('data-current', 0);
        
        const paginationElement = generatePages(data.totalPages, 0);
        categoriesPagination.appendChild(paginationElement);

        categoriesPagination.querySelectorAll('.pagination-page').forEach(btn => {
          btn.addEventListener('click', handlePagination);
        });
      }
    }
    
    if (categoriesList) {
      categoriesList.innerHTML = createCategoriesMarkup(data.results);
      categoryClickHandler();
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function handlePagination(e) {
  e.preventDefault();
  
  const pageIndex = Number(e.target.dataset.index);
  const page = pageIndex + 1;
  
  const activeFilter = document.querySelector('.filter-button.active');
  const filter = activeFilter ? activeFilter.dataset.filter.replace('-', ' ') : '';

  try {
    const data = await getCategories(filter, page);
    
    if (categoriesList) {
      categoriesList.innerHTML = createCategoriesMarkup(data.results);
      categoryClickHandler();
    }

    if (categoriesPagination) {
      categoriesPagination.setAttribute('data-current', pageIndex);
      
      categoriesPagination.querySelectorAll('.pagination-page').forEach(page => {
        page.classList.remove('selected');
      });
      e.target.classList.add('selected');
    }
  } catch (err) {
    console.error('Error handling pagination:', err);
  }
}

function categoryClickHandler() {
  let categoriesItem = document.querySelectorAll('.categories-item');
  categoriesItem.forEach(item => {
    item.addEventListener('click', openCategory);
  });
}

function openCategory(e) {
  e.preventDefault();
  
  const categoriesContainer = document.querySelector('.m-categories');
  const workoutsSection = document.querySelector('.m-workouts');
  
  if (categoriesContainer && workoutsSection) {
    categoriesContainer.style.display = 'none';
    workoutsSection.style.display = 'flex';
    
    const categoryItem = e.target.closest('.categories-item');
    if (!categoryItem) return;
    
    const categoryName = categoryItem.dataset.name;
    const categoryFilter = categoryItem.dataset.filter;

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
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadCategories('Muscles');
});
