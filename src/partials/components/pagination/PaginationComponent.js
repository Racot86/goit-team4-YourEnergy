const paginations = document.querySelectorAll('.pagination');
paginations.forEach(pagination => {
  pagination.innerHTML='';
  if (pagination.hasAttribute('total-pages')){
    const totalPages = parseInt(pagination.getAttribute('total-pages'));
    const currentPage = parseInt(pagination.getAttribute('current-page'));
    let pagesFragment = new DocumentFragment();
    for(let i = 0; i < totalPages; i++) {
      let p = document.createElement('p');
      p.setAttribute('index', i);
      p.innerHTML = i + 1;
      p.classList.add('pagination-page');
      if (i===currentPage){p.classList.add('selected');}
      pagesFragment.appendChild(p);
    }
    pagination.appendChild(pagesFragment);
    pagination.addEventListener('click', async (e) => {
      if (e.target.classList.contains('pagination-page')){
        const pages = pagination.querySelectorAll('.pagination-page');
        pages.forEach(page => {
            page.classList.remove('selected');
        })
        e.target.classList.add('selected');
        e.target.parentElement.setAttribute('current-page', e.target.getAttribute('index'));
      }

    })
  }
})