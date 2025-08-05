import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Leaf, Users, ArrowRight, MapPin, BarChart3, FileCheck, Globe, Package, Clock, Calendar, Cloud, Sun, CloudRain, Mountain, Pickaxe, HardHat, Truck } from "lucide-react";
import agriTraceLogo from "@assets/IMG-20250724-WA0007_1753362990630.jpg";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";
import { useState, useEffect } from "react";

export default function MineWatchPortal() {
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
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Mine Watch - Mineral Resource Protection Platform | Ministry of Mines & Energy</title>
        <meta name="description" content="Advanced mining compliance and environmental monitoring system for Liberian mineral resource protection" />
      </Helmet>

      {/* Mobile-Responsive Header - ISMS Style */}
      <header className="isms-card sticky top-0 z-10 mb-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-8">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg overflow-hidden">
                  <img 
                    src={lacraLogo} 
                    alt="LACRA Official Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg overflow-hidden">
                  <img 
                    src={agriTraceLogo} 
                    alt="Mine Watch Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">Mine Watch</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Ministry of Mines & Energy</p>
                  <p className="text-xs text-gray-600 sm:hidden">MIME</p>
                </div>
              </div>
              
              {/* Time, Date, and Weather Widget */}
              <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-lg border border-orange-100">
                {/* Date and Time */}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
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
                  <Clock className="h-4 w-4 text-red-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
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
                <div className="flex items-center space-x-2 border-l border-orange-200 pl-4">
                  <WeatherIcon className="h-4 w-4 text-yellow-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{weather.temperature}</div>
                    <div className="text-xs text-gray-600">{weather.location}</div>
                  </div>
                </div>
              </div>
              
              {/* Mobile compact view */}
              <div className="lg:hidden flex items-center space-x-3 bg-gradient-to-r from-orange-50 to-red-50 px-3 py-1 rounded-lg border border-orange-100">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
                <WeatherIcon className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">{weather.temperature}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Ministry of Mines & Energy</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Hero Section - ISMS Style */}
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-6">
            <Mountain className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Mineral Resource
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              {" "}Protection Platform
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced mining compliance and environmental monitoring system for Liberian mineral resource protection 
            with real-time tracking, environmental impact assessment, and comprehensive regulatory oversight.
          </p>
          
          {/* Key Features - ISMS Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-3">
                <Pickaxe className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Mining</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Operations</p>
              <p className="text-slate-600 text-sm">Monitoring</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-red flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">GPS</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Tracking</p>
              <p className="text-slate-600 text-sm">System</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-yellow flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Environmental</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">100%</p>
              <p className="text-slate-600 text-sm">Protection</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Government</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Integration</p>
              <p className="text-slate-600 text-sm">Active</p>
            </div>
          </div>
        </div>

        {/* Access Portals - ISMS Style */}
        <div className="isms-card mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-slate flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Access Portals</h2>
              <p className="text-slate-600">Role-based authentication for mining resource management</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mining Engineer Portal */}
            <div className="isms-card group hover:shadow-xl transition-all duration-300 h-80 flex flex-col p-4">
              <div className="text-center pb-3">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <HardHat className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Mining Engineer Portal
                </h3>
                <p className="text-slate-600 text-xs leading-tight">
                  Mining specialists
                </p>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Mining operations</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Safety monitoring</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Equipment tracking</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-slate-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Production reports</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="isms-button w-full text-sm py-2 group-hover:scale-105 transition-transform"
              >
                <a href="/mining-engineer-login">
                  Access Portal
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>

            {/* Mine Operator Portal */}
            <div className="isms-card group hover:shadow-xl transition-all duration-300 h-80 flex flex-col p-4">
              <div className="text-center pb-3">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-red flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Pickaxe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Mine Operator Portal
                </h3>
                <p className="text-slate-600 text-xs leading-tight">
                  Mining companies
                </p>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">License management</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Compliance reporting</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Environmental impact</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Production data</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="isms-button w-full text-sm py-2 group-hover:scale-105 transition-transform"
              >
                <a href="/mine-operator-login">
                  Access Portal
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>

            {/* Environmental Inspector Portal */}
            <div className="isms-card group hover:shadow-xl transition-all duration-300 h-80 flex flex-col p-4">
              <div className="text-center pb-3">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-yellow flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Environmental Inspector Portal
                </h3>
                <p className="text-slate-600 text-xs leading-tight">
                  Environmental officers
                </p>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Impact assessments</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Site inspections</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Compliance monitoring</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Violation reports</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="isms-button w-full text-sm py-2 group-hover:scale-105 transition-transform"
              >
                <a href="/environmental-inspector-login">
                  Access Portal
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>

            {/* Transport Coordinator Portal */}
            <div className="isms-card group hover:shadow-xl transition-all duration-300 h-80 flex flex-col p-4">
              <div className="text-center pb-3">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Transport Coordinator Portal
                </h3>
                <p className="text-slate-600 text-xs leading-tight">
                  Mineral transporters
                </p>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Route tracking</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Cargo monitoring</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Security tracking</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Delivery verification</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="isms-button w-full text-sm py-2 group-hover:scale-105 transition-transform"
              >
                <a href="/transport-coordinator-login">
                  Access Portal
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview - ISMS Style */}
        <div className="isms-card mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Platform Statistics</h3>
              <p className="text-slate-600">Comprehensive mining resource protection coverage</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Liberian</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">15</p>
              <p className="text-slate-600 text-sm">Counties</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-red flex items-center justify-center mx-auto mb-3">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Mining</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">500+</p>
              <p className="text-slate-600 text-sm">Sites</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-yellow flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Environmental</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">24/7</p>
              <p className="text-slate-600 text-sm">Monitoring</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Government</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">4</p>
              <p className="text-slate-600 text-sm">Integrations</p>
            </div>
          </div>
        </div>

        {/* Contact Information - ISMS Style */}
        <div className="isms-card text-center">
          <div className="w-16 h-16 rounded-2xl isms-icon-bg-slate flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-xl font-semibold text-slate-900 mb-4">
            Need Help Accessing the System?
          </h4>
          <p className="text-slate-600 mb-6">
            Contact your local mining office or system administrator for account setup and technical support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Mining Hotline</p>
              <p className="text-slate-600">+231 77 MINE-1</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Email Support</p>
              <p className="text-slate-600">support@mime.gov.lr</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Emergency</p>
              <p className="text-slate-600">+231 88 MINE-911</p>
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
                alt="Mine Watch Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-slate-600 mb-2 font-medium">
            © 2025 Ministry of Mines & Energy
          </p>
          <p className="text-sm text-slate-500">
            Mine Watch - Securing Liberia's Mineral Future
          </p>
        </div>
      </footer>
    </div>
  );
}