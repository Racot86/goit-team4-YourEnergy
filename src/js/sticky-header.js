const header = document.querySelector('.router');
const body = document.querySelector('body');

let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  header.classList.add('sticky');
  const scrollTop = document.documentElement.scrollTop;
if (scrollTop > 0) {
  if (scrollTop > lastScrollTop) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
}else {
  header.classList.remove('sticky');
}
  lastScrollTop = scrollTop; // Update the last scroll position
});