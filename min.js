function drawCursor(mouseX, mouseY){
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); 
    svg.setAttribute("width", "12");
    svg.setAttribute("height", "19");
    svg.setAttribute("viewbox", "0 0 12 19");

    //part one
    line_one = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line_one.setAttribute('fill-rule','evenodd');
    line_one.setAttribute('d', 'M0 16.015V0L11.591 11.619H4.81L4.399 11.743L0 16.015Z');
    line_one.setAttribute('fill', 'white');
    svg.appendChild( line_one );

    //part-two
    line_two = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line_two.setAttribute('fill-rule','evenodd');
    line_two.setAttribute('d', 'M9.08449 16.6893L5.47949 18.2243L0.797485 7.13531L4.48349 5.58231L9.08449 16.6893Z');
    line_two.setAttribute('fill', 'white');
    svg.appendChild( line_two );

    //part-three
    line_three = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line_three.setAttribute('fill-rule','evenodd');
    line_three.setAttribute('d', 'M7.75101 16.0086L5.90701 16.7826L2.80701 9.40861L4.64801 8.63361L7.75101 16.0086Z');
    line_three.setAttribute('fill', 'black');
    svg.appendChild( line_three );

    //part-four
    line_four = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line_four.setAttribute('fill-rule','evenodd');
    line_four.setAttribute('d', 'M1 2.4071V13.5951L3.969 10.7291L4.397 10.5901H9.165L1 2.4071Z');
    line_four.setAttribute('fill', 'black');
    svg.appendChild( line_four );

    svg.style.position = "absolute"; 
    svg.style.left = mouseX + "px"; 
    svg.style.top = mouseY + "px"; 
    svg.style.zIndex = 99999; 
    document.body.appendChild(svg);
}

function writeLocation(posX, posY){
    var cursorList = [];
    if(!sessionStorage.cursorList){
        console.log("don't have history");
        cursorList.push({x:posX,y:posY});
        sessionStorage.cursorList = JSON.stringify(cursorList);
    }else{
        const temp = sessionStorage.cursorList;
        cursorList = JSON.parse(temp);
        cursorList.push({x:posX,y:posY});
        sessionStorage.cursorList = JSON.stringify(cursorList);
    }
}

function drawList(){
    const cursorList = JSON.parse (sessionStorage.cursorList);
    console.log(cursorList);
    if(cursorList){
        cursorList.map((item)=>{
            drawCursor(item.x,item.y);
        })
    }
}

function startCursorTraces(){
    console.log("this is cursor-traces!");
    document.querySelectorAll("a").forEach((a) => { 
        a.addEventListener('click', (e) => { 
            writeLocation(e.pageX, e.pageY);
        }) 
    });
    drawList();
};