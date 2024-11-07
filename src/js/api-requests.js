import { filtersUrl } from './api-service';
import axios from 'axios';

export async function getCategories(filter = 'Muscles', page = 1, limit = 12) {
  const isMobile = window.innerWidth <= 768; 
  limit = isMobile ? 9 : limit;
  const { data } = await axios.get(filtersUrl(), {
    params: {
      filter: filter,
      page: page,
      limit: limit
    },
  });
  return data;
}
