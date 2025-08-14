import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Waves,
  Fish,
  Shield,
  AlertTriangle,
  BarChart3,
  Plus,
  Eye,
  TestTube,
  FileText,
  Activity,
  MapPin,
  TrendingUp
} from "lucide-react";

export default function AquaTraceDashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/aqua-trace/stats"],
  });

  // Fetch recent water bodies
  const { data: waterBodies, isLoading: waterLoading } = useQuery({
    queryKey: ["/api/water-bodies"],
  });

  // Fetch pollution reports
  const { data: pollutionReports, isLoading: pollutionLoading } = useQuery({
    queryKey: ["/api/pollution-reports"],
  });

  const dashboardStats = [
    {
      title: 'Water Bodies',
      value: stats?.totalWaterBodies || 0,
      icon: Waves,
      color: 'bg-indigo-500',
      change: '+8%'
    },
    {
      title: 'Protected Waters',
      value: stats?.protectedWaters || 0,
      icon: Shield,
      color: 'bg-green-500',
      change: '+12%'
    },
    {
      title: 'Fishing Permits',
      value: stats?.activeFishingPermits || 0,
      icon: Fish,
      color: 'bg-blue-500',
      change: '+5%'
    },
    {
      title: 'Pollution Reports',
      value: stats?.activePollutionReports || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-18%'
    }
  ];

  const monitoringFeatures = [
    {
      title: 'Water Quality Monitoring',
      description: 'Real-time ocean and river quality tracking',
      icon: TestTube,
      color: 'bg-indigo-500',
      action: 'Monitor Quality'
    },
    {
      title: 'Fishing Rights Management',
      description: 'Fishing permit and quota management',
      icon: Fish,
      color: 'bg-blue-500',
      action: 'Manage Rights'
    },
    {
      title: 'Environmental Protection',
      description: 'Marine ecosystem protection and monitoring',
      icon: Shield,
      color: 'bg-green-500',
      action: 'Protect Ecosystem'
    },
    {
      title: 'Pollution Alerts',
      description: 'Automated pollution detection and alerts',
      icon: AlertTriangle,
      color: 'bg-red-500',
      action: 'View Alerts'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Aqua Trace Dashboard - Ocean & River Monitoring</title>
        <meta name="description" content="Ocean and river monitoring with fishing rights protection dashboard" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center">
              <Waves className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Aqua Trace Dashboard</h1>
          <p className="text-xl text-slate-600 mb-6">
            Ocean & River Monitoring with Fishing Rights Protection
          </p>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            Water Quality Monitoring Active - Marine Protection Online
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
          <Button className="h-16 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Register Water Body</span>
          </Button>
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Test Water Quality</span>
          </Button>
          <Button className="h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2">
            <Fish className="h-5 w-5" />
            <span>Issue Fishing Permit</span>
          </Button>
          <Button className="h-16 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Report Pollution</span>
          </Button>
        </div>

        {/* Monitoring Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {monitoringFeatures.map((feature, index) => {
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
          {/* Recent Water Body Registrations */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Waves className="h-5 w-5 text-indigo-600" />
                <span>Recent Water Body Registrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {waterLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading water body data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {waterBodies?.slice(0, 5).map((water: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{water.waterId}</p>
                        <p className="text-sm text-slate-600">{water.type} - {water.county} ({water.size} km²)</p>
                      </div>
                      <Badge variant={water.protectionStatus === 'protected' ? 'default' : 'secondary'}>
                        {water.protectionStatus}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Waves className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No water bodies registered</p>
                      <Button className="mt-4" size="sm">
                        Register First Water Body
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pollution Reports */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Recent Pollution Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pollutionLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading pollution data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pollutionReports?.slice(0, 5).map((report: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-slate-900">{report.reportId}</p>
                        <p className="text-sm text-slate-600">{report.reportType} - {report.pollutionSource}</p>
                      </div>
                      <Badge variant={report.severity === 'catastrophic' ? 'destructive' : 'secondary'}>
                        {report.severity}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No pollution reports</p>
                      <p className="text-sm text-slate-500">All water bodies are clean and protected</p>
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