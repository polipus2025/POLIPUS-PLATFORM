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
      console.error('PWA installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleIOSInstallInstructions = () => {
    setShowPrompt(false);
    setShowIOSModal(true);
  };

  // Don't show if already installed or in standalone mode
  if (isInstalled || isStandalone || !showPrompt) {
    return showIOSModal ? (
      <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-5">
        <div className="bg-white rounded-xl p-6 max-w-sm text-center">
          <h3 className="text-xl font-semibold text-emerald-600 mb-4">Install Polipus App</h3>
          <div className="space-y-4 mb-5">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span className="text-gray-800">Share</span>
            </div>
            <p className="text-gray-600 text-sm">1. Tap the Share button at the bottom</p>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
              <span className="text-gray-800">Add to Home Screen</span>
            </div>
            <p className="text-gray-600 text-sm">2. Select "Add to Home Screen"</p>
          </div>
          <button
            onClick={() => setShowIOSModal(false)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-emerald-700 transition-colors"
            data-testid="button-close-ios-modal"
          >
            Got it!
          </button>
        </div>
      </div>
    ) : null;
  }

  return (
    <>
      {showIOSModal && (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-5">
          <div className="bg-white rounded-xl p-6 max-w-sm text-center">
            <h3 className="text-xl font-semibold text-emerald-600 mb-4">Install Polipus App</h3>
            <div className="space-y-4 mb-5">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-gray-800">Share</span>
              </div>
              <p className="text-gray-600 text-sm">1. Tap the Share button at the bottom</p>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </div>
                <span className="text-gray-800">Add to Home Screen</span>
              </div>
              <p className="text-gray-600 text-sm">2. Select "Add to Home Screen"</p>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-emerald-700 transition-colors"
              data-testid="button-close-ios-modal"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className="fixed top-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 md:max-w-md md:left-auto md:right-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
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
    </>
  );
}