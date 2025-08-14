import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  Scale,
  FileText,
  Shield,
  Satellite,
  BarChart3,
  Plus,
  Eye,
  AlertTriangle,
  Map,
  Search,
  Camera,
  TrendingUp
} from "lucide-react";

export default function LandMap360Dashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/land-map360/stats"],
  });

  // Fetch recent land parcels
  const { data: parcels, isLoading: parcelsLoading } = useQuery({
    queryKey: ["/api/land-parcels"],
  });

  // Fetch recent disputes
  const { data: disputes, isLoading: disputesLoading } = useQuery({
    queryKey: ["/api/land-disputes"],
  });

  const dashboardStats = [
    {
      title: 'Total Parcels',
      value: stats?.totalParcels || 0,
      icon: Map,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Registered Parcels',
      value: stats?.registeredParcels || 0,
      icon: FileText,
      color: 'bg-green-500',
      change: '+18%'
    },
    {
      title: 'Active Disputes',
      value: stats?.activeDisputes || 0,
      icon: Scale,
      color: 'bg-orange-500',
      change: '-12%'
    },
    {
      title: 'Completed Surveys',
      value: stats?.completedSurveys || 0,
      icon: Camera,
      color: 'bg-blue-500',
      change: '+7%'
    }
  ];

  const mappingFeatures = [
    {
      title: 'Satellite Mapping',
      description: 'High-resolution land boundary mapping',
      icon: Satellite,
      color: 'bg-purple-500',
      action: 'Start Mapping'
    },
    {
      title: 'Dispute Resolution',
      description: 'Evidence-based land dispute mediation',
      icon: Scale,
      color: 'bg-blue-500',
      action: 'Mediate Dispute'
    },
    {
      title: 'Land Registry',
      description: 'Digital land ownership documentation',
      icon: FileText,
      color: 'bg-green-500',
      action: 'Register Land'
    },
    {
      title: 'Legal Protection',
      description: 'Land rights enforcement and protection',
      icon: Shield,
      color: 'bg-red-500',
      action: 'Legal Support'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Land Map360 Dashboard - Land Mapping & Dispute Prevention</title>
        <meta name="description" content="Advanced land mapping and dispute prevention dashboard" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-purple-500 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Land Map360 Dashboard</h1>
          <p className="text-xl text-slate-600 mb-6">
            Land Mapping and Dispute Prevention Services
          </p>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            System Active - Satellite Integration Online
          </Badge>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="isms-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900">{statsLoading ? '...' : stat.value.toLocaleString()}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change} vs last month</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Register Land</span>
          </Button>
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Parcels</span>
          </Button>
          <Button className="h-16 bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center space-x-2">
            <Scale className="h-5 w-5" />
            <span>Report Dispute</span>
          </Button>
          <Button className="h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Survey Land</span>
          </Button>
        </div>

        {/* Mapping Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mappingFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="isms-card hover-card">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <Button variant="outline" className="w-full">
                    {feature.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Land Registrations */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Map className="h-5 w-5 text-purple-600" />
                <span>Recent Land Registrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {parcelsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading land parcel data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {parcels?.slice(0, 5).map((parcel: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{parcel.parcelId}</p>
                        <p className="text-sm text-slate-600">{parcel.landUse} - {parcel.county} ({parcel.area} ha)</p>
                      </div>
                      <Badge variant={parcel.registrationStatus === 'registered' ? 'default' : 'secondary'}>
                        {parcel.registrationStatus}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No land registrations yet</p>
                      <Button className="mt-4" size="sm">
                        Register First Parcel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Disputes */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-orange-600" />
                <span>Active Disputes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {disputesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading dispute data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {disputes?.slice(0, 5).map((dispute: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium text-slate-900">{dispute.disputeId}</p>
                        <p className="text-sm text-slate-600">{dispute.disputeType} - {dispute.claimantName}</p>
                      </div>
                      <Badge variant={dispute.priority === 'urgent' ? 'destructive' : 'secondary'}>
                        {dispute.priority}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No active disputes</p>
                      <p className="text-sm text-slate-500">All land rights are protected and secure</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}