const header = document.querySelector('.router');


let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  header.classList.add('sticky');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }

  lastScrollTop = scrollTop; // Update the last scroll position
});