// Добавляем явное объявление DriveApp
var DriveApp = DriveApp;

// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '8186615050:AAFR9_ybnyh9Nm9Z500ohemRAplu4CYcb7Y';
const TELEGRAM_CHAT_ID = '-1002347459746';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Конфигурация Google Drive
const DRIVE_FOLDER_ID = '1WSjcNwduiozqNXUkJMYnebhHpGp-aPqR';

// Конфигурация сервисного аккаунта
const SERVICE_ACCOUNT_CREDS = {
  "type": "service_account",
  "project_id": "task-manage-440918",
  "private_key_id": "e138a131f653f6185e10179469fc3285644c7882",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "task-manager-service@task-manage-440918.iam.gserviceaccount.com",
  "client_id": "110846520274239055590"
};

// Добавляем тестовую функцию для проверки доступа к Drive
function testDriveAccess() {
  try {
    // Пробуем получить доступ к папке
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    Logger.log('Drive access successful. Folder name: ' + folder.getName());
    return {
      success: true,
      folderName: folder.getName(),
      folderId: DRIVE_FOLDER_ID
    };
  } catch (error) {
    Logger.log('Drive access failed: ' + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// Функция для получения токена доступа
function getServiceAccountToken() {
  return OAuth2.createService('drive_service')
    .setPrivateKey(SERVICE_ACCOUNT_CREDS.private_key)
    .setIssuer(SERVICE_ACCOUNT_CREDS.client_email)
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setScope('https://www.googleapis.com/auth/drive')
    .getAccessToken();
}

function manualTestDrive() {
  const result = testDrivePermissions();
  Logger.log('Test result:', result);
}

function doPost(e) {
    try {
        Logger.log('Received POST request');
        Logger.log('Content type:', e.postData.type);
        Logger.log('Raw contents:', e.postData.contents);

        let data;
        try {
            data = JSON.parse(e.postData.contents);
        } catch (error) {
            // Если не удалось распарсить JSON, проверяем form-data
            if (e.parameter.type === 'upload_image') {
                return handleImageUpload(e);
            }
            throw error;
        }

        // Получаем или создаем лист
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks') || 
                     SpreadsheetApp.getActiveSpreadsheet().insertSheet('Tasks');

        // Проверяем/создаем заголовки
        if (sheet.getLastRow() === 0) {
            const headers = [
                'id', 'title', 'description', 'category', 'priorityStatus',
                'progressStatus', 'assignees', 'subtasks', 'taskNumber',
                'createdAt', 'updatedAt', 'imageId'
            ];
            sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        }

        // Обрабатываем задачи
        if (data.tasks && Array.isArray(data.tasks)) {
            const currentData = sheet.getDataRange().getValues();
            const [headers, ...rows] = currentData;

            data.tasks.forEach(task => {
                Logger.log('Processing task:', task);
                
                const taskData = [
                    task.id,
                    task.title || '',
                    task.description || '',
                    task.category || '',
                    task.priorityStatus || '',
                    task.progressStatus || '',
                    JSON.stringify(task.assignees || []),
                    JSON.stringify(task.subtasks || []),
                    task.taskNumber || '',
                    task.createdAt || new Date().toISOString(),
                    task.updatedAt || new Date().toISOString(),
                    task.imageId || ''
                ];

                const rowIndex = rows.findIndex(row => row[0] === task.id);
                if (rowIndex !== -1) {
                    sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([taskData]);
                } else {
                    sheet.appendRow(taskData);
                }
            });
        }

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: 'Tasks saved successfully'
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('Error in doPost:', error);
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

function handleImageUpload(e) {
    try {
        const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        const imageBlob = Utilities.newBlob(
            Utilities.base64Decode(e.parameter.image.split(',')[1]),
            e.parameter.contentType,
            e.parameter.fileName
        );

        const file = folder.createFile(imageBlob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            fileId: file.getId(),
            fileUrl: file.getUrl()
        })).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}




