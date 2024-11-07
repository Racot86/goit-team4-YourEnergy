class TestTaskManager {
    constructor() {
        this.initTestButtons();
    }

    initTestButtons() {
        // Существующая кнопка тестирования соединения
        const testButton = document.getElementById('testConnectionBtn');
        if (testButton) {
            testButton.addEventListener('click', () => this.testConnection());
        }

        // Новая кнопка для тестирования загрузки изображения
        const testImageButton = document.getElementById('testImageUploadBtn');
        if (testImageButton) {
            testImageButton.addEventListener('click', () => this.testImageUpload());
        }

        // Скрытый input для выбора файла
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'testImageInput';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.uploadTestImage(e.target.files[0]);
            }
        });
    }

    async testImageUpload() {
        const fileInput = document.getElementById('testImageInput');
        fileInput.click();
    }

    async uploadTestImage(file) {
        try {
            this.updateStatus('Начинаем загрузку изображения...');
            console.log('Starting upload for file:', file.name);
            
            // Конвертируем файл в base64
            this.updateStatus('Конвертация файла...');
            const base64Image = await this.fileToBase64(file);
            console.log('File converted to base64, length:', base64Image.length);
            
            // Создаем данные для отправки
            const uploadData = {
                type: 'upload_image',
                taskId: 'test-' + Date.now(),
                image: base64Image,
                fileName: file.name,
                contentType: file.type
            };
            
            this.updateStatus('Отправка запроса...');
            console.log('Sending request with data:', {
                ...uploadData,
                image: uploadData.image.substring(0, 50) + '...' // Логируем только начало base64
            });

            // Отправляем запрос
            const response = await fetch('https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadData),
                mode: 'cors' // Явно указываем режим CORS
            });

            console.log('Response received:', {
                status: response.status,
                statusText: response.statusText,
                headers: Array.from(response.headers.entries())
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.updateStatus('Получен ответ, обработка...');
            const text = await response.text();
            console.log('Raw response:', text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse response:', e);
                throw new Error('Invalid JSON response: ' + text);
            }
            
            if (result.error) {
                throw new Error(result.error);
            }

            console.log('Upload successful:', result);
            this.updateStatus(`
                Изображение успешно загружено!<br>
                ID: ${result.id}<br>
                URL: <a href="${result.url}" target="_blank">Открыть изображение</a>
            `);

        } catch (error) {
            console.error('Test image upload failed:', error);
            this.updateStatus(`❌ Ошибка загрузки: ${error.message}`);
            
            // Добавляем детальную информацию об ошибке в консоль
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
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