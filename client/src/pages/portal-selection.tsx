import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, User, Building2, Truck, Wheat } from 'lucide-react';

export default function PortalSelection() {
  const portals = [
    {
      id: 'lacra',
      title: 'LACRA Portal',
      subtitle: 'Regulatory Staff',
      description: 'Administrative dashboard for LACRA regulatory officers and compliance managers',
      icon: Building2,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      route: '/lacra-portal'
    },
    {
      id: 'farmer',
      title: 'Farmer Portal',
      subtitle: 'Farmer Access',
      description: 'Registration, compliance tracking, and farm management tools',
      icon: Wheat,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      route: '/farmer-portal'
    },
    {
      id: 'field-agent',
      title: 'Field Agent Portal',
      subtitle: 'Field Officers',
      description: 'Mobile-optimized tools for field inspections and data collection',
      icon: Users,
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      route: '/field-agent-portal'
    },
    {
      id: 'exporter',
      title: 'Exporter Portal',
      subtitle: 'Export Companies',
      description: 'Export permit applications and supply chain documentation',
      icon: Truck,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      route: '/exporter-portal'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Select Your Portal
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the appropriate portal based on your role in the agricultural compliance system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            
            return (
              <Card key={portal.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${portal.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">{portal.title}</CardTitle>
                  <p className="text-sm text-slate-500 font-medium">{portal.subtitle}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 mb-6">{portal.description}</p>
                  <Link href={portal.route}>
                    <Button className={`w-full ${portal.color} ${portal.hoverColor} text-white`}>
                      Access Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}