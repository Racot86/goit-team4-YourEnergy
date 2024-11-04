(function() {
    function calcAverageCalories(days) {
        if (days.length === 0) {
            return 0;
        }

        let totalCalories = 0;
        for (const day of days) {
            totalCalories += day.calories;
        }
        return totalCalories / days.length;
    }

    // Робимо функцію глобальною
    window.calcAverageCalories = calcAverageCalories;

    function formatDays(days) {
        if (days.length === 0) return '[]';
        
        const items = days.map(day => 
            `  { "day": "${day.day}", "calories": ${day.calories} }`
        ).join(',\n');
        
        return `[\n${items}\n]`;
    }

    function displayResult(days, result) {
        const resultDiv = document.querySelector('#task2 .result');
        const formattedDays = formatDays(days);
        const resultText = `Days: ${formattedDays} → Average Calories: ${result}`;
        
        console.log(result);
        
        const resultElement = document.createElement('div');
        resultElement.className = 'result-line';
        resultElement.innerHTML = `<pre>${resultText}</pre>`;
        resultDiv.appendChild(resultElement);
    }

    // Чекаємо завантаження DOM перед виконанням
    document.addEventListener('DOMContentLoaded', () => {
        const testCases = [
            [
                { day: 'monday', calories: 3010 },
                { day: 'tuesday', calories: 3200 },
                { day: 'wednesday', calories: 3120 },
                { day: 'thursday', calories: 2900 },
                { day: 'friday', calories: 3450 },
                { day: 'saturday', calories: 3280 },
                { day: 'sunday', calories: 3300 }
            ],
            [
                { day: 'monday', calories: 2040 },
                { day: 'tuesday', calories: 2270 },
                { day: 'wednesday', calories: 2420 },
                { day: 'thursday', calories: 1900 },
                { day: 'friday', calories: 2370 },
                { day: 'saturday', calories: 2280 },
                { day: 'sunday', calories: 2610 }
            ],
            []
        ];

        testCases.forEach(days => {
            const result = calcAverageCalories(days);
            displayResult(days, result);
        });
    });
})();


console.log(
    calcAverageCalories([
      { day: 'monday', calories: 3010 },
      { day: 'tuesday', calories: 3200 },
      { day: 'wednesday', calories: 3120 },
      { day: 'thursday', calories: 2900 },
      { day: 'friday', calories: 3450 },
      { day: 'saturday', calories: 3280 },
      { day: 'sunday', calories: 3300 },
    ])
  ); // 3180
  
  console.log(
    calcAverageCalories([
      { day: 'monday', calories: 2040 },
      { day: 'tuesday', calories: 2270 },
      { day: 'wednesday', calories: 2420 },
      { day: 'thursday', calories: 1900 },
      { day: 'friday', calories: 2370 },
      { day: 'saturday', calories: 2280 },
      { day: 'sunday', calories: 2610 },
    ])
  ); // 2270

  console.log(
    calcAverageCalories([])
  ); // 0