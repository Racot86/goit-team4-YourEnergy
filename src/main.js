// Импортируем общие стили
import './css/styles.css';
import { ModalWindow } from './js/modal-window.js';

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

    // Додаємо консоль лог для перевірки
    console.log('Initializing modal window...');

    // Ініціалізуємо модальне вікно
    const modalWindow = new ModalWindow();

    // Додаємо обробник для тестової кнопки
    const modalBtn = document.querySelector('.modal-btn');
    if (modalBtn) {
      console.log('Modal button found');
      modalBtn.addEventListener('click', () => {
        console.log('Modal button clicked');
        // Тестові дані відповідно до структури API
        const testData = {
          _id: '64f389465ae26083f39b17a4',
          bodyPart: 'waist',
          equipment: 'body weight',
          gifUrl: 'https://ftp.goit.study/img/power-pulse/gifs/0003.gif',
          name: 'air bike',
          target: 'abs',
          description:
            "This refers to your core muscles, which include the rectus abdominis, obliques, and transverse abdominis. They're essential for maintaining posture, stability, and generating force in many movements. Exercises that target the abs include crunches, leg raises, and planks.",
          rating: 3,
          burnedCalories: 312,
          time: 3,
          popularity: 1,
        };
        modalWindow.open(testData);
      });
    } else {
      console.log('Modal button not found');
    }
  } catch (error) {
    console.error('Error initializing task manager:', error);
  }
});
