(function(window) {
    'use strict';

    let cursorTemplate = null;
    let pendingCursors = [];
    let drawnCursorIds = []; 
    let resizeObserver = null;

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

    function getDocHeight() {
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
    }

    function getDocWidth() {
        return Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth
        );
    }

    function drawCursor(item, zIndex) {
        const id = item.x + '-' + item.y + '-' + (item.ts || '');
        if (drawnCursorIds.indexOf(id) !== -1) return;

        const template = getCursorTemplate(zIndex);
        const mountPoint = document.body || document.documentElement;
        if (!template || !mountPoint) return;
        
        const currentHeight = getDocHeight();
        const currentWidth = getDocWidth();

        // 检查 Y 轴 和 X 轴
        if (item.y > currentHeight + 50 || item.x > currentWidth + 50) {
            let exists = false;
            for(let i=0; i<pendingCursors.length; i++) {
                if(pendingCursors[i].id === id) exists = true;
            }
            if (!exists) {
                item.id = id;
                pendingCursors.push(item);
            }
            return; 
        }

        const svg = template.cloneNode(true);
        svg.style.left = item.x + "px";
        svg.style.top = item.y + "px";
        mountPoint.appendChild(svg);
        drawnCursorIds.push(id);

        const newPending = [];
        for(let i=0; i<pendingCursors.length; i++) {
            if(pendingCursors[i].id !== id) newPending.push(pendingCursors[i]);
        }
        pendingCursors = newPending;
    }

    function getHistory() {
        try {
            return JSON.parse(sessionStorage.getItem('cursor-traces-list')) || [];
        } catch (e) { return []; }
    }

    function recordPosition(x, y) {
        try {
            const list = getHistory();
            const ts = Date.now();
            list.push({ x: x, y: y, ts: ts });
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

        console.log("CursorTraces: v1.2.1 Initialized");

        const start = function() {
            const history = getHistory();
            for(let i=0; i<history.length; i++) {
                drawCursor(history[i], config.zIndex);
            }

            if (window.ResizeObserver) {
                resizeObserver = new ResizeObserver(function() {
                    if (pendingCursors.length > 0) {
                        const currentHeight = getDocHeight();
                        const currentWidth = getDocWidth();
                        const cursorsToCheck = pendingCursors.slice();
                        
                        for(let i=0; i<cursorsToCheck.length; i++) {
                            // 双向检查
                            if (cursorsToCheck[i].y <= currentHeight + 50 && 
                                cursorsToCheck[i].x <= currentWidth + 50) {
                                drawCursor(cursorsToCheck[i], config.zIndex);
                            }
                        }
                    }
                });
                resizeObserver.observe(document.body);
                resizeObserver.observe(document.documentElement);
            }

            document.addEventListener('click', function(e) {
                const target = e.target.closest(config.selector);
                if (target) {
                    const item = { x: e.pageX, y: e.pageY, ts: Date.now() };
                    drawCursor(item, config.zIndex);
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
