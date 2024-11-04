(function() {
    window.displayResult = function(operation, result) {
        const resultDiv = document.querySelector('#task2 .result');
        const resultText = `${operation}: ${JSON.stringify(result)}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    class Storage {
        #items;
    
        constructor(items) {
            this.#items = items;
        }
    
        getItems() {
            return this.#items;
        }
    
        addItem(newItem) {
            this.#items.push(newItem);
        }
    
        removeItem(itemToRemove) {
            this.#items = this.#items.filter(item => item !== itemToRemove);
        }
    }

    // Робимо клас Storage глобальним для тестування
    window.Storage = Storage;

    // Створюємо екземпляр класу та робимо його глобальним
    const storage = new Storage(['Nanitoids', 'Prolonger', 'Antigravitator']);
    window.storage = storage;

    // Перевірка
    console.log(storage.getItems()); // ["Nanitoids", "Prolonger", "Antigravitator"]
    displayResult('Початковий стан', storage.getItems());

    storage.addItem('Droid');
    console.log(storage.getItems()); // ["Nanitoids", "Prolonger", "Antigravitator", "Droid"]
    displayResult('Після додавання', storage.getItems());

    storage.removeItem('Prolonger');
    console.log(storage.getItems()); // ["Nanitoids", "Antigravitator", "Droid"]
    displayResult('Після видалення', storage.getItems());
})();
  