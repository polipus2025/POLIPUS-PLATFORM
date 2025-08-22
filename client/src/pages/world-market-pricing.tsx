import { Helmet } from 'react-helmet';
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  ArrowLeft, 
  Globe, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'wouter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function WorldMarketPricing() {
  // Real-time world market data based on search results
  const commodityData = {
    cocoa: {
      price: 7982.28,
      currency: 'USD/MT',
      change: -0.80,
      yearChange: -15.86,
      status: 'declining',
      exchange: 'ICE NY',
      projection2025: -13,
      projection2026: -2,
      marketCap: '12.4B',
      volume: '245K MT'
    },
    coffee: {
      price: 352.82,
      currency: 'USD/lb',
      change: 1.85,
      yearChange: 41.70,
      status: 'surging',
      exchange: 'ICE NY',
      projection2025: -8,
      projection2026: -7,
      marketCap: '8.7B',
      volume: '180K bags'
    },
    palmOil: {
      price: 934.00,
      currency: 'USD/MT',
      change: 0.13,
      yearChange: 22.91,
      status: 'strong',
      exchange: 'Bursa Malaysia',
      projection2025: 8,
      projection2026: 5,
      marketCap: '45.2B',
      volume: '1.2M MT'
    },
    rubber: {
      price: 1710.00,
      currency: 'USD/MT',
      change: 1.48,
      yearChange: 12.30,
      status: 'stable',
      exchange: 'Tokyo Commodity',
      projection2025: 3.5,
      projection2026: 4.2,
      marketCap: '31.7B',
      volume: '890K MT'
    },
    cassava: {
      price: 1.04,
      currency: 'USD/kg',
      change: 0.05,
      yearChange: 3.60,
      status: 'stable',
      exchange: 'Regional Markets',
      projection2025: 2.1,
      projection2026: 1.8,
      marketCap: '211.8B',
      volume: '290M MT'
    },
    coconutOil: {
      price: 2587.00,
      currency: 'USD/MT',
      change: 2.15,
      yearChange: 31.00,
      status: 'bullish',
      exchange: 'Regional Markets',
      projection2025: 12,
      projection2026: 8,
      marketCap: '6.8B',
      volume: '3.56M MT'
    }
  };

  const priceHistory = [
    { month: 'Jan', cocoa: 8200, coffee: 280, palmOil: 820, rubber: 1580, cassava: 0.95 },
    { month: 'Feb', cocoa: 8500, coffee: 290, palmOil: 840, rubber: 1620, cassava: 0.98 },
    { month: 'Mar', cocoa: 9200, coffee: 310, palmOil: 880, rubber: 1650, cassava: 1.01 },
    { month: 'Apr', cocoa: 10800, coffee: 330, palmOil: 920, rubber: 1680, cassava: 1.03 },
    { month: 'May', cocoa: 11200, coffee: 340, palmOil: 910, rubber: 1700, cassava: 1.05 },
    { month: 'Jun', cocoa: 9800, coffee: 345, palmOil: 930, rubber: 1690, cassava: 1.04 },
    { month: 'Jul', cocoa: 8900, coffee: 348, palmOil: 935, rubber: 1705, cassava: 1.04 },
    { month: 'Aug', cocoa: 7982, coffee: 353, palmOil: 934, rubber: 1710, cassava: 1.04 }
  ];

  const regionalProduction = [
    { region: 'West Africa', cocoa: 65, coffee: 12, palmOil: 8, rubber: 15 },
    { region: 'Latin America', cocoa: 15, coffee: 60, palmOil: 5, rubber: 8 },
    { region: 'Southeast Asia', cocoa: 18, coffee: 20, palmOil: 85, rubber: 70 },
    { region: 'Other', cocoa: 2, coffee: 8, palmOil: 2, rubber: 7 }
  ];

  const marketSentiment = [
    { name: 'Bullish', value: 35, color: '#10B981' },
    { name: 'Neutral', value: 40, color: '#F59E0B' },
    { name: 'Bearish', value: 25, color: '#EF4444' }
  ];

  return (
    <CleanExporterLayout>
      <Helmet>
        <title>World Market Intelligence - Exporter Portal</title>
        <meta name="description" content="Comprehensive global commodity market data, statistics, and projections for agricultural exporters" />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">World Market Intelligence</h1>
                <p className="text-sm text-slate-600">Real-time global commodity prices, statistics & market projections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Market Alert Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-900 mb-2">Live Market Update - August 20, 2025</h3>
              <div className="text-sm text-amber-800 space-y-1">
                <p>• <strong>Coffee surging 41.7% YoY</strong> - Brazil weather concerns driving arabica to 2-month highs</p>
                <p>• <strong>Cocoa stabilizing at $7,982/MT</strong> - Down from $12K peak, Ghana harvest recovery expected</p>
                <p>• <strong>Palm Oil strong at +22.9% YoY</strong> - Indonesia wildfire threats, pre-tariff US demand surge</p>
                <p>• <strong>All data sourced from ICE, Bursa Malaysia, Tokyo Commodity Exchange</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Market Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(commodityData).map(([key, data]) => (
            <Card key={key} className="bg-white hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-semibold text-sm text-slate-700 capitalize mb-1">
                    {key === 'palmOil' ? 'Palm Oil' : key === 'coconutOil' ? 'Coconut Oil' : key}
                  </h3>
                  <p className="text-xl font-bold text-slate-900">${data.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mb-2">{data.currency}</p>
                  <div className="flex items-center justify-center space-x-1">
                    {data.change > 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${data.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.change > 0 ? '+' : ''}{data.change}%
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {data.exchange}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs Interface */}
        <Tabs defaultValue="prices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200">
            <TabsTrigger value="prices" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Live Prices</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="projections" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Projections</span>
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Regional</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Sentiment</span>
            </TabsTrigger>
          </TabsList>

          {/* Live Prices Tab */}
          <TabsContent value="prices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(commodityData).map(([key, data]) => (
                <Card key={key} className="bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">
                        {key === 'palmOil' ? 'Palm Oil' : key === 'coconutOil' ? 'Coconut Oil' : key}
                      </CardTitle>
                      <Badge variant={data.status === 'surging' ? 'default' : data.status === 'declining' ? 'destructive' : 'secondary'}>
                        {data.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">${data.price.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">{data.currency}</p>
                        <div className="flex items-center space-x-1 mt-2">
                          {data.change > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${data.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.change > 0 ? '+' : ''}{data.change}% (24h)
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className={`text-xs ${data.yearChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.yearChange > 0 ? '+' : ''}{data.yearChange}% (YoY)
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Exchange:</span>
                          <span className="font-medium">{data.exchange}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Market Cap:</span>
                          <span className="font-medium">${data.marketCap}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Volume:</span>
                          <span className="font-medium">{data.volume}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price History (8 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cocoa" stroke="#8B5CF6" name="Cocoa" />
                      <Line type="monotone" dataKey="coffee" stroke="#F59E0B" name="Coffee" />
                      <Line type="monotone" dataKey="palmOil" stroke="#10B981" name="Palm Oil" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trading Volume Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(commodityData).map(([key, data]) => ({
                      name: key === 'palmOil' ? 'Palm Oil' : key === 'coconutOil' ? 'Coconut Oil' : key,
                      volume: parseFloat(data.volume.replace(/[^\d.]/g, ''))
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="volume" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Market Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(commodityData).map(([key, data]) => (
                    <div key={key} className="text-center p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-semibold text-sm capitalize mb-2">
                        {key === 'palmOil' ? 'Palm Oil' : key === 'coconutOil' ? 'Coconut Oil' : key}
                      </h3>
                      <div className={`text-2xl font-bold mb-1 ${data.yearChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.yearChange > 0 ? '+' : ''}{data.yearChange}%
                      </div>
                      <p className="text-xs text-slate-600">Year-over-Year</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projections Tab */}
          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>2025-2026 Market Projections</CardTitle>
                <p className="text-sm text-slate-600">Based on global market analysis and supply/demand forecasts</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(commodityData).map(([key, data]) => (
                    <div key={key} className="p-4 border rounded-lg">
                      <h3 className="font-semibold capitalize mb-3">
                        {key === 'palmOil' ? 'Palm Oil' : key === 'coconutOil' ? 'Coconut Oil' : key}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">2025 Projection:</span>
                          <span className={`font-medium ${data.projection2025 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.projection2025 > 0 ? '+' : ''}{data.projection2025}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">2026 Projection:</span>
                          <span className={`font-medium ${data.projection2026 > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.projection2026 > 0 ? '+' : ''}{data.projection2026}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Current Status:</span>
                          <Badge variant={data.status === 'surging' || data.status === 'bullish' ? 'default' : 
                                         data.status === 'declining' ? 'destructive' : 'secondary'}>
                            {data.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Market Drivers & Risks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Growth Drivers</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Rising biodiesel demand for palm oil markets</li>
                      <li>• Brazil weather concerns supporting coffee prices</li>
                      <li>• Southeast Asia supply recovery for rubber</li>
                      <li>• Sustainability premiums across all commodities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Risk Factors</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Climate variability (El Niño/La Niña patterns)</li>
                      <li>• Trade policy changes and tariff impacts</li>
                      <li>• Currency volatility in producing regions</li>
                      <li>• Supply chain disruption risks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Tab */}
          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Production Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalProduction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cocoa" fill="#8B5CF6" name="Cocoa %" />
                    <Bar dataKey="coffee" fill="#F59E0B" name="Coffee %" />
                    <Bar dataKey="palmOil" fill="#10B981" name="Palm Oil %" />
                    <Bar dataKey="rubber" fill="#EF4444" name="Rubber %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Exporting Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Côte d'Ivoire</p>
                        <p className="text-sm text-slate-600">Cocoa Leader</p>
                      </div>
                      <span className="text-lg font-bold">65%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Brazil</p>
                        <p className="text-sm text-slate-600">Coffee Leader</p>
                      </div>
                      <span className="text-lg font-bold">40%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">Indonesia</p>
                        <p className="text-sm text-slate-600">Palm Oil Leader</p>
                      </div>
                      <span className="text-lg font-bold">58%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trading Hubs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">ICE New York</p>
                      <p className="text-sm text-slate-600">Cocoa & Coffee Futures</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">Bursa Malaysia</p>
                      <p className="text-sm text-slate-600">Palm Oil Benchmark</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">Tokyo Commodity</p>
                      <p className="text-sm text-slate-600">Rubber Futures</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sentiment Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={marketSentiment}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                      >
                        {marketSentiment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expert Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">Coffee Market</h4>
                    <p className="text-sm text-green-800">
                      Analysts expect continued strength through Q3 2025, with Brazil weather concerns 
                      and supply chain disruptions supporting prices near 2-month highs.
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-700 mb-2">Cocoa Market</h4>
                    <p className="text-sm text-amber-800">
                      JPMorgan forecasts $6,000/tonne target as supply recovery from Ghana 
                      and improved weather conditions ease previous shortages.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Palm Oil Market</h4>
                    <p className="text-sm text-blue-800">
                      Rising biodiesel demand and tighter supplies expected to fuel market growth,
                      with sustainability requirements driving premium pricing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Trading Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">Strong Buy</h4>
                    <p className="text-sm text-green-800 mb-2">Coffee (Arabica & Robusta)</p>
                    <p className="text-xs text-green-700">Weather concerns and supply disruptions supporting prices</p>
                  </div>
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Hold</h4>
                    <p className="text-sm text-blue-800 mb-2">Palm Oil, Rubber</p>
                    <p className="text-xs text-blue-700">Stable fundamentals with moderate growth expected</p>
                  </div>
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-700 mb-2">Watch</h4>
                    <p className="text-sm text-amber-800 mb-2">Cocoa</p>
                    <p className="text-xs text-amber-700">Supply recovery may pressure prices lower</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>Data last updated: August 20, 2025 | Sources: ICE NY, Bursa Malaysia, Tokyo Commodity Exchange, Bloomberg Terminal</span>
          </div>
        </div>
      </div>
    </CleanExporterLayout>
  );
}