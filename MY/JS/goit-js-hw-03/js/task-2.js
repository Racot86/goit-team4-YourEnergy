// Задача 2. Композиція масивів
(function() {
    function makeArray(firstArray, secondArray, maxLength) {
        const combinedArray = firstArray.concat(secondArray);
        return combinedArray.slice(0, maxLength);
    }

    // Делаем функцию глобальной
    window.makeArray = makeArray;

    function displayResult(firstArray, secondArray, maxLength, result) {
        const resultDiv = document.querySelector('#task2 .result');
        const resultText = `First array: [${firstArray}], Second array: [${secondArray}], MaxLength: ${maxLength} → Result: [${result}]`;
        
        console.log(result);
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.textContent = resultText;
        resultDiv.appendChild(resultElement);
    }

    // Ждем загрузку DOM перед выполнением
    document.addEventListener('DOMContentLoaded', () => {
        const testCases = [
            [['Mango', 'Poly'], ['Ajax', 'Chelsea'], 3],
            [['Mango', 'Poly', 'Houston'], ['Ajax', 'Chelsea'], 4],
            [['Mango'], ['Ajax', 'Chelsea', 'Poly', 'Houston'], 3],
            [['Earth', 'Jupiter'], ['Neptune', 'Uranus'], 2],
            [['Earth', 'Jupiter'], ['Neptune', 'Uranus'], 4],
            [['Earth', 'Jupiter'], ['Neptune', 'Uranus', 'Venus'], 0]
        ];

        testCases.forEach(([first, second, max]) => {
            displayResult(first, second, max, makeArray(first, second, max));
        });
    });

    // Примеры прямого использования функции
    console.log(makeArray(['Mango', 'Poly'], ['Ajax', 'Chelsea'], 3)); // ["Mango", "Poly", "Ajax"]
    console.log(makeArray(['Mango', 'Poly', 'Houston'], ['Ajax', 'Chelsea'], 4)); // ["Mango", "Poly", "Houston", "Ajax"]
    console.log(makeArray(['Mango'], ['Ajax', 'Chelsea', 'Poly', 'Houston'], 3)); // ["Mango", "Ajax", "Chelsea"]
    console.log(makeArray(['Earth', 'Jupiter'], ['Neptune', 'Uranus'], 2)); // ["Earth", "Jupiter"]
    console.log(makeArray(['Earth', 'Jupiter'], ['Neptune', 'Uranus'], 4)); // ["Earth", "Jupiter", "Neptune", "Uranus"]
    console.log(makeArray(['Earth', 'Jupiter'], ['Neptune', 'Uranus', 'Venus'], 0)); // []
})();