import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TreePine, 
  Satellite, 
  DollarSign, 
  Shield, 
  ArrowRight, 
  BarChart3,
  Users,
  Leaf
} from 'lucide-react';

export default function ForestGuardPortal() {
  const features = [
    {
      title: 'Forest Monitoring',
      description: 'Real-time satellite forest surveillance',
      icon: Satellite,
      color: 'bg-teal-500'
    },
    {
      title: 'Carbon Credits',
      description: 'Carbon credit generation and management',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Deforestation Alerts',
      description: 'Automated deforestation detection system',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      title: 'Biodiversity Tracking',
      description: 'Ecosystem and biodiversity monitoring',
      icon: Leaf,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Forest Guard Portal - Forest Protection & Carbon Credits</title>
        <meta name="description" content="Forest protection and carbon credit management system" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-teal-500 flex items-center justify-center">
              <TreePine className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Forest Guard</h1>
          <p className="text-xl text-slate-600 mb-6">
            Forest Protection and Carbon Credit Management
          </p>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            System Operational - Dashboard Available
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="isms-card">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Status */}
        <div className="isms-card mb-8">
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-10 w-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">System Ready for Use</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Forest Guard is now fully operational with comprehensive forest protection capabilities 
              including real-time satellite monitoring, carbon credit management, deforestation 
              prevention alerts, and complete biodiversity tracking systems.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back to Platform
                </Button>
              </Link>
              <Link href="/forest-guard-dashboard">
                <Button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
                  <TreePine className="h-4 w-4" />
                  Access Forest Guard Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}