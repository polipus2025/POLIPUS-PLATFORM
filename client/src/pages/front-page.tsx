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
  Satellite
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
      route: '/landing',
      isAgriTrace: true
    },
    {
      id: 2,
      title: 'Supply Chain Management',
      icon: Truck,
      color: 'bg-blue-500',
      route: '/supply-chain'
    },
    {
      id: 3,
      title: 'Compliance & Certification',
      icon: Shield,
      color: 'bg-purple-500',
      route: '/compliance'
    },
    {
      id: 4,
      title: 'Analytics & Reporting',
      icon: BarChart3,
      color: 'bg-orange-500',
      route: '/analytics'
    },
    {
      id: 5,
      title: 'Enhanced GIS Mapping',
      icon: Satellite,
      color: 'bg-teal-500',
      route: '/enhanced-gis-mapping'
    },
    {
      id: 6,
      title: 'User Management',
      icon: Users,
      color: 'bg-indigo-500',
      route: '/users'
    },
    {
      id: 7,
      title: 'Document Management',
      icon: FileText,
      color: 'bg-red-500',
      route: '/documents'
    },
    {
      id: 8,
      title: 'System Configuration',
      icon: Settings,
      color: 'bg-gray-500',
      route: '/settings'
    }
  ];



  return (
    <div className="min-h-screen isms-gradient">
      <div className="max-w-7xl mx-auto p-8">


        {/* Polipos Logo - ISMS Style */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center py-6 relative">
            <img 
              src={poliposLogo} 
              alt="Polipos - Brightening the Future" 
              className="h-64 w-auto object-contain"
            />
            {/* Registered trademark symbol positioned over the 's' */}
            <span className="absolute top-6 right-[calc(50%-240px)] text-xl font-bold text-slate-700">®</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Environmental Intelligence Platform</h2>
        </div>

        {/* Platform Statistics - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="isms-card text-center">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Active Modules</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">1/8</p>
            <p className="text-slate-600 text-sm">Operational</p>
          </div>
          
          <div className="isms-card text-center">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-3">
              <Wheat className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">AgriTrace360</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">EUDR 100%</p>
            <p className="text-slate-600 text-sm">Compliance</p>
          </div>

          <div className="isms-card text-center">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mx-auto mb-3">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">In Development</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">7</p>
            <p className="text-slate-600 text-sm">Modules</p>
          </div>

          <div className="isms-card text-center">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center mx-auto mb-3">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm mb-1">Platform Reach</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">Global</p>
            <p className="text-slate-600 text-sm">Coverage</p>
          </div>
        </div>

        {/* Platform Modules - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-slate flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Platform Modules</h2>
              <p className="text-slate-600">Integrated business solutions and enterprise applications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              
              return (
                <div 
                  key={module.id} 
                  className={`
                    isms-card transition-all duration-300 h-64 flex flex-col
                    ${module.isAgriTrace ? 'border-green-500 hover:shadow-lg hover:scale-105' : 'opacity-60 cursor-not-allowed'}
                  `}
                >
                  {module.isAgriTrace ? (
                    <Link href={module.route} className="flex-1 relative block group">
                      <div className="flex flex-col items-center text-center space-y-4 h-full justify-center">
                        <div className="w-16 h-16 rounded-2xl isms-icon-bg-green flex items-center justify-center group-hover:scale-110 transition-transform">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">{module.title}</h3>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <Button className="isms-button w-full">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Enter Platform
                        </Button>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center text-center space-y-4 h-full justify-center p-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <IconComponent className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-500 mb-2">{module.title}</h3>
                        <Badge variant="outline" className="text-slate-500 border-slate-300">
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        This module is under development
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}