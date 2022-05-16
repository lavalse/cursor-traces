# Use by CDN

``` html
<script src="https://unpkg.com/cursor-traces@0.0.6/min.js"></script>
```

- put this in your html header part
- in your html body , use the the function `startCursorTraces()`

```html
    
    <script>
        window.onload = function(){
            document.onmouseup=function(e){
                if(e.target){
                    if(findALabel(e.target)){
                        writeLocation(e.pageX, e.pageY);
                        drawCursor(e.pageX, e.pageY);
                    }
                }
            };
            drawList();
        }
    </script>
```
![This is an image](https://payload.cargocollective.com/1/0/8955/14362679/cursor-traces.gif)

https://eventstructure.com/cursor-traces
