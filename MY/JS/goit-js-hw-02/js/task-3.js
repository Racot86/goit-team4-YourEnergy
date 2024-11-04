// Задача 3. Перевірка спаму
(function() {
    function checkForSpam(message) {
        const lowerCaseMessage = message.toLowerCase();
        return lowerCaseMessage.includes('spam') || lowerCaseMessage.includes('sale');
    }

    // Делаем функцию глобальной
    window.checkForSpam = checkForSpam;

    function displayResultTask3(message, result) {
        const output = `"${message}" -> ${result}`;
        
        // Вивід в консоль
        console.log(output);
        
        // Вивід на сторінку
        const outputElement = document.getElementById('task3-output');
        const resultElement = document.createElement('div');
        resultElement.className = 'output-line';
        resultElement.textContent = output;
        outputElement.appendChild(resultElement);
    }

    // Прямі виклики для консолі
    console.log(checkForSpam("Latest technology news")); // повертає false
    console.log(checkForSpam("JavaScript weekly newsletter")); // повертає false
    console.log(checkForSpam("Get best sale offers now!")); // повертає true
    console.log(checkForSpam("Amazing SalE, only tonight!")); // повертає true
    console.log(checkForSpam("Trust me, this is not a spam message")); // повертає true
    console.log(checkForSpam("Get rid of sPaM emails. Our book in on sale!")); // повертає true
    console.log(checkForSpam("[SPAM] How to earn fast money?")); // повертає true

    // Вивід на сторінку
    const testCases = [
        "Latest technology news",
        "JavaScript weekly newsletter",
        "Get best sale offers now!",
        "Amazing SalE, only tonight!",
        "Trust me, this is not a spam message",
        "Get rid of sPaM emails. Our book in on sale!",
        "[SPAM] How to earn fast money?"
    ];

    testCases.forEach(message => displayResultTask3(message, checkForSpam(message)));
})();