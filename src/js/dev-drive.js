// В начале файла
if (typeof require === 'undefined') {
    console.error('Monaco Editor loader not found');
}

// Конфигурация Monaco Editor
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

// Функция отображения изображений
function displayImages() {
    const imagesGrid = document.querySelector('.images-grid');
    if (!imagesGrid) return;

    // Импортируем изображения напрямую
    const images = [
        new URL('../img/editor-images/[BSPWM] Red Star OS 2_0 Devil Edition.jfif', import.meta.url),
        new URL('../img/editor-images/[i3-gaps] Beach Please.jfif', import.meta.url),
        new URL('../img/editor-images/3999e0c0-14ed-44ff-b701-73b76c2019a5.jfif', import.meta.url),
        new URL('../img/editor-images/GitHub - nekonako_dotfiles_@ Comfy h.jfif', import.meta.url),
        new URL('../img/editor-images/Pallavi Ghanshani on LinkedIn_ #api #tec.gif', import.meta.url),
        new URL('../img/editor-images/Без названия (12).jfif', import.meta.url)
    ];

    images.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl.href;
        img.alt = imgUrl.href.split('/').pop();
        
        img.onclick = () => {
            const fullscreen = document.createElement('div');
            fullscreen.className = 'fullscreen-view';
            fullscreen.innerHTML = `
                <img src="${img.src}" alt="${img.alt}">
            `;
            
            fullscreen.onclick = () => fullscreen.remove();
            document.body.appendChild(fullscreen);
        };

        imagesGrid.appendChild(img);
    });
}

// HTML и CSS шаблоны
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

const defaultCssCode = `/* Styles for layout */
body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
}

header {
    background: hsla(200, 70%, 50%, 0.3);
    padding: 20px;
}

.content-1 {
    background: hsla(120, 70%, 50%, 0.3);
    margin: 20px 0;
}

.container-1, .container-2 {
    padding: 15px;
    margin: 10px;
    background: white;
}

.favorites {
    background: hsla(45, 70%, 50%, 0.3);
    padding: 20px;
}

footer {
    background: hsla(280, 70%, 50%, 0.3);
    padding: 20px;
    margin-top: 20px;
}`;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    require(['vs/editor/editor.main'], function() {
        // Создаем HTML редактор
        const htmlEditor = monaco.editor.create(document.getElementById('html-editor'), {
            value: defaultHtmlCode,
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14
        });

        // Создаем CSS редактор
        const cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
            value: defaultCssCode,
            language: 'css',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14
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

        // Обработчики событий
        runBtn.addEventListener('click', updatePreview);
        copyBtn.addEventListener('click', () => {
            const htmlCode = htmlEditor.getValue();
            const cssCode = cssEditor.getValue();
            navigator.clipboard.writeText(`HTML:\n${htmlCode}\n\nCSS:\n${cssCode}`);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });

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

        // Автоматическое обновление превью
        htmlEditor.onDidChangeModelContent(updatePreview);
        cssEditor.onDidChangeModelContent(updatePreview);

        // Загрузка сохраненных шаблонов
        const savedHtml = localStorage.getItem('savedHtmlTemplate');
        const savedCss = localStorage.getItem('savedCssTemplate');
        if (savedHtml) htmlEditor.setValue(savedHtml);
        if (savedCss) cssEditor.setValue(savedCss);

        // Инициализация
        updatePreview();
        displayImages();
    });
}); 