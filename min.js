(function(window) {
    'use strict';

    let cursorTemplate = null;

    function getCursorTemplate(zIndex) {
        if (cursorTemplate) {
            cursorTemplate.style.zIndex = zIndex;
            return cursorTemplate;
        }
        if (typeof document === 'undefined') return null;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("width", "12");
        svg.setAttribute("height", "19");
        svg.setAttribute("viewBox", "0 0 12 19");
        svg.style.position = "absolute";
        svg.style.zIndex = zIndex;
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

        cursorTemplate = svg;
        return svg;
    }

    function drawCursor(x, y, zIndex) {
        const template = getCursorTemplate(zIndex);
        const mountPoint = document.body || document.documentElement;
        if (!template || !mountPoint) return;
        
        const svg = template.cloneNode(true);
        svg.style.left = x + "px";
        svg.style.top = y + "px";
        mountPoint.appendChild(svg);
    }

    function getHistory() {
        try {
            return JSON.parse(sessionStorage.getItem('cursor-traces-list')) || [];
        } catch (e) { return []; }
    }

    function recordPosition(x, y) {
        try {
            const list = getHistory();
            list.push({ x, y });
            sessionStorage.setItem('cursor-traces-list', JSON.stringify(list));
        } catch (e) {}
    }

    function init(options) {
        options = options || {};
        if (typeof document === 'undefined') return;

        const config = {
            selector: options.selector || 'a',
            zIndex: options.zIndex || '2147483647',
            useCapture: options.useCapture !== undefined ? options.useCapture : true
        };

        console.log("CursorTraces: v1.1.0 Initialized");

        const start = function() {
            getHistory().forEach(function(item) {
                drawCursor(item.x, item.y, config.zIndex);
            });

            document.addEventListener('click', function(e) {
                const target = e.target.closest(config.selector);
                if (target) {
                    drawCursor(e.pageX, e.pageY, config.zIndex);
                    recordPosition(e.pageX, e.pageY);
                }
            }, { capture: config.useCapture });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }
    }

    window.CursorTraces = {
        startCursorTraces: init
    };

})(window);
