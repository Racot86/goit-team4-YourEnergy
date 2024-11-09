const useRouter = ()=>{
  const homePage = document.querySelector('.home-page');
  const favoritesPage = document.querySelector('.favorites-page');
  const router = document.querySelector('.router');
  let pathname = window.location.pathname;
  switch (pathname) {
    case '/':
      router.children[0].classList.add('active');
      router.children[1].classList.remove('active');
      homePage.classList.remove('hidden');
      favoritesPage.classList.add('hidden');
      break;
    case '/favorites':
      router.children[0].classList.remove('active');
      router.children[1].classList.add('active');
      homePage.classList.add('hidden');
      favoritesPage.classList.remove('hidden');
      break;
  }
}

// Set up a MutationObserver to watch for changes to the document's title or body
const observer = new MutationObserver(() => {
  useRouter();
});

// Start observing for URL changes
observer.observe(document, { childList: true, subtree: true });