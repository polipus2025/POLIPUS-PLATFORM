import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wheat, 
  Truck, 
  Shield, 
  MapPin, 
  TreePine,
  Waves,
  DollarSign,
  Leaf,
  ArrowRight,
  CheckCircle,
  Globe,
  Users,
  Settings
} from 'lucide-react';

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
      color: 'bg-blue-600',
      route: '/blue-carbon360',
      description: 'Marine conservation economics and carbon marketplace'
    },
    {
      id: 8,
      title: 'Carbon Trace',
      icon: Leaf,
      color: 'bg-green-600',
      route: '/carbon-trace-dashboard',
      description: 'Environmental monitoring and carbon footprint tracking'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Platform Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🌟 Polipus® Environmental Intelligence Platform
          </h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">General Environmental Intelligence Platform</h2>
          <Link href="#login-portals">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 mx-auto">
              <Users className="h-4 w-4" />
              Login Portals
            </Button>
          </Link>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Active Modules</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">8/8</p>
            <p className="text-slate-600 text-sm">Operational</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">EU</span>
            </div>
            <p className="text-slate-600 text-sm mb-1">AgriTrace360</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">EUDR</p>
            <p className="text-slate-600 text-sm">100% Compliant</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Platform Status</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">Live</p>
            <p className="text-slate-600 text-sm">All Systems</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Platform Reach</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">Global</p>
            <p className="text-slate-600 text-sm">Coverage</p>
          </div>
        </div>

        {/* Platform Modules */}
        <div className="bg-white rounded-xl shadow-lg p-8">
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
                <Card key={module.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 ${module.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-slate-800">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {module.description}
                    </p>
                    <div className="mb-4">
                      <Badge className={module.isAgriTrace ? "bg-green-100 text-green-800 border-green-200" : "bg-blue-100 text-blue-800 border-blue-200"}>
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
                    <Link href={module.route}>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white" variant="default">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Access Portal
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Badge variant="outline" className="px-6 py-3 text-base bg-white">
            All 8 Modules Active • Real-time Environmental Monitoring • EUDR Compliant
          </Badge>
        </div>
      </div>
    </div>
  );
}