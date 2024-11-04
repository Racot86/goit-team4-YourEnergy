(function() {
    const sortByDescendingFriendCount = users =>
        users.toSorted((a, b) => b.friends.length - a.friends.length);

    // Робимо функцію глобальною
    window.sortByDescendingFriendCount = sortByDescendingFriendCount;

    function displayResult(users, result) {
        const resultDiv = document.querySelector('#task3 .result');
        const resultText = `Result: ${JSON.stringify(result, null, 2)}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const users = [
            {
                name: 'Moore Hensley',
                friends: ['Sharron Pace'],
                gender: 'male',
            },
            {
                name: 'Sharlene Bush',
                friends: ['Briana Decker', 'Sharron Pace'],
                gender: 'female',
            },
            {
                name: 'Ross Vazquez',
                friends: ['Marilyn Mcintosh', 'Padilla Garrison', 'Naomi Buckner'],
                gender: 'male',
            },
            {
                name: 'Elma Head',
                friends: ['Goldie Gentry', 'Aisha Tran'],
                gender: 'female',
            },
            {
                name: 'Carey Barr',
                friends: ['Jordan Sampson', 'Eddie Strong'],
                gender: 'male',
            },
            {
                name: 'Blackburn Dotson',
                friends: ['Jacklyn Lucas', 'Linda Chapman'],
                gender: 'male',
            },
            {
                name: 'Sheree Anthony',
                friends: ['Goldie Gentry', 'Briana Decker'],
                gender: 'female',
            },
        ];

        const result = sortByDescendingFriendCount(users);
        displayResult(users, result);
    });
})();

// Консольні тести
console.log(
    sortByDescendingFriendCount([
        {
            name: 'Moore Hensley',
            friends: ['Sharron Pace'],
            gender: 'male',
        },
        {
            name: 'Sharlene Bush',
            friends: ['Briana Decker', 'Sharron Pace'],
            gender: 'female',
        },
        {
            name: 'Ross Vazquez',
            friends: ['Marilyn Mcintosh', 'Padilla Garrison', 'Naomi Buckner'],
            gender: 'male',
        },
        {
            name: 'Elma Head',
            friends: ['Goldie Gentry', 'Aisha Tran'],
            gender: 'female',
        },
        {
            name: 'Carey Barr',
            friends: ['Jordan Sampson', 'Eddie Strong'],
            gender: 'male',
        },
        {
            name: 'Blackburn Dotson',
            friends: ['Jacklyn Lucas', 'Linda Chapman'],
            gender: 'male',
        },
        {
            name: 'Sheree Anthony',
            friends: ['Goldie Gentry', 'Briana Decker'],
            gender: 'female',
        },
    ])
);


  // [
  //   {
  //     name: "Ross Vazquez",
  //     friends: ["Marilyn Mcintosh", "Padilla Garrison", "Naomi Buckner"],
  //     gender: "male"
  //   },
  //   {
  //     name: "Sharlene Bush",
  //     friends: ["Briana Decker", "Sharron Pace"],
  //     gender: "female"
  //   },
  //   {
  //     name: "Elma Head",
  //     friends: ["Goldie Gentry", "Aisha Tran"],
  //     gender: "female"
  //   },
  //   {
  //     name: "Carey Barr",
  //     friends: ["Jordan Sampson", "Eddie Strong"],
  //     gender: "male"
  //   },
  //   {
  //     name: "Blackburn Dotson",
  //     friends: ["Jacklyn Lucas", "Linda Chapman"],
  //     gender: "male"
  //   },
  //   {
  //     name: "Sheree Anthony",
  //     friends: ["Goldie Gentry", "Briana Decker"],
  //     gender: "female"
  //   },
  //   {
  //     name: "Moore Hensley",
  //     friends: ["Sharron Pace"],
  //     gender: "male"
  //   }
  // ]
  