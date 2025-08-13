import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  CheckCircle, 
  Settings, 
  Globe, 
  Satellite, 
  Wheat, 
  Truck, 
  Map, 
  Mountain, 
  Trees, 
  Waves, 
  Heart, 
  Leaf,
  Zap
} from 'lucide-react';

export default function FrontPage() {
  const modules = [
    {
      id: 'agritrace',
      title: 'Agricultural Traceability & Compliance',
      description: 'Complete agricultural commodity tracking & LACRA compliance system',
      icon: Wheat,
      color: 'isms-icon-bg-green',
      route: '/portals',
      isAgriTrace: true
    },
    {
      id: 'livetrace',
      title: 'Live Trace',
      description: 'Livestock movement monitoring and control system',
      icon: Truck,
      color: 'isms-icon-bg-blue',
      route: '/live-trace',
      isAgriTrace: false
    },
    {
      id: 'landmap360',
      title: 'Land Map360',
      description: 'Land mapping and dispute prevention services',
      icon: Map,
      color: 'isms-icon-bg-purple',
      route: '/land-map360',
      isAgriTrace: false
    },
    {
      id: 'minewatch',
      title: 'Mine Watch',
      description: 'Mineral resource protection and community safeguarding',
      icon: Mountain,
      color: 'isms-icon-bg-orange',
      route: '/mine-watch',
      isAgriTrace: false
    },
    {
      id: 'forestguard',
      title: 'Forest Guard',
      description: 'Forest protection and carbon credit management',
      icon: Trees,
      color: 'isms-icon-bg-teal',
      route: '/forest-guard',
      isAgriTrace: false
    },
    {
      id: 'aquatrace',
      title: 'Aqua Trace',
      description: 'Ocean ecosystem monitoring and protection',
      icon: Waves,
      color: 'isms-icon-bg-cyan',
      route: '/aqua-trace',
      isAgriTrace: false
    },
    {
      id: 'bluecarbon360',
      title: 'Blue Carbon 360',
      description: 'Marine conservation economics and carbon marketplace',
      icon: Heart,
      color: 'isms-icon-bg-indigo',
      route: '/blue-carbon-360',
      isAgriTrace: false
    },
    {
      id: 'carbontrace',
      title: 'Carbon Trace',
      description: 'Environmental monitoring and carbon footprint tracking',
      icon: Leaf,
      color: 'isms-icon-bg-emerald',
      route: '/carbon-trace',
      isAgriTrace: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg bg-green-600 flex items-center justify-center border-2 border-white shadow-lg">
                  <span className="text-white font-bold text-sm sm:text-lg">P</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Polipus</h1>
                <p className="text-xs sm:text-sm text-slate-600">Environmental Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/field-agent-login">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                  Field Agent
                </Button>
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                Mobile App
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="mb-4 sm:mb-6">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs sm:text-sm px-3 py-1">
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
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-lg w-full sm:w-auto">
                <Wheat className="mr-2 h-5 w-5" />
                Start with AgriTrace360
              </Button>
            </Link>
            <Link href="/integrated-dashboard">
              <Button variant="outline" className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium text-lg w-full sm:w-auto">
                📊 View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
          <Card className="text-center p-4 sm:p-6">
            <CardContent className="p-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-1">Active</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">1</p>
              <p className="text-slate-600 text-xs sm:text-sm">Module</p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardContent className="p-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-1">In Development</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">7</p>
              <p className="text-slate-600 text-xs sm:text-sm">Modules</p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardContent className="p-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-1">Platform Reach</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Global</p>
              <p className="text-slate-600 text-xs sm:text-sm">Coverage</p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <CardContent className="p-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Satellite className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-1">Satellite Network</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">24</p>
              <p className="text-slate-600 text-xs sm:text-sm">Satellites</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Modules */}
        <Card className="p-6 sm:p-8 mb-8 sm:mb-12">
          <CardHeader className="p-0 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">Platform Modules</CardTitle>
                <p className="text-sm sm:text-base text-slate-600">Integrated environmental monitoring solutions</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {modules.map((module) => {
                const IconComponent = module.icon;
                
                return (
                  <Card key={module.id} className="transition-all duration-300 h-64 sm:h-80 flex flex-col hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-slate-300">
                    <CardContent className="p-0 flex-1">
                      <Link href={module.route} className="flex-1 relative block group h-full">
                        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 h-full justify-center p-3 sm:p-4">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${module.isAgriTrace ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{module.title}</h3>
                            <p className="text-xs text-slate-600 mb-2 sm:mb-3 leading-relaxed">
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
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Enter Platform
                          </Button>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cross-Module Integration */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 p-6 sm:p-8">
          <CardContent className="p-0 text-center">
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
                📊 View Integrated Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}