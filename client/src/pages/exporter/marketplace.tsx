import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ShoppingCart, Users, Globe, Search, Star } from 'lucide-react';
import { Link } from 'wouter';

export default function ExporterMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockBuyers = [
    {
      id: 'BUY-001',
      name: 'European Chocolate Ltd.',
      country: 'Belgium',
      rating: 4.8,
      commodities: ['Cocoa', 'Coffee'],
      volume: '500+ MT/year',
      lastOrder: '2025-08-10',
      status: 'Active'
    },
    {
      id: 'BUY-002',
      name: 'Global Coffee Corp',
      country: 'USA',
      rating: 4.6,
      commodities: ['Coffee', 'Cashew'],
      volume: '300+ MT/year',
      lastOrder: '2025-07-25',
      status: 'Active'
    },
    {
      id: 'BUY-003',
      name: 'Asia Food Industries',
      country: 'Singapore',
      rating: 4.9,
      commodities: ['Palm Oil', 'Rice'],
      volume: '1000+ MT/year',
      lastOrder: '2025-08-15',
      status: 'Premium'
    },
    {
      id: 'BUY-004',
      name: 'Nordic Commodities AB',
      country: 'Sweden',
      rating: 4.5,
      commodities: ['Rubber', 'Cocoa'],
      volume: '200+ MT/year',
      lastOrder: '2025-06-30',
      status: 'Active'
    }
  ];

  const filteredBuyers = mockBuyers.filter(buyer =>
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.commodities.some(commodity => commodity.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Active': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Buyer Marketplace - Exporter Portal</title>
        <meta name="description" content="Connect with verified buyers and explore new market opportunities" />
      </Helmet>

      {/* Header with Back Button */}
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
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Buyer Marketplace</h1>
                <p className="text-sm text-slate-600">Connect with verified buyers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search buyers or commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Marketplace Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Buyers</p>
                  <p className="text-3xl font-bold text-blue-900">4</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Countries</p>
                  <p className="text-3xl font-bold text-green-900">4</p>
                </div>
                <Globe className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Premium Buyers</p>
                  <p className="text-3xl font-bold text-purple-900">1</p>
                </div>
                <Star className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg. Rating</p>
                  <p className="text-3xl font-bold text-orange-900">4.7</p>
                </div>
                <Star className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buyer Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Verified Buyers ({filteredBuyers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBuyers.map((buyer) => (
                <div key={buyer.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{buyer.name}</h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {buyer.country}
                      </p>
                    </div>
                    <Badge className={getStatusColor(buyer.status)}>
                      {buyer.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{buyer.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Volume:</span>
                      <span className="font-medium">{buyer.volume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Order:</span>
                      <span className="font-medium">{buyer.lastOrder}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-gray-500 text-sm">Commodities:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {buyer.commodities.map((commodity) => (
                        <Badge key={commodity} variant="secondary" className="text-xs">
                          {commodity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">Contact Buyer</Button>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}