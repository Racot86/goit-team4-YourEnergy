(function() {
    window.displayResult = function(operation, result) {
        const resultDiv = document.querySelector('#task3 .result');
        const resultText = `${operation}: ${JSON.stringify(result)}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    class StringBuilder {
        #value;
    
        constructor(initialValue) {
            this.#value = initialValue;
        }
    
        getValue() {
            return this.#value;
        }
    
        padEnd(str) {
            this.#value += str;
        }
    
        padStart(str) {
            this.#value = str + this.#value;
        }
    
        padBoth(str) {
            this.padStart(str);
            this.padEnd(str);
        }
    }

    // Робимо клас StringBuilder глобальним для тестування
    window.StringBuilder = StringBuilder;

    // Створюємо екземпляр класу та робимо його глобальним
    const builder = new StringBuilder('.');
    window.builder = builder;

    // Перевірка
    console.log(builder.getValue()); // "."
    displayResult('Початкове значення', builder.getValue());

    builder.padStart('^');
    console.log(builder.getValue()); // "^."
    displayResult('Після padStart', builder.getValue());

    builder.padEnd('^');
    console.log(builder.getValue()); // "^.^"
    displayResult('Після padEnd', builder.getValue());

    builder.padBoth('=');
    console.log(builder.getValue()); // "=^.^="
    displayResult('Після padBoth', builder.getValue());
})();
  