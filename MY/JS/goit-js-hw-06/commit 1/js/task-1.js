(function() {
    // Робимо функцію глобальною для тестування
    window.displayResult = function(operation, result) {
        const resultDiv = document.querySelector('#task1 .result');
        const resultText = `${operation}: ${JSON.stringify(result)}`;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    const customer = {
        username: 'Mango',
        balance: 24000,
        discount: 0.1,
        orders: ['Burger', 'Pizza', 'Salad'],
    
        getBalance() {
            return this.balance;
        },
        getDiscount() {
            return this.discount;
        },
        setDiscount(value) {
            this.discount = value;
        },
        getOrders() {
            return this.orders;
        },
        addOrder(cost, order) {
            this.balance -= cost - cost * this.discount;
            this.orders.push(order);
        },
    };

    // Робимо об'єкт customer глобальним для тестування
    window.customer = customer;

    // Перевірка
    customer.setDiscount(0.15);
    console.log(customer.getDiscount()); // 0.15
    displayResult('Знижка', customer.getDiscount());

    customer.addOrder(5000, 'Steak');
    console.log(customer.getBalance()); // 19750
    displayResult('Баланс', customer.getBalance());

    console.log(customer.getOrders()); // ["Burger", "Pizza", "Salad", "Steak"]
    displayResult('Замовлення', customer.getOrders());
})();
  