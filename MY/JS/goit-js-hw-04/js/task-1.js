(function() {
    function isEnoughCapacity(products, containerSize) {
        let totalQuantity = 0;
        for (const quantity of Object.values(products)) {
            totalQuantity += quantity;
        }
        return totalQuantity <= containerSize;
    }

    // Робимо функцію глобальною
    window.isEnoughCapacity = isEnoughCapacity;

    function displayResult(products, containerSize, result) {
        const resultDiv = document.querySelector('#task1 .result');
        const resultText = `Products: ${JSON.stringify(products)}, Container Size: ${containerSize} → Result: ${result}`;
        
        console.log(result);
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.textContent = resultText;
        resultDiv.appendChild(resultElement);
    }

    // Чекаємо завантаження DOM перед виконанням
    document.addEventListener('DOMContentLoaded', () => {
        const testCases = [
            [{ apples: 2, grapes: 3, carrots: 1 }, 8],
            [{ apples: 4, grapes: 6, lime: 16 }, 12],
            [{ apples: 1, lime: 5, tomatoes: 3 }, 14],
            [{ apples: 18, potatoes: 5, oranges: 2 }, 7]
        ];

        testCases.forEach(([products, size]) => {
            const result = isEnoughCapacity(products, size);
            displayResult(products, size, result);
        });
    });
})();

console.log(isEnoughCapacity({ apples: 2, grapes: 3, carrots: 1 }, 8)); // true
  
console.log(isEnoughCapacity({ apples: 4, grapes: 6, lime: 16 }, 12)); // false

console.log(isEnoughCapacity({ apples: 1, lime: 5, tomatoes: 3 }, 14)); // true

console.log(isEnoughCapacity({ apples: 18, potatoes: 5, oranges: 2 }, 7)); // false