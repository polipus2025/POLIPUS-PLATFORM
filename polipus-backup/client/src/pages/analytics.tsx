import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity, Database, Download, RefreshCw } from "lucide-react";

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("monthly");
  const [selectedCounty, setSelectedCounty] = useState("all");

  // Fetch analytics data
  const { data: complianceTrends, isLoading: trendsLoading, refetch: refetchTrends } = useQuery({
    queryKey: ["/api/analytics/compliance-trends", timeframe],
  });

  const { data: farmPerformance, isLoading: farmLoading, refetch: refetchFarm } = useQuery({
    queryKey: ["/api/analytics/farm-performance"],
  });

  const { data: regionalAnalytics, isLoading: regionalLoading, refetch: refetchRegional } = useQuery({
    queryKey: ["/api/analytics/regional", selectedCounty !== "all" ? selectedCounty : ""],
  });

  const { data: systemHealth, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ["/api/analytics/system-health"],
  });

  const { data: analyticsData, isLoading: dataLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  const refreshAllData = () => {
    refetchTrends();
    refetchFarm();
    refetchRegional();
    refetchHealth();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const counties = [
    "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
    "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County",
    "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
    "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
  ];

  const complianceData = Array.isArray(complianceTrends) ? complianceTrends : [];
  const farmData = Array.isArray(farmPerformance) ? farmPerformance : [];
  const regionalData = Array.isArray(regionalAnalytics) ? regionalAnalytics : [];
  const healthData = Array.isArray(systemHealth) ? systemHealth : [];

  // Sample processed data for charts
  const chartData = {
    compliance: complianceData.map((item: any) => ({
      name: item.timeframe || 'Current',
      value: parseFloat(item.metricValue) || 0,
      metadata: item.metadata
    })),
    regional: regionalData.map((item: any) => ({
      county: item.metadata?.county || 'Unknown',
      compliance: parseFloat(item.metricValue) || 0,
      commodities: item.metadata?.totalCommodities || 0
    })),
    farm: farmData.slice(0, 10).map((item: any, index: number) => ({
      farmer: item.metadata?.farmerName || `Farmer ${index + 1}`,
      yield: parseFloat(item.metricValue) || 0,
      plots: item.metadata?.totalPlots || 0,
      area: item.metadata?.totalArea || 0
    }))
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Analytics Dashboard - AgriTrace360™ Admin</title>
        <meta name="description" content="Comprehensive analytics and insights for agricultural compliance monitoring - AgriTrace360™ Administrator Access Only" />
      </Helmet>

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">Comprehensive data analytics and insights</p>
            <Badge variant="destructive" className="mt-2">AgriTrace360™ Admin Only</Badge>
          </div>
          <div className="flex space-x-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refreshAllData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Analytics
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Trends</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="farms">Farm Performance</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Compliance Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {complianceData.length > 0 && complianceData[0]?.metricValue ? `${parseFloat(complianceData[0].metricValue).toFixed(1)}%` : '0%'}
                </div>
                <Progress value={complianceData.length > 0 && complianceData[0]?.metricValue ? parseFloat(complianceData[0].metricValue) : 0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commodities</CardTitle>
                <Database className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthData.length > 0 ? healthData[0]?.metadata?.totalCommodities || 0 : 0}
                </div>
                <p className="text-sm text-gray-600 mt-1">Tracked commodities</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthData.length > 0 ? healthData[0]?.metadata?.totalFarmers || 0 : 0}
                </div>
                <p className="text-sm text-gray-600 mt-1">Registered farmers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {healthData.length > 0 ? healthData[0]?.metadata?.systemStatus || 'Unknown' : 'Unknown'}
                </div>
                <p className="text-sm text-gray-600 mt-1">Operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Overview Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Compliance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.regional.slice(0, 5)}
                      dataKey="compliance"
                      nameKey="county"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                    >
                      {chartData.regional.slice(0, 5).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Farms</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.farm}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="farmer" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="yield" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {trendsLoading ? (
                <div className="flex justify-center p-8">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData.compliance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Regional Performance Analysis</h3>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select County" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county.toLowerCase().replace(/\s+/g, '_')}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>County Compliance Rates</CardTitle>
            </CardHeader>
            <CardContent>
              {regionalLoading ? (
                <div className="flex justify-center p-8">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData.regional}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="county" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="compliance" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Farm Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {farmLoading ? (
                <div className="flex justify-center p-8">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData.farm}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="farmer" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="yield" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Database Records</span>
                      <span>{healthData.length > 0 ? healthData[0]?.metadata?.totalCommodities || 0 : 0}</span>
                    </div>
                    <Progress value={75} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Active Users</span>
                      <span>{healthData.length > 0 ? healthData[0]?.metadata?.totalUsers || 0 : 0}</span>
                    </div>
                    <Progress value={60} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Sync Operations</span>
                      <span>{healthData.length > 0 ? healthData[0]?.metadata?.totalSyncLogs || 0 : 0}</span>
                    </div>
                    <Progress value={90} className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Response Time</span>
                    <Badge variant="secondary">&lt; 200ms</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Uptime</span>
                    <Badge variant="secondary">99.9%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Data Accuracy</span>
                    <Badge variant="secondary">99.8%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sync Success Rate</span>
                    <Badge variant="secondary">98.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Critical</span>
                    <Badge variant="destructive">0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Warnings</span>
                    <Badge variant="outline">2</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Information</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}