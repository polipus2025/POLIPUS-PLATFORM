import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Leaf, Users, ArrowRight, MapPin, BarChart3, FileCheck, Globe, Package, Clock, Calendar, Cloud, Sun, CloudRain, Download, FileText } from "lucide-react";
import agriTraceLogo from "@assets/IMG-20250724-WA0007_1753362990630.jpg";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";
import { useState, useEffect } from "react";

export default function Landing() {
  // Time, Date, and Weather State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    condition: 'sunny',
    temperature: '28°C',
    location: 'Monrovia, Liberia'
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate weather updates (in a real app, this would fetch from a weather API)
  useEffect(() => {
    const weatherConditions = [
      { condition: 'sunny', temperature: '28°C', icon: Sun },
      { condition: 'cloudy', temperature: '26°C', icon: Cloud },
      { condition: 'partly-cloudy', temperature: '25°C', icon: Cloud },
      { condition: 'rainy', temperature: '24°C', icon: CloudRain }
    ];
    
    // Update weather every 5 minutes (simulated)
    const weatherTimer = setInterval(() => {
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      setWeather(prev => ({ ...prev, ...randomWeather }));
    }, 300000); // 5 minutes

    return () => clearInterval(weatherTimer);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return Sun;
      case 'rainy': return CloudRain;
      case 'cloudy':
      case 'partly-cloudy':
      default: return Cloud;
    }
  };

  const WeatherIcon = getWeatherIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>AgriTrace360™ - Agricultural Traceability & Compliance Platform | LACRA</title>
        <meta name="description" content="Comprehensive agricultural commodity compliance management system for the Liberia Agriculture Commodity Regulatory Authority" />
      </Helmet>

      {/* Mobile-Responsive Header */}
      <header className="bg-white shadow-xl border-slate-200 sticky top-0 z-10 mb-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                {/* Liberian Flag */}
                <div className="w-16 h-11 rounded-lg overflow-hidden shadow-lg border border-slate-300">
                  <svg viewBox="0 0 190 100" className="w-full h-full">
                    {/* Red and white stripes */}
                    <rect width="190" height="100" fill="#BF0A30"/>
                    <rect y="9.09" width="190" height="9.09" fill="white"/>
                    <rect y="27.27" width="190" height="9.09" fill="white"/>
                    <rect y="45.45" width="190" height="9.09" fill="white"/>
                    <rect y="63.64" width="190" height="9.09" fill="white"/>
                    <rect y="81.82" width="190" height="9.09" fill="white"/>
                    
                    {/* Blue canton */}
                    <rect width="76" height="54.55" fill="#002B7F"/>
                    
                    {/* White star */}
                    <polygon points="38,13 40.85,21.15 49.5,21.15 42.83,26.35 45.68,34.5 38,29.3 30.32,34.5 33.17,26.35 26.5,21.15 35.15,21.15" 
                             fill="white"/>
                  </svg>
                </div>
                
                <div className="w-14 h-14 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={lacraLogo} 
                    alt="LACRA Official Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={agriTraceLogo} 
                    alt="AgriTrace360 Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">AgriTrace360™</h1>
                  <p className="text-sm text-slate-600 hidden sm:block">Liberia Agriculture Commodity Regulatory Authority</p>
                  <p className="text-xs text-slate-600 sm:hidden">LACRA</p>
                </div>
              </div>
              
              {/* Time, Date, and Weather Widget */}
              <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                {/* Date and Time */}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <div className="text-sm">
                    <div className="font-medium text-slate-900">
                      {currentTime.toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-600" />
                  <div className="text-sm">
                    <div className="font-medium text-slate-900">
                      {currentTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Weather */}
                <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                  <WeatherIcon className="h-4 w-4 text-slate-600" />
                  <div className="text-sm">
                    <div className="font-medium text-slate-900">{weather.temperature}</div>
                    <div className="text-xs text-slate-600">{weather.location}</div>
                  </div>
                </div>
              </div>
              
              {/* Mobile compact view */}
              <div className="lg:hidden flex items-center space-x-3 bg-gradient-to-r from-slate-50 to-blue-50 px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                <Clock className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
                <WeatherIcon className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">{weather.temperature}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-slate-600">Republic of Liberia</p>
              <p className="text-xs text-slate-500">Ministry of Agriculture</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Hero Section */}
        <div className="bg-white shadow-xl border-slate-200 rounded-lg p-8 text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Globe className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Agricultural Traceability &
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              {" "}Compliance Platform
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Comprehensive commodity tracking, regulatory compliance monitoring, and farm management 
            platform supporting all 15 Liberian counties and major cash crops with EUDR compliance integration.
          </p>
          
          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white shadow-lg border-slate-200 rounded-lg p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Real-time</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Analytics</p>
              <p className="text-slate-600 text-sm">Platform</p>
            </div>
            
            <div className="bg-white shadow-lg border-slate-200 rounded-lg p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">GPS Farm</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Mapping</p>
              <p className="text-slate-600 text-sm">System</p>
            </div>
            
            <div className="bg-white shadow-lg border-slate-200 rounded-lg p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-black text-xl">EU</span>
              </div>
              <p className="text-slate-600 text-sm mb-1">EUDR</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">100%</p>
              <p className="text-slate-600 text-sm">Compliance</p>
            </div>
            
            <div className="bg-white shadow-lg border-slate-200 rounded-lg p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Government</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Integration</p>
              <p className="text-slate-600 text-sm">Active</p>
            </div>
          </div>
        </div>



        {/* Access Portals */}
        <div className="bg-white shadow-xl border-slate-200 rounded-lg p-8 mb-12">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Access Portals</h2>
                <p className="text-slate-600">Role-based authentication for agricultural compliance management</p>
              </div>
            </div>
            <div>
              <Button 
                asChild 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <a href="/">
                  ← Back to Polipus Platform
                </a>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Regulatory Portal */}
            <div className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-lg p-6">
              <div className="text-center pb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Regulatory
                </h3>
                <p className="text-slate-600 text-sm">
                  LACRA administrators
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Compliance monitoring</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>System analytics</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span>Government integration</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-slate-500 mt-2 flex-shrink-0"></div>
                  <span>User management</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group"
              >
                <a href="/regulatory-login">
                  Access Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            {/* Farmer Portal */}
            <div className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-lg p-6">
              <div className="text-center pb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Farmer & Buyer
                </h3>
                <p className="text-slate-600 text-sm">
                  Agricultural producers & buyers
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Farm plot mapping</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  <span>Batch code tracking</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>Crop planning</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                  <span>Compliance docs</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white group"
              >
                <a href="/farmer-login">
                  Access Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            {/* Inspector Portal */}
            <div className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-lg p-6">
              <div className="text-center pb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Inspector
                </h3>
                <p className="text-slate-600 text-sm">
                  Extension officers
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>Farmer onboarding</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                  <span>GPS field mapping</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Mobile data collection</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>Field reports</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white group"
              >
                <a href="/inspector-login">
                  Access Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            {/* Exporter Portal */}
            <div className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-lg p-6">
              <div className="text-center pb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Exporter
                </h3>
                <p className="text-slate-600 text-sm">
                  Commodity exporters
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>Export order management</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span>LACRA compliance</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Network partnerships</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>Export analytics</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white group"
              >
                <a href="/exporter-login">
                  Access Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white shadow-xl border-slate-200 rounded-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Platform Statistics</h3>
              <p className="text-slate-600">Comprehensive agricultural compliance management coverage</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow-lg border-slate-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Liberian</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">15</p>
              <p className="text-slate-600 text-sm">Counties</p>
            </div>
            
            <div className="bg-white shadow-lg border-slate-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Cash Crop</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">20+</p>
              <p className="text-slate-600 text-sm">Types</p>
            </div>
            
            <div className="bg-white shadow-lg border-slate-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">EUDR</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">100%</p>
              <p className="text-slate-600 text-sm">Compliant</p>
            </div>
            
            <div className="bg-white shadow-lg border-slate-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Government</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">3</p>
              <p className="text-slate-600 text-sm">Integrations</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-xl border-slate-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-xl font-semibold text-slate-900 mb-4">
            Need Help Accessing the System?
          </h4>
          <p className="text-slate-600 mb-6">
            Contact your local LACRA office or system administrator for account setup and technical support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">LACRA Hotline</p>
              <p className="text-slate-600">+231 77 LACRA-1</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Email Support</p>
              <p className="text-slate-600">support@lacra.gov.lr</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Emergency</p>
              <p className="text-slate-600">+231 88 AGRI-911</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - ISMS Style */}
      <footer className="isms-card mt-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src={lacraLogo} 
                alt="LACRA Official Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src={agriTraceLogo} 
                alt="AgriTrace360 Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-slate-600 mb-2 font-medium">
            © 2025 Liberia Agriculture Commodity Regulatory Authority (LACRA)
          </p>
          <p className="text-sm text-slate-500">
            AgriTrace360™ - Securing Liberia's Agricultural Future
          </p>
        </div>
      </footer>
    </div>
  );
}