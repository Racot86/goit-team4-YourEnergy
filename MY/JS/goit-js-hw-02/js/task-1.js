// Задача 1. Замовлення дроїдів
(function() {
    function makeTransaction(quantity, pricePerDroid, customerCredits) {
        const totalPrice = quantity * pricePerDroid;

        if (totalPrice > customerCredits) {
            return "Insufficient funds!";
        } else {
            return `You ordered ${quantity} droids worth ${totalPrice} credits!`;
        }
    }

    // Делаем функцию глобальной
    window.makeTransaction = makeTransaction;

    function displayResultTask1(result) {
        console.log(result);
        
        const output = document.getElementById('task1-output');
        const resultElement = document.createElement('div');
        resultElement.className = 'output-line';
        resultElement.textContent = result;
        output.appendChild(resultElement);
    }

    // Прямі виклики для консолі
    console.log(makeTransaction(5, 3000, 23000)); // повертає "You ordered 5 droids worth 15000 credits!"
    console.log(makeTransaction(3, 1000, 15000)); // повертає "You ordered 3 droids worth 3000 credits!"
    console.log(makeTransaction(10, 5000, 8000)); // повертає "Insufficient funds!"
    console.log(makeTransaction(8, 2000, 10000)); // повертає "Insufficient funds!"
    console.log(makeTransaction(10, 500, 5000)); // повертає "You ordered 10 droids worth 5000 credits!"

    // Вивід на сторінку
    const testCases = [
        [5, 3000, 23000],
        [3, 1000, 15000],
        [10, 5000, 8000],
        [8, 2000, 10000],
        [10, 500, 5000]
    ];

    testCases.forEach(([quantity, price, credits]) => 
        displayResultTask1(makeTransaction(quantity, price, credits))
    );
})();