function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        // Handle Telegram updates
        if (data.message && data.update_id) {
            handleTelegramMessage(data.message);
            return ContentService.createTextOutput(JSON.stringify({ ok: true }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // Обработка удаления задачи
        if (data.action === 'delete' && data.taskId) {
            const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
            const currentData = sheet.getDataRange().getValues();
            const [headers, ...rows] = currentData;

            // Ищем индекс строки для удаления
            const rowIndex = rows.findIndex((row, index) => 
                row[headers.indexOf('id')] === data.taskId
            );

            if (rowIndex !== -1) {
                // Удаляем строку (+2 потому что индексы в таблице начинаются с 1 и есть заголовок)
                sheet.deleteRow(rowIndex + 2);
                return ContentService.createTextOutput(JSON.stringify({
                    success: true,
                    message: 'Task deleted successfully'
                })).setMimeType(ContentService.MimeType.JSON);
            }

            return ContentService.createTextOutput(JSON.stringify({
                success: false,
                error: 'Task not found'
            })).setMimeType(ContentService.MimeType.JSON);
        }

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
        const currentData = sheet.getDataRange().getValues();
        const [headers, ...rows] = currentData;

        const existingTasks = new Map();
        rows.forEach((row, index) => {
            const taskId = row[headers.indexOf('id')];
            const task = {};
            headers.forEach((header, colIndex) => {
                if (header === 'assignees' || header === 'subtasks') {
                    task[header] = JSON.parse(row[colIndex] || '[]');
                } else {
                    task[header] = row[colIndex];
                }
            });
            existingTasks.set(taskId, { index: index + 2, task });
        });

        // Обрабатываем каждую задачу из запроса
        data.tasks.forEach(task => {
            const existing = existingTasks.get(task.id);
            const taskData = [
                task.id,
                task.title,
                task.description,
                task.category,
                task.priorityStatus,
                task.progressStatus,
                JSON.stringify(task.assignees),
                JSON.stringify(task.subtasks),
                task.taskNumber,
                task.createdAt || new Date().toISOString(),
                task.updatedAt || new Date().toISOString(),
                task.imageId || ''
            ];

            if (existing) {
                // Обновляем существующую задачу
                sheet.getRange(existing.index, 1, 1, headers.length).setValues([taskData]);
                
                const changes = {};
                if (existing.task.progressStatus !== task.progressStatus) {
                    changes.status = {
                        old: existing.task.progressStatus,
                        new: task.progressStatus
                    };
                }
                
                if (existing.task.priorityStatus !== task.priorityStatus) {
                    changes.priority = {
                        old: existing.task.priorityStatus,
                        new: task.priorityStatus
                    };
                }
                
                const oldAssignees = existing.task.assignees;
                const newAssignees = task.assignees;
                if (JSON.stringify(oldAssignees) !== JSON.stringify(newAssignees)) {
                    changes.assignees = {
                        old: oldAssignees,
                        new: newAssignees
                    };
                }
                
                if (Object.keys(changes).length > 0) {
                    sendTelegramMessage(formatTaskChangeMessage(task, changes));
                }
            } else {
                // Добавляем новую задачу
                sheet.appendRow(taskData);
                const changes = {
                    status: {
                        old: 'Новая задача',
                        new: task.progressStatus
                    },
                    priority: {
                        old: 'Не установлен',
                        new: task.priorityStatus
                    },
                    assignees: {
                        old: [],
                        new: task.assignees
                    }
                };
                sendTelegramMessage(formatTaskChangeMessage(task, changes));
            }
        });

        return ContentService.createTextOutput(JSON.stringify({success: true}))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log('Error in doPost:', error);
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}




