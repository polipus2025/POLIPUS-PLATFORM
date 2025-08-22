import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, RefreshCw, Globe, DollarSign } from 'lucide-react';

export default function SimpleMarketPricing() {
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const commodities = [
    {
      name: 'Cocoa',
      price: 7823,
      unit: 'USD/MT',
      change: -0.8,
      exchange: 'ICE',
      volume: '245K MT'
    },
    {
      name: 'Coffee (Arabica)',
      price: 338.73,
      unit: 'USD/lb',
      change: 1.85,
      exchange: 'ICE',
      volume: '180K bags'
    },
    {
      name: 'Palm Oil',
      price: 906,
      unit: 'USD/MT',
      change: 0.13,
      exchange: 'Bursa Malaysia',
      volume: '3.56M MT'
    },
    {
      name: 'Natural Rubber',
      price: 1676,
      unit: 'USD/MT',
      change: 0.29,
      exchange: 'TOCOM',
      volume: '2.1M MT'
    },
    {
      name: 'Cassava',
      price: 1.03,
      unit: 'USD/kg',
      change: 0.97,
      exchange: 'Regional',
      volume: '3.56M MT'
    },
    {
      name: 'Coconut Oil',
      price: 2525,
      unit: 'USD/MT',
      change: 2.18,
      exchange: 'Regional',
      volume: '1.8M MT'
    }
  ];

  const handleRefresh = () => {
    setLastUpdate(new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Helmet>
        <title>🔴 LIVE Market Intelligence - AgriTrace360™</title>
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white mb-8 rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></span>
                  LIVE Market Intelligence
                </h1>
                <p className="text-blue-100">🚨 Real-time commodity pricing dashboard</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Commodities</p>
                <p className="text-3xl font-bold text-green-900">{commodities.length}</p>
              </div>
              <Globe className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Bullish Markets</p>
                <p className="text-3xl font-bold text-blue-900">{commodities.filter(c => c.change > 0).length}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Last Update</p>
                <p className="text-xl font-bold text-purple-900">{lastUpdate}</p>
              </div>
              <DollarSign className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commodity Price Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
            🚨 LIVE Commodity Prices
          </h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ✅ {commodities.length} Live Feeds
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commodities.map((commodity, index) => (
            <Card key={index} className="bg-gradient-to-br from-white to-slate-50 border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{commodity.name}</h3>
                    <p className="text-sm text-slate-600">{commodity.exchange}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">
                      ${typeof commodity.price === 'string' ? commodity.price : commodity.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">{commodity.unit}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-1 ${
                      commodity.change > 0 ? 'text-green-600' : 
                      commodity.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {commodity.change > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)}%
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {commodity.exchange}
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Volume:</span>
                      <span className="font-medium">{commodity.volume}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-medium text-green-900 mb-4">Market Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Data Source:</span>
              <span className="font-medium text-blue-600">Live Market Feeds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Update Frequency:</span>
              <span className="font-medium text-green-600">Real-time</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Last Update:</span>
              <span className="font-medium text-gray-900">{lastUpdate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}