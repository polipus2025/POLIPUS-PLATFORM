import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Eye,
  Users,
  AlertTriangle,
  FileText,
  Shield,
  BarChart3,
  Plus,
  Search,
  ClipboardCheck,
  TrendingUp,
  Factory,
  UserCheck
} from "lucide-react";

export default function MineWatchDashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/mine-watch/stats"],
  });

  // Fetch recent mining operations
  const { data: operations, isLoading: operationsLoading } = useQuery({
    queryKey: ["/api/mining-operations"],
  });

  // Fetch community impacts
  const { data: impacts, isLoading: impactsLoading } = useQuery({
    queryKey: ["/api/community-impacts"],
  });

  const dashboardStats = [
    {
      title: 'Total Operations',
      value: stats?.totalOperations || 0,
      icon: Factory,
      color: 'bg-orange-500',
      change: '+15%'
    },
    {
      title: 'Active Operations',
      value: stats?.activeOperations || 0,
      icon: Eye,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Community Impacts',
      value: stats?.communityImpacts || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '-5%'
    },
    {
      title: 'Recent Inspections',
      value: stats?.recentInspections || 0,
      icon: ClipboardCheck,
      color: 'bg-purple-500',
      change: '+12%'
    }
  ];

  const protectionFeatures = [
    {
      title: 'Resource Monitoring',
      description: 'Real-time mineral resource surveillance',
      icon: Eye,
      color: 'bg-orange-500',
      action: 'Monitor Resources'
    },
    {
      title: 'Community Protection',
      description: 'Safeguarding local communities',
      icon: Users,
      color: 'bg-blue-500',
      action: 'Protect Communities'
    },
    {
      title: 'Environmental Impact',
      description: 'Mining impact assessment and control',
      icon: AlertTriangle,
      color: 'bg-red-500',
      action: 'Assess Impact'
    },
    {
      title: 'Compliance Tracking',
      description: 'Mining permit and regulation compliance',
      icon: FileText,
      color: 'bg-green-500',
      action: 'Check Compliance'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Mine Watch Dashboard - Mineral Resource Protection</title>
        <meta name="description" content="Mineral resource protection and community safeguarding dashboard" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-orange-500 flex items-center justify-center">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Mine Watch Dashboard</h1>
          <p className="text-xl text-slate-600 mb-6">
            Mineral Resource Protection and Community Safeguarding
          </p>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            Protection Systems Active - Community Monitoring Online
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
          <Button className="h-16 bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Register Operation</span>
          </Button>
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Monitor Resources</span>
          </Button>
          <Button className="h-16 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Report Impact</span>
          </Button>
          <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2">
            <ClipboardCheck className="h-5 w-5" />
            <span>Schedule Inspection</span>
          </Button>
        </div>

        {/* Protection Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {protectionFeatures.map((feature, index) => {
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
          {/* Recent Mining Operations */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Factory className="h-5 w-5 text-orange-600" />
                <span>Recent Mining Operations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {operationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading operations data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {operations?.slice(0, 5).map((operation: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{operation.operationId}</p>
                        <p className="text-sm text-slate-600">{operation.mineralType} - {operation.county} ({operation.areaSize} ha)</p>
                      </div>
                      <Badge variant={operation.status === 'active' ? 'default' : 'secondary'}>
                        {operation.status}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Factory className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No mining operations registered</p>
                      <Button className="mt-4" size="sm">
                        Register First Operation
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Impact Reports */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Community Impact Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {impactsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading impact data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {impacts?.slice(0, 5).map((impact: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <p className="font-medium text-slate-900">{impact.impactId}</p>
                        <p className="text-sm text-slate-600">{impact.impactType} - {impact.communityName}</p>
                      </div>
                      <Badge variant={impact.severity === 'severe' ? 'destructive' : 'secondary'}>
                        {impact.severity}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <UserCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No community impacts reported</p>
                      <p className="text-sm text-slate-500">Communities are protected and safe</p>
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