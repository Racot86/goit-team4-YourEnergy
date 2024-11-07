class TestTaskManager {
    constructor() {
        this.initTestButton();
    }

    initTestButton() {
        const testButton = document.getElementById('testConnectionBtn');
        if (testButton) {
            testButton.addEventListener('click', () => this.testConnection());
        }
    }

    async testConnection() {
        try {
            console.log('Starting test connection...');
            const url = 'https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec?test=' + Date.now();
            
            this.updateStatus('Connecting...');
            
            console.log('Sending request to:', url);
            
            const response = await fetch(url);
            console.log('Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Array.from(response.headers.entries())
            });
            
            const text = await response.text();
            console.log('Raw response:', text);
            
            const data = JSON.parse(text);
            console.log('Parsed data:', data);
            
            this.updateStatus(`
                Connection successful!<br>
                Message: ${data.message}<br>
                Time: ${data.timestamp}
            `);
            
        } catch (error) {
            console.error('Test connection failed:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            this.updateStatus(`Connection failed: ${error.message}`);
        }
    }

    updateStatus(message) {
        const statusElement = document.getElementById('testConnectionStatus');
        if (statusElement) {
            statusElement.innerHTML = message;
        }
    }
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.testTaskManager = new TestTaskManager();
}); 