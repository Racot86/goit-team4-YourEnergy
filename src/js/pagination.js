export const generatePages = (totalPages, currentPage) => {
  let pagesFragment = new DocumentFragment();
  for(let i = 0; i < totalPages; i++) {
    let p = document.createElement('p');
    p.setAttribute('data-index', i);
    p.innerHTML = i + 1;
    p.classList.add('pagination-page');
    if (i === currentPage) {
      p.classList.add('selected');
    }
    pagesFragment.appendChild(p);
  }
  return pagesFragment;
}

export const initPagination = () => {
  const paginations = document.querySelectorAll('.pagination');

  paginations.forEach(pagination => {
    if (pagination.hasAttribute('data-total')) {
      pagination.innerHTML = '';
      const totalPages = parseInt(pagination.getAttribute('data-total'));
      const currentPage = parseInt(pagination.getAttribute('data-current'));

      pagination.appendChild(generatePages(totalPages, currentPage));
      
      pagination.addEventListener('click', async (e) => {
        if (e.target.classList.contains('pagination-page')) {
          e.preventDefault();
          
          const pages = pagination.querySelectorAll('.pagination-page');
          pages.forEach(page => {
            page.classList.remove('selected');
          });
          e.target.classList.add('selected');
          pagination.setAttribute('data-current', e.target.getAttribute('data-index'));
        }
      });

      const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-total') {
            const newValue = parseInt(pagination.getAttribute('data-total'));
            const currentPage = parseInt(pagination.getAttribute('data-current'));
            pagination.innerHTML = '';
            pagination.appendChild(generatePages(newValue, currentPage));
          }
        }
      });

      observer.observe(pagination, { attributes: true });
    }
  });
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initPagination); 