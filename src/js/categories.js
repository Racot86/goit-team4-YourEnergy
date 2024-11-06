import axios from 'axios';
import { filtersUrl } from './api-service';
import createCategoriesMarkup from './markup/categoriesMarkup'

let categoriesList = document.querySelector('.categories-list');



async function getCategories() {
  const { data } = await axios.get(`${filtersUrl()}`);
  categoriesList.innerHTML = createCategoriesMarkup(data.results);
  let categoriesItem = document.querySelectorAll('.categories-item');
  categoriesItem.forEach((item, index) => {
    item.style.backgroundImage = `url(${data.results[index].imgURL})`;
    item.style.backgroundSize = 'cover';
    item.style.backgroundRepeat = 'no-repeat';
    item.style.backgroundPosition = 'center';
    item.addEventListener('click', openCategory);
  });
  return data; 
}


function openCategory() {
    console.log('dfd') // логіка відкриття вправ по категорії
}



getCategories()