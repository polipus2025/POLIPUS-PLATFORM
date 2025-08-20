import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  MapPin,
  Calendar,
  Download,
  Eye,
  Filter
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ExporterNavbar from '@/components/layout/exporter-navbar';

export default function ExporterAnalytics() {
  const [timeRange, setTimeRange] = useState('6months');
  const [commodityFilter, setCommodityFilter] = useState('all');

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Mock analytics data
  const monthlyRevenue = [
    { month: 'Jul 2024', revenue: 850000, orders: 5, volume: 1200 },
    { month: 'Aug 2024', revenue: 1200000, orders: 8, volume: 1800 },
    { month: 'Sep 2024', revenue: 950000, orders: 6, volume: 1400 },
    { month: 'Oct 2024', revenue: 1600000, orders: 10, volume: 2200 },
    { month: 'Nov 2024', revenue: 1100000, orders: 7, volume: 1600 },
    { month: 'Dec 2024', revenue: 1800000, orders: 12, volume: 2800 },
    { month: 'Jan 2025', revenue: 2100000, orders: 14, volume: 3200 }
  ];

  const commodityBreakdown = [
    { name: 'Coffee', value: 45, revenue: 2800000, color: '#8B4513' },
    { name: 'Cocoa', value: 30, revenue: 1900000, color: '#D2691E' },
    { name: 'Rubber', value: 20, revenue: 1200000, color: '#696969' },
    { name: 'Palm Oil', value: 5, revenue: 300000, color: '#FF8C00' }
  ];

  const destinationAnalytics = [
    { region: 'Europe', orders: 18, revenue: 3200000, avgPrice: 2850 },
    { region: 'North America', orders: 12, revenue: 2100000, avgPrice: 3100 },
    { region: 'Asia', orders: 8, revenue: 1400000, avgPrice: 2200 },
    { region: 'Africa', orders: 5, revenue: 500000, avgPrice: 1800 }
  ];

  const complianceMetrics = [
    { metric: 'EUDR Compliance Rate', value: 98, target: 100 },
    { metric: 'On-time Delivery', value: 92, target: 95 },
    { metric: 'Quality Pass Rate', value: 96, target: 98 },
    { metric: 'Documentation Accuracy', value: 94, target: 100 }
  ];

  const currentYearStats = {
    totalRevenue: 6200000,
    totalOrders: 43,
    totalVolume: 8500,
    avgOrderValue: 144186,
    growthRate: 23.5,
    topCommodity: 'Coffee',
    topDestination: 'Europe'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Analytics - Exporter Portal</title>
        <meta name="description" content="View detailed analytics and insights for your export business" />
      </Helmet>

      <ExporterNavbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Export Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into your export business performance and trends
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="2years">Last 2 Years</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${currentYearStats.totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{currentYearStats.growthRate}%</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {currentYearStats.totalOrders}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Avg: ${currentYearStats.avgOrderValue.toLocaleString()}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Volume Exported</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {currentYearStats.totalVolume.toLocaleString()} MT
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Top: {currentYearStats.topCommodity}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Destination</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {currentYearStats.topDestination}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    18 orders this year
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#D1FAE5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Commodity Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Commodity Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={commodityBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {commodityBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders & Volume */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Orders & Volume Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="Orders" />
                  <Bar yAxisId="right" dataKey="volume" fill="#8B5CF6" name="Volume (MT)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Destination Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                Destination Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {destinationAnalytics.map((dest) => (
                  <div key={dest.region} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{dest.region}</h4>
                      <p className="text-sm text-gray-600">{dest.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${dest.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Avg: ${dest.avgPrice}/MT</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Compliance & Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceMetrics.map((metric) => (
                <div key={metric.metric} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                    <span className="text-sm text-gray-500">{metric.value}% / {metric.target}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        metric.value >= metric.target ? 'bg-green-500' : 
                        metric.value >= metric.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(metric.value, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.value >= metric.target ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${
                      metric.value >= metric.target ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.value >= metric.target ? 'Target Met' : 'Below Target'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Key Achievements</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Revenue Growth</p>
                      <p className="text-xs text-green-700">23.5% increase compared to last period</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Order Volume</p>
                      <p className="text-xs text-blue-700">43 successful exports completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">EUDR Compliance</p>
                      <p className="text-xs text-purple-700">98% compliance rate maintained</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Recommendations</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">Market Opportunity</p>
                    <p className="text-xs text-yellow-700">Consider expanding coffee exports to Asia - growing demand detected</p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm font-medium text-orange-900">Quality Improvement</p>
                    <p className="text-xs text-orange-700">Focus on quality metrics to achieve 100% compliance target</p>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <p className="text-sm font-medium text-indigo-900">Documentation</p>
                    <p className="text-xs text-indigo-700">Streamline documentation process to improve accuracy rate</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}