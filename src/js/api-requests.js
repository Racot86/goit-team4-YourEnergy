import { filtersUrl } from './api-service';
import axios from 'axios';

export async function getCategories() {
    const { data } = await axios.get(`${filtersUrl()}`);
    return data; 
  }