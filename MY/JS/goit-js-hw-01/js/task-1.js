function makeTransaction(quantity, pricePerDroid) {
    return `You ordered ${quantity} droids worth ${quantity * pricePerDroid} credits!`;
}

// Виклик в консоль
console.log(makeTransaction(5, 3000)); // "You ordered 5 droids worth 15000 credits!"
console.log(makeTransaction(3, 1000)); // "You ordered 3 droids worth 3000 credits!"
console.log(makeTransaction(10, 500)); // "You ordered 10 droids worth 5000 credits!"

// Виклик на страницу
document.addEventListener('DOMContentLoaded', () => {
    const result1 = document.getElementById('result1');
    result1.innerHTML = `
        <p>${makeTransaction(5, 3000)}</p>
        <p>${makeTransaction(3, 1000)}</p>
        <p>${makeTransaction(10, 500)}</p>
    `;
});