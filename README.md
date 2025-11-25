# cursor-traces

Leaves a visual trace (custom cursor icon) at the location where you click a link. The traces persist across page reloads within the session.

## Preview

![Preview](https://payload.cargocollective.com/1/0/8955/14362679/cursor-traces.gif)

## Usage

### 1. Via CDN (Recommended for static sites)

Add the script and initialize it in your HTML.

```html
<script src="https://unpkg.com/cursor-traces@1.0.0/min.js"></script>

<script>
    window.onload = function() {
        if(window.CursorTraces) {
            CursorTraces.startCursorTraces();
        }
    };
</script>



### 2. Via NPM

Bash
npm install cursor-traces

JavaScript
const { startCursorTraces } = require('cursor-traces');

// Initialize
startCursorTraces();


