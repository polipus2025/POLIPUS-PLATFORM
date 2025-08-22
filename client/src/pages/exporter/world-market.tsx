import { memo, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Globe, DollarSign, BarChart3 } from 'lucide-react';
import { Link } from 'wouter';
import ExporterLayout from '@/components/layout/exporter-layout';
import { useQuery } from '@tanstack/react-query';

const ExporterWorldMarket = memo(() => {
  // ⚡ GET USER DATA
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 30000,
  });
  // ⚡ MEMOIZED MARKET DATA
  const marketData = useMemo(() => [
    {
      commodity: 'Cocoa Beans',
      currentPrice: 2850,
      priceChange: +125,
      percentChange: +4.6,
      trend: 'up',
      volume: '1.2M MT',
      markets: ['London', 'New York', 'Amsterdam'],
      forecast: 'bullish',
      lastUpdated: '2025-08-22 14:30'
    },
    {
      commodity: 'Coffee Beans (Arabica)',
      currentPrice: 1750,
      priceChange: -85,
      percentChange: -4.6,
      trend: 'down',
      volume: '890K MT',
      markets: ['New York', 'London', 'Hamburg'],
      forecast: 'bearish',
      lastUpdated: '2025-08-22 14:28'
    },
    {
      commodity: 'Palm Oil',
      currentPrice: 945,
      priceChange: +32,
      percentChange: +3.5,
      trend: 'up',
      volume: '2.1M MT',
      markets: ['Malaysia', 'Singapore', 'Rotterdam'],
      forecast: 'stable',
      lastUpdated: '2025-08-22 14:25'
    },
    {
      commodity: 'Cashew Nuts',
      currentPrice: 3200,
      priceChange: +180,
      percentChange: +6.0,
      trend: 'up',
      volume: '450K MT',
      markets: ['India', 'Vietnam', 'Europe'],
      forecast: 'bullish',
      lastUpdated: '2025-08-22 14:20'
    }
  ], []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getForecastColor = (forecast: string) => {
    switch (forecast) {
      case 'bullish': return 'bg-green-100 text-green-800';
      case 'bearish': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ExporterLayout user={user}>
      <Helmet>
        <title>World Market Prices - Exporter Portal</title>
        <meta name="description" content="Real-time global commodity prices and market analysis for agricultural exports" />
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">World Market Prices</h1>
                <p className="text-sm text-slate-600">Live commodity pricing and market intelligence</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Markets Open</p>
                  <p className="text-3xl font-bold text-green-900">8</p>
                </div>
                <Globe className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Avg. Volume</p>
                  <p className="text-3xl font-bold text-blue-900">1.1M MT</p>
                </div>
                <BarChart3 className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Trending Up</p>
                  <p className="text-3xl font-bold text-purple-900">3</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Market Cap</p>
                  <p className="text-3xl font-bold text-orange-900">$24.5B</p>
                </div>
                <DollarSign className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Commodity Prices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Live Commodity Prices (USD/MT)
            </CardTitle>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {marketData.map((commodity) => {
                const TrendIcon = getTrendIcon(commodity.trend);
                return (
                  <div key={commodity.commodity} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{commodity.commodity}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(commodity.currentPrice)}
                          </span>
                          <div className={`flex items-center gap-1 ${getTrendColor(commodity.trend)}`}>
                            <TrendIcon className="w-4 h-4" />
                            <span className="font-medium">
                              {formatPrice(Math.abs(commodity.priceChange))} ({Math.abs(commodity.percentChange)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getForecastColor(commodity.forecast)}>
                        {commodity.forecast.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Trading Volume</h4>
                        <p className="text-lg font-semibold text-gray-700">{commodity.volume}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Major Markets</h4>
                        <div className="flex flex-wrap gap-1">
                          {commodity.markets.map((market) => (
                            <Badge key={market} variant="secondary" className="text-xs">
                              {market}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Last Updated</h4>
                        <p className="text-sm text-gray-600">{commodity.lastUpdated}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Chart</Button>
                      <Button size="sm" variant="outline">Price History</Button>
                      <Button size="sm" variant="outline">Market Analysis</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Market Insights</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Cocoa prices up 4.6% due to supply concerns in West Africa</p>
                <p>• Coffee futures declining on increased Brazilian production forecasts</p>
                <p>• Palm oil showing steady growth with strong Asian demand</p>
                <p>• Cashew nuts experiencing premium pricing in European markets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExporterLayout>
  );
});

ExporterWorldMarket.displayName = 'ExporterWorldMarket';
export default ExporterWorldMarket;