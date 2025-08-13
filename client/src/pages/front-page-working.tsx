import { Link } from 'wouter';
import { 
  Wheat, 
  Truck, 
  Shield, 
  BarChart3, 
  MapPin, 
  Users, 
  Settings,
  ArrowRight,
  CheckCircle,
  Globe,
  Waves,
  DollarSign,
  Download,
  Smartphone,
  Zap,
  TreePine
} from 'lucide-react';

export default function FrontPageWorking() {
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
      description: 'Mineral resource monitoring and protection'
    },
    {
      id: 5,
      title: 'Forest Guard',
      icon: TreePine,
      color: 'bg-green-600',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Logo Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 text-center mb-8 sm:mb-12 p-6">
          <div className="py-4 sm:py-6">
            <div className="text-4xl font-bold text-slate-800 mb-4">POLIPUS®</div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 text-center">General Environmental Intelligence Platform</h2>
            
            <div className="mt-4">
              <Link href="#login-portals">
                <button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto">
                  <Users className="h-4 w-4" />
                  Login Portals
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Active Modules</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">1/8</p>
            <p className="text-slate-600 text-xs sm:text-sm">Operational</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-white font-bold text-sm sm:text-lg bg-blue-600 w-full h-full flex items-center justify-center rounded-xl">EU</span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">AgriTrace360</p>
            <p className="text-lg sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">EUDR 100%</p>
            <p className="text-slate-600 text-xs sm:text-sm">Compliance</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Settings className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">In Development</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">7</p>
            <p className="text-slate-600 text-xs sm:text-sm">Modules</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Globe className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Platform Reach</p>
            <p className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Global</p>
            <p className="text-slate-600 text-xs sm:text-sm">Coverage</p>
          </div>
        </div>

        {/* Platform Modules */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
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
                  className="bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300 h-64 sm:h-80 flex flex-col hover:shadow-lg hover:scale-105 cursor-pointer hover:border-slate-300"
                >
                  <Link href={module.route} className="flex-1 relative block group p-4">
                    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 h-full justify-center">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${module.isAgriTrace ? 'bg-green-500' : module.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{module.title}</h3>
                        {module.description && (
                          <p className="text-xs text-slate-600 mb-2 sm:mb-3 leading-relaxed">
                            {module.description}
                          </p>
                        )}
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${module.isAgriTrace ? "bg-green-100 text-green-800 border border-green-200" : "bg-orange-100 text-orange-800 border border-orange-200"}`}>
                          {module.isAgriTrace ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            "Coming Soon"
                          )}
                        </div>
                      </div>
                      <button className="w-full text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Enter Platform
                      </button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile App Download */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 sm:mt-12 p-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4 sm:mb-6">
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
                <button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download App
                </button>
              </Link>
              <Link href="/install-app">
                <button className="border border-slate-200 hover:bg-slate-50 px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Installation Guide
                </button>
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