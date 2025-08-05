import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 10 seconds if not already installed
      setTimeout(() => {
        if (!standalone && !localStorage.getItem('pwa-prompt-dismissed')) {
          setShowPrompt(true);
        }
      }, 10000);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if previously installed
    if (localStorage.getItem('pwa-installed') || standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        localStorage.setItem('pwa-installed', 'true');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleIOSInstallInstructions = () => {
    setShowPrompt(false);
    // Show iOS installation modal
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div style="background: white; border-radius: 12px; padding: 24px; max-width: 350px; text-align: center;">
          <h3 style="margin: 0 0 16px 0; color: #059669; font-size: 20px;">Install Polipus App</h3>
          <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <div style="width: 32px; height: 32px; background: #059669; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                <svg style="width: 20px; height: 20px; fill: white;" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <span style="font-size: 16px; color: #333;">Share</span>
            </div>
            <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">1. Tap the Share button at the bottom</p>
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <div style="width: 32px; height: 32px; background: #059669; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                <svg style="width: 20px; height: 20px; fill: white;" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              </div>
              <span style="font-size: 16px; color: #333;">Add to Home Screen</span>
            </div>
            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">2. Select "Add to Home Screen"</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="background: #059669; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer;">Got it!</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  // Don't show if already installed or in standalone mode
  if (isInstalled || isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 md:max-w-md md:left-auto md:right-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-content-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">Install Polipus App</h3>
            <p className="text-gray-600 text-xs mt-1">
              Get the full experience with offline access and native app features
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 p-1"
          data-testid="button-dismiss-pwa"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-4 flex space-x-2">
        {isIOS ? (
          <button
            onClick={handleIOSInstallInstructions}
            className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            data-testid="button-install-ios"
          >
            <Download className="w-4 h-4" />
            <span>Install Instructions</span>
          </button>
        ) : (
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            data-testid="button-install-pwa"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors"
          data-testid="button-maybe-later"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}