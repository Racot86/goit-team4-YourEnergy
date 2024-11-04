(function() {
    window.displayResult = function(operation, result) {
        const resultDiv = document.querySelector('#task2 .result');
        const resultText = `${operation}: ${JSON.stringify(result)}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    // Оголошений клас Storage
    class Storage {
        // Властивість items у класі Storage оголошена приватною
        #items;
    
        constructor(items) {
            this.#items = items;
        }
    
        // Метод getItems повертає значення приватної властивості items
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
    // У результаті виклику new Storage() значення змінної storage — це об'єкт
    const storage = new Storage(['Nanitoids', 'Prolonger', 'Antigravitator']);
    window.storage = storage;

    // Перевірка
    console.log(storage.getItems()); // ["Nanitoids", "Prolonger", "Antigravitator"]
    displayResult('Початковий стан', storage.getItems());

    // Другий виклик storage.getItems() після виклику storage.addItem("Droid")
    storage.addItem('Droid');
    console.log(storage.getItems()); // ["Nanitoids", "Prolonger", "Antigravitator", "Droid"]
    displayResult('Після додавання', storage.getItems());

    // Третій виклик storage.getItems() після виклику storage.removeItem("Prolonger")
    storage.removeItem('Prolonger');
    console.log(storage.getItems()); // ["Nanitoids", "Antigravitator", "Droid"]
    displayResult('Після видалення', storage.getItems());
})();
  