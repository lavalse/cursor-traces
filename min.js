/**
 * cursor-traces v1.0.5
 * (Browser Global) - Fixed Infinite Scroll Bug (Vertical & Horizontal)
 */
(function(window) {
    'use strict';

    let cursorTemplate = null;
    let pendingCursors = [];
    let drawnCursorIds = new Set();
    let resizeObserver = null;
    let clickHandler = null;
    let isInitialized = false;

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
        if (drawnCursorIds.has(id)) return;

        const template = getCursorTemplate(zIndex);
        const mountPoint = document.body || document.documentElement;
        if (!template || !mountPoint) return;

        const currentHeight = getDocHeight();
        const currentWidth = getDocWidth();

        // 如果垂直或水平方向超出，则暂存，避免撑开页面
        if (item.y > currentHeight + 50 || item.x > currentWidth + 50) {
            if (!pendingCursors.some(function(p) { return p.id === id; })) {
                pendingCursors.push({ x: item.x, y: item.y, ts: item.ts, id: id });
            }
            return;
        }

        const svg = template.cloneNode(true);
        svg.style.left = item.x + "px";
        svg.style.top = item.y + "px";
        mountPoint.appendChild(svg);
        drawnCursorIds.add(id);

        // 成功绘制后移除 pending
        pendingCursors = pendingCursors.filter(function(p) { return p.id !== id; });
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

    function validateOptions(options) {
        const errors = [];
        if (options.selector && typeof options.selector !== 'string') {
            errors.push('selector must be a string');
        }
        if (options.zIndex !== undefined && typeof options.zIndex !== 'string' && typeof options.zIndex !== 'number') {
            errors.push('zIndex must be a string or number');
        }
        if (options.useCapture !== undefined && typeof options.useCapture !== 'boolean') {
            errors.push('useCapture must be a boolean');
        }
        return errors;
    }

    function init(options) {
        options = options || {};
        if (typeof document === 'undefined' || typeof window === 'undefined') return;

        // 输入验证
        const validationErrors = validateOptions(options);
        if (validationErrors.length > 0) {
            console.warn('CursorTraces: Invalid options -', validationErrors.join(', '));
        }

        // 防止重复初始化
        if (isInitialized) {
            console.warn('CursorTraces: Already initialized. Call destroy() first to reinitialize.');
            return;
        }

        const config = {
            selector: options.selector || 'a',
            zIndex: String(options.zIndex || '2147483647'),
            useCapture: options.useCapture !== undefined ? options.useCapture : true
        };

        const start = function() {
            const history = getHistory();
            history.forEach(function(item) {
                drawCursor(item, config.zIndex);
            });

            // 监听尺寸变化（支持无限滚动/响应式布局）
            if (window.ResizeObserver) {
                resizeObserver = new ResizeObserver(function() {
                    if (pendingCursors.length > 0) {
                        const currentHeight = getDocHeight();
                        const currentWidth = getDocWidth();
                        var cursorsToCheck = pendingCursors.slice();

                        cursorsToCheck.forEach(function(item) {
                            if (item.y <= currentHeight + 50 && item.x <= currentWidth + 50) {
                                drawCursor(item, config.zIndex);
                            }
                        });
                    }
                });
                resizeObserver.observe(document.body);
                resizeObserver.observe(document.documentElement);
            }

            clickHandler = function(e) {
                var target = e.target;
                if (target.closest) {
                    target = target.closest(config.selector);
                }
                if (target) {
                    const item = { x: e.pageX, y: e.pageY, ts: Date.now() };
                    drawCursor(item, config.zIndex);
                    recordPosition(e.pageX, e.pageY);
                }
            };

            document.addEventListener('click', clickHandler, { capture: config.useCapture });
            isInitialized = true;
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }
    }

    function destroy() {
        if (!isInitialized) return;

        // 移除事件监听器
        if (clickHandler) {
            document.removeEventListener('click', clickHandler, true);
            document.removeEventListener('click', clickHandler, false);
            clickHandler = null;
        }

        // 断开 ResizeObserver
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }

        // 移除所有已绘制的光标
        const cursors = document.querySelectorAll('svg[viewBox="0 0 12 19"]');
        cursors.forEach(function(cursor) {
            if (cursor.parentNode) {
                cursor.parentNode.removeChild(cursor);
            }
        });

        // 重置状态
        cursorTemplate = null;
        pendingCursors = [];
        drawnCursorIds = new Set();
        isInitialized = false;
    }

    function clearHistory() {
        try {
            sessionStorage.removeItem('cursor-traces-list');
        } catch (e) {
            console.warn('CursorTraces: Failed to clear history -', e.message);
        }
    }

    window.CursorTraces = {
        startCursorTraces: init,
        destroy: destroy,
        clearHistory: clearHistory
    };

})(window);
