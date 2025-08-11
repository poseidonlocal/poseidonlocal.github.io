# poseidonPhoto - Professional Image Corner Rounding

A professional, browser-based image corner rounding tool built with modern web technologies. Secure, private, and fast - everything runs locally in your browser with no server uploads required.

## Features

### 🎨 **Professional Interface**
- Clean, modern design inspired by professional tools
- Responsive layout that works on all devices
- Intuitive drag & drop file upload
- Real-time preview with smooth animations
- Professional color scheme with green accents

### ⚡ **High Performance**
- Client-side processing for maximum speed
- No server uploads - complete privacy
- Optimized canvas rendering for quality results
- Smart debounced updates for smooth interaction
- Visual progress indicators

### 🛠 **Advanced Functionality**
- Support for all major image formats (PNG, JPG, JPEG, WebP)
- Precise corner radius control (0-1000px)
- Live preview with instant updates
- High-quality anti-aliased output
- One-click download of processed images

### 🔒 **Complete Privacy**
- 100% client-side processing
- No data transmission to servers
- Works completely offline
- Your images never leave your device

## Usage

1. **Upload Image**: Click the upload area or drag & drop an image file
2. **Adjust Radius**: Use the slider or input field to set corner radius
3. **Preview**: See real-time changes (if live preview is enabled)
4. **Download**: Click "Download Rounded Image" to save the result

## Technical Details

### File Structure
```
photo/
├── index.html          # Main HTML file with UI
├── script.js           # JavaScript functionality
└── README.md          # This file
```

### Browser Compatibility
- Modern browsers with HTML5 Canvas support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

### File Limitations
- Maximum file size: 10MB
- Supported formats: PNG, JPG, JPEG, WebP, GIF, BMP

## Getting Started

1. Open `index.html` in any modern web browser
2. No installation or setup required
3. Works offline once loaded

## Comparison with Desktop Version

| Feature | Desktop (PyQt6) | Web Version |
|---------|----------------|-------------|
| Platform | Windows/Mac/Linux | Any browser |
| Installation | Python + dependencies | None |
| File Processing | PIL/Pillow | HTML5 Canvas |
| Preview | Qt widgets | Canvas rendering |
| Performance | Native speed | Browser-dependent |
| Privacy | Local files | Local processing |

## Development

The web version maintains feature parity with the desktop application while offering:
- Universal accessibility (no installation)
- Modern web UI/UX patterns
- Responsive design for mobile devices
- Easy deployment to any web server

## License

Open source - feel free to modify and distribute.