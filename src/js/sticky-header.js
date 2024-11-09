const header = document.querySelector('.router');
const body = document.querySelector('body');

let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  
  if (!document.body.hasAttribute('data-user-scrolling')) {
    return;
  }

  header.classList.add('sticky');
  if (scrollTop > 0) {
    if (scrollTop > lastScrollTop) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
  } else {
    header.classList.remove('sticky');
  }
  lastScrollTop = scrollTop;
});

document.addEventListener('wheel', () => {
  document.body.setAttribute('data-user-scrolling', 'true');
  setTimeout(() => {
    document.body.removeAttribute('data-user-scrolling');
  }, 100);
});