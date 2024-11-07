// Определяем класс для уведомлений перед классом TaskManager
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
    }

    async loadTasks() {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec');
            const data = await response.json();
            this.tasks = data.tasks || [];
            this.renderTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    async saveTasks(taskToSave) {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec', {
                method: 'POST',
                body: JSON.stringify({ tasks: [taskToSave] })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save tasks');
            }
            
            return response;
        } catch (error) {
            console.error('Error in saveTasks:', error);
            throw error;
        }
    }

    init() {
        this.setupEventListeners();
        this.renderTasks();
        this.setupDragAndDrop();
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

        // Добавляем обработчик для поля номера задачи
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

        // Добавляем делегирование событий для кнопок удаления исполнителя
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

        // Добавляем делегирование событий для кнопок удаления подзадачи
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

        // Очищаем стили и подсказки если поле пустое
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
        
        // Показываем кнопку удаления только при редактировании
        deleteBtn.style.display = taskId ? 'block' : 'none';
        
        // Очищаем список исполнителей
        assigneesList.innerHTML = '';
        
        const subtasksList = document.getElementById('subtasksList');
        subtasksList.innerHTML = '';
        
        if (taskId) {
            // ем задачу по ID и добавляем проверку на строковое значение
            const task = this.tasks.find(t => String(t.id) === String(taskId));
            console.log('Found task:', task);
            
            if (task) {
                // Заполняем основ��ые поля
                form.taskTitle.value = task.title || '';
                form.taskNumber.value = task.taskNumber || '';
                form.taskDescription.value = task.description || '';
                form.taskCategory.value = task.category || 'Must_Have';
                form.taskPriority.value = task.priorityStatus || 'normal';
                form.taskStatus.value = task.progressStatus || 'who-take';
                
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
        
        // Добавляем обработчик для кнопки удаления
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

            // Сразу закрываем модальное окно
            this.hideModal();

            if (this.currentTaskId) {
                this.updateTask(this.currentTaskId, taskData);
            } else {
                this.addTask(taskData);
            }
        } catch (error) {
            console.error('Error in handleFormSubmit:', error);
            Notification.show('Произошла ошибка', 'error');
        }
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
                updatedAt: new Date().toISOString(),
                imageId: taskData.imageId || null
            };
            
            // Сначала добавляем в UI для быстрой реакции
            this.tasks.push(task);
            this.renderTasks();
            this.hideModal(); // Сразу закрываем модальное окно
            
            try {
                // Затем сохраняем на сервере
                await this.saveTasks(task);
                Notification.show('Задача успешно сохранена');
            } catch (error) {
                console.error('Error saving task:', error);
                // Удаляем задачу из UI если сохранение не удалось
                this.tasks = this.tasks.filter(t => t.id !== task.id);
                this.renderTasks();
                
                Notification.show('Ошибка при сохранении задачи', 'error', [
                    {
                        text: 'Редактировать',
                        callback: () => {
                            this.currentTaskId = task.id;
                            this.showModal(task.id);
                        }
                    },
                    {
                        text: 'Удалить',
                        callback: () => {
                            // Задача уже удалена из this.tasks
                            this.renderTasks();
                        }
                    }
                ]);
            }
        } catch (error) {
            console.error('Error in addTask:', error);
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
                    title: taskData.title,
                    taskNumber: taskData.taskNumber,
                    description: taskData.description,
                    category: taskData.category,
                    priorityStatus: taskData.priorityStatus,
                    progressStatus: taskData.progressStatus,
                    assignees: taskData.assignees,
                    subtasks: taskData.subtasks,
                    updatedAt: new Date().toISOString(),
                    imageId: taskData.imageId || oldTask.imageId
                };

                // Сначала обновляем UI
                this.tasks[index] = updatedTask;
                this.renderTasks();
                this.hideModal();

                // Потом сохраняем на сервере
                this.saveTasks(updatedTask)
                    .then(() => {
                        const truncatedTitle = updatedTask.title.length > 15 ? 
                            updatedTask.title.substring(0, 15) + '...' : 
                            updatedTask.title;
                        const assignee = updatedTask.assignees.filter(a => a !== 'empty')[0] || 'не назначен';
                        Notification.show(
                            `Задача "${truncatedTitle}" обновлена\n` +
                            `Исполнитель: ${assignee}\n` +
                            `Номер: ${updatedTask.taskNumber || 'не присвоен'}`
                        );
                    })
                    .catch(error => {
                        console.error('Error saving updated task:', error);
                        // Возвращаем старую версию задачи при ошибке
                        this.tasks[index] = oldTask;
                        this.renderTasks();
                        Notification.show('Ошибка при сохранении изменений', 'error', [
                            {
                                text: 'Повторить',
                                callback: () => this.updateTask(taskId, taskData)
                            }
                        ]);
                    });
                
            } else {
                console.error('Task not found:', taskId);
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
                body: JSON.stringify({ 
                    action: 'delete',
                    taskId: taskId 
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            
            return response;
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

            // Сначала удаляем на сервере
            await this.deleteTaskOnServer(taskId);
            
            // Если удаление на сервере прошло успешно, удаляем локально
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.renderTasks();
            
            const truncatedTitle = task.title.length > 15 ? 
                task.title.substring(0, 15) + '...' : 
                task.title;
            Notification.show(`Задача "${truncatedTitle}" удалена`);
        } catch (error) {
            console.error('Error deleting task:', error);
            Notification.show('Ошибка при удалении задачи', 'error');
        }
    }

    renderTasks() {
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
        
        // Форматиуем номер задачи: № 7 или № ###
        const taskNumber = task.taskNumber ? `№ ${task.taskNumber}` : '№ ***';
        
        // Добавляем разметку для изображения, если оно есть
        const imageHtml = task.image ? `
            <div class="task-image">
                <img src="${task.image.url}" alt="Task image">
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
        
        // Удаляем старые обработчики
        document.removeEventListener('dragstart', this.handleDragStart);
        document.removeEventListener('dragend', this.handleDragEnd);
        
        this.handleDragStart = (e) => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
            }
        };

        this.handleDragEnd = (e) => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.remove('dragging');
            }
        };

        document.addEventListener('dragstart', this.handleDragStart);
        document.addEventListener('dragend', this.handleDragEnd);

        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.removeEventListener('dragover', this.handleDragOver);
            zone.removeEventListener('dragleave', this.handleDragLeave);
            zone.removeEventListener('drop', this.handleDrop);

            this.handleDragOver = (e) => {
                e.preventDefault();
                zone.classList.add('dragover');
            };

            this.handleDragLeave = () => {
                zone.classList.remove('dragover');
            };

            this.handleDrop = async (e) => {
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
                        await this.saveTasks(updatedTask);
                        this.tasks[taskIndex] = updatedTask;
                        
                        // Форматируем информацию для уведомления
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
                        this.renderTasks();
                        Notification.show('Ошибка при сохранении позиции', 'error');
                    }
                }
            };

            zone.addEventListener('dragover', this.handleDragOver);
            zone.addEventListener('dragleave', this.handleDragLeave);
            zone.addEventListener('drop', this.handleDrop);
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
}

// Испрви инициализацию
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
}); 