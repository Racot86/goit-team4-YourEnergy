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
            const response = await fetch('https://script.google.com/macros/s/AKfycbwMbiYIzsnP07ciF6zVwV3jiajZT6_fNFBnYxN1vRJJbuQ2VVaS12a6RwYiRV3IxTjP/exec');
            const data = await response.json();
            
            if (Array.isArray(data.tasks)) {
                // Удаляем дубликаты и невалидные задачи
                this.tasks = Array.from(new Map(
                    data.tasks
                        .filter(task => 
                            task && 
                            task.id && 
                            task.title && 
                            task.description
                        )
                        .map(task => [task.id, task])
                ).values());
            } else {
                this.tasks = [];
            }
            
            this.renderTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    }

    async saveTasks() {
        try {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
            }

            // Дедупликация и валидация перед отправкой
            const uniqueTasks = Array.from(
                new Map(
                    this.tasks
                        .filter(task => task && task.id && task.title)
                        .map(task => [task.id, {
                            ...task,
                            updatedAt: new Date().toISOString()
                        }])
                ).values()
            );

            return new Promise((resolve, reject) => {
                this.saveTimeout = setTimeout(async () => {
                    try {
                        const response = await fetch('https://script.google.com/macros/s/AKfycbwMbiYIzsnP07ciF6zVwV3jiajZT6_fNFBnYxN1vRJJbuQ2VVaS12a6RwYiRV3IxTjP/exec', {
                            method: 'POST',
                            body: JSON.stringify({ 
                                tasks: uniqueTasks,
                                timestamp: new Date().toISOString() 
                            })
                        });
                        
                        if (!response.ok) {
                            throw new Error('Failed to save tasks');
                        }

                        const result = await response.json();
                        if (!result.success) {
                            throw new Error(result.error || 'Unknown error');
                        }

                        // Обновляем локальное состояние
                        this.tasks = uniqueTasks;
                        
                        resolve(result);
                    } catch (error) {
                        console.error('Error saving tasks:', error);
                        reject(error);
                    }
                }, 500);
            });
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
            // Ищем задачу по ID и добавляем проверку на строковое значение
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

    handleFormSubmit() {
        const form = document.getElementById('taskForm');
        
        // Собираем подзадачи
        const subtasks = Array.from(form.querySelectorAll('.subtask-item')).map(item => ({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            text: item.querySelector('.subtask-text').value,
            completed: item.querySelector('.subtask-checkbox').checked
        }));

        // Собираем исполнителей, включая 'empty'
        const assignees = Array.from(form.querySelectorAll('.taskAssignee'))
            .map(select => select.value)
            .filter(value => value); // Убираем пустые значения, но оставляем 'empty'

        // Если нт исполнителей или все исполнители были удалены, добавляем 'empty'
        if (assignees.length === 0) {
            assignees.push('empty');
        }

        const taskData = {
            title: form.taskTitle.value,
            taskNumber: form.taskNumber.value || null,
            description: form.taskDescription.value,
            category: form.taskCategory.value,
            priorityStatus: form.taskPriority.value,
            progressStatus: form.taskStatus.value,
            assignees: assignees,
            subtasks: subtasks
        };

        // Проверяем уникальность номера задачи
        if (taskData.taskNumber) {
            const exists = this.tasks.some(task => 
                task.taskNumber === taskData.taskNumber && 
                task.id !== this.currentTaskId
            );
            if (exists) {
                alert('Задача с таким номером уже существует!');
                return;
            }
        }

        if (this.currentTaskId) {
            this.updateTask(this.currentTaskId, taskData);
        } else {
            this.addTask(taskData);
        }

        this.hideModal();
        this.renderTasks();
    }

    addTask(taskData) {
        const generateUniqueId = () => {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 10000);
            return `${timestamp}-${random}`;
        };

        // Генерируем ID и проверяем его уникальность
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
        
        this.tasks.push(task);
        this.saveTasks();
    }

    async updateTask(taskId, taskData) {
        try {
            const index = this.tasks.findIndex(t => String(t.id) === String(taskId));
            if (index !== -1) {
                // Сохраняем старые значения для сравнения
                const oldTask = this.tasks[index];
                
                // Проверяем, не создаст ли обновление дубликат
                if (taskData.taskNumber) {
                    const duplicateExists = this.tasks.some(t => 
                        t.id !== taskId && 
                        t.taskNumber === taskData.taskNumber
                    );
                    if (duplicateExists) {
                        throw new Error('Task number already exists');
                    }
                }
                
                // Обновляем задачу
                this.tasks[index] = {
                    ...oldTask,
                    title: taskData.title,
                    taskNumber: taskData.taskNumber,
                    description: taskData.description,
                    category: taskData.category,
                    priorityStatus: taskData.priorityStatus,
                    progressStatus: taskData.progressStatus,
                    assignees: taskData.assignees,
                    subtasks: taskData.subtasks,
                    updatedAt: new Date().toISOString()
                };

                // Сохраняем изменения
                await this.saveTasks();
                
                // Перерисовываем задачи
                this.renderTasks();
                this.setupDragAndDrop();
                
            } else {
                console.error('Task not found:', taskId);
            }
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
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
        
        // Форматируем номер задачи: № 7 или № ###
        const taskNumber = task.taskNumber ? `№ ${task.taskNumber}` : '№ ***';
        
        div.innerHTML = `
            <div class="task-card-header">
                <div class="task-left">
                    <h4 class="task-title">${task.title}</h4>
                    <div class="task-number">${taskNumber}</div>
                    <p class="task-description">${task.description}</p>
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
                const task = this.tasks.find(t => String(t.id) === String(taskId));
                
                if (task) {
                    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                    if (taskElement) {
                        zone.appendChild(taskElement);
                    }

                    task.priorityStatus = zone.dataset.priority;
                    task.progressStatus = zone.dataset.status;
                    task.updatedAt = new Date().toISOString();
                    
                    this.saveTasks().catch(error => {
                        console.error('Error saving task:', error);
                        this.renderTasks();
                    });
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

// Исправим инициализацию
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
}); 