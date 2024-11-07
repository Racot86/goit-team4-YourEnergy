document.addEventListener('DOMContentLoaded', () => {
    const editors = document.querySelectorAll('.code-editor');
    
    editors.forEach(editor => {
        const container = editor.closest('.editor-container');
        const runBtn = container.querySelector('.run-btn');
        const copyBtn = container.querySelector('.copy-btn');
        const preview = container.querySelector('.code-preview');

        // Автоматическое обновление превью
        editor.addEventListener('input', () => {
            updatePreview(editor, preview);
        });

        // Кнопка Run
        runBtn.addEventListener('click', () => {
            updatePreview(editor, preview);
        });

        // Кнопка Copy
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(editor.value);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });

        // Обработка табуляции
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
            }
        });

        // Инициализация превью
        updatePreview(editor, preview);
    });
});

function updatePreview(editor, preview) {
    const code = editor.value;
    const iframe = preview;
    iframe.srcdoc = code;
} 