import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  Fish, 
  Shield, 
  Satellite, 
  ArrowRight, 
  BarChart3,
  Users,
  AlertTriangle
} from 'lucide-react';

export default function AquaTracePortal() {
  const features = [
    {
      title: 'Water Quality Monitoring',
      description: 'Real-time ocean and river quality tracking',
      icon: Waves,
      color: 'bg-indigo-500'
    },
    {
      title: 'Fishing Rights Management',
      description: 'Fishing permit and quota management',
      icon: Fish,
      color: 'bg-blue-500'
    },
    {
      title: 'Environmental Protection',
      description: 'Marine ecosystem protection and monitoring',
      icon: Shield,
      color: 'bg-green-500'
    },
    {
      title: 'Pollution Alerts',
      description: 'Automated pollution detection and alerts',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Aqua Trace Portal - Ocean & River Monitoring</title>
        <meta name="description" content="Ocean and river monitoring with fishing rights protection" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center">
              <Waves className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Aqua Trace</h1>
          <p className="text-xl text-slate-600 mb-6">
            Ocean & River Monitoring with Fishing Rights Protection
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
              The Aqua Trace portal is currently under development. This comprehensive marine 
              monitoring system will provide water quality tracking, fishing rights management, 
              environmental protection, and pollution detection capabilities.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back to Platform
                </Button>
              </Link>
              <Link href="/aqua-trace-dashboard">
                <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                  <Waves className="h-4 w-4" />
                  Access Aqua Trace Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}