(function() {
    const getTotalBalanceByGender = (users, gender) =>
        users
            .filter(user => user.gender === gender)
            .reduce((total, user) => total + user.balance, 0);

    // Робимо функцію глобальною
    window.getTotalBalanceByGender = getTotalBalanceByGender;

    function displayResult(users, gender, result) {
        const resultDiv = document.querySelector('#task4 .result');
        const resultText = `Gender: ${gender}\nTotal Balance: ${result}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const clients = [
            {
                name: 'Moore Hensley',
                gender: 'male',
                balance: 2811,
            },
            {
                name: 'Sharlene Bush',
                gender: 'female',
                balance: 3821,
            },
            {
                name: 'Ross Vazquez',
                gender: 'male',
                balance: 3793,
            },
            {
                name: 'Elma Head',
                gender: 'female',
                balance: 2278,
            },
            {
                name: 'Carey Barr',
                gender: 'male',
                balance: 3951,
            },
            {
                name: 'Blackburn Dotson',
                gender: 'male',
                balance: 1498,
            },
            {
                name: 'Sheree Anthony',
                gender: 'female',
                balance: 2764,
            },
        ];

        const genders = ['male', 'female'];
        genders.forEach(gender => {
            const result = getTotalBalanceByGender(clients, gender);
            displayResult(clients, gender, result);
        });
    });
})();

// Консольні тести
const clients = [
    {
        name: 'Moore Hensley',
        gender: 'male',
        balance: 2811,
    },
    {
        name: 'Sharlene Bush',
        gender: 'female',
        balance: 3821,
    },
    {
        name: 'Ross Vazquez',
        gender: 'male',
        balance: 3793,
    },
    {
        name: 'Elma Head',
        gender: 'female',
        balance: 2278,
    },
    {
        name: 'Carey Barr',
        gender: 'male',
        balance: 3951,
    },
    {
        name: 'Blackburn Dotson',
        gender: 'male',
        balance: 1498,
    },
    {
        name: 'Sheree Anthony',
        gender: 'female',
        balance: 2764,
    },
];

console.log(getTotalBalanceByGender(clients, 'male')); // 12053
console.log(getTotalBalanceByGender(clients, 'female')); // 8863

