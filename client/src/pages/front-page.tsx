import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
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
import poliposLogo from '@/assets/polipos-logo.jpg';

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
      title: 'GIS & Mapping Services',
      icon: MapPin,
      color: 'bg-teal-500',
      route: '/gis-mapping'
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

  const stats = [
    { label: 'Active Farms', value: '2,847', icon: Wheat },
    { label: 'Commodities Tracked', value: '156K', icon: Globe },
    { label: 'Export Licenses', value: '1,249', icon: Shield },
    { label: 'Counties Covered', value: '15', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <Helmet>
        <title>Digital Agriculture Platform - Republic of Liberia</title>
        <meta name="description" content="Comprehensive digital agriculture platform for traceability, compliance, and farm management in Liberia" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Polipos Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src={poliposLogo} 
                alt="Polipos - Brightening the Future" 
                className="h-20 w-auto object-contain"
              />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Digital Agriculture Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive digital solutions for agricultural traceability, compliance management, 
              and sustainable farming practices in the Republic of Liberia
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Satellite className="h-4 w-4 mr-2" />
                Satellite Monitoring
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                EUDR Compliant
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Globe className="h-4 w-4 mr-2" />
                15 Counties
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                LACRA Certified
              </Badge>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Platform Modules
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive suite of integrated modules designed for modern agricultural operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            
            return (
              <Card 
                key={module.id} 
                className={`
                  relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 h-64
                  ${module.isAgriTrace ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${module.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {module.isAgriTrace && (
                      <Badge className="bg-green-600 text-white">
                        AgriTrace360™
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight text-center">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 flex-1 flex flex-col justify-end">
                  <Link href={module.route}>
                    <Button 
                      className={`
                        w-full transition-all duration-200
                        ${module.isAgriTrace 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }
                      `}
                      size="sm"
                    >
                      Access Module
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
                
                {module.isAgriTrace && (
                  <div className="absolute top-0 right-0 w-16 h-16 transform translate-x-4 -translate-y-4">
                    <div className="w-full h-full bg-green-500 rounded-full opacity-20"></div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Agriculture Operations?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start with our flagship AgriTrace360™ platform for complete agricultural traceability and compliance management
            </p>
            <Link href="/landing">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Launch AgriTrace360™
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src={poliposLogo} 
                  alt="Polipos" 
                  className="h-8 w-auto mr-3"
                />
                <span className="text-xl font-bold">Digital Agriculture Platform</span>
              </div>
              <p className="text-gray-400">
                Empowering sustainable agriculture through digital innovation and compliance management
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Agricultural Traceability</li>
                <li>Supply Chain Management</li>
                <li>Compliance & Certification</li>
                <li>GIS & Mapping Services</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>LACRA Integration</li>
                <li>Technical Support</li>
                <li>Training & Documentation</li>
                <li>System Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Digital Agriculture Platform - Republic of Liberia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}