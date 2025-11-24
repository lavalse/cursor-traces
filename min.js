(function(window) {
    'use strict';

    const cursorTemplate = (function createCursorTemplate() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("width", "12");
        svg.setAttribute("height", "19");
        svg.setAttribute("viewBox", "0 0 12 19");
        svg.style.position = "absolute";
        svg.style.zIndex = "99999";
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

    function drawCursor(x, y) {
        const svg = cursorTemplate.cloneNode(true);
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
        const list = getHistory();
        list.push({ x, y });
        sessionStorage.setItem('cursor-traces-list', JSON.stringify(list));
    }

    function init() {
        console.log("cursor-traces (browser) initialized!");
        const history = getHistory();
        history.forEach(item => drawCursor(item.x, item.y));

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                recordPosition(e.pageX, e.pageY);
                drawCursor(e.pageX, e.pageY);
            }
        });
    }

    // 暴露给全局对象
    window.CursorTraces = {
        startCursorTraces: init
    };

})(window);
