import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Leaf, Users, ArrowRight, MapPin, BarChart3, FileCheck, Globe, Package, Clock, Calendar, Cloud, Sun, CloudRain, Waves, Heart, DollarSign, TrendingUp, Zap } from "lucide-react";
import agriTraceLogo from "@assets/IMG-20250724-WA0007_1753362990630.jpg";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function BlueCarbon360Portal() {
  const [, setLocation] = useLocation();
  
  // Time, Date, and Weather State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    condition: 'sunny',
    temperature: '28°C',
    location: 'Monrovia, Liberia'
  });

  // Auto login function
  const handleAutoLogin = async () => {
    try {
      const response = await fetch('/api/auth/blue-carbon360-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'bluecarbon.admin',
          password: 'BlueOcean2024!'
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('blue_carbon_360_user', JSON.stringify(data.user));
        localStorage.setItem('blue_carbon_360_token', data.token);
        setLocation('/portals/blue-carbon360-dashboard');
      } else {
        console.error('Auto login failed');
      }
    } catch (error) {
      console.error('Auto login error:', error);
    }
  };

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
        <title>Blue Carbon 360 - Ocean Conservation Economics Platform | Ministry of Environment</title>
        <meta name="description" content="Advanced blue carbon credit and ocean conservation economics system for Liberian marine ecosystems" />
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
                    alt="Blue Carbon 360 Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">Blue Carbon 360</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Ministry of Environment & Climate</p>
                  <p className="text-xs text-gray-600 sm:hidden">MEC</p>
                </div>
              </div>
              
              {/* Time, Date, and Weather Widget */}
              <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100">
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
                  <Clock className="h-4 w-4 text-indigo-600" />
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
                  <WeatherIcon className="h-4 w-4 text-purple-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{weather.temperature}</div>
                    <div className="text-xs text-gray-600">{weather.location}</div>
                  </div>
                </div>
              </div>
              
              {/* Mobile compact view */}
              <div className="lg:hidden flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-lg border border-blue-100">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
                <WeatherIcon className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">{weather.temperature}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Ministry of Environment & Climate</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Hero Section - ISMS Style */}
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Ocean Conservation
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}Economics Platform
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced blue carbon credit and ocean conservation economics system for Liberian marine ecosystems 
            with carbon trading, ecosystem valuation, and comprehensive conservation impact measurement.
          </p>
          
          {/* Key Features - ISMS Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Blue Carbon</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Trading</p>
              <p className="text-slate-600 text-sm">System</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-indigo flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Ecosystem</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Valuation</p>
              <p className="text-slate-600 text-sm">Analytics</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-sky flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Conservation</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">Impact</p>
              <p className="text-slate-600 text-sm">Tracking</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-3">
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
              <p className="text-slate-600">Role-based authentication for ocean conservation economics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Carbon Trader Portal */}
            <div className="isms-card group hover:shadow-xl transition-all duration-300 h-80 flex flex-col p-4">
              <div className="text-center pb-3">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Carbon Trader Portal
                </h3>
                <p className="text-slate-600 text-xs leading-tight">
                  Blue carbon specialists
                </p>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Carbon trading</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Market analysis</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Credit verification</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-slate-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Investment tracking</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="isms-button w-full text-sm py-2 group-hover:scale-105 transition-transform"
              >
                <a href="/blue-carbon360-regulatory-login">
                  Access Portal
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>

            {/* Conservation Economist Portal */}
            <div className="isms-card group hover:shadow-xl transition-all duration-300 h-80 flex flex-col p-4">
              <div className="text-center pb-3">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-indigo flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Conservation Economist Portal
                </h3>
                <p className="text-slate-600 text-xs leading-tight">
                  Environmental economists
                </p>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Ecosystem valuation</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Economic modeling</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Cost-benefit analysis</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Policy recommendations</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="isms-button w-full text-sm py-2 group-hover:scale-105 transition-transform"
              >
                <a href="/blue-carbon-conservation-economist-login">
                  Access Portal
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>

            {/* Marine Conservationist Portal */}
            <div className="isms-card group hover:shadow-xl transition-all duration-300 h-80 flex flex-col p-4">
              <div className="text-center pb-3">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-sky flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Marine Conservationist Portal
                </h3>
                <p className="text-slate-600 text-xs leading-tight">
                  Conservation specialists
                </p>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Impact assessment</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Conservation projects</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Ecosystem monitoring</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Community engagement</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="isms-button w-full text-sm py-2 group-hover:scale-105 transition-transform"
              >
                <a href="/blue-carbon-marine-conservation-login">
                  Access Portal
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>

            {/* Policy Advisor Portal */}
            <div className="isms-card group hover:shadow-xl transition-all duration-300 h-80 flex flex-col p-4">
              <div className="text-center pb-3">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Policy Advisor Portal
                </h3>
                <p className="text-slate-600 text-xs leading-tight">
                  Government policy makers
                </p>
              </div>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Policy development</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Regulatory framework</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">Strategic planning</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <span className="leading-tight">International cooperation</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="isms-button w-full text-sm py-2 group-hover:scale-105 transition-transform"
              >
                <a href="/blue-carbon-policy-advisory-login">
                  Access Portal
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>

          {/* CRITICAL FIX: Auto Login Testing Button - Make it highly visible */}
          <div className="mt-8 relative">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-300 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center animate-pulse">
                    <div className="text-2xl">⚡</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      🧪 INSTANT TESTING ACCESS
                    </h3>
                    <p className="text-slate-700 text-base font-semibold">
                      Click to automatically login - NO credentials needed!
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleAutoLogin}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-2 border-white"
                  data-testid="auto-login-test-button"
                >
                  ⚡ AUTO LOGIN TEST ⚡
                </Button>
              </div>
            </div>
            {/* Attention-grabbing animation */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
        </div>

        {/* System Overview - ISMS Style */}
        <div className="isms-card mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Platform Statistics</h3>
              <p className="text-slate-600">Comprehensive ocean conservation economics coverage</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Marine</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">580</p>
              <p className="text-slate-600 text-sm">Kilometers</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-indigo flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Carbon</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">$50M+</p>
              <p className="text-slate-600 text-sm">Value</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-sky flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Conservation</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">24/7</p>
              <p className="text-slate-600 text-sm">Monitoring</p>
            </div>
            
            <div className="isms-card text-center">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm mb-1">Government</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">6</p>
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
            Contact your local environment office or system administrator for account setup and technical support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Blue Carbon Hotline</p>
              <p className="text-slate-600">+231 77 BLUE-1</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Email Support</p>
              <p className="text-slate-600">support@mec.gov.lr</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900">Emergency</p>
              <p className="text-slate-600">+231 88 BLUE-911</p>
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
                alt="Blue Carbon 360 Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-slate-600 mb-2 font-medium">
            © 2025 Ministry of Environment & Climate
          </p>
          <p className="text-sm text-slate-500">
            Blue Carbon 360 - Securing Liberia's Ocean Future
          </p>
        </div>
      </footer>
    </div>
  );
}