import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Smartphone, Monitor, Check, ExternalLink, Globe, Zap, Shield, Wifi } from 'lucide-react';
import { Link } from 'wouter';

export default function MobileAppDownload() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/ipad|iphone|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Check if app is already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(standalone || localStorage.getItem('pwa-installed') === 'true');

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          localStorage.setItem('pwa-installed', 'true');
        }
      } catch (error) {
        console.error('Installation failed:', error);
      }
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Access",
      description: "Launch directly from your home screen like a native app"
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Offline Capability",
      description: "Work without internet - data syncs when connection returns"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your agricultural data stays protected with enterprise security"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Get instant notifications for compliance alerts and updates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-emerald-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Download Polipus App</h1>
              <p className="text-emerald-200 text-sm">Install our mobile app for the best experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* App Preview */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-emerald-600 rounded-3xl mb-6 shadow-2xl">
            <div className="text-white text-4xl font-bold">P</div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Polipus Environmental Intelligence</h2>
          <p className="text-emerald-200 text-lg mb-8 max-w-2xl mx-auto">
            Complete 8-module platform for agricultural traceability, land mapping, livestock monitoring, 
            forest protection, and carbon management - now available as a mobile app.
          </p>

          {/* Installation Status */}
          {isInstalled ? (
            <div className="bg-emerald-600/20 border border-emerald-500/50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 text-emerald-300">
                <Check className="w-6 h-6" />
                <span className="text-lg font-semibold">App Successfully Installed!</span>
              </div>
              <p className="text-emerald-200 mt-2">Launch Polipus from your home screen</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {/* Android/Chrome Install */}
              {!isIOS && installPrompt && (
                <button
                  onClick={handleInstallApp}
                  className="w-full max-w-md mx-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-3 shadow-lg"
                  data-testid="button-install-android"
                >
                  <Download className="w-6 h-6" />
                  <span>Install Polipus App</span>
                </button>
              )}

              {/* iOS Instructions */}
              {isIOS && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left max-w-md mx-auto">
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Install on iOS
                  </h3>
                  <div className="space-y-3 text-emerald-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                      <p>Tap the <strong>Share</strong> button at the bottom of Safari</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                      <p>Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                      <p>Tap <strong>"Add"</strong> to install the Polipus app</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback for other browsers */}
              {!installPrompt && !isIOS && (
                <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-white font-semibold mb-2">Browser Not Supported</h3>
                  <p className="text-blue-200 text-sm mb-4">
                    For the best experience, please use Chrome, Edge, or Safari to install the app.
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Continue in Browser</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-emerald-200">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Module Access */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <h3 className="text-white font-semibold text-xl mb-4">Access All 8 Modules</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Agricultural Traceability",
              "Live Trace",
              "Land Map360", 
              "Mine Watch",
              "Forest Guard",
              "Aqua Trace",
              "Blue Carbon 360",
              "Carbon Trace"
            ].map((module, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <p className="text-emerald-200 text-sm">{module}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">System Requirements</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-emerald-300 font-medium mb-2">Mobile Devices</h4>
              <ul className="text-emerald-200 space-y-1">
                <li>• iOS 12.0+ (Safari)</li>
                <li>• Android 8.0+ (Chrome)</li>
                <li>• Modern web browser with PWA support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-emerald-300 font-medium mb-2">Features</h4>
              <ul className="text-emerald-200 space-y-1">
                <li>• GPS location services</li>
                <li>• Camera access for QR scanning</li>
                <li>• Push notifications</li>
                <li>• Offline data storage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}