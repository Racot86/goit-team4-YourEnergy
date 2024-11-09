export function removeFromFavorites(exerciseId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  console.log('Current favorites before removal:', favorites); // Логування перед видаленням
  favorites = favorites.filter(item => item.id !== exerciseId);
  console.log('Favorites after removal:', favorites); // Логування після видалення
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
