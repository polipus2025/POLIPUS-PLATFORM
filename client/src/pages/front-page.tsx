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
  Leaf
} from 'lucide-react';
import poliposLogo from '@assets/polipos logo 1_1753394173408.jpg';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';

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
      color: 'bg-cyan-500',
      route: '/aqua-trace',
      description: 'Ocean ecosystem monitoring and protection'
    },
    {
      id: 7,
      title: 'Blue Carbon 360',
      icon: DollarSign,
      color: 'bg-indigo-500',
      route: '/blue-carbon360',
      description: 'Marine conservation economics and carbon marketplace'
    },
    {
      id: 8,
      title: 'Carbon Trace',
      icon: Leaf,
      color: 'bg-emerald-500',
      route: '/carbon-trace',
      description: 'Environmental monitoring and carbon footprint tracking'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Polipus Environmental Intelligence Platform</title>
        <meta name="description" content="Complete 8-module environmental intelligence platform for agricultural traceability, land mapping, livestock monitoring, forest protection, and carbon management" />
      </Helmet>
      
      <ModernBackground />
      
      <div className="min-h-screen relative overflow-x-hidden">
        {/* Header with Enhanced ISMS Design */}
        <header className="relative bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <img className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg object-cover border-2 border-white shadow-lg" src={poliposLogo} alt="Polipus Logo" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Polipus</h1>
                  <p className="text-xs sm:text-sm text-slate-600">Environmental Intelligence Platform</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/mobile-app">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white hidden sm:flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Mobile App
                  </Button>
                </Link>
                
                <Link href="/mobile-app">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white sm:hidden">
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          
          {/* Hero Section with ISMS Design */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="mb-4 sm:mb-6">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs sm:text-sm px-3 py-1">
                Environmental Intelligence Platform
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6">
              Comprehensive <span className="text-blue-600">Environmental</span>
              <br />
              <span className="text-green-600">Monitoring Solutions</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8">
              Advanced 8-module platform providing integrated solutions for agricultural traceability, 
              environmental monitoring, and sustainable resource management across multiple ecosystems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/portals">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                  <Wheat className="h-5 w-5 mr-2" />
                  Start with AgriTrace360
                </Button>
              </Link>
              <Link href="/integrated-dashboard">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Platform Statistics - ISMS Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-1">Active</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">1</p>
              <p className="text-slate-600 text-xs sm:text-sm">Module</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-1">In Development</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">7</p>
              <p className="text-slate-600 text-xs sm:text-sm">Modules</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-1">Platform Reach</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Global</p>
              <p className="text-slate-600 text-xs sm:text-sm">Coverage</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Satellite className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-1">Satellite Network</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">24</p>
              <p className="text-slate-600 text-xs sm:text-sm">Satellites</p>
            </div>
          </div>

          {/* Platform Modules */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Platform Modules</h2>
                <p className="text-sm sm:text-base text-slate-600">Integrated environmental monitoring solutions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {modules.map((module) => {
                const IconComponent = module.icon;
                
                return (
                  <Link key={module.id} href={module.route}>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col">
                      <div className="flex flex-col items-center text-center space-y-3 flex-1">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${module.color} flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2">{module.title}</h3>
                          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                            {module.description}
                          </p>
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
                        <Button className="w-full text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white">
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Enter Platform
                        </Button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Cross-Module Integration */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
              Integrated Cross-Module Dashboard  
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Access the comprehensive integrated dashboard showing real-time connectivity and data exchange 
              between all 8 modules. Monitor cross-module integration status and system-wide performance.
            </p>
            <Link href="/integrated-dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Integrated Dashboard
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}