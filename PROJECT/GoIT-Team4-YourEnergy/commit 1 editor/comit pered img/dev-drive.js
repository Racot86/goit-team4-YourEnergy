// В начале файла
if (typeof require === 'undefined') {
    console.error('Monaco Editor loader not found');
}

// Конфигурация Monaco Editor
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

const defaultHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- Header Section -->
    <header>
        <nav>Navigation content</nav>
    </header>

    <!-- Content 1 Section -->
    <section class="content-1">
        <div class="container-1">Content for container 1</div>
        <div class="container-2">Content for container 2</div>
    </section>

    <!-- Content 2 Section (Favorites) -->
    <section class="content-2 favorites">
        <div class="favorites-container">Favorites content</div>
    </section>

    <!-- Footer Section -->
    <footer>Footer content</footer>
</body>
</html>`;

// Функция для генерации случайного HSL цвета
function getRandomHSLColor(opacity = 0.3) {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 50%, ${opacity})`;
}

const defaultCssCode = `/* Styles for layout */
body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
}

header {
    background: ${getRandomHSLColor()};
    padding: 20px;
}

.content-1 {
    background: ${getRandomHSLColor()};
    margin: 20px 0;
}

.container-1, .container-2 {
    padding: 15px;
    margin: 10px;
    background: white;
}

.favorites {
    background: ${getRandomHSLColor()};
    padding: 20px;
}

footer {
    background: ${getRandomHSLColor()};
    padding: 20px;
    margin-top: 20px;
}`;

// Добавьте в начало файла
const IMAGE_STORAGE_KEY = 'monaco-editor-images';

document.addEventListener('DOMContentLoaded', () => {
    require(['vs/editor/editor.main'], function() {
        // Создаем HTML редактор
        const htmlEditor = monaco.editor.create(document.getElementById('html-editor'), {
            value: defaultHtmlCode,
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            formatOnType: true
        });

        // Создаем CSS редактор
        const cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
            value: defaultCssCode,
            language: 'css',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            autoClosingBrackets: 'always',
            formatOnPaste: true,
            formatOnType: true
        });

        // Обработчики кнопок
        const runBtn = document.querySelector('.run-btn');
        const copyBtn = document.querySelector('.copy-btn');
        const saveBtn = document.querySelector('.save-btn');
        const saveStatus = document.querySelector('.save-status');
        const preview = document.querySelector('.code-preview');

        // Функция обновления превью
        function updatePreview() {
            const htmlCode = htmlEditor.getValue();
            const cssCode = cssEditor.getValue();
            const combinedCode = `
                ${htmlCode.replace('</head>', `<style>${cssCode}</style></head>`)}
            `;
            preview.srcdoc = combinedCode;
        }

        // Кнопка Run
        runBtn.addEventListener('click', updatePreview);

        // Кнопка Copy
        copyBtn.addEventListener('click', () => {
            const htmlCode = htmlEditor.getValue();
            const cssCode = cssEditor.getValue();
            navigator.clipboard.writeText(`HTML:\n${htmlCode}\n\nCSS:\n${cssCode}`);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });

        // Кнопка Save
        saveBtn.addEventListener('click', () => {
            const htmlCode = htmlEditor.getValue();
            const cssCode = cssEditor.getValue();
            localStorage.setItem('savedHtmlTemplate', htmlCode);
            localStorage.setItem('savedCssTemplate', cssCode);
            saveStatus.textContent = 'Saved!';
            setTimeout(() => {
                saveStatus.textContent = '';
            }, 2000);
        });

        // Автоматическое обновление превью при изменении кода
        htmlEditor.onDidChangeModelContent(updatePreview);
        cssEditor.onDidChangeModelContent(updatePreview);

        // Загрузка сохраненных шаблонов
        const savedHtml = localStorage.getItem('savedHtmlTemplate');
        const savedCss = localStorage.getItem('savedCssTemplate');
        if (savedHtml) htmlEditor.setValue(savedHtml);
        if (savedCss) cssEditor.setValue(savedCss);

        // Инициализация превью
        updatePreview();

        // Обработка темной темы
        const updateTheme = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const theme = isDark ? 'vs-dark' : 'vs-light';
            monaco.editor.setTheme(theme);
        };

        // Следим за изменением темы
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Начальная установка темы
        updateTheme();

        // Обработка изображений
        const imageBtn = document.querySelector('.image-btn');
        const imageUpload = document.getElementById('imageUpload');
        const imageGallery = document.querySelector('.image-gallery');

        // Загрузка сохраненных изображений
        const loadSavedImages = () => {
            const savedImages = JSON.parse(localStorage.getItem(IMAGE_STORAGE_KEY) || '[]');
            savedImages.forEach(imgData => {
                const img = createImageElement(imgData);
                imageGallery.appendChild(img);
            });
        };

        // Создание элемента изображения
        const createImageElement = (imgData) => {
            const img = document.createElement('img');
            img.src = imgData.url;
            img.alt = imgData.name;
            img.title = imgData.name;
            img.onclick = () => {
                const imgTag = `<img src="${imgData.url}" alt="${imgData.name}" style="max-width: 100%;">`;
                htmlEditor.trigger('keyboard', 'type', {
                    text: imgTag
                });
            };
            return img;
        };

        // Обработка загрузки изображения
        imageBtn.onclick = () => imageUpload.click();
        
        imageUpload.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const imgData = {
                        url: e.target.result,
                        name: file.name,
                        date: new Date().toISOString()
                    };

                    // Сохраняем изображение
                    const savedImages = JSON.parse(localStorage.getItem(IMAGE_STORAGE_KEY) || '[]');
                    savedImages.push(imgData);
                    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(savedImages));

                    // Добавляем в галерею
                    const img = createImageElement(imgData);
                    imageGallery.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        };

        // Загружаем сохраненные изображения при старте
        loadSavedImages();
    });
}); 