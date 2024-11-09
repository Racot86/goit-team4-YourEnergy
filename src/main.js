// Импортируем общие стили
import './css/styles.css';
import './js/sidebar-quote.js';
import './js/categories.js';
import './js/pagination.js';
import './js/footer-subscribe.js';
import './js/menu.js';
import './js/search-filters.js'
import './js/router.js'
import './js/sticky-header.js'
import './js/modal-window.js';
import './js/favorites.js';

// Если мы на странице task-management, загружаем дополнительные стили
if (window.location.pathname.includes('task-management')) {
  import('./css/task-manager.css');
}

// Функция для инициализации TaskManager
async function initTaskManager() {
  if (!window.taskManager) {
    try {
      const TaskManagerModule = await import('./js/task-manager.js');
      const TaskManager = TaskManagerModule.default;
      window.taskManager = new TaskManager();
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error initializing TaskManager:', error);
      return null;
    }
  }
  return window.taskManager;
}
// Инициализируем обработчики кнопок
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Если мы на странице task-management
    if (window.location.pathname.includes('task-management')) {
      // Инициализируем TaskManager
      await initTaskManager();

      // Обработчик для плавающей кнопки
      const floatingAddTaskBtn = document.getElementById('addTaskBtn');
      if (floatingAddTaskBtn) {
        floatingAddTaskBtn.addEventListener('click', async e => {
          e.preventDefault();
          if (window.taskManager) {
            window.taskManager.showModal();
          } else {
            console.error('TaskManager not initialized');
          }
        });
      }
    }
  } catch (error) {
    console.error('Error initializing task manager:', error);
  }
});
