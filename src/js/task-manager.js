const IMGBB_API_KEY = '1aad3d84ed2ee332d869dd74a8b19d64'; // Замените на ваш API ключ

class Notification {
    static show(message, type = 'success', actions = null) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            min-width: 200px;
            max-width: 400px;
        `;

        notification.innerHTML = `
            <div class="notification-content" style="margin-bottom: ${actions ? '10px' : '0'}">
                ${message}
            </div>
        `;

        if (actions) {
            const actionsDiv = document.createElement('div');
            actionsDiv.style.cssText = `
                display: flex;
                gap: 10px;
                margin-top: 10px;
            `;

            actions.forEach(action => {
                const button = document.createElement('button');
                button.textContent = action.text;
                button.style.cssText = `
                    padding: 5px 10px;
                    border: none;
                    border-radius: 3px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    cursor: pointer;
                    transition: background 0.2s;
                `;
                button.onmouseover = () => {
                    button.style.background = 'rgba(255,255,255,0.3)';
                };
                button.onmouseout = () => {
                    button.style.background = 'rgba(255,255,255,0.2)';
                };
                button.onclick = () => {
                    action.callback();
                    notification.remove();
                };
                actionsDiv.appendChild(button);
            });

            notification.appendChild(actionsDiv);
        } else {
            // Для успешных уведомлений автоматическое скрытие через 5 секунд
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 7000);
        }

        document.body.appendChild(notification);

        // Добавляем стили для анимаций, если их еще нет
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(120%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        return notification;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentTaskId = null;
        this.modalEscapeListener = null;
        this.loadTheme();
        this.loadTasks().then(() => {
            this.init();
        });
        this.setupImageHandling();
    }

    async loadTasks() {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec');
            const data = await response.json();
            
            // Обрабатываем каждую задачу для получения URL изображения
            this.tasks = await Promise.all((data.tasks || []).map(async task => {
                // Если у задачи есть imageId, получаем URL изображения
                if (task.imageId) {
                    try {
                        // Используем прямой URL для изображения
                        task.imageUrl = `https://i.ibb.co/${task.imageId}/image.jpg`;
                        console.log(`Image URL set for task ${task.id}:`, task.imageUrl);
                    } catch (imgError) {
                        console.error(`Error setting image URL for task ${task.id}:`, imgError);
                    }
                }
                return task;
            }));

            console.log('Loaded tasks with images:', this.tasks);
            this.renderTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    async saveTasks(task) {
        try {
            console.log('Saving task:', task);

            // Подготавливаем данные задачи
            const taskToSave = {
                ...task,
                assignees: task.assignees || ['empty'],
                subtasks: task.subtasks || [],
                updatedAt: new Date().toISOString()
            };

            // Создаем данные для отправки
            const payload = {
                tasks: [taskToSave]
            };

            console.log('Sending payload:', payload);

            // Отправляем запрос
            const response = await fetch('https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec', {
                method: 'POST',
                mode: 'no-cors', // Важно для работы с Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // В режиме no-cors мы не можем прочитать ответ
            // Поэтому просто возвращаем успех
            return { success: true };

        } catch (error) {
            console.error('Error saving task:', error);
            throw error;
        }
    }

    init() {
        this.setupEventListeners();
        this.renderTasks();
        this.setupDragAndDrop();
        
        // Добавляем обработчик для тестовой кнопки
        const testDriveBtn = document.getElementById('testDriveBtn');
        if (testDriveBtn) {
            testDriveBtn.addEventListener('click', () => this.testDriveAccess());
        }

        // Добавляем обработчик тестовой кнопки загрузки изображения
        const testImageUploadBtn = document.getElementById('testImageUploadBtn');
        if (testImageUploadBtn) {
            testImageUploadBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    if (e.target.files.length > 0) {
                        this.testImageUpload(e.target.files[0]);
                    }
                };
                input.click();
            });
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        const addButton = document.getElementById('addTaskBtn');
        console.log('Add button:', addButton);
        
        addButton.addEventListener('click', () => {
            console.log('Add button clicked');
            this.currentTaskId = null;
            this.showModal();
        });

        // Закрытие модального окна по клику на крестик
        document.querySelector('.close').addEventListener('click', () => {
            this.hideModal();
        });

        // Обработка формы
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Добавляем обработчик для переключения темы
        document.getElementById('themeToggleBtn').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Добавляем обрабтчик для поля номера задачи
        const taskNumberInput = document.getElementById('taskNumber');
        taskNumberInput.addEventListener('input', (e) => {
            this.handleTaskNumberInput(e.target.value);
        });

        // Закрываем подсказки при клике вне поля
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.task-number-container')) {
                document.getElementById('taskNumberSuggestions').style.display = 'none';
            }
        });

        // Добавляем обработчик для кнопки добавления исполнителя
        document.getElementById('addAssigneeBtn').addEventListener('click', () => {
            this.addAssigneeField();
        });

        // Добавлям делегирование событий для кнопок удаления исполнителя
        document.getElementById('assigneesList').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-assignee-btn')) {
                const assigneeItem = e.target.closest('.assignee-item');
                if (assigneeItem && document.querySelectorAll('.assignee-item').length > 1) {
                    assigneeItem.remove();
                }
            }
        });

        // Добавляем обработчик для кнопки обавления подзадачи
        document.getElementById('addSubtaskBtn').addEventListener('click', () => {
            this.addSubtaskField();
        });

        // Добавляем делегирование событий для кнопок  подзаа
        document.getElementById('subtasksList').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-subtask-btn')) {
                e.target.closest('.subtask-item').remove();
            }
        });
    }

    addAssigneeField() {
        const assigneesList = document.getElementById('assigneesList');
        assigneesList.appendChild(this.createAssigneeItem('empty'));
    }

    addSubtaskField(text = '', completed = false) {
        const subtasksList = document.getElementById('subtasksList');
        const subtaskItem = document.createElement('div');
        subtaskItem.className = 'subtask-item';
        subtaskItem.innerHTML = `
            <input type="checkbox" class="subtask-checkbox" ${completed ? 'checked' : ''}>
            <input type="text" class="subtask-text" value="${text}" placeholder="Введите подзадачу">
            <button type="button" class="remove-subtask-btn">×</button>
        `;
        subtasksList.appendChild(subtaskItem);
    }

    handleTaskNumberInput(value) {
        const suggestionsContainer = document.getElementById('taskNumberSuggestions');
        const input = document.getElementById('taskNumber');

        // Очищаем стили и подсказки если поле путое
        if (!value) {
            input.classList.remove('exists', 'available');
            suggestionsContainer.style.display = 'none';
            return;
        }

        // Получаем все существующие номера задач
        const existingNumbers = this.tasks
            .map(task => task.taskNumber)
            .filter(number => number) // Фильтруем undefined и пустые значения
            .sort((a, b) => a - b);

        // Проверяем существует ли введенный номер
        const exists = existingNumbers.includes(value);
        input.classList.toggle('exists', exists);
        input.classList.toggle('available', !exists && value.length > 0);

        // Показывм похожие номера
        if (value.length > 0) {
            const suggestions = existingNumbers
                .filter(number => number.toString().includes(value))
                .slice(0, 5); // Показываем только первые 5 совпадений

            if (suggestions.length > 0) {
                suggestionsContainer.innerHTML = suggestions
                    .map(number => `
                        <div class="suggestion-item" onclick="window.taskManager.selectTaskNumber('${number}')">
                            ${number}
                        </div>
                    `)
                    .join('');
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }

    selectTaskNumber(number) {
        document.getElementById('taskNumber').value = number;
        document.getElementById('taskNumberSuggestions').style.display = 'none';
    }

    showModal(taskId = null) {
        console.log('Opening modal for taskId:', taskId);
        console.log('All tasks:', this.tasks);

        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const assigneesList = document.getElementById('assigneesList');
        const deleteBtn = modal.querySelector('.delete-task-btn');
        const imagePreview = document.getElementById('taskImagePreview');
        
        // Очищаем превью изображения
        imagePreview.innerHTML = '';
        
        // Показываем кнопку удаления только при редактировании
        deleteBtn.style.display = taskId ? 'block' : 'none';
        
        // Очищаем список исполнителей
        assigneesList.innerHTML = '';
        
        const subtasksList = document.getElementById('subtasksList');
        subtasksList.innerHTML = '';
        
        if (taskId) {
            const task = this.tasks.find(t => String(t.id) === String(taskId));
            console.log('Found task:', task);
            
            if (task) {
                // Заполняем основные поля
                form.taskTitle.value = task.title || '';
                form.taskNumber.value = task.taskNumber || '';
                form.taskDescription.value = task.description || '';
                form.taskCategory.value = task.category || 'Must_Have';
                form.taskPriority.value = task.priorityStatus || 'normal';
                form.taskStatus.value = task.progressStatus || 'who-take';
                
                // Отображаем существующее изображение с ImgBB
                if (task.imageUrl) {
                    console.log('Rendering image preview:', task.imageUrl);
                    const container = document.createElement('div');
                    container.className = 'preview-container';
                    container.style.cssText = `
                        width: 100%;
                        max-height: 200px;
                        overflow: hidden;
                        border-radius: 4px;
                        position: relative;
                        margin-top: 10px;
                    `;
                    
                    const img = document.createElement('img');
                    img.src = task.imageUrl;
                    img.style.cssText = `
                        width: 100%;
                        height: auto;
                        object-fit: contain;
                    `;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-image-btn';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = () => {
                        task.imageUrl = null;
                        task.imageId = null;
                        container.remove();
                    };
                    
                    container.appendChild(img);
                    container.appendChild(removeBtn);
                    imagePreview.appendChild(container);
                }
                
                // Обработка исполнителей
                const assignees = Array.isArray(task.assignees) ? task.assignees : [task.assignee || 'empty'];
                console.log('Processing assignees:', assignees);
                assignees.forEach(assignee => {
                    const assigneeItem = this.createAssigneeItem(assignee);
                    assigneesList.appendChild(assigneeItem);
                });
                
                // Обработка подзадач
                if (task.subtasks && Array.isArray(task.subtasks)) {
                    console.log('Processing subtasks:', task.subtasks);
                    task.subtasks.forEach(subtask => {
                        if (typeof subtask === 'string') {
                            this.addSubtaskField(subtask, false);
                        } else if (typeof subtask === 'object') {
                            this.addSubtaskField(subtask.text, subtask.completed);
                        }
                    });
                }
                
                this.currentTaskId = taskId;
            } else {
                console.error('Task not found:', taskId);
            }
        } else {
            form.reset();
            form.taskCategory.value = 'Must_Have';
            assigneesList.appendChild(this.createAssigneeItem('empty'));
        }

        modal.style.display = 'block';
        
        // Добавляем обработчик дя кнопки удаления
        deleteBtn.onclick = () => this.showDeleteConfirmation(taskId);
        
        // Добавляем обработчик Escape
        this.modalEscapeListener = (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        };
        document.addEventListener('keydown', this.modalEscapeListener);

        // Добавляем обработчик клика вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
    }

    showDeleteConfirmation(taskId) {
        const confirmModal = document.getElementById('deleteConfirmModal');
        confirmModal.style.display = 'block';

        // Обработчик подтверждения удаления
        const handleConfirm = () => {
            this.deleteTask(taskId);
            confirmModal.style.display = 'none';
            this.hideModal();
            cleanup();
        };

        // Обработчик отмены
        const handleCancel = () => {
            confirmModal.style.display = 'none';
            cleanup();
        };

        // Обработчик клика вне модального окна
        const handleOutsideClick = (e) => {
            if (e.target === confirmModal) {
                confirmModal.style.display = 'none';
                cleanup();
            }
        };

        // Обработчик клавиши Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                confirmModal.style.display = 'none';
                cleanup();
            }
        };

        // Очистка обработчиков
        const cleanup = () => {
            document.getElementById('confirmDelete').removeEventListener('click', handleConfirm);
            document.getElementById('cancelDelete').removeEventListener('click', handleCancel);
            confirmModal.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };

        // Добавляем обработчики
        document.getElementById('confirmDelete').addEventListener('click', handleConfirm);
        document.getElementById('cancelDelete').addEventListener('click', handleCancel);
        confirmModal.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
    }

    hideModal() {
        const modal = document.getElementById('taskModal');
        modal.style.display = 'none';
        
        // Удаляем обработчк Escape при закрытии модального окна
        if (this.modalEscapeListener) {
            document.removeEventListener('keydown', this.modalEscapeListener);
            this.modalEscapeListener = null;
        }
    }

    async handleFormSubmit() {
        try {
            const form = document.getElementById('taskForm');
            
            // Собираем данные формы
            const taskData = {
                title: form.taskTitle.value,
                taskNumber: form.taskNumber.value || null,
                description: form.taskDescription.value,
                category: form.taskCategory.value,
                priorityStatus: form.taskPriority.value,
                progressStatus: form.taskStatus.value,
                assignees: Array.from(form.querySelectorAll('.taskAssignee'))
                    .map(select => select.value)
                    .filter(value => value) || ['empty'],
                subtasks: Array.from(form.querySelectorAll('.subtask-item')).map(item => ({
                    id: Date.now() + Math.random().toString(36).substr(2, 9),
                    text: item.querySelector('.subtask-text').value,
                    completed: item.querySelector('.subtask-checkbox').checked
                }))
            };

            // Если есть новое изображение, загружаем его на ImgBB
            if (this.currentImage) {
                try {
                    const imageResult = await this.uploadImage(this.currentImage);
                    if (imageResult && imageResult.success) {
                        taskData.imageUrl = imageResult.url;
                        taskData.imageId = imageResult.id;
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    Notification.show('Ошибка при загрузке изображения', 'error');
                }
            }

            // Сразу закрываем модальное окно
            this.hideModal();

            if (this.currentTaskId) {
                await this.updateTask(this.currentTaskId, taskData);
            } else {
                await this.addTask(taskData);
            }

            // Очищаем текущее изображение
            this.currentImage = null;
            document.getElementById('taskImagePreview').innerHTML = '';

        } catch (error) {
            console.error('Error in handleFormSubmit:', error);
            Notification.show('Произошла ошибка', 'error');
        }
    }

    async uploadImage(file) {
        try {
            console.log('Starting image upload to ImgBB...');
            
            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', IMGBB_API_KEY);

            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('ImgBB response:', result);

            if (result.success) {
                return {
                    success: true,
                    id: result.data.id,
                    url: result.data.url,
                    delete_url: result.data.delete_url,
                    thumbnail: result.data.thumb.url
                };
            } else {
                throw new Error(result.error?.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading to ImgBB:', error);
            throw error;
        }
    }

    // Добавим тестовый метод
    async testImageUpload(file) {
        try {
            console.log('Starting test image upload...');
            const result = await this.uploadImage(file);
            console.log('Test upload result:', result);
            Notification.show(`
                Изображение успешно загружено!<br>
                ID: ${result.id}<br>
                URL: <a href="${result.url}" target="_blank">Открыть изображение</a>
            `);
            return result;
        } catch (error) {
            console.error('Test image upload failed:', error);
            Notification.show(`❌ Ошибка зарузки: ${error.message}`, 'error');
            throw error;
        }
    }

    // Вспомогательный метод для конвертации файла в base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    async addTask(taskData) {
        try {
            const generateUniqueId = () => {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 10000);
                return `${timestamp}-${random}`;
            };

            let taskId;
            do {
                taskId = generateUniqueId();
            } while (this.tasks.some(task => task.id === taskId));

            const task = {
                id: taskId,
                taskNumber: taskData.taskNumber || null,
                title: taskData.title,
                description: taskData.description,
                category: taskData.category || 'Must_Have',
                priorityStatus: taskData.priorityStatus,
                progressStatus: taskData.progressStatus,
                assignees: taskData.assignees,
                subtasks: taskData.subtasks || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Сначала сохраняем задачу без изображения
            await this.saveTasks(task);
            
            // Если есть изображение, загружаем его отдельно
            if (this.currentImage) {
                try {
                    const imageResult = await this.uploadImage(this.currentImage);
                    if (imageResult && imageResult.success) {
                        task.imageId = imageResult.id;
                        task.imageUrl = imageResult.url;
                        task.imageThumbnail = imageResult.thumbnail;
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    Notification.show('Ошибка при загрузке изображения', 'error');
                    // Продолжаем выполнение даже если загрузка изображения не удалась
                }
            }

            this.tasks.push(task);
            this.renderTasks();
            this.hideModal();
            
            // Очищаем текущее изображение
            this.currentImage = null;
            document.getElementById('taskImagePreview').innerHTML = '';
            
            Notification.show('Задача успешно создана');
            
        } catch (error) {
            console.error('Error in addTask:', error);
            Notification.show('Ошибка при создании задачи', 'error');
            throw error;
        }
    }

    async updateTask(taskId, taskData) {
        try {
            const index = this.tasks.findIndex(t => String(t.id) === String(taskId));
            if (index !== -1) {
                const oldTask = this.tasks[index];
                
                const updatedTask = {
                    ...oldTask,
                    ...taskData,
                    updatedAt: new Date().toISOString()
                };

                // Если есть новое изображение
                if (this.currentImage) {
                    try {
                        const imageResult = await this.uploadImage(this.currentImage);
                        if (imageResult && imageResult.id) {
                            updatedTask.imageId = imageResult.id;
                        }
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        Notification.show('Ошибка при загрузке изображения', 'error');
                    }
                }

                // Отправляем запрос на обновление
                const response = await fetch('https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tasks: [updatedTask] })
                });

                // Обновляем локальное состояние
                this.tasks[index] = updatedTask;
                this.renderTasks();
                
                // Очищаем екущее изображение
                this.currentImage = null;
                document.getElementById('taskImagePreview').innerHTML = '';
                
                Notification.show('Задача успешно обновлена');

            } else {
                throw new Error('Task not found: ' + taskId);
            }
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    async deleteTaskOnServer(taskId) {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    tasks: [],
                    action: 'delete',
                    taskId: taskId 
                })
            });
            
            // В режиме no-cors мы не можем прочитать ответ
            // Поэтому просто возвращаем успешный результат
            return { success: true };
        } catch (error) {
            console.error('Error in deleteTaskOnServer:', error);
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            const task = this.tasks.find(t => t.id === taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            // Сначала удаляем локально
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.renderTasks();
            
            // Затем отправляем запрос на сервер
            await this.deleteTaskOnServer(taskId);
            
            const truncatedTitle = task.title.length > 15 ? 
                task.title.substring(0, 15) + '...' : 
                task.title;
            Notification.show(`Задача "${truncatedTitle}" удалена`);
            
            // Закрываем модальное окно
            this.hideModal();
        } catch (error) {
            console.error('Error deleting task:', error);
            Notification.show('Ошибка при удалении задачи', 'error');
            
            // В случае ошибки восстанавливаем задачу локально
            if (task) {
                this.tasks.push(task);
                this.renderTasks();
            }
        }
    }

    renderTasks() {
        this.renderImagesGallery();
        this.renderCompactGrid();
        // Очищаем все зоны
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.innerHTML = '';
        });

        // Отрисовываем задачи в основной таблице
        this.tasks.forEach(task => {
            // Проверяем и конвертируем старый формат в новый
            if (!task.assignees && task.assignee) {
                task.assignees = [task.assignee];
                delete task.assignee;
            }
            
            // Проверяем, есть ли среди исполнителей кто-то кроме Empty
            const hasNonEmptyAssignee = task.assignees.some(assignee => assignee !== 'empty');
            
            // Создаем элемент задачи только если есть не-Empty исполнитель
            if (hasNonEmptyAssignee) {
                console.log('Rendering task with image:', task.imageUrl);
                const taskElement = this.createTaskElement(task);
                const dropZone = document.querySelector(
                    `.drop-zone[data-priority="${task.priorityStatus}"][data-status="${task.progressStatus}"]`
                );
                if (dropZone) {
                    dropZone.appendChild(taskElement);
                }
            }
        });

        // Отрисовываем Must Have задачи (включая Empty)
        const mustHaveGrid = document.querySelector('.must-have-grid');
        if (mustHaveGrid) {
            mustHaveGrid.innerHTML = '';
            const mustHaveTasks = this.tasks.filter(task => task.category === 'Must_Have');
            const mustHaveByAssignee = this.groupTasksByAssignee(mustHaveTasks, true);
            this.renderGroupedTasks(mustHaveByAssignee, mustHaveGrid);
        }

        // Отрисовываем Upgrade задачи (включая Empty)
        const upgradeGrid = document.querySelector('.upgrade-grid');
        if (upgradeGrid) {
            upgradeGrid.innerHTML = '';
            const upgradeTasks = this.tasks.filter(task => task.category === 'Upgrade');
            const upgradeByAssignee = this.groupTasksByAssignee(upgradeTasks, true);
            this.renderGroupedTasks(upgradeByAssignee, upgradeGrid);
        }
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = 'task-card';
        div.draggable = true;
        div.dataset.taskId = task.id;
        
        // Фильтруем исполнителей, исключая Empty
        const nonEmptyAssignees = (task.assignees || [task.assignee || 'empty'])
            .filter(assignee => assignee !== 'empty');
        
        // Форматируем номер задачи
        const taskNumber = task.taskNumber ? `№ ${task.taskNumber}` : '№ ***';
        
        // Добавляем разметку для изображения, если оно есть
        const imageHtml = task.imageUrl ? `
            <div class="task-image">
                <img src="${task.imageUrl}" alt="Task image" style="
                    max-width: 100%;
                    max-height: 150px;
                    object-fit: contain;
                    border-radius: 4px;
                    margin-top: 8px;
                ">
            </div>
        ` : '';
        
        div.innerHTML = `
            <div class="task-card-header">
                <div class="task-left">
                    <h4 class="task-title">${task.title}</h4>
                    <div class="task-number">${taskNumber}</div>
                    <p class="task-description">${task.description}</p>
                    ${imageHtml}
                </div>
                <div class="task-right">
                    <div class="assignees-list">
                        ${nonEmptyAssignees.map(assignee => `
                            <div class="assignee-badge">${assignee}</div>
                        `).join('')}
                    </div>
                    <div class="task-status-badge">${task.progressStatus}</div>
                    <div class="category-badge" data-category="${task.category}">${task.category}</div>
                </div>
            </div>
        `;

        // Добавляем отображение прогресса подзадач
        if (task.subtasks?.length > 0) {
            const completed = task.subtasks.filter(st => st.completed).length;
            const total = task.subtasks.length;
            div.querySelector('.task-left').insertAdjacentHTML('beforeend', `
                <div class="subtasks-progress">
                    ${completed}/${total}
                </div>
            `);
        }

        div.addEventListener('click', () => this.showModal(task.id));
        return div;
    }

    setupDragAndDrop() {
        console.log('Setting up drag and drop');
        
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.remove('dragging');
            }
        });

        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('dragover');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('dragover');
            });

            zone.addEventListener('drop', async (e) => {
                e.preventDefault();
                zone.classList.remove('dragover');
                
                const taskId = e.dataTransfer.getData('text/plain');
                const taskIndex = this.tasks.findIndex(t => String(t.id) === String(taskId));
                
                if (taskIndex !== -1) {
                    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                    if (taskElement) {
                        zone.appendChild(taskElement);
                    }

                    const updatedTask = {
                        ...this.tasks[taskIndex],
                        priorityStatus: zone.dataset.priority,
                        progressStatus: zone.dataset.status,
                        updatedAt: new Date().toISOString()
                    };

                    try {
                        // Обновляем UI сразу
                        this.tasks[taskIndex] = updatedTask;
                        
                        // Сохраняем изменения
                        await this.saveTasks(updatedTask);
                        
                        // Показываем уведомление об успехе
                        const truncatedTitle = updatedTask.title.length > 15 ? 
                            updatedTask.title.substring(0, 15) + '...' : 
                            updatedTask.title;
                        const assignee = updatedTask.assignees.filter(a => a !== 'empty')[0] || 'не назначен';
                        
                        Notification.show(
                            `Задача "${truncatedTitle}" перемещена\n` +
                            `Исполнитель: ${assignee}\n` +
                            `Номер: ${updatedTask.taskNumber || 'не присвоен'}`
                        );
                    } catch (error) {
                        console.error('Error saving task:', error);
                        // Возвращаем предыдущее состояние при ошибке
                        this.tasks[taskIndex] = { ...this.tasks[taskIndex] };
                        this.renderTasks();
                        Notification.show('Ошибка при сохранении позиции', 'error');
                    }
                }
            });
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Обновленный метод groupTasksByAssignee с параметром includeEmpty
    groupTasksByAssignee(tasks, includeEmpty = false) {
        const grouped = {};
        tasks.forEach(task => {
            const assignees = task.assignees || [task.assignee || 'empty'];
            assignees.forEach(assignee => {
                // Включаем Empty только если includeEmpty = true
                if (assignee !== 'empty' || includeEmpty) {
                    if (!grouped[assignee]) {
                        grouped[assignee] = [];
                    }
                    if (!grouped[assignee].includes(task)) {
                        grouped[assignee].push(task);
                    }
                }
            });
        });
        return grouped;
    }

    // Обновим метод renderGroupedTasks для поддержки множественных исполнителей
    renderGroupedTasks(groupedTasks, container) {
        Object.entries(groupedTasks).forEach(([assignee, tasks]) => {
            // Создаем колонку с исполнителем
            const assigneeColumn = document.createElement('div');
            assigneeColumn.className = 'task-assignee';
            assigneeColumn.innerHTML = `
                <div class="assignee-name ${assignee === 'empty' ? 'empty-assignee' : ''}">
                    ${assignee}
                </div>
                ${tasks.map(task => `
                    <div class="task-status" data-task-id="${task.id}">${task.progressStatus}</div>
                `).join('')}
            `;

            assigneeColumn.addEventListener('click', (e) => {
                const taskId = e.target.dataset.taskId;
                if (taskId) {
                    this.showModal(taskId);
                }
            });
            container.appendChild(assigneeColumn);

            // Создаем колонку с задачами
            const tasksColumn = document.createElement('div');
            tasksColumn.className = 'task-content';
            tasksColumn.innerHTML = tasks.map(task => `
                <div class="task-item" data-task-id="${task.id}">
                    <h4>${task.title}</h4>
                    <div class="task-assignees">
                        ${(task.assignees || [task.assignee || 'empty']).map(a => `
                            <span class="assignee-badge">${a}</span>
                        `).join('')}
                    </div>
                    <p>${task.description}</p>
                    ${task.imageUrl ? `
                        <div class="task-image">
                            <img src="${task.imageUrl}" alt="Task image" style="
                                max-width: 100%;
                                max-height: 150px;
                                object-fit: contain;
                                border-radius: 4px;
                                margin-top: 8px;
                            ">
                        </div>
                    ` : ''}
                </div>
            `).join('');

            tasksColumn.addEventListener('click', (e) => {
                const taskItem = e.target.closest('.task-item');
                if (taskItem) {
                    const taskId = taskItem.dataset.taskId;
                    this.showModal(taskId);
                }
            });
            container.appendChild(tasksColumn);
        });
    }

    createAssigneeSelect() {
        return `
            <select class="taskAssignee" required>
                <option value="empty">Empty</option>
                <option value="Andrii Sushylnikov">Andrii Sushylnikov</option>
                <option value="Daria Honcharuk">Daria Honcharuk</option>
                <option value="Dmytro Mayevsky">Dmytro Mayevsky</option>
                <option value="Maks Ki">Maks Ki</option>
                <option value="Mariia Sv.">Mariia Sv.</option>
                <option value="Roman Turas">Roman Turas</option>
                <option value="Viktoriia Didenko">Viktoriia Didenko</option>
                <option value="Hryhorii Chernysh">Hryhorii Chernysh (Mentor)</option>
                <option value="Daria">Daria (client manager)</option>
                <option value="Lesya Katanova">Lesya Katanova</option>
                <option value="Olena Deineha">Olena Deineha</option>
            </select>
        `;
    }

    createAssigneeItem(selectedValue = 'empty') {
        const div = document.createElement('div');
        div.className = 'assignee-item';
        div.innerHTML = `
            ${this.createAssigneeSelect()}
            <button type="button" class="remove-assignee-btn">×</button>
        `;
        div.querySelector('select').value = selectedValue;
        return div;
    }

    setupImageHandling() {
        const addImageBtn = document.getElementById('addImageBtn');
        const imageInput = document.getElementById('taskImageInput');
        const imagePreview = document.getElementById('taskImagePreview');

        addImageBtn.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const preview = await this.previewImage(file);
                    imagePreview.innerHTML = `
                        <div class="preview-container">
                            <img src="${preview}" alt="Preview">
                            <button class="remove-image-btn" onclick="taskManager.removeImage()">×</button>
                        </div>
                    `;
                    this.currentImage = file;
                } catch (error) {
                    console.error('Error previewing image:', error);
                    Notification.show('Ошибка при загрузке изображения', 'error');
                }
            }
        });
    }

    previewImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    removeImage() {
        const imagePreview = document.getElementById('taskImagePreview');
        imagePreview.innerHTML = '';
        this.currentImage = null;
        document.getElementById('taskImageInput').value = '';
    }

    renderImagesGallery() {
        const galleryContainer = document.getElementById('taskImagesGrid');
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';
        
        // Устанавливаем стили для контейнера галереи
        galleryContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 20px;
            width: 100%;
            max-width: calc(100% - 40px);
            margin: 0 auto 20px;
            background: var(--secondary-background);
            border-radius: 8px;
            overflow-x: auto;
        `;
        
        const images = this.tasks
            .filter(task => task.imageUrl)
            .map(task => ({
                url: task.imageUrl,
                taskId: task.id,
                taskTitle: task.title,
                assignees: task.assignees?.filter(a => a !== 'empty') || []
            }));

        images.forEach(image => {
            const container = document.createElement('div');
            container.className = 'gallery-image-container';
            container.style.cssText = `
                flex: 0 0 120px;
                height: 160px;
                border-radius: 4px;
                cursor: pointer;
                position: relative;
                transition: transform 0.2s;
                background: rgba(0, 0, 0, 0.05);
                padding: 8px;
                display: flex;
                flex-direction: column;
            `;
            
            // Обрезаем заголовок до 15 символов
            const truncatedTitle = image.taskTitle.length > 15 
                ? image.taskTitle.substring(0, 15) + '...' 
                : image.taskTitle;
            
            // Добавляем заголовок
            const title = document.createElement('div');
            title.style.cssText = `
                text-align: center;
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            title.textContent = truncatedTitle;
            title.title = image.taskTitle; // Полный текст в подсказке
            
            // Контейнер для изображения
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = `
                flex: 1;
                overflow: hidden;
                border-radius: 4px;
                margin: 4px 0;
            `;
            
            const img = document.createElement('img');
            img.src = image.url;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
            `;
            
            // Обрезаем список исполнителей до 25 символов
            const assigneesText = image.assignees.join(', ');
            const truncatedAssignees = assigneesText.length > 25 
                ? assigneesText.substring(0, 25) + '...' 
                : assigneesText;
            
            // Добавляем имена исполнителей
            const assignees = document.createElement('div');
            assignees.style.cssText = `
                text-align: right;
                font-size: 11px;
                color: var(--text-secondary);
                margin-top: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            assignees.textContent = truncatedAssignees || 'Нет исполнителя';
            assignees.title = assigneesText; // Полный текст в подсказке
            
            // Эффекты при наведении
            container.onmouseover = () => {
                container.style.transform = 'scale(1.05)';
            };
            container.onmouseout = () => {
                container.style.transform = 'scale(1)';
            };
            
            container.onclick = () => this.showModal(image.taskId);
            
            imgContainer.appendChild(img);
            container.appendChild(title);
            container.appendChild(imgContainer);
            container.appendChild(assignees);
            galleryContainer.appendChild(container);
        });

        // Если нет изображений, скрываем галерею
        galleryContainer.style.display = images.length ? 'flex' : 'none';
    }

    // Добавим метод для тестирования доступа к Drive
    async testDriveAccess() {
        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'GET'
            });
            
            if (response.ok) {
                console.log('ImgBB connection OK');
                return true;
            } else {
                throw new Error('ImgBB connection failed');
            }
        } catch (error) {
            console.error('ImgBB test error:', error);
            throw error;
        }
    }

    renderCompactGrid() {
        const gridContainer = document.getElementById('tasksCompactGrid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';
        
        // Получаем все задачи и раз��еляем их на активные и пустые
        const sortedTasks = [...this.tasks].sort((a, b) => {
            const numA = parseInt(a.taskNumber) || 0;
            const numB = parseInt(b.taskNumber) || 0;
            return numA - numB;
        });

        // Разделяем задачи на две группы
        const activeTasks = sortedTasks.filter(task => 
            task.assignees?.some(assignee => assignee !== 'empty')
        );
        
        const emptyTasks = sortedTasks.filter(task => 
            !task.assignees?.some(assignee => assignee !== 'empty')
        );

        // Сначала добавляем активные задачи
        activeTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'compact-task-item';
            
            // Номер задачи
            const number = document.createElement('span');
            number.className = 'compact-task-number';
            number.textContent = task.taskNumber ? `№${task.taskNumber}` : '№***';
            
            // Иконка изображения
            const imageIcon = document.createElement('span');
            imageIcon.className = 'compact-task-image-icon';
            imageIcon.textContent = task.imageUrl ? '🖼️' : '👽';
            
            // Заголовок задачи
            const title = document.createElement('span');
            title.className = 'compact-task-title';
            title.textContent = task.title.length > 15 
                ? task.title.substring(0, 15) + '...' 
                : task.title;
            title.title = task.title;
            
            // Статус
            const status = document.createElement('span');
            status.className = 'compact-task-status';
            if (task.progressStatus === 'done') {
                status.textContent = '✅';
            } else {
                status.textContent = '🔨';
            }
            
            taskElement.appendChild(number);
            taskElement.appendChild(imageIcon);
            taskElement.appendChild(title);
            taskElement.appendChild(status);
            
            taskElement.addEventListener('click', () => this.showModal(task.id));
            
            gridContainer.appendChild(taskElement);
        });

        // Затем добавляем пустые задачи
        emptyTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'compact-task-item empty-task';
            
            const number = document.createElement('span');
            number.className = 'compact-task-number';
            number.textContent = task.taskNumber ? `№${task.taskNumber}` : '№***';
            
            // Иконка изображения
            const imageIcon = document.createElement('span');
            imageIcon.className = 'compact-task-image-icon';
            imageIcon.textContent = task.imageUrl ? '🖼️' : '👽';
            
            const title = document.createElement('span');
            title.className = 'compact-task-title';
            title.textContent = task.title.length > 15 
                ? task.title.substring(0, 15) + '...' 
                : task.title;
            title.title = task.title;
            
            taskElement.appendChild(number);
            taskElement.appendChild(imageIcon);
            taskElement.appendChild(title);
            
            taskElement.addEventListener('click', () => this.showModal(task.id));
            
            gridContainer.appendChild(taskElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const imagePreview = document.getElementById('taskImagePreview');
    const fullscreenContainer = document.getElementById('fullscreenImageContainer');
    const fullscreenImage = document.getElementById('fullscreenImage');

    imagePreview.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            fullscreenImage.src = e.target.src;
            fullscreenContainer.style.display = 'flex';
        }
    });

    fullscreenContainer.addEventListener('click', () => {
        fullscreenContainer.style.display = 'none';
    });
});
// Испрви инициализацию
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
}); 