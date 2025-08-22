import { memo, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, Package, Globe, Users } from 'lucide-react';
import { Link } from 'wouter';

const ExporterAnalytics = memo(() => {
  const analyticsData = useMemo(() => ({
    revenue: {
      current: 2450000,
      previous: 2280000,
      growth: 7.4
    },
    volume: {
      current: 1250,
      previous: 1180,
      growth: 5.9
    },
    orders: {
      current: 147,
      previous: 132,
      growth: 11.4
    },
    markets: {
      current: 12,
      previous: 10,
      growth: 20
    }
  }), []);

  const monthlyData = useMemo(() => [
    { month: 'Jan', revenue: 180000, volume: 95, orders: 12 },
    { month: 'Feb', revenue: 195000, volume: 102, orders: 14 },
    { month: 'Mar', revenue: 210000, volume: 115, orders: 16 },
    { month: 'Apr', revenue: 205000, volume: 108, orders: 15 },
    { month: 'May', revenue: 225000, volume: 125, orders: 18 },
    { month: 'Jun', revenue: 240000, volume: 130, orders: 19 },
    { month: 'Jul', revenue: 235000, volume: 128, orders: 17 },
    { month: 'Aug', revenue: 260000, volume: 142, orders: 21 }
  ], []);

  const topCommodities = useMemo(() => [
    { name: 'Cocoa Beans', revenue: 980000, percentage: 40 },
    { name: 'Coffee Beans', revenue: 735000, percentage: 30 },
    { name: 'Palm Oil', revenue: 490000, percentage: 20 },
    { name: 'Cashew Nuts', revenue: 245000, percentage: 10 }
  ], []);

  const topMarkets = useMemo(() => [
    { country: 'Belgium', revenue: 620000, orders: 45 },
    { country: 'USA', revenue: 560000, orders: 38 },
    { country: 'Germany', revenue: 485000, orders: 32 },
    { country: 'Netherlands', revenue: 425000, orders: 28 },
    { country: 'Singapore', revenue: 360000, orders: 24 }
  ], []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Analytics & Reports - Exporter Portal</title>
        <meta name="description" content="Comprehensive analytics and performance metrics for your export business" />
      </Helmet>

      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/exporter-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
                <p className="text-sm text-slate-600">Performance insights and business intelligence</p>
              </div>
            </div>
            <Button>
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(analyticsData.revenue.current)}</p>
                  <p className="text-sm text-green-600">{formatGrowth(analyticsData.revenue.growth)} vs last year</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Export Volume</p>
                  <p className="text-2xl font-bold text-blue-900">{analyticsData.volume.current} MT</p>
                  <p className="text-sm text-blue-600">{formatGrowth(analyticsData.volume.growth)} vs last year</p>
                </div>
                <Package className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Orders</p>
                  <p className="text-2xl font-bold text-purple-900">{analyticsData.orders.current}</p>
                  <p className="text-sm text-purple-600">{formatGrowth(analyticsData.orders.growth)} vs last year</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Active Markets</p>
                  <p className="text-2xl font-bold text-orange-900">{analyticsData.markets.current}</p>
                  <p className="text-sm text-orange-600">{formatGrowth(analyticsData.markets.growth)} vs last year</p>
                </div>
                <Globe className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Commodities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Top Commodities by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCommodities.map((commodity, index) => (
                  <div key={commodity.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{commodity.name}</p>
                        <p className="text-sm text-gray-600">{commodity.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(commodity.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Markets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Top Markets by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMarkets.map((market, index) => (
                  <div key={market.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{market.country}</p>
                        <p className="text-sm text-gray-600">{market.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(market.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Monthly Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t mb-2"
                    style={{ height: `${(data.revenue / 260000) * 200}px` }}
                  />
                  <p className="text-xs font-medium text-gray-600">{data.month}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(data.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

ExporterAnalytics.displayName = 'ExporterAnalytics';
export default ExporterAnalytics;