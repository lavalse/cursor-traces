(function(window) {
    'use strict';

    // 懒加载模板变量
    let cursorTemplate = null;

    // 创建或获取 SVG 模板
    function getCursorTemplate() {
        if (cursorTemplate) return cursorTemplate;
        // 再次检查 document 是否存在
        if (typeof document === 'undefined') return null;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("width", "12");
        svg.setAttribute("height", "19");
        svg.setAttribute("viewBox", "0 0 12 19");
        svg.style.position = "absolute";
        svg.style.zIndex = "99999";
        svg.style.pointerEvents = "none"; // 关键：不阻挡点击

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

        cursorTemplate = svg;
        return svg;
    }

    function drawCursor(x, y) {
        const template = getCursorTemplate();
        // 确保 body 已加载且模板存在
        if (!template || !document.body) return;
        
        const svg = template.cloneNode(true);
        svg.style.left = x + "px";
        svg.style.top = y + "px";
        document.body.appendChild(svg);
    }

    function getHistory() {
        try {
            return JSON.parse(sessionStorage.getItem('cursor-traces-list')) || [];
        } catch (e) {
            return [];
        }
    }

    function recordPosition(x, y) {
        try {
            const list = getHistory();
            list.push({ x, y });
            sessionStorage.setItem('cursor-traces-list', JSON.stringify(list));
        } catch (e) {
            // 忽略存储错误（如隐身模式或配额满）
        }
    }

    function init() {
        if (typeof document === 'undefined') return;

        console.log("CursorTraces: v1.0.0 Initialized");
        
        // 1. 恢复历史
        const history = getHistory();
        history.forEach(item => drawCursor(item.x, item.y));

        // 2. 监听点击
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                drawCursor(e.pageX, e.pageY);
                recordPosition(e.pageX, e.pageY);
            }
        });
    }

    // 暴露给全局对象
    window.CursorTraces = {
        startCursorTraces: init
    };

})(window);
