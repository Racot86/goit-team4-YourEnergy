function onUrlChange(callback) {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  const handleUrlChange = () => {
    callback(window.location.href);
  };

  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    handleUrlChange();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    handleUrlChange();
  };

  window.addEventListener('popstate', handleUrlChange);
}

onUrlChange((newUrl) => {
  console.log("URL changed to:", newUrl);
  const homePage = document.querySelector('.home-page');
  const favoritesPage = document.querySelector('.favorites-page');
  switch (window.location.pathname) {
    case '/':
      homePage.classList.remove('hidden');
      favoritesPage.classList.add('hidden');
      break;
    case '/favorites':
      homePage.classList.add('hidden');
      favoritesPage.classList.remove('hidden');
      break;
  }
});


// Change the URL endpoint without reloading the page
function changeLastEndpoint(newEndpoint) {
  // Get the current URL path
  const currentPath = window.location.pathname;

  // Split the path into parts
  const pathParts = currentPath.split('/');

  // Replace the last part with the new endpoint
  pathParts[pathParts.length - 1] = newEndpoint;

  // Join the path back together
  const newPath = pathParts.join('/');

  // Update the URL without reloading the page
  window.history.pushState({}, '', newPath);
}

const routerButtons = document.querySelector('.router');
routerButtons.addEventListener('click', (e)=>{
  e.preventDefault();
  switch (e.target.innerHTML.toLowerCase()) {
    case 'home':
      routerButtons.children[0].classList.add('active');
      routerButtons.children[1].classList.remove('active');
      changeLastEndpoint('/');
      break;
      case 'favorites':
        routerButtons.children[0].classList.remove('active');
        routerButtons.children[1].classList.add('active');
        changeLastEndpoint('/favorites');
      break;
  }
});
