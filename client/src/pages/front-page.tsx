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
  DollarSign
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
      route: '/land-map360',
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
    <div className="min-h-screen isms-gradient">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">


        {/* Mobile-Responsive Polipos Logo - ISMS Style */}
        <div className="isms-card text-center mb-8 sm:mb-12">
          <div className="flex justify-center py-4 sm:py-6 relative">
            <img 
              src={poliposLogo} 
              alt="Polipos - Brightening the Future" 
              className="h-32 sm:h-48 md:h-64 w-auto object-contain"
            />
            {/* Registered trademark symbol positioned over the 's' */}
            <span className="absolute top-8 sm:top-12 md:top-16 right-[calc(50%-140px)] sm:right-[calc(50%-240px)] md:right-[calc(50%-380px)] text-sm sm:text-lg md:text-xl font-black text-slate-800 drop-shadow-sm">®</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center relative gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 text-center">General Environmental Intelligence Platform</h2>
            <div className="sm:absolute sm:right-0">
              <Link href="/monitoring-login">
                <Button className="isms-button flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Login
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
                  <Link href={module.route} className="flex-1 relative block group">
                    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 h-full justify-center p-3 sm:p-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${module.isAgriTrace ? 'isms-icon-bg-green' : module.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div className="flex-1">
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
                      <Button className={`w-full text-xs sm:text-sm ${module.isAgriTrace ? 'isms-button' : 'bg-slate-400 hover:bg-slate-500'}`}>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {module.isAgriTrace ? 'Enter Platform' : 'View Details'}
                      </Button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}