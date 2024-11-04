const profile = {
    username: 'Jacob',
    playTime: 300,

    changeUsername(newName) {
        this.username = newName;
    },

    updatePlayTime(hours) {
        this.playTime += hours;
    },

    getInfo() {
        return `${this.username} has ${this.playTime} active hours!`;
    },
};

// Функція для відображення на сторінці
function displayResult(info) {
    const resultDiv = document.querySelector('#task3 .result');
    
    const resultElement = document.createElement('div');
    resultElement.className = 'result-line';
    resultElement.textContent = info;
    resultDiv.appendChild(resultElement);
}

// Чекаємо завантаження DOM перед виконанням
document.addEventListener('DOMContentLoaded', () => {
    // Виводимо початковий стан
    displayResult(profile.getInfo());
    
    // Змінюємо ім'я і виводимо
    profile.changeUsername('Marco');
    displayResult(profile.getInfo());
    
    // Оновлюємо час і виводимо
    profile.updatePlayTime(20);
    displayResult(profile.getInfo());
});

// Код для перевірки в консолі згідно з завданням
console.log(profile.getInfo()); // "Jacob has 300 active hours!"

profile.changeUsername('Marco');
console.log(profile.getInfo()); // "Marco has 300 active hours!"

profile.updatePlayTime(20);
console.log(profile.getInfo()); // "Marco has 320 active hours!"
