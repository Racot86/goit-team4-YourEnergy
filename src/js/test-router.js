// Router function to handle navigation
function initRouter() {
  // Define the allowed routes
  const allowedPaths = ['goit-team4-YourEnergy/', 'goit-team4-YourEnergy/favorites'];
  // Function to handle route changes
  function handleRouteChange() {
    // Get the current path
    const currentPath = window.location.pathname;

    // If the current path is not allowed, redirect to '/'
    if (!allowedPaths.includes(currentPath)) {
      // Redirect to the main path
      window.history.replaceState({}, '', '/');
      renderPageContent('goit-team4-YourEnergy/');
    } else {
      // Render the correct page content for the allowed path
      renderPageContent(currentPath);
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

// Function to navigate, only changing the last endpoint
function navigate(newEndpoint) {
  //event.preventDefault(); // Prevent default link behavior

  // Get the current path and replace only the last segment
  const pathParts = window.location.pathname.split('/');
  pathParts[pathParts.length - 1] = newEndpoint.replace('/', ''); // Replace last part with new endpoint

  // Construct the new path
  const newPath = pathParts.join('/');

  // Update the URL to the new path without reloading the page
  history.pushState({}, '', newPath);
  //handleRouteChange();
}

// Initialize router
document.addEventListener('DOMContentLoaded', initRouter);


const routerButtons = document.querySelector('.router');
routerButtons.addEventListener('click', (e)=>{
e.preventDefault();
  switch (e.target.innerHTML.toLowerCase()) {
    case 'home':
      navigate('/')
      routerButtons.children[0].classList.add('active');
      routerButtons.children[1].classList.remove('active');
      break;
      case 'favorites':
        navigate('/favorites');
        routerButtons.children[0].classList.remove('active');
        routerButtons.children[1].classList.add('active');
      break;
  }
});
