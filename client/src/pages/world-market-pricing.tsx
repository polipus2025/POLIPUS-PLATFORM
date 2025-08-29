import { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, DollarSign, Globe, TrendingUp, TrendingDown, BarChart3, Activity, Target, RefreshCw, Bell } from 'lucide-react';
import { Link } from 'wouter';
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import { useQuery } from '@tanstack/react-query';

// ⚡ MEMOIZED WORLD MARKET COMPONENT FOR PERFORMANCE
const WorldMarketPricing = memo(() => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  
  // ⚡ GET USER DATA
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 30000,
  });

  // ⚡ MEMOIZED COMMODITY PRICES DATA
  const commodityPrices = useMemo(() => [
    {
      symbol: 'COCOA',
      name: 'Cocoa',
      price: 7823,
      currency: 'USD',
      unit: 'per MT',
      change: -64.12,
      changePercent: -0.8,
      lastUpdated: '2025-08-22',
      exchange: 'ICE',
      volume: '245K MT'
    },
    {
      symbol: 'COFFEE',
      name: 'Coffee (Arabica)',
      price: 338.73,
      currency: 'USD',
      unit: 'per lb',
      change: 6.43,
      changePercent: 1.85,
      lastUpdated: '2025-08-22',
      exchange: 'ICE',
      volume: '180K bags'
    },
    {
      symbol: 'PALM_OIL',
      name: 'Palm Oil',
      price: 906,
      currency: 'USD',
      unit: 'per MT',
      change: 1.21,
      changePercent: 0.13,
      lastUpdated: '2025-08-22',
      exchange: 'Bursa Malaysia',
      volume: '3.56M MT'
    },
    {
      symbol: 'RUBBER',
      name: 'Natural Rubber',
      price: 1676,
      currency: 'USD',
      unit: 'per MT',
      change: 5,
      changePercent: 0.29,
      lastUpdated: '2025-08-22',
      exchange: 'TOCOM',
      volume: '892K MT'
    }
  ], []);

  // ⚡ MEMOIZED MARKET INDICATORS
  const marketIndicators = useMemo(() => [
    { name: 'Global Demand', value: 'High', trend: 'up', color: 'green' },
    { name: 'Supply Chain', value: 'Stable', trend: 'neutral', color: 'blue' },
    { name: 'Price Volatility', value: 'Medium', trend: 'down', color: 'yellow' },
    { name: 'Market Sentiment', value: 'Positive', trend: 'up', color: 'green' }
  ], []);

  // ⚡ MEMOIZED PRICE CHANGE COLOR FUNCTION
  const getPriceChangeColor = useMemo(() => {
    return (change: number) => change >= 0 ? 'text-green-600' : 'text-red-600';
  }, []);

  const getPriceChangeIcon = useMemo(() => {
    return (change: number) => change >= 0 ? TrendingUp : TrendingDown;
  }, []);

  return (
    <CleanExporterLayout user={user}>
      <Helmet>
        <title>World Market Pricing - Exporter Portal</title>
        <meta name="description" content="Real-time global commodity prices and market intelligence for exporters" />
      </Helmet>

      <div className="bg-white shadow-sm border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900">World Market Pricing</h1>
                <p className="text-sm text-slate-600">Real-time global commodity prices and insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {marketIndicators.map((indicator, index) => (
            <Card key={index} className={`bg-gradient-to-r from-${indicator.color}-50 to-${indicator.color}-100 border-${indicator.color}-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium text-${indicator.color}-600`}>{indicator.name}</p>
                    <p className={`text-2xl font-bold text-${indicator.color}-900`}>{indicator.value}</p>
                  </div>
                  <Activity className={`h-8 w-8 text-${indicator.color}-600`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Commodity Prices */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span>Live Commodity Prices</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600">
                <RefreshCw className="h-3 w-3 mr-1" />
                Live Updates
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  alert(`🔔 Price Alert Setup\n\nCommodity: Cocoa\nCurrent Price: $7,823/MT\n\nAlert Options:\n• Above $8,000/MT\n• Below $7,500/MT\n• 5% price change\n\nFeature coming soon!`);
                }}
                data-testid="set-alerts-button"
              >
                <Bell className="h-4 w-4 mr-2" />
                Set Alerts
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commodityPrices.map((commodity, index) => {
                const ChangeIcon = getPriceChangeIcon(commodity.change);
                return (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {commodity.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{commodity.name}</h4>
                          <p className="text-sm text-slate-600">{commodity.exchange}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {commodity.currency} {commodity.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600">{commodity.unit}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`flex items-center ${getPriceChangeColor(commodity.change)}`}>
                        <ChangeIcon className="h-4 w-4 mr-1" />
                        <span className="font-medium">
                          {commodity.change >= 0 ? '+' : ''}{commodity.change}
                        </span>
                      </div>
                      <p className={`text-sm ${getPriceChangeColor(commodity.change)}`}>
                        {commodity.changePercent >= 0 ? '+' : ''}{commodity.changePercent}%
                      </p>
                    </div>

                    <div className="text-right ml-8">
                      <p className="text-sm font-medium text-slate-900">Volume</p>
                      <p className="text-sm text-slate-600">{commodity.volume}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Market Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>Market Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Cocoa Market</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Prices down 0.8% due to improved weather conditions in Côte d'Ivoire. 
                    Strong demand from European chocolate manufacturers continues.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Coffee Market</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Arabica prices surge 1.85% on Brazilian frost concerns. 
                    Global demand remains strong with supply constraints expected.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Palm Oil</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Stable pricing with slight uptick. Malaysian production steady, 
                    Indonesian exports showing growth potential.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span>Trading Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-900">Buy Signal</span>
                    <Badge className="bg-green-100 text-green-800">Strong</Badge>
                  </div>
                  <p className="text-sm text-green-700">
                    Coffee futures showing strong upward momentum. Consider increasing positions.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-yellow-900">Hold Signal</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Palm oil prices stable. Monitor Indonesian export policies for changes.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Watch Signal</span>
                    <Badge className="bg-blue-100 text-blue-800">Monitor</Badge>
                  </div>
                  <p className="text-sm text-blue-700">
                    Cocoa market volatility expected. Weather patterns in West Africa critical.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeframe Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price History Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe} className="w-full">
              <TabsList className="grid grid-cols-5 w-full max-w-md">
                <TabsTrigger value="1D">1D</TabsTrigger>
                <TabsTrigger value="1W">1W</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="3M">3M</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
              </TabsList>
              <TabsContent value={selectedTimeframe} className="mt-6">
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">
                      Price chart for {selectedTimeframe} timeframe
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Historical data and technical analysis coming soon
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </CleanExporterLayout>
  );
});

WorldMarketPricing.displayName = 'WorldMarketPricing';

export default WorldMarketPricing;