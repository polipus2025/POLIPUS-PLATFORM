import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Download, Smartphone } from 'lucide-react';
import { Link } from 'wouter';

interface PWACheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

export default function PWATest() {
  const [checks, setChecks] = useState<PWACheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    runPWAChecks();
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const runPWAChecks = async () => {
    const newChecks: PWACheck[] = [];

    // Check 1: Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          newChecks.push({
            name: 'Service Worker',
            status: 'pass',
            details: `Registered at scope: ${registration.scope}`
          });
        } else {
          newChecks.push({
            name: 'Service Worker',
            status: 'fail',
            details: 'Not registered'
          });
        }
      } catch (error) {
        newChecks.push({
          name: 'Service Worker',
          status: 'fail',
          details: `Error: ${error}`
        });
      }
    } else {
      newChecks.push({
        name: 'Service Worker',
        status: 'fail',
        details: 'Not supported in this browser'
      });
    }

    // Check 2: Manifest
    try {
      const response = await fetch('/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        newChecks.push({
          name: 'Web App Manifest',
          status: 'pass',
          details: `Found: ${manifest.name || manifest.short_name}`
        });
      } else {
        newChecks.push({
          name: 'Web App Manifest',
          status: 'fail',
          details: `HTTP ${response.status}: ${response.statusText}`
        });
      }
    } catch (error) {
      newChecks.push({
        name: 'Web App Manifest',
        status: 'fail',
        details: `Error loading manifest: ${error}`
      });
    }

    // Check 3: HTTPS
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
    newChecks.push({
      name: 'HTTPS/Secure Context',
      status: isSecure ? 'pass' : 'fail',
      details: isSecure ? `Secure (${location.protocol})` : 'PWA requires HTTPS or localhost'
    });

    // Check 4: Browser Support
    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome = /chrome|chromium|crios/i.test(userAgent);
    const isEdge = /edg/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
    const isFirefox = /firefox/i.test(userAgent);

    if (isChrome || isEdge) {
      newChecks.push({
        name: 'Browser Support',
        status: 'pass',
        details: 'Chrome/Edge - Full PWA support'
      });
    } else if (isSafari) {
      newChecks.push({
        name: 'Browser Support',
        status: 'warning',
        details: 'Safari - Limited PWA support, use "Add to Home Screen"'
      });
    } else if (isFirefox) {
      newChecks.push({
        name: 'Browser Support',
        status: 'warning',
        details: 'Firefox - Limited PWA install support'
      });
    } else {
      newChecks.push({
        name: 'Browser Support',
        status: 'warning',
        details: 'Unknown browser - PWA support may be limited'
      });
    }

    // Check 5: Installation Status
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = localStorage.getItem('pwa-installed') === 'true';
    
    if (isStandalone) {
      newChecks.push({
        name: 'Installation Status',
        status: 'pass',
        details: 'App is installed and running in standalone mode'
      });
    } else if (isInstalled) {
      newChecks.push({
        name: 'Installation Status',
        status: 'warning',
        details: 'App marked as installed but not in standalone mode'
      });
    } else {
      newChecks.push({
        name: 'Installation Status',
        status: 'fail',
        details: 'App is not installed'
      });
    }

    setChecks(newChecks);
    setIsLoading(false);
  };

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
          localStorage.setItem('pwa-installed', 'true');
          runPWAChecks(); // Refresh checks
        }
      } catch (error) {
        console.error('Install failed:', error);
      }
    }
  };

  const getStatusIcon = (status: PWACheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">PWA Installation Test</h1>
            <Link href="/" className="text-emerald-300 hover:text-emerald-200">
              ← Back to Home
            </Link>
          </div>
          <p className="text-emerald-200">
            This page tests PWA (Progressive Web App) functionality and installation readiness.
          </p>
        </div>

        {/* PWA Checks */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">PWA Readiness Checks</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-emerald-200">Running PWA checks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {checks.map((check, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{check.name}</h3>
                    <p className="text-sm text-gray-300">{check.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Install Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Installation</h2>
          
          {installPrompt ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <p className="text-emerald-200 mb-4">
                Great! Your browser supports automatic PWA installation.
              </p>
              <button
                onClick={handleInstall}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Install Polipus App
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-300 mb-4">
                Automatic install prompt not available. Try these manual steps:
              </p>
              <div className="text-left bg-white/5 rounded-lg p-4 mb-4">
                <p className="text-emerald-200 font-medium mb-2">Chrome/Edge:</p>
                <p className="text-gray-300 text-sm mb-3">
                  1. Look for the install icon (⊞) in the address bar<br/>
                  2. OR click the three-dot menu → "Install app"
                </p>
                
                <p className="text-emerald-200 font-medium mb-2">Safari (iOS):</p>
                <p className="text-gray-300 text-sm">
                  1. Tap the share button (⤴)<br/>
                  2. Select "Add to Home Screen"
                </p>
              </div>
              <Link href="/mobile-app-download">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  View Installation Guide
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mt-6">
          <h3 className="text-lg font-medium text-white mb-3">Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-emerald-300">User Agent:</p>
              <p className="text-gray-300 break-all">{navigator.userAgent}</p>
            </div>
            <div>
              <p className="text-emerald-300">Location:</p>
              <p className="text-gray-300">{window.location.href}</p>
            </div>
            <div>
              <p className="text-emerald-300">Display Mode:</p>
              <p className="text-gray-300">
                {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}
              </p>
            </div>
            <div>
              <p className="text-emerald-300">Install Prompt Available:</p>
              <p className="text-gray-300">{installPrompt ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}