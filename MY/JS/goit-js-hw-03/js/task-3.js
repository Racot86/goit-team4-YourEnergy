// Задача 3. Фільтрація масиву чисел
(function() {
    function filterArray(numbers, value) {
        const filteredNumbers = [];
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] > value) {
                filteredNumbers.push(numbers[i]);
            }
        }
        return filteredNumbers;
    }

    // Делаем функцию глобальной
    window.filterArray = filterArray;

    function displayFilterResults(numbers, value, result) {
        const resultDiv = document.querySelector('#task3 .result');
        const resultText = `Numbers: [${numbers}], Value: ${value} → Result: [${result}]`;
        
        console.log(result);
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.textContent = resultText;
        resultDiv.appendChild(resultElement);
    }

    // Ждем загрузку DOM перед выполнением
    document.addEventListener('DOMContentLoaded', () => {
        const testCases = [
            [[1, 2, 3, 4, 5], 3],
            [[1, 2, 3, 4, 5], 4],
            [[1, 2, 3, 4, 5], 5],
            [[12, 24, 8, 41, 76], 38],
            [[12, 24, 8, 41, 76], 20]
        ];

        testCases.forEach(([numbers, value]) => {
            const result = filterArray(numbers, value);
            displayFilterResults(numbers, value, result);
        });
    });

    // Примеры прямого использования функции
    console.log(filterArray([1, 2, 3, 4, 5], 3)); // [4, 5]
    console.log(filterArray([1, 2, 3, 4, 5], 4)); // [5]
    console.log(filterArray([1, 2, 3, 4, 5], 5)); // []
    console.log(filterArray([12, 24, 8, 41, 76], 38)); // [41, 76]
    console.log(filterArray([12, 24, 8, 41, 76], 20)); // [24, 41, 76]
})();
  