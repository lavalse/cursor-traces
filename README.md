# cursor-traces

Leaves a visual trace (custom cursor icon) at the location where you click a link. The traces persist across page reloads within the session.

## Preview

![Preview](https://payload.cargocollective.com/1/0/8955/14362679/cursor-traces.gif)

## Usage

### 1. Via CDN (Recommended for static sites)

Add the script and initialize it in your HTML.

```html
<script src="https://unpkg.com/cursor-traces@1.1.0/min.js"></script>

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

```bash
npm install cursor-traces
```

```javascript
const { startCursorTraces, destroy, clearHistory } = require('cursor-traces');

// Initialize with default settings (tracks <a> tags)
startCursorTraces();

// Or initialize with custom options
startCursorTraces({
    selector: 'a, .trace-me', // CSS selector for elements to trace
    zIndex: '999999',         // Z-Index of the cursor icon
    useCapture: true          // Use capture phase (recommended)
});
```

## API

### `startCursorTraces(options?)`

Initialize cursor tracing.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selector` | `string` | `'a'` | CSS selector for elements to track |
| `zIndex` | `string \| number` | `'2147483647'` | Z-index of cursor traces |
| `useCapture` | `boolean` | `true` | Use capture phase for click events |

### `destroy()`

Clean up all resources. Removes event listeners, disconnects ResizeObserver, and removes all cursor traces from the DOM.

```javascript
// CommonJS
const { destroy } = require('cursor-traces');
destroy();

// Browser
CursorTraces.destroy();
```

### `clearHistory()`

Clear the session storage history. This removes all saved cursor positions.

```javascript
// CommonJS
const { clearHistory } = require('cursor-traces');
clearHistory();

// Browser
CursorTraces.clearHistory();
```

## License

ISC







