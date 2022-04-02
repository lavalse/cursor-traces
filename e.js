document.querySelectorAll("a").forEach((a) => { 
    a.addEventListener('click', (e) => { e.preventDefault(); 
    const p = document.createElement("div"); 
    p.style.position = "absolute"; 
    p.style.left = e.pageX + "px"; p.style.top = e.pageY + "px"; 
    p.style.zIndex = 99999; 
    p.style.width = "10px"; 
    p.style.height = "10px"; 
    p.style.background = "#f00"; 
    document.body.appendChild(p) 
}) })