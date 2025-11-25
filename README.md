# cursor-traces

Leaves a visual trace (custom cursor icon) at the location where you click a link. The traces persist across page reloads within the session.

## Preview

![Preview](https://payload.cargocollective.com/1/0/8955/14362679/cursor-traces.gif)

## Usage

### 1. Via CDN (Recommended for static sites)

Add the script and initialize it in your HTML.

```html
<script src="https://unpkg.com/cursor-traces@1.0.4/min.js"></script>

<script>
    // Simple usage
    if(window.CursorTraces) {
        CursorTraces.startCursorTraces();
    }

    // Or with options
    /*
    if(window.CursorTraces) {
        CursorTraces.startCursorTraces({
            selector: 'a, button', // Track links and buttons
            zIndex: '9999',        // Custom z-index
            useCapture: true       // Force event capture
        });
    }
    */
</script>
```

### 2. Via NPM
Bash
```
npm install cursor-traces
```
JavaScript
```
const { startCursorTraces } = require('cursor-traces');

// Initialize with default settings (tracks <a> tags)
startCursorTraces();

// Or initialize with custom options
startCursorTraces({
    selector: 'a, .trace-me', // CSS selector for elements to trace
    zIndex: '999999',         // Z-Index of the cursor icon
    useCapture: true          // Use capture phase (recommended)
});
```




