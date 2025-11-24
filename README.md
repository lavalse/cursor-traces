# Use by CDN

``` html
<script src="https://unpkg.com/cursor-traces@0.0.8/min.js"></script>
```

- put this in your html header part
- in your html body , use the the function `startCursorTraces()`

```html
    
<script>
    // Initialize after window loads
    window.onload = function() {
        // Now using the namespace to avoid conflicts
        CursorTraces.startCursorTraces();
    };
</script>
```
![This is an image](https://payload.cargocollective.com/1/0/8955/14362679/cursor-traces.gif)

https://eventstructure.com/cursor-traces

