import { quoteURL } from './api-service';

async function getQuote() {
    const today = new Date().toISOString().split('T')[0];

    // дані з localStorage
    const storedQuote = localStorage.getItem('quote');
    const storedAuthor = localStorage.getItem('author');
    const storedDate = localStorage.getItem('quoteDate');

    // якщо дата не змінилась, відображаємо збережену цитату&автора і завершуємо функцію
    if (storedQuote && storedAuthor && storedDate === today) {
        document.querySelector('.sidebar-quote').textContent = `${storedQuote}`;
        document.querySelector('.sidebar-quote-author').textContent = `${storedAuthor}`;
        return;
    }

    // якщо дата змінилась або цитата&автор відсутні, то запит на бекенд
    try {
        const response = await fetch(quoteURL());
        if (!response.ok) {
        throw new Error('Failed to fetch quote');
        }

        const data = await response.json();
        const quoteText = data.quote;
        const author = data.author;

        document.querySelector('.sidebar-quote').textContent = `${quoteText}`;
        document.querySelector('.sidebar-quote-author').textContent = `${author}`;

        // збереження в localStorage
        localStorage.setItem('quote', quoteText);
        localStorage.setItem('author', author);
        localStorage.setItem('quoteDate', today);

    } catch (error) {
        console.error('Error fetching quote:', error);
    }
}

getQuote();
