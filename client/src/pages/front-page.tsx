// React import removed - handled by Vite JSX transform
import { Link } from 'wouter';
// Removed problematic imports: Helmet, ModernBackground, ModernCard
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
// Removed asset imports that might cause loading issues
// GPS detector removed to fix rendering issue

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


        {/* Platform Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              🌟 Polipus® Environmental Intelligence Platform
            </h1>
            <h2 className="text-2xl font-semibold text-slate-700">General Environmental Intelligence Platform</h2>
          </div>
          <div className="flex justify-center">
            <Link href="#login-portals">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-2">
                <Users className="h-4 w-4" />
                Login Portals
              </Button>
            </Link>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Active Modules</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">8/8</p>
            <p className="text-slate-600 text-sm">Operational</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">EU</span>
            </div>
            <p className="text-slate-600 text-sm mb-1">AgriTrace360</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">EUDR</p>
            <p className="text-slate-600 text-sm">100% Compliant</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Platform Status</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">Live</p>
            <p className="text-slate-600 text-sm">All Systems</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Platform Reach</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">Global</p>
            <p className="text-slate-600 text-sm">Coverage</p>
          </div>
        </div>

        {/* Platform Modules */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Platform Modules</h2>
              <p className="text-base text-slate-600">Integrated environmental intelligence solutions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <div 
                  key={module.id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200 hover:border-gray-300"
                >
                  <Link href={module.route} className="block">
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-2xl ${module.color} flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{module.title}</h3>
                      {module.description && (
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                          {module.description}
                        </p>
                        <Badge className={module.isAgriTrace ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-100 text-orange-800 border-orange-200"}>
                          {module.isAgriTrace ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            "Ready"
                          )}
                        </Badge>
                      </div>
                      <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Enter Portal
                      </Button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
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
                      <Button className="w-full text-xs sm:text-sm isms-button">
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Enter Platform
                      </Button>
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
      </div>
    </div>
  );
}