// Router function to handle navigation
function initRouter() {
  // Define the allowed routes
  const allowedPaths = ['/', '/favorites'];

  // Function to handle route changes
  function handleRouteChange() {
    // Check the current path
    const currentPath = window.location.pathname;

    // Redirect to '/' if the current path is not allowed
    if (!allowedPaths.includes(currentPath)) {
      window.history.replaceState({}, '', '/'); // Redirect to root
      renderPageContent('/'); // Render root page content
    } else {
      renderPageContent(currentPath); // Render content for allowed paths
    }
  }

  // Function to render content based on the path
  function renderPageContent(path) {
    const homePage = document.querySelector('.home-page');
    const favoritesPage = document.querySelector('.favorites-page');
    if (path === '/') {
      homePage.classList.remove('hidden');
      favoritesPage.classList.add('hidden');
    } else if (path === '/favorites') {
      homePage.classList.add('hidden');
      favoritesPage.classList.remove('hidden');
    }
  }

  // Override `pushState` and `replaceState` to detect manual URL changes
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    handleRouteChange();
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    handleRouteChange();
  };

  // Listen for back/forward navigation
  window.addEventListener('popstate', handleRouteChange);

  // Initialize the route on page load
  handleRouteChange();
}

// Initialize router
document.addEventListener('DOMContentLoaded', initRouter);



const routerButtons = document.querySelector('.router');
routerButtons.addEventListener('click', (e)=>{

  switch (e.target.innerHTML.toLowerCase()) {
    case 'home':
      routerButtons.children[0].classList.add('active');
      routerButtons.children[1].classList.remove('active');
      break;
      case 'favorites':
        routerButtons.children[0].classList.remove('active');
        routerButtons.children[1].classList.add('active');
      break;
  }
});
