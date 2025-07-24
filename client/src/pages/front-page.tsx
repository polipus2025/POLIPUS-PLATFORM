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



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <Helmet>
        <title>Digital Agriculture Platform - Republic of Liberia</title>
        <meta name="description" content="Comprehensive digital agriculture platform for traceability, compliance, and farm management in Liberia" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b">
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
          </div>
        </div>
      </div>

      {/* Platform Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

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




    </div>
  );
}