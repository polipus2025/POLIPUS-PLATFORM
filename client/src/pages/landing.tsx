import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Leaf, Users, ArrowRight, MapPin, BarChart3, FileCheck, Globe, Package, Clock, Calendar, Cloud, Sun, CloudRain } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <Helmet>
        <title>AgriTrace360™ - Agricultural Traceability & Compliance Platform | LACRA</title>
        <meta name="description" content="Comprehensive agricultural commodity compliance management system for the Liberia Agriculture Commodity Regulatory Authority" />
      </Helmet>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden">
                  <img 
                    src={lacraLogo} 
                    alt="LACRA Official Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img 
                    src={agriTraceLogo} 
                    alt="AgriTrace360 Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AgriTrace360™</h1>
                  <p className="text-sm text-gray-600">Liberia Agriculture Commodity Regulatory Authority</p>
                </div>
              </div>
              
              {/* Time, Date, and Weather Widget */}
              <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 rounded-lg border border-blue-100">
                {/* Date and Time */}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
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
                  <Clock className="h-4 w-4 text-green-600" />
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
                <div className="flex items-center space-x-2 border-l border-blue-200 pl-4">
                  <WeatherIcon className="h-4 w-4 text-orange-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{weather.temperature}</div>
                    <div className="text-xs text-gray-600">{weather.location}</div>
                  </div>
                </div>
              </div>
              
              {/* Mobile compact view */}
              <div className="lg:hidden flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-green-50 px-3 py-1 rounded-lg border border-blue-100">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
                <WeatherIcon className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">{weather.temperature}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Ministry of Agriculture</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Agricultural Traceability &
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              {" "}Compliance Platform
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Comprehensive commodity tracking, regulatory compliance monitoring, and farm management 
            platform supporting all 15 Liberian counties and major cash crops with EUDR compliance integration.
          </p>
          
          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="flex flex-col items-center p-4 bg-white/60 rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">Real-time Analytics</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/60 rounded-lg">
              <MapPin className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">GPS Farm Mapping</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/60 rounded-lg">
              <FileCheck className="h-8 w-8 text-emerald-600 mb-2" />
              <span className="text-sm font-medium">EUDR Compliance</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/60 rounded-lg">
              <Globe className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Gov Integration</span>
            </div>
          </div>
        </div>

        {/* Access Portals */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {/* Regulatory Portal */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-full group-hover:scale-110 transition-transform">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Regulatory Portal
              </CardTitle>
              <p className="text-gray-600">
                For LACRA administrators and regulatory staff
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  Compliance monitoring & oversight
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  System analytics & reporting
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4 text-purple-600" />
                  Government agency integration
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-gray-600" />
                  User management & permissions
                </div>
              </div>
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 group-hover:scale-105 transition-transform"
              >
                <a href="/regulatory-login">
                  Access Regulatory Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Farmer Portal */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Farmer Portal
              </CardTitle>
              <p className="text-gray-600">
                For registered farmers and agricultural producers
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-green-600" />
                  Farm plot mapping & management
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  Batch code generation & tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Crop planning & harvest records
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Leaf className="h-4 w-4 text-green-500" />
                  Compliance documentation
                </div>
              </div>
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 group-hover:scale-105 transition-transform"
              >
                <a href="/farmer-login">
                  Access Farmer Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Field Agent Portal */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Field Agent Portal
              </CardTitle>
              <p className="text-gray-600">
                For field agents and extension officers
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-orange-600" />
                  Farmer onboarding & registration
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-yellow-600" />
                  GPS field mapping & inspections
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  Mobile data collection forms
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Field report submissions
                </div>
              </div>
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-medium py-3 group-hover:scale-105 transition-transform"
              >
                <a href="/field-agent-login">
                  Access Field Agent Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Exporter Portal */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:scale-110 transition-transform">
                  <Package className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Exporter Portal
              </CardTitle>
              <p className="text-gray-600">
                For licensed agricultural commodity exporters
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4 text-blue-600" />
                  Export order management
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4 text-purple-600" />
                  LACRA compliance integration
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-green-600" />
                  Network partnerships
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                  Export analytics & reporting
                </div>
              </div>
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 group-hover:scale-105 transition-transform"
              >
                <a href="/exporter-login">
                  Access Exporter Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Comprehensive Agricultural Compliance Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">15</div>
              <div className="text-gray-600">Liberian Counties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">20+</div>
              <div className="text-gray-600">Cash Crop Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">100%</div>
              <div className="text-gray-600">EUDR Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">3</div>
              <div className="text-gray-600">Gov Integrations</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help Accessing the System?
          </h4>
          <p className="text-gray-600 mb-4">
            Contact your local LACRA office or system administrator for account setup and technical support.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span>LACRA Hotline: +231 77 LACRA-1</span>
            <span>•</span>
            <span>Email: support@lacra.gov.lr</span>
            <span>•</span>
            <span>Emergency: +231 88 AGRI-911</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-2">
            © 2025 Liberia Agriculture Commodity Regulatory Authority (LACRA)
          </p>
          <p className="text-sm text-gray-500">
            AgriTrace360™ - Securing Liberia's Agricultural Future
          </p>
        </div>
      </footer>
    </div>
  );
}