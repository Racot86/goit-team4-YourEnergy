// Этот файл поможет с плавной миграцией
import { initPagination } from './pagination';
import '../partials/components/pagination/PaginationComponent';

// Инициализируем новую пагинацию после загрузки старой
document.addEventListener('DOMContentLoaded', () => {
  // Даем время старой пагинации инициализироваться
  setTimeout(() => {
    initPagination();
  }, 100);
}); 