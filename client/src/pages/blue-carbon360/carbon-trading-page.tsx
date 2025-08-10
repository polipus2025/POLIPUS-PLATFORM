import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Globe,
  Users,
  Award,
  Clock,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  TreePine,
  Waves,
  MapPin,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Target
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CarbonTradingPage() {
  // Fetch trading data
  const { data: tradingData = [], isLoading: tradingLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/carbon-trading"],
  });

  // Market overview metrics
  const marketMetrics = [
    {
      title: 'Today\'s Trading Volume',
      value: 2850,
      unit: 'tCO2',
      icon: Activity,
      color: 'bg-green-500',
      change: '+15%',
      period: 'vs yesterday'
    },
    {
      title: 'Average Price',
      value: 19.50,
      unit: 'USD/tCO2',
      icon: DollarSign,
      color: 'bg-blue-500',
      change: '+2.3%',
      period: '24h change'
    },
    {
      title: 'Market Cap',
      value: 1.2,
      unit: 'M USD',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      change: '+8.7%',
      period: 'total value'
    },
    {
      title: 'Active Traders',
      value: 147,
      unit: 'participants',
      icon: Users,
      color: 'bg-cyan-500',
      change: '+12',
      period: 'this week'
    }
  ];

  // Recent trading transactions
  const recentTrades = [
    {
      id: 'TXN-2024-001',
      type: 'buy',
      creditType: 'Mangrove Blue Carbon',
      quantity: 150,
      price: 18.75,
      total: 2812.50,
      buyer: 'Global Climate Solutions Ltd',
      seller: 'Monrovia Conservation Trust',
      timestamp: '2 minutes ago',
      status: 'completed'
    },
    {
      id: 'TXN-2024-002',
      type: 'sell',
      creditType: 'Seagrass Protection',
      quantity: 200,
      price: 22.00,
      total: 4400.00,
      buyer: 'Nordic Carbon Fund',
      seller: 'Grand Bassa Marine Conservancy',
      timestamp: '8 minutes ago',
      status: 'completed'
    },
    {
      id: 'TXN-2024-003',
      type: 'buy',
      creditType: 'Salt Marsh Restoration',
      quantity: 75,
      price: 16.25,
      total: 1218.75,
      buyer: 'Carbon Offset Traders Inc',
      seller: 'Sinoe Environmental Group',
      timestamp: '15 minutes ago',
      status: 'completed'
    },
    {
      id: 'TXN-2024-004',
      type: 'sell',
      creditType: 'Mixed Ecosystem',
      quantity: 300,
      price: 25.50,
      total: 7650.00,
      buyer: 'European Climate Exchange',
      seller: 'River Cess Blue Carbon Co-op',
      timestamp: '23 minutes ago',
      status: 'pending'
    }
  ];

  // Price trends by credit type
  const priceTrends = [
    {
      creditType: 'Mangrove Blue Carbon',
      icon: TreePine,
      currentPrice: 18.75,
      change: '+5.2%',
      trend: 'up',
      volume: 850,
      high24h: 19.25,
      low24h: 17.50
    },
    {
      creditType: 'Seagrass Protection',
      icon: Waves,
      currentPrice: 22.00,
      change: '+3.1%',
      trend: 'up',
      volume: 620,
      high24h: 22.75,
      low24h: 21.25
    },
    {
      creditType: 'Salt Marsh Restoration',
      icon: MapPin,
      currentPrice: 16.25,
      change: '-1.8%',
      trend: 'down',
      volume: 340,
      high24h: 16.95,
      low24h: 15.80
    },
    {
      creditType: 'Mixed Ecosystem',
      icon: Leaf,
      currentPrice: 25.50,
      change: '+7.3%',
      trend: 'up',
      volume: 480,
      high24h: 26.10,
      low24h: 24.25
    }
  ];

  // Trading opportunities
  const tradingOpportunities = [
    {
      id: 'OPP-001',
      type: 'arbitrage',
      description: 'Price difference between Mangrove credits on different exchanges',
      potential: 280,
      risk: 'low',
      timeframe: '2 hours',
      creditType: 'Mangrove Blue Carbon'
    },
    {
      id: 'OPP-002',
      type: 'bulk_discount',
      description: 'Volume discount available for Seagrass credits',
      potential: 1250,
      risk: 'medium',
      timeframe: '1 day',
      creditType: 'Seagrass Protection'
    },
    {
      id: 'OPP-003',
      type: 'seasonal',
      description: 'Pre-season booking for restoration projects',
      potential: 2150,
      risk: 'low',
      timeframe: '3 months',
      creditType: 'Salt Marsh Restoration'
    }
  ];

  const getTradeTypeColor = (type: string) => {
    return type === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Carbon Trading - Blue Carbon 360</title>
        <meta name="description" content="Real-time blue carbon credits trading platform and market analysis" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64">
          <ScrollArea className="h-screen">
            <div className="p-6 pb-20">
              
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Carbon Trading</h1>
                      <p className="text-slate-600">Real-time blue carbon credits trading and market intelligence</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Market Analysis
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Place Order
                    </Button>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  Live Trading • Market Open
                </Badge>
              </div>

              {/* Market Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {marketMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  const isPositive = metric.change.startsWith('+');
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="ml-1">{metric.change}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                          <p className="text-3xl font-bold text-slate-900">
                            {metric.unit === 'USD/tCO2' || metric.unit === 'M USD' ? '$' : ''}{metric.value.toLocaleString()}{metric.unit === 'USD/tCO2' || metric.unit === 'M USD' ? '' : ` ${metric.unit}`}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">{metric.period}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Price Trends by Credit Type */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Price Trends by Credit Type</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {priceTrends.map((trend, index) => {
                    const IconComponent = trend.icon;
                    return (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{trend.creditType}</p>
                                <p className="text-sm text-slate-600">Volume: {trend.volume} tCO2</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-slate-900">${trend.currentPrice}</p>
                              <p className={`text-sm ${getTrendColor(trend.trend)}`}>{trend.change}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                              <p className="text-lg font-bold text-slate-900">${trend.high24h}</p>
                              <p className="text-xs text-slate-600">24h High</p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                              <p className="text-lg font-bold text-slate-900">${trend.low24h}</p>
                              <p className="text-xs text-slate-600">24h Low</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Recent Trading Activity */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Trading Activity</h2>
                <Card className="bg-white shadow-sm border-0">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-slate-200">
                          <tr>
                            <th className="text-left p-4 font-semibold text-slate-900">Transaction</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Type</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Credit Type</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Quantity</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Price</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Total</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTrades.map((trade, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-4 font-mono text-sm">{trade.id}</td>
                              <td className="p-4">
                                <span className={`font-semibold uppercase ${getTradeTypeColor(trade.type)}`}>
                                  {trade.type}
                                </span>
                              </td>
                              <td className="p-4 text-slate-900">{trade.creditType}</td>
                              <td className="p-4 font-semibold">{trade.quantity} tCO2</td>
                              <td className="p-4 font-semibold">${trade.price}</td>
                              <td className="p-4 font-bold text-slate-900">${trade.total.toLocaleString()}</td>
                              <td className="p-4">
                                <Badge className={getStatusColor(trade.status)}>
                                  {trade.status}
                                </Badge>
                              </td>
                              <td className="p-4 text-slate-600 text-sm">{trade.timestamp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Trading Opportunities & Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <span>Trading Opportunities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tradingOpportunities.map((opportunity, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-slate-900 mb-1">{opportunity.type.replace('_', ' ').toUpperCase()}</p>
                              <p className="text-sm text-slate-600">{opportunity.description}</p>
                              <p className="text-sm text-slate-500 mt-1">Credit Type: {opportunity.creditType}</p>
                            </div>
                            <Badge className={getRiskColor(opportunity.risk)}>
                              {opportunity.risk} risk
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-bold text-green-600">${opportunity.potential}</p>
                              <p className="text-xs text-slate-500">potential profit</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">{opportunity.timeframe}</p>
                              <Button variant="outline" size="sm" className="mt-1">
                                <Eye className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Trading Tools</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Place Buy Order
                      </Button>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Place Sell Order
                      </Button>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Advanced Charts
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Activity className="h-4 w-4 mr-2" />
                        Portfolio Tracker
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Trading History
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Globe className="h-4 w-4 mr-2" />
                        Market News
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}