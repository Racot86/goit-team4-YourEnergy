(function() {
    window.displayResult = function(operation, result) {
        const resultDiv = document.querySelector('#task3 .result');
        const resultText = `${operation}: ${JSON.stringify(result)}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    // Оголошений клас StringBuilder
    class StringBuilder {
        // Властивість value у класі StringBuilder оголошена приватною
        #value;
    
        constructor(initialValue) {
            this.#value = initialValue;
        }
    
        // Метод getValue повертає значення приватної властивості value
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
    // У результаті виклику new StringBuilder(".") значення змінної builder — це об'єкт
    const builder = new StringBuilder('.');
    window.builder = builder;

    // Перевірка
    console.log(builder.getValue()); // "."
    displayResult('Початкове значення', builder.getValue());

    // Другий виклик builder.getValue() після виклику builder.padStart("^") повертає рядок ^.
    builder.padStart('^');
    console.log(builder.getValue()); // "^."
    displayResult('Після padStart', builder.getValue());

    // Третій виклик builder.getValue() після виклику builder.padEnd("^") повертає рядок ^.^
    builder.padEnd('^');
    console.log(builder.getValue()); // "^.^"
    displayResult('Після padEnd', builder.getValue());

    // Четвертий виклик builder.getValue() після виклику builder.padBoth("=") повертає рядок =^.^=
    builder.padBoth('=');
    console.log(builder.getValue()); // "=^.^="
    displayResult('Після padBoth', builder.getValue());
})();
  