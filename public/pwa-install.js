// PWA Installation Manager for AgriTrace360
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.setupEventListeners();
        this.checkInstallationStatus();
    }

    setupEventListeners() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('AgriTrace360 PWA: Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for the appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('AgriTrace360 PWA: App was installed');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstalledMessage();
        });

        // Check if running in standalone mode
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            console.log('AgriTrace360 PWA: Running in standalone mode');
            this.isInstalled = true;
        }

        // iOS detection
        if (window.navigator.standalone === true) {
            console.log('AgriTrace360 PWA: Running as iOS PWA');
            this.isInstalled = true;
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            console.log('AgriTrace360 PWA: No install prompt available');
            this.showManualInstallInstructions();
            return;
        }

        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`AgriTrace360 PWA: User response to install prompt: ${outcome}`);
            
            if (outcome === 'accepted') {
                this.hideInstallButton();
            }
            
            // Clear the deferred prompt
            this.deferredPrompt = null;
        } catch (error) {
            console.error('AgriTrace360 PWA: Installation failed:', error);
        }
    }

    showInstallButton() {
        // Create install button if it doesn't exist
        let installBtn = document.getElementById('pwa-install-btn');
        if (!installBtn) {
            installBtn = this.createInstallButton();
        }
        installBtn.style.display = 'block';
    }

    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    createInstallButton() {
        const button = document.createElement('button');
        button.id = 'pwa-install-btn';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Install AgriTrace360 App
        `;
        button.className = 'pwa-install-button';
        button.onclick = () => this.installApp();
        
        // Add styles
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #059669, #0d9488);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            display: none;
            align-items: center;
            gap: 8px;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
        });
        
        document.body.appendChild(button);
        return button;
    }

    showInstalledMessage() {
        // Show a brief success message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        `;
        message.textContent = 'AgriTrace360 app installed successfully!';
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }

    showManualInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        
        if (isIOS) {
            instructions = `
                <h3>Install AgriTrace360 on iOS:</h3>
                <ol>
                    <li>Tap the Share button <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8M12 12l4-4M8 8l4 4"/></svg></li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" to install the app</li>
                </ol>
            `;
        } else if (isAndroid) {
            instructions = `
                <h3>Install AgriTrace360 on Android:</h3>
                <ol>
                    <li>Tap the menu button (⋮) in your browser</li>
                    <li>Select "Add to Home screen" or "Install app"</li>
                    <li>Tap "Add" or "Install" to confirm</li>
                </ol>
            `;
        } else {
            instructions = `
                <h3>Install AgriTrace360:</h3>
                <p>Look for an install icon in your browser's address bar, or check your browser's menu for "Install" or "Add to Home Screen" options.</p>
            `;
        }
        
        this.showModal(instructions);
    }

    showModal(content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 24px;
            border-radius: 12px;
            max-width: 400px;
            margin: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        modalContent.innerHTML = `
            ${content}
            <button id="close-modal" style="
                margin-top: 16px;
                background: #059669;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            ">Close</button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal
        document.getElementById('close-modal').onclick = () => {
            document.body.removeChild(modal);
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    checkInstallationStatus() {
        // Check if already installed
        if (this.isInstalled) {
            console.log('AgriTrace360 PWA: App is already installed');
            return;
        }

        // For browsers that support getInstalledRelatedApps
        if ('getInstalledRelatedApps' in navigator) {
            navigator.getInstalledRelatedApps().then((relatedApps) => {
                if (relatedApps.length > 0) {
                    console.log('AgriTrace360 PWA: Related app is installed');
                    this.isInstalled = true;
                }
            }).catch(err => {
                console.log('AgriTrace360 PWA: Could not check related apps:', err);
            });
        }
    }

    // Initialize offline functionality
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            console.log('AgriTrace360 PWA: Back online');
            this.showConnectionStatus('Connected', '#10b981');
        });

        window.addEventListener('offline', () => {
            console.log('AgriTrace360 PWA: Gone offline');
            this.showConnectionStatus('Offline - Some features may be limited', '#f59e0b');
        });
    }

    showConnectionStatus(message, color) {
        const statusBar = document.createElement('div');
        statusBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: ${color};
            color: white;
            text-align: center;
            padding: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1002;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        `;
        statusBar.textContent = message;
        document.body.appendChild(statusBar);
        
        // Animate in
        setTimeout(() => {
            statusBar.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            statusBar.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (document.body.contains(statusBar)) {
                    document.body.removeChild(statusBar);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize PWA installer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pwaInstaller = new PWAInstaller();
        window.pwaInstaller.setupOfflineDetection();
    });
} else {
    window.pwaInstaller = new PWAInstaller();
    window.pwaInstaller.setupOfflineDetection();
}

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('AgriTrace360 PWA: Service Worker registered successfully:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                console.log('AgriTrace360 PWA: Update found, installing...');
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('AgriTrace360 PWA: Update ready');
                        // Show update available notification
                        window.pwaInstaller?.showConnectionStatus('Update available - Refresh to get the latest version', '#3b82f6');
                    }
                });
            });
        } catch (error) {
            console.error('AgriTrace360 PWA: Service Worker registration failed:', error);
        }
    });
}