// Задача 1. Генератор slug
(function() {
    function slugify(title) {
        const lowerCaseTitle = title.toLowerCase();
        const words = lowerCaseTitle.split(' ');
        const slug = words.join('-');
        return slug;
    }

    // Делаем функцию глобальной
    window.slugify = slugify;

    function displayResult(input, output) {
        const resultDiv = document.querySelector('#task1 .result');
        const result = `Input: "${input}" → Output: "${output}"`;
        
        console.log(output);
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.textContent = result;
        resultDiv.appendChild(resultElement);
    }

    // Ждем загрузку DOM перед выполнением
    document.addEventListener('DOMContentLoaded', () => {
        const testCases = [
            'Arrays for begginers',
            'English for developer',
            'Ten secrets of JavaScript',
            'How to become a JUNIOR developer in TWO WEEKS'
        ];

        testCases.forEach(test => {
            displayResult(test, slugify(test));
        });
    });

    // Примеры прямого использования функции
    console.log(slugify('Arrays for begginers')); // "arrays-for-begginers"
    console.log(slugify('English for developer')); // "english-for-developer"
    console.log(slugify('Ten secrets of JavaScript')); // "ten-secrets-of-javascript"
    console.log(slugify('How to become a JUNIOR developer in TWO WEEKS')); // "how-to-become-a-junior-developer-in-two-weeks"
})();