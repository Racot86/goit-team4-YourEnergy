// Задача 2. Форматування повідомлення
(function() {
    function formatMessage(message, maxLength) {
        if (message.length <= maxLength) {
            return message;
        } else {
            return message.slice(0, maxLength) + "...";
        }
    }

    // Делаем функцию глобальной для доступа из консоли
    window.formatMessage = formatMessage;

    function displayResultTask2(result) {
        console.log(result);
        
        const output = document.getElementById('task2-output');
        const resultElement = document.createElement('div');
        resultElement.className = 'output-line';
        resultElement.textContent = result;
        output.appendChild(resultElement);
    }

    // Прямі виклики для консолі
    console.log(formatMessage("Curabitur ligula sapien", 16)); // "Curabitur ligula..."
    console.log(formatMessage("Curabitur ligula sapien", 23)); // "Curabitur ligula sapien"
    console.log(formatMessage("Vestibulum facilisis purus nec", 20)); // "Vestibulum facilisis..."
    console.log(formatMessage("Vestibulum facilisis purus nec", 30)); // "Vestibulum facilisis purus nec"
    console.log(formatMessage("Nunc sed turpis a felis in nunc fringilla", 15)); // "Nunc sed turpis..."
    console.log(formatMessage("Nunc sed turpis a felis in nunc fringilla", 41)); // "Nunc sed turpis a felis in nunc fringilla"

    // Вивід на сторінку
    const testCases = [
        ["Curabitur ligula sapien", 16],
        ["Curabitur ligula sapien", 23],
        ["Vestibulum facilisis purus nec", 20],
        ["Vestibulum facilisis purus nec", 30],
        ["Nunc sed turpis a felis in nunc fringilla", 15],
        ["Nunc sed turpis a felis in nunc fringilla", 41]
    ];

    testCases.forEach(([message, length]) => displayResultTask2(formatMessage(message, length)));
})();