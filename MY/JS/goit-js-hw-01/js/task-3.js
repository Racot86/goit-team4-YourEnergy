function getElementWidth(content, padding, border) {
    const contentWidth = parseFloat(content);
    const paddingWidth = parseFloat(padding) * 2;
    const borderWidth = parseFloat(border) * 2;
    
    const totalWidth = contentWidth + paddingWidth + borderWidth;
    
    return totalWidth;
}

// Вииід в консоль
console.log(getElementWidth("50px", "8px", "4px")); // 74
console.log(getElementWidth("60px", "12px", "8.5px")); // 101
console.log(getElementWidth("200px", "0px", "0px")); // 200

// Вивід на страницу
document.addEventListener('DOMContentLoaded', () => {
    const result3 = document.getElementById('result3');
    result3.innerHTML = `
        <p>getElementWidth("50px", "8px", "4px") = ${getElementWidth("50px", "8px", "4px")}</p>
        <p>getElementWidth("60px", "12px", "8.5px") = ${getElementWidth("60px", "12px", "8.5px")}</p>
        <p>getElementWidth("200px", "0px", "0px") = ${getElementWidth("200px", "0px", "0px")}</p>
    `;
});
  