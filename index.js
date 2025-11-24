// 1. 预先创建模板，避免重复创建 DOM 元素的开销
const cursorTemplate = (function createCursorTemplate() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute("width", "12");
    svg.setAttribute("height", "19");
    svg.setAttribute("viewBox", "0 0 12 19");
    svg.style.position = "absolute";
    svg.style.zIndex = "99999";
    // Pointer events none 确保光标图形本身不会阻挡下一次点击
    svg.style.pointerEvents = "none"; 

    const paths = [
        { d: 'M0 16.015V0L11.591 11.619H4.81L4.399 11.743L0 16.015Z', fill: 'white' },
        { d: 'M9.08449 16.6893L5.47949 18.2243L0.797485 7.13531L4.48349 5.58231L9.08449 16.6893Z', fill: 'white' },
        { d: 'M7.75101 16.0086L5.90701 16.7826L2.80701 9.40861L4.64801 8.63361L7.75101 16.0086Z', fill: 'black' },
        { d: 'M1 2.4071V13.5951L3.969 10.7291L4.397 10.5901H9.165L1 2.4071Z', fill: 'black' }
    ];

    paths.forEach(p => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('d', p.d);
        path.setAttribute('fill', p.fill);
        svg.appendChild(path);
    });

    return svg;
})();

function drawCursor(mouseX, mouseY) {
    // 使用 cloneNode 提高性能
    const svg = cursorTemplate.cloneNode(true);
    svg.style.left = mouseX + "px";
    svg.style.top = mouseY + "px";
    document.body.appendChild(svg);
}

// 内存中缓存 list，减少读取 storage 次数（可选，视需求而定）
function getCursorList() {
    try {
        return JSON.parse(sessionStorage.getItem('cursorList')) || [];
    } catch (e) {
        return [];
    }
}

function writeLocation(posX, posY) {
    const cursorList = getCursorList();
    cursorList.push({ x: posX, y: posY });
    sessionStorage.setItem('cursorList', JSON.stringify(cursorList));
}

function drawList() {
    const cursorList = getCursorList();
    cursorList.forEach((item) => {
        drawCursor(item.x, item.y);
    });
}

module.exports = {
    startCursorTraces: () => {
        console.log("cursor-traces started!");

        // 绘制历史记录
        drawList();

        // 优化：使用事件委托 (Event Delegation)
        // 这样即使是动态加载的 <a> 标签也能触发效果
        document.addEventListener('click', (e) => {
            // 检查点击的目标是否是 a 标签或在 a 标签内部
            const link = e.target.closest('a');
            
            if (link) {
                // pageX/Y 比 clientX/Y 更适合绝对定位（包含滚动条偏移）
                writeLocation(e.pageX, e.pageY);
                drawCursor(e.pageX, e.pageY);
            }
        });
    },
}
