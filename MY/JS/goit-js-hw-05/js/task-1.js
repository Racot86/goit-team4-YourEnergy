(function() {
    const getUserNames = users => users.map(user => user.name);

    // Робимо функцію глобальною
    window.getUserNames = getUserNames;

    function displayResult(users, result) {
        const resultDiv = document.querySelector('#task1 .result');
        const resultText = `Input: ${JSON.stringify(users, null, 2)}\nOutput: ${JSON.stringify(result)}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const users = [
            {
                name: 'Moore Hensley',
                email: 'moorehensley@indexia.com',
                balance: 2811,
            },
            {
                name: 'Sharlene Bush',
                email: 'sharlenebush@tubesys.com',
                balance: 3821,
            },
            {
                name: 'Ross Vazquez',
                email: 'rossvazquez@xinware.com',
                balance: 3793,
            },
            {
                name: 'Elma Head',
                email: 'elmahead@omatom.com',
                balance: 2278,
            },
            {
                name: 'Carey Barr',
                email: 'careybarr@nurali.com',
                balance: 3951,
            },
            {
                name: 'Blackburn Dotson',
                email: 'blackburndotson@furnigeer.com',
                balance: 1498,
            },
            {
                name: 'Sheree Anthony',
                email: 'shereeanthony@kog.com',
                balance: 2764,
            },
        ];

        const result = getUserNames(users);
        displayResult(users, result);
    });
})();

// Консольні тести
console.log(
    getUserNames([
        {
            name: 'Moore Hensley',
            email: 'moorehensley@indexia.com',
            balance: 2811,
        },
        {
            name: 'Sharlene Bush',
            email: 'sharlenebush@tubesys.com',
            balance: 3821,
        },
        {
            name: 'Ross Vazquez',
            email: 'rossvazquez@xinware.com',
            balance: 3793,
        },
        {
            name: 'Elma Head',
            email: 'elmahead@omatom.com',
            balance: 2278,
        },
        {
            name: 'Carey Barr',
            email: 'careybarr@nurali.com',
            balance: 3951,
        },
        {
            name: 'Blackburn Dotson',
            email: 'blackburndotson@furnigeer.com',
            balance: 1498,
        },
        {
            name: 'Sheree Anthony',
            email: 'shereeanthony@kog.com',
            balance: 2764,
        },
    ])
);


// console.log(
//     getUserNames([
//     {
//       name: "Moore Hensley",
//       email: "moorehensley@indexia.com",
//       balance: 2811
//     },
//     {
//       name: "Sharlene Bush",
//       email: "sharlenebush@tubesys.com",
//       balance: 3821
//     },
//     {
//       name: "Ross Vazquez",
//       email: "rossvazquez@xinware.com",
//       balance: 3793
//     },
//     {
//       name: "Elma Head",
//       email: "elmahead@omatom.com",
//       balance: 2278
//     },
//     {
//       name: "Carey Barr",
//       email: "careybarr@nurali.com",
//       balance: 3951
//     },
//     {
//       name: "Blackburn Dotson",
//       email: "blackburndotson@furnigeer.com",
//       balance: 1498
//     },
//     {
//       name: "Sheree Anthony",
//       email: "shereeanthony@kog.com",
//       balance: 2764
//     },
//   ])
//   ); // ["Moore Hensley", "Sharlene Bush", "Ross Vazquez", "Elma Head", "Carey Barr", "Blackburn Dotson", "Sheree Anthony"]
  
  