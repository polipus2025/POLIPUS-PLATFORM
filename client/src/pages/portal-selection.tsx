import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  User, 
  UserCheck, 
  Truck, 
  ArrowRight,
  Home,
  CheckCircle
} from 'lucide-react';

export default function PortalSelection() {
  const portals = [
    {
      id: 'lacra',
      title: 'LACRA Regulatory Portal',
      description: 'Comprehensive regulatory oversight and compliance management',
      icon: Shield,
      color: 'bg-blue-600',
      route: '/lacra-dashboard',
      users: 'Regulatory Staff',
      status: 'active'
    },
    {
      id: 'farmer',
      title: 'Farmer Portal',
      description: 'Farm management, crop planning, and compliance tracking',
      icon: User,
      color: 'bg-green-600',
      route: '/farmer-login',
      users: 'Farmers',
      status: 'active'
    },
    {
      id: 'field-agent',
      title: 'Field Agent Portal',
      description: 'Mobile inspection and offline data collection',
      icon: UserCheck,
      color: 'bg-orange-600',
      route: '/field-agent-login',
      users: 'Field Agents',
      status: 'active'
    },
    {
      id: 'exporter',
      title: 'Exporter Portal',
      description: 'Export permit management and international compliance',
      icon: Truck,
      color: 'bg-purple-600',
      route: '/exporter-login',
      users: 'Exporters',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg bg-green-600 flex items-center justify-center border-2 border-white shadow-lg">
                    <span className="text-white font-bold text-sm sm:text-lg">A</span>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900">AgriTrace360™</h1>
                    <p className="text-xs sm:text-sm text-slate-600">Agricultural Compliance Management</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="mb-4">
            <Badge className="bg-green-100 text-green-800 border border-green-200 text-sm px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Agricultural Traceability & Compliance Module
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Select Your <span className="text-green-600">Portal</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Choose your role to access the appropriate features and functionalities 
            within the AgriTrace360™ compliance management system.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            
            return (
              <Card key={portal.id} className="group transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-slate-300 cursor-pointer h-full">
                <CardContent className="p-0">
                  <Link href={portal.route} className="block h-full">
                    <div className="p-6 sm:p-8 h-full flex flex-col">
                      {/* Icon and Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${portal.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                          <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                          {portal.title}
                        </h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          {portal.description}
                        </p>
                        <div className="mb-6">
                          <p className="text-sm text-slate-500 mb-1">Designed for:</p>
                          <p className="font-semibold text-slate-700">{portal.users}</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button className={`w-full group-hover:scale-105 transition-transform ${portal.color} hover:opacity-90`}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Access {portal.title.split(' ')[0]} Portal
                      </Button>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-12 sm:mt-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Need Help Choosing?
              </h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Each portal is specifically designed for different user roles in the agricultural 
                compliance ecosystem. Contact your system administrator if you're unsure which 
                portal is appropriate for your responsibilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                  📞 Contact Support
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  📖 View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}