class PoseidonPhotoEditor {
    constructor() {
        this.currentImage = null;
        this.originalCanvas = null;
        this.previewCanvas = document.getElementById('previewCanvas');
        this.ctx = this.previewCanvas.getContext('2d');
        this.previewTimer = null;
        this.currentTool = 'corner';
        
        // Image editing settings
        this.settings = {
            cornerRadius: 50,
            width: 0,
            height: 0,
            maintainAspect: true,
            blur: 0,
            grayscale: 0,
            sepia: 0,
            invert: 0,
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0
        };
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.radiusSlider = document.getElementById('radiusSlider');
        this.radiusInput = document.getElementById('radiusInput');
        this.radiusValue = document.getElementById('radiusValue');
        this.livePreview = document.getElementById('livePreview');
        this.generatePreview = document.getElementById('generatePreview');
        this.downloadImage = document.getElementById('downloadImage');
        this.previewContainer = document.getElementById('previewContainer');
        this.previewPlaceholder = document.getElementById('previewPlaceholder');
        this.imageInfo = document.getElementById('imageInfo');
        this.imageDimensions = document.getElementById('imageDimensions');
        this.imageSize = document.getElementById('imageSize');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        
        // Debug: Check if critical elements exist
        if (!this.dropZone) console.error('dropZone element not found');
        if (!this.fileInput) console.error('fileInput element not found');
        if (!this.previewCanvas) console.error('previewCanvas element not found');
    }

    bindEvents() {
        // File input events
        if (this.dropZone && this.fileInput) {
            this.dropZone.addEventListener('click', () => {
                console.log('Drop zone clicked, triggering file input');
                this.fileInput.click();
            });
            this.dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
            this.dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            this.dropZone.addEventListener('drop', this.handleDrop.bind(this));
            this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        // Radius control events
        if (this.radiusSlider) {
            this.radiusSlider.addEventListener('input', this.handleRadiusChange.bind(this));
        }
        if (this.radiusInput) {
            this.radiusInput.addEventListener('input', this.handleRadiusInputChange.bind(this));
        }

        // Button events
        if (this.generatePreview) {
            this.generatePreview.addEventListener('click', this.updatePreview.bind(this));
        }
        if (this.downloadImage) {
            this.downloadImage.addEventListener('click', this.downloadProcessedImage.bind(this));
        }

        // Live preview toggle
        if (this.livePreview) {
            this.livePreview.addEventListener('change', () => {
                if (this.livePreview.checked && this.currentImage) {
                    this.updatePreview();
                }
            });
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        console.log('File input changed:', e.target.files);
        const file = e.target.files[0];
        if (file) {
            console.log('Processing file:', file.name, file.type, file.size);
            this.processFile(file);
        }
    }

    processFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size must be less than 10MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadImage(e.target.result, file);
        };
        reader.readAsDataURL(file);
    }

    loadImage(src, file) {
        const img = new Image();
        img.onload = () => {
            this.currentImage = img;
            this.setupCanvas();
            this.updateImageInfo(file);
            this.enableControls();
            
            if (this.livePreview.checked) {
                this.updatePreview();
            }
        };
        img.onerror = () => {
            this.showError('Failed to load image. Please try another file.');
        };
        img.src = src;
    }

    setupCanvas() {
        // Create original canvas for processing
        this.originalCanvas = document.createElement('canvas');
        this.originalCanvas.width = this.currentImage.width;
        this.originalCanvas.height = this.currentImage.height;
        
        const originalCtx = this.originalCanvas.getContext('2d');
        originalCtx.drawImage(this.currentImage, 0, 0);

        // Setup preview canvas
        const maxSize = 400;
        const scale = Math.min(maxSize / this.currentImage.width, maxSize / this.currentImage.height, 1);
        
        this.previewCanvas.width = this.currentImage.width * scale;
        this.previewCanvas.height = this.currentImage.height * scale;
        
        // Show canvas, hide placeholder
        this.previewPlaceholder.classList.add('hidden');
        this.previewCanvas.classList.remove('hidden');
    }

    updateImageInfo(file) {
        this.imageDimensions.textContent = `${this.currentImage.width} × ${this.currentImage.height}`;
        this.imageSize.textContent = this.formatFileSize(file.size);
        this.imageInfo.classList.remove('hidden');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    enableControls() {
        if (this.generatePreview) {
            this.generatePreview.disabled = false;
            this.generatePreview.classList.remove('opacity-50');
        }
        
        if (this.downloadImage) {
            this.downloadImage.disabled = false;
            this.downloadImage.classList.remove('opacity-50');
        }
    }

    handleRadiusChange(e) {
        const value = parseInt(e.target.value);
        this.radiusValue.textContent = `${value}px`;
        this.radiusInput.value = value;
        
        if (this.livePreview.checked && this.currentImage) {
            this.debouncedPreview();
        }
    }

    handleRadiusInputChange(e) {
        const value = parseInt(e.target.value) || 0;
        this.radiusValue.textContent = `${value}px`;
        
        if (value <= 200) {
            this.radiusSlider.value = value;
        }
        
        if (this.livePreview.checked && this.currentImage) {
            this.debouncedPreview();
        }
    }

    debouncedPreview() {
        clearTimeout(this.previewTimer);
        this.previewTimer = setTimeout(() => {
            this.updatePreview();
        }, 300);
    }

    async updatePreview() {
        if (!this.currentImage) return;

        this.showProgress(true);
        
        try {
            const radius = parseInt(this.radiusInput.value) || 0;
            await this.processImageWithProgress(radius, true);
        } catch (error) {
            this.showError('Failed to generate preview: ' + error.message);
        } finally {
            this.showProgress(false);
        }
    }

    async processImageWithProgress(radius, isPreview = false) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = isPreview ? this.previewCanvas : this.originalCanvas;
                const ctx = canvas.getContext('2d');
                const scale = isPreview ? 
                    Math.min(400 / this.currentImage.width, 400 / this.currentImage.height, 1) : 1;

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Update progress
                this.updateProgress(20, 'Preparing image...');

                setTimeout(() => {
                    try {
                        // Create rounded rectangle path
                        const width = this.currentImage.width * scale;
                        const height = this.currentImage.height * scale;
                        const scaledRadius = radius * scale;

                        ctx.save();
                        
                        // Create clipping path
                        this.createRoundedRectPath(ctx, 0, 0, width, height, scaledRadius);
                        ctx.clip();
                        
                        this.updateProgress(60, 'Applying rounded corners...');
                        
                        setTimeout(() => {
                            // Draw image
                            ctx.drawImage(this.currentImage, 0, 0, width, height);
                            ctx.restore();
                            
                            this.updateProgress(100, 'Complete!');
                            resolve();
                        }, 50);
                        
                    } catch (error) {
                        reject(error);
                    }
                }, 50);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    createRoundedRectPath(ctx, x, y, width, height, radius) {
        // Ensure radius doesn't exceed half of width or height
        radius = Math.min(radius, width / 2, height / 2);
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    async downloadProcessedImage() {
        console.log('Download button clicked');
        if (!this.currentImage) {
            console.error('No current image available for download');
            this.showError('No image loaded. Please upload an image first.');
            return;
        }

        console.log('Starting download process...');
        this.showProgress(true);
        
        try {
            const radius = parseInt(this.radiusInput.value) || 0;
            
            // Create a new canvas for full resolution output
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = this.currentImage.width;
            outputCanvas.height = this.currentImage.height;
            const outputCtx = outputCanvas.getContext('2d');

            this.updateProgress(20, 'Creating high-resolution canvas...');
            
            // Enable high-quality rendering
            outputCtx.imageSmoothingEnabled = true;
            outputCtx.imageSmoothingQuality = 'high';
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            this.updateProgress(40, 'Processing full resolution image...');
            
            // Clear canvas with transparent background
            outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
            
            // Create rounded rectangle clipping path
            outputCtx.save();
            this.createRoundedRectPath(outputCtx, 0, 0, outputCanvas.width, outputCanvas.height, radius);
            outputCtx.clip();
            
            // Draw the original image
            outputCtx.drawImage(this.currentImage, 0, 0, outputCanvas.width, outputCanvas.height);
            outputCtx.restore();
            
            this.updateProgress(70, 'Preparing download...');
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Create download using blob method
            this.updateProgress(80, 'Creating download file...');
            
            outputCanvas.toBlob((blob) => {
                try {
                    if (!blob) {
                        console.error('Failed to create blob from canvas');
                        throw new Error('Failed to create image blob');
                    }
                    
                    console.log('Blob created successfully:', blob.size, 'bytes');
                    
                    const url = URL.createObjectURL(blob);
                    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                    const filename = `poseidonPhoto-${radius}px-${timestamp}.png`;
                    
                    console.log('Creating download link for:', filename);
                    
                    // Create download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = filename;
                    downloadLink.style.display = 'none';
                    
                    // Add to DOM, click, and remove
                    document.body.appendChild(downloadLink);
                    
                    // Force download
                    downloadLink.click();
                    
                    console.log('Download link clicked');
                    
                    // Cleanup
                    setTimeout(() => {
                        if (document.body.contains(downloadLink)) {
                            document.body.removeChild(downloadLink);
                        }
                        URL.revokeObjectURL(url);
                        console.log('Download cleanup completed');
                    }, 1000);
                    
                    this.updateProgress(100, 'Download started!');
                    setTimeout(() => this.showProgress(false), 2000);
                    
                } catch (error) {
                    console.error('Error in blob callback:', error);
                    this.showError('Failed to create download: ' + error.message);
                    this.showProgress(false);
                }
            }, 'image/png', 0.95);
            
            // Fallback timeout in case blob creation fails silently
            setTimeout(() => {
                if (this.progressContainer && !this.progressContainer.classList.contains('hidden')) {
                    console.warn('Download seems to have stalled, trying fallback method');
                    this.tryDataURLDownload(outputCanvas, radius);
                }
            }, 5000);
            
        } catch (error) {
            console.error('Download failed:', error);
            this.showError('Failed to download image: ' + error.message);
            this.showProgress(false);
        }
    }

    showProgress(show) {
        if (show) {
            this.progressContainer.classList.remove('hidden');
            this.updateProgress(0, 'Starting...');
        } else {
            this.progressContainer.classList.add('hidden');
        }
    }

    updateProgress(percent, text) {
        this.progressBar.style.width = `${percent}%`;
        this.progressText.textContent = text;
    }

    showError(message) {
        // Create a professional toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-6 right-6 bg-red-500/90 backdrop-blur-sm border border-red-400/30 text-white px-6 py-4 rounded-lg shadow-xl z-50 transform transition-all duration-500 translate-x-full opacity-0 max-w-md';
        
        toast.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-white font-semibold text-sm">Error</p>
                    <p class="text-white/90 text-sm leading-relaxed">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto flex-shrink-0 text-white/70 hover:text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 500);
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing PoseidonPhotoEditor...');
    try {
        new PoseidonPhotoEditor();
        console.log('PoseidonPhotoEditor initialized successfully');
    } catch (error) {
        console.error('Failed to initialize PoseidonPhotoEditor:', error);
    }
});

// Add dark mode toggle functionality
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}