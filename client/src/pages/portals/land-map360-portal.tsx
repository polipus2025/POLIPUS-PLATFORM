import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Satellite, 
  FileText, 
  Shield, 
  ArrowRight, 
  BarChart3,
  Users,
  Scale
} from 'lucide-react';

export default function LandMap360Portal() {
  const features = [
    {
      title: 'Satellite Mapping',
      description: 'High-resolution land boundary mapping',
      icon: Satellite,
      color: 'bg-purple-500'
    },
    {
      title: 'Dispute Resolution',
      description: 'Evidence-based land dispute mediation',
      icon: Scale,
      color: 'bg-blue-500'
    },
    {
      title: 'Land Registry',
      description: 'Digital land ownership documentation',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Legal Protection',
      description: 'Land rights enforcement and protection',
      icon: Shield,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Land Map360 Portal - Land Mapping & Dispute Prevention</title>
        <meta name="description" content="Advanced land mapping and dispute prevention services" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-purple-500 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Land Map360</h1>
          <p className="text-xl text-slate-600 mb-6">
            Land Mapping and Dispute Prevention Services
          </p>
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-4 py-2">
            Coming Soon - Under Development
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Development In Progress</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              The Land Map360 portal is currently under development. This comprehensive land 
              management system will provide satellite mapping, dispute resolution, and legal 
              protection services for land rights and ownership.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back to Platform
                </Button>
              </Link>
              <Button disabled className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Portal Access (Coming Soon)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}