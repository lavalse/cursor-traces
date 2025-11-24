/**
 * cursor-traces
 * 在点击链接时留下光标痕迹
 */

// 1. 预加载光标 SVG 模板 (性能优化)
const cursorTemplate = (function createCursorTemplate() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute("width", "12");
  svg.setAttribute("height", "19");
  svg.setAttribute("viewBox", "0 0 12 19");
  svg.style.position = "absolute";
  svg.style.zIndex = "99999";
  svg.style.pointerEvents = "none"; // 关键：防止光标挡住下方的点击

  // 定义路径数据
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

// 内部函数：绘制
function drawCursor(x, y) {
  const svg = cursorTemplate.cloneNode(true);
  svg.style.left = x + "px";
  svg.style.top = y + "px";
  document.body.appendChild(svg);
}

// 内部函数：获取历史
function getHistory() {
  try {
    return JSON.parse(sessionStorage.getItem('cursor-traces-list')) || [];
  } catch {
    return [];
  }
}

// 内部函数：写入位置
function recordPosition(x, y) {
  const list = getHistory();
  list.push({ x, y });
  sessionStorage.setItem('cursor-traces-list', JSON.stringify(list));
}

// 核心入口函数
function init() {
  if (typeof document === 'undefined') return;

  console.log("cursor-traces initialized");

  // 1. 恢复历史痕迹
  getHistory().forEach(pos => drawCursor(pos.x, pos.y));

  // 2. 全局监听点击 (事件委托)
  document.addEventListener('click', (e) => {
    // 查找最近的 A 标签，替代了原先复杂的 findALabel
    const link = e.target.closest('a');
    if (link) {
      // 使用 pageX/Y 确保包含滚动距离
      recordPosition(e.pageX, e.pageY);
      drawCursor(e.pageX, e.pageY);
    }
  });
}

// 导出逻辑
module.exports = {
  startCursorTraces: init
};
