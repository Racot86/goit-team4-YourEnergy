(function() {
    const getUsersWithFriend = (users, friendName) =>
        users.filter(user => user.friends.includes(friendName));

    // Робимо функцію глобальною
    window.getUsersWithFriend = getUsersWithFriend;

    function displayResult(users, friendName, result) {
        const resultDiv = document.querySelector('#task2 .result');
        const resultText = `Friend name: ${friendName}\nResult: ${JSON.stringify(result, null, 2)}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const allUsers = [
            {
                name: 'Moore Hensley',
                friends: ['Sharron Pace'],
            },
            {
                name: 'Sharlene Bush',
                friends: ['Briana Decker', 'Sharron Pace'],
            },
            {
                name: 'Ross Vazquez',
                friends: ['Marilyn Mcintosh', 'Padilla Garrison', 'Naomi Buckner'],
            },
            {
                name: 'Elma Head',
                friends: ['Goldie Gentry', 'Aisha Tran'],
            },
            {
                name: 'Carey Barr',
                friends: ['Jordan Sampson', 'Eddie Strong'],
            },
            {
                name: 'Blackburn Dotson',
                friends: ['Jacklyn Lucas', 'Linda Chapman'],
            },
            {
                name: 'Sheree Anthony',
                friends: ['Goldie Gentry', 'Briana Decker'],
            },
        ];

        const testCases = ['Briana Decker', 'Goldie Gentry', 'Adrian Cross'];
        testCases.forEach(friend => {
            const result = getUsersWithFriend(allUsers, friend);
            displayResult(allUsers, friend, result);
        });
    });
})();

// Консольні тести
const allUsers = [
    {
        name: 'Moore Hensley',
        friends: ['Sharron Pace'],
    },
    {
        name: 'Sharlene Bush',
        friends: ['Briana Decker', 'Sharron Pace'],
    },
    {
        name: 'Ross Vazquez',
        friends: ['Marilyn Mcintosh', 'Padilla Garrison', 'Naomi Buckner'],
    },
    {
        name: 'Elma Head',
        friends: ['Goldie Gentry', 'Aisha Tran'],
    },
    {
        name: 'Carey Barr',
        friends: ['Jordan Sampson', 'Eddie Strong'],
    },
    {
        name: 'Blackburn Dotson',
        friends: ['Jacklyn Lucas', 'Linda Chapman'],
    },
    {
        name: 'Sheree Anthony',
        friends: ['Goldie Gentry', 'Briana Decker'],
    },
];

console.log(getUsersWithFriend(allUsers, 'Briana Decker'));
console.log(getUsersWithFriend(allUsers, 'Goldie Gentry'));
console.log(getUsersWithFriend(allUsers, 'Adrian Cross'));




// const allUsers = [
//     {
//       name: "Moore Hensley",
//       friends: ["Sharron Pace"]
//     },
//     {
//       name: "Sharlene Bush",
//       friends: ["Briana Decker", "Sharron Pace"]
//     },
//     {
//       name: "Ross Vazquez",
//       friends: ["Marilyn Mcintosh", "Padilla Garrison", "Naomi Buckner"]
//     },
//     {
//       name: "Elma Head",
//       friends: ["Goldie Gentry", "Aisha Tran"]
//     },
//     {
//       name: "Carey Barr",
//       friends: ["Jordan Sampson", "Eddie Strong"]
//     },
//     {
//       name: "Blackburn Dotson",
//       friends: ["Jacklyn Lucas", "Linda Chapman"]
//     },
//     {
//       name: "Sheree Anthony",
//       friends: ["Goldie Gentry", "Briana Decker"]
//     }
//   ];
  
//   console.log(getUsersWithFriend(allUsers, "Briana Decker")); 
//   // [
//   //   {
//   //     name: "Sharlene Bush",
//   //     friends: ["Briana Decker", "Sharron Pace"]
//   //   },
//   //   {
//   //     name: "Sheree Anthony",
//   //     friends: ["Goldie Gentry", "Briana Decker"]
//   //   }
//   // ]
  
//   console.log(getUsersWithFriend(allUsers, "Goldie Gentry"));
//   // [
//   //   {
//   //     name: "Elma Head",
//   //     friends: ["Goldie Gentry", "Aisha Tran"]
//   //   },
//   //   {
//   //     name: "Sheree Anthony",
//   //     friends: ["Goldie Gentry", "Briana Decker"]
//   //   }
//   // ]
  
//   console.log(getUsersWithFriend(allUsers, "Adrian Cross" )); // []
  