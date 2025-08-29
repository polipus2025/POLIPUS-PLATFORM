import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import ModernBackground from '@/components/ui/modern-background';
import ModernCard from '@/components/ui/modern-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wheat, 
  Truck, 
  Shield, 
  BarChart3, 
  MapPin, 
  Users, 
  FileText, 
  Settings,
  ArrowRight,
  CheckCircle,
  Globe,
  Satellite,
  TreePine,
  Waves,
  DollarSign,
  Download,
  Smartphone,
  Zap,
  Leaf,
  Database,
  FileCheck,
  Building2
} from 'lucide-react';
// Original Polipus logo restored - using URL-encoded path
const poliposLogo = '/api/assets/polipos%20logo%201_1753394173408.jpg';

export default function FrontPage() {
  const modules = [
    {
      id: 1,
      title: 'Agricultural Traceability & Compliance',
      icon: Wheat,
      color: 'bg-green-500',
      route: '/portals',
      isAgriTrace: true,
      description: 'Complete agricultural commodity tracking & LACRA compliance system'
    },
    {
      id: 2,
      title: 'Live Trace',
      icon: Truck,
      color: 'bg-blue-500',
      route: '/live-trace',
      description: 'Livestock movement monitoring and control system'
    },
    {
      id: 3,
      title: 'Land Map360',
      icon: MapPin,
      color: 'bg-purple-500',
      route: '/landmap360-portal',
      description: 'Land mapping and dispute prevention services'
    },
    {
      id: 4,
      title: 'Mine Watch',
      icon: Shield,
      color: 'bg-orange-500',
      route: '/mine-watch',
      description: 'Mineral resource protection and community safeguarding'
    },
    {
      id: 5,
      title: 'Forest Guard',
      icon: TreePine,
      color: 'bg-teal-500',
      route: '/forest-guard',
      description: 'Forest protection and carbon credit management'
    },
    {
      id: 6,
      title: 'Aqua Trace',
      icon: Waves,
      color: 'bg-indigo-500',
      route: '/aqua-trace',
      description: 'Ocean & river monitoring with fishing rights protection'
    },
    {
      id: 7,
      title: 'Blue Carbon 360',
      icon: DollarSign,
      color: 'bg-cyan-500',
      route: '/blue-carbon360',
      description: 'Conservation economics and real economic benefits'
    },
    {
      id: 8,
      title: 'Carbon Trace',
      icon: Globe,
      color: 'bg-emerald-500',
      route: '/carbon-trace',
      description: 'Environmental monitoring and carbon credit certification'
    }
  ];



  return (
    <div className="min-h-screen isms-gradient" style={{ overflowY: 'auto', height: 'auto' }}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">


        {/* Mobile-Responsive Polipos Logo - ISMS Style */}
        <div className="isms-card text-center mb-8 sm:mb-12">
          <div className="flex justify-center py-4 sm:py-6 relative">
            <div className="h-32 sm:h-48 md:h-64 w-auto flex items-center justify-center rounded-xl overflow-hidden">
              <img 
                src={poliposLogo} 
                alt="Polipus Environmental Intelligence Platform" 
                className="h-full w-auto object-contain max-w-full"
                style={{ maxHeight: '100%', width: 'auto' }}
              />
            </div>
            {/* Registered trademark symbol positioned over the 's' */}
            <span className="absolute top-8 sm:top-12 md:top-16 right-[calc(50%-140px)] sm:right-[calc(50%-240px)] md:right-[calc(50%-380px)] text-sm sm:text-lg md:text-xl font-black text-slate-800 drop-shadow-sm">®</span>
          </div>
          <div className="relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 text-center">General Environmental Intelligence Platform</h2>
            
            {/* Monitoring Portal Button - Positioned to the right */}
            <div className="absolute right-0 top-0 flex flex-col gap-2">
              <Link href="/monitoring-login">
                <Button className="isms-button text-sm px-3 py-2 flex items-center gap-1.5">
                  <Users className="h-3 w-3" />
                  Monitoring
                </Button>
              </Link>
            </div>


          </div>
        </div>

        {/* Mobile-Responsive Platform Statistics - ISMS Style */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <div className="isms-card text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl isms-icon-bg-green flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Active Modules</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">1/8</p>
            <p className="text-slate-600 text-xs sm:text-sm">Operational</p>
          </div>
          
          <div className="isms-card text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-white font-bold text-sm sm:text-lg">EU</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">AgriTrace360</p>
            <p className="text-lg sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">EUDR 100%</p>
            <p className="text-slate-600 text-xs sm:text-sm">Compliance</p>
          </div>

          <div className="isms-card text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Settings className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">In Development</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">7</p>
            <p className="text-slate-600 text-xs sm:text-sm">Modules</p>
          </div>

          <div className="isms-card text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Globe className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Platform Reach</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Global</p>
            <p className="text-slate-600 text-xs sm:text-sm">Coverage</p>
          </div>
        </div>

        {/* Mobile-Responsive Platform Modules - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl isms-icon-bg-slate flex items-center justify-center">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Platform Modules</h2>
              <p className="text-sm sm:text-base text-slate-600">Integrated business solutions and enterprise applications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <div 
                  key={module.id} 
                  className="isms-card transition-all duration-300 h-64 sm:h-80 flex flex-col hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-slate-300"
                >
                  <Link href={module.route} className="h-full flex flex-col relative block group">
                    <div className="flex flex-col items-center text-center h-full p-3 sm:p-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${module.isAgriTrace ? 'isms-icon-bg-green' : module.color} flex items-center justify-center group-hover:scale-110 transition-transform mb-3`}>
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{module.title}</h3>
                          {module.description && (
                            <p className="text-xs text-slate-600 mb-2 sm:mb-3 leading-relaxed">
                              {module.description}
                            </p>
                          )}
                          <Badge className={module.isAgriTrace ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-100 text-orange-800 border-orange-200"}>
                            {module.isAgriTrace ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              "Coming Soon"
                            )}
                          </Badge>
                        </div>
                        <Button className="w-full text-xs sm:text-sm isms-button mt-4">
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Enter Platform
                        </Button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>


        {/* Cross-Module Integration Dashboard */}
        <div className="isms-card mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
              Integrated Cross-Module Dashboard  
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Access the comprehensive integrated dashboard showing real-time connectivity and data exchange 
              between all 7 modules. Monitor cross-module integration status and system-wide performance.
            </p>
            <Link href="/integrated-dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white flex items-center gap-2 mx-auto">
                <Zap className="h-4 w-4" />
                View Integrated Dashboard
              </Button>
            </Link>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>7 Modules Connected</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Real-time Data Exchange</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Cross-Module Search</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>System Health Monitoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile App Download Section */}
        <div className="isms-card mt-8 sm:mt-12">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl isms-icon-bg-green flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
              Download Polipus Mobile App
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Install our Progressive Web App for the complete mobile experience. Access all 8 modules offline, 
              get push notifications, and enjoy native app-like performance on your mobile device.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/mobile-app-download">
                <Button className="isms-button flex items-center gap-2" data-testid="button-download-app">
                  <Download className="h-4 w-4" />
                  Download App
                </Button>
              </Link>
              <Link href="/install-app">
                <Button variant="outline" className="flex items-center gap-2 border-slate-200 hover:bg-slate-50" data-testid="button-install-instructions">
                  <Smartphone className="h-4 w-4" />
                  Installation Guide
                </Button>
              </Link>
              <Link href="/pwa-test">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                  Debug PWA
                </Button>
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Works Offline</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Push Notifications</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Native Performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Documentation Download - After Mobile App Section */}
        <div className="isms-card mt-8 sm:mt-12 bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
              Platform Documentation
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Download comprehensive technical documentation covering the world's first environmental intelligence ecosystem with all 8 integrated modules, 200+ satellite sources, shipping tracking & monitoring system integration, and complete monitoring capabilities.
            </p>
            <Button 
              onClick={() => window.open('/api/download/platform-documentation', '_blank')}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Complete Documentation PDF
            </Button>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Complete 24-Page Analysis</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>All 8 Modules</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>200+ Satellites</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Comprehensive environmental intelligence analysis • Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}