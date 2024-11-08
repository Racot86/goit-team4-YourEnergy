const favoritesQuote = localStorage.getItem('quote');
const favoritesQuoteAuthor = localStorage.getItem('author');
const favoritesQuoteDate = localStorage.getItem('quoteDate');

const favoritesCard = document.querySelector('.favorites-card')

if(favoritesQuote !== null){
  favoritesCard.children[1].innerHTML = favoritesQuote;
  favoritesCard.children[2].innerHTML = favoritesQuoteAuthor;
}