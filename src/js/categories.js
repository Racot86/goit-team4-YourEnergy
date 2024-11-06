import createCategoriesMarkup from './markup/categoriesMarkup'
import {getCategories} from './api-requestes'

let categoriesList = document.querySelector('.categories-list');



async function loadCategories(currentCategoryName ) { //параметри для фільтру, відображення
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
  


function openCategory() {
    console.log('dfd') // логіка відкриття вправ по категорії
}



loadCategories()