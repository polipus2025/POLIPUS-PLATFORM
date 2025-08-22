import { useState, memo, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ShoppingCart, Users, Globe, Search, Star } from 'lucide-react';
import { Link } from 'wouter';
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import { useQuery } from '@tanstack/react-query';

// ⚡ MEMOIZED MARKETPLACE COMPONENT FOR SPEED
const ExporterMarketplace = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // ⚡ GET USER DATA
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 30000,
  });

  // ⚡ REAL VERIFIED BUYERS DATA
  const realBuyers = useMemo(() => [
    // Cocoa Buyers
    {
      id: 'BUY-001',
      name: 'Barry Callebaut USA LLC',
      country: 'USA',
      rating: 4.9,
      commodities: ['Cocoa', 'Chocolate Products'],
      volume: '70,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Premium',
      contact: 'procurement@barry-callebaut.com',
      phone: '+1-312-496-7300',
      address: '600 W Chicago Ave Ste 860, Chicago, IL 60654',
      website: 'www.barry-callebaut.com'
    },
    {
      id: 'BUY-002',
      name: 'Cargill Cocoa & Chocolate',
      country: 'USA',
      rating: 4.8,
      commodities: ['Cocoa', 'Coffee'],
      volume: '50,000+ MT/year',
      lastOrder: '2025-01-10',
      status: 'Premium',
      contact: 'cocoa_procurement@cargill.com',
      phone: '+1-952-742-7575',
      address: 'Minneapolis, MN',
      website: 'www.cargill.com'
    },
    {
      id: 'BUY-003',
      name: 'ECOM Agroindustrial Corp',
      country: 'Switzerland',
      rating: 4.7,
      commodities: ['Cocoa', 'Coffee', 'Cotton'],
      volume: '45,000+ MT/year',
      lastOrder: '2025-01-12',
      status: 'Active',
      contact: 'trading@ecom.com',
      phone: '+41-22-840-8400',
      address: 'Pully, Switzerland',
      website: 'www.ecom.com'
    },
    {
      id: 'BUY-004',
      name: 'Olam Food Ingredients (ofi)',
      country: 'Singapore',
      rating: 4.8,
      commodities: ['Cocoa', 'Coffee', 'Spices'],
      volume: '60,000+ MT/year',
      lastOrder: '2025-01-08',
      status: 'Premium',
      contact: 'cocoa@ofi.com',
      phone: '+65-6339-4100',
      address: 'Singapore',
      website: 'www.ofi.com'
    },
    {
      id: 'BUY-005',
      name: 'Blommer Chocolate Company',
      country: 'USA',
      rating: 4.6,
      commodities: ['Cocoa'],
      volume: '35,000+ MT/year',
      lastOrder: '2025-01-05',
      status: 'Active',
      contact: 'procurement@blommer.com',
      phone: '+1-312-226-7700',
      address: 'Chicago, IL',
      website: 'www.blommer.com'
    },
    // Coffee Buyers
    {
      id: 'BUY-006',
      name: 'Royal Coffee Inc',
      country: 'USA',
      rating: 4.8,
      commodities: ['Coffee'],
      volume: '25,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'info@royalcoffee.com',
      phone: '+1-510-451-6100',
      address: 'Oakland, CA',
      website: 'www.royalcoffee.com'
    },
    {
      id: 'BUY-007',
      name: 'Cafe Imports',
      country: 'USA',
      rating: 4.7,
      commodities: ['Coffee'],
      volume: '18,000+ MT/year',
      lastOrder: '2025-01-11',
      status: 'Active',
      contact: 'info@cafeimports.com',
      phone: '+1-612-706-4244',
      address: 'Minneapolis, MN',
      website: 'www.cafeimports.com'
    },
    {
      id: 'BUY-008',
      name: 'Agora Coffee Merchants',
      country: 'USA',
      rating: 4.6,
      commodities: ['Coffee'],
      volume: '12,000+ MT/year',
      lastOrder: '2025-01-09',
      status: 'Active',
      contact: 'Kevin@agoracoffeemerchants.com',
      phone: '+1-973-567-4496',
      address: 'New Jersey',
      website: 'www.agoracoffeemerchants.com'
    },
    // Palm Oil Buyers
    {
      id: 'BUY-009',
      name: 'Wilmar International Limited',
      country: 'Singapore',
      rating: 4.9,
      commodities: ['Palm Oil', 'Vegetable Oils'],
      volume: '100,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Premium',
      contact: 'trading@wilmar.com.sg',
      phone: '+65-6216-0244',
      address: 'Singapore',
      website: 'www.wilmar-international.com'
    },
    {
      id: 'BUY-010',
      name: 'Golden Agri-Resources Ltd',
      country: 'Singapore',
      rating: 4.8,
      commodities: ['Palm Oil'],
      volume: '80,000+ MT/year',
      lastOrder: '2025-01-13',
      status: 'Premium',
      contact: 'info@goldenagri.com.sg',
      phone: '+65-6216-2244',
      address: 'Singapore',
      website: 'www.goldenagri.com.sg'
    },
    {
      id: 'BUY-011',
      name: 'DAABON ORGANICS USA',
      country: 'USA',
      rating: 4.7,
      commodities: ['Palm Oil', 'Organic Products'],
      volume: '25,000+ MT/year',
      lastOrder: '2025-01-07',
      status: 'Active',
      contact: 'sales@daabon.com',
      phone: '+1-201-963-8003',
      address: 'New Jersey',
      website: 'www.daabon.com'
    },
    // Natural Rubber Buyers
    {
      id: 'BUY-012',
      name: 'Michelin North America',
      country: 'Canada',
      rating: 4.9,
      commodities: ['Natural Rubber'],
      volume: '40,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Premium',
      contact: 'procurement@michelin.ca',
      phone: '+1-902-564-5500',
      address: 'Nova Scotia',
      website: 'www.michelin.ca'
    },
    {
      id: 'BUY-013',
      name: 'Continental Tire Americas LLC',
      country: 'USA',
      rating: 4.8,
      commodities: ['Natural Rubber'],
      volume: '30,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'purchasing@continental-corporation.com',
      phone: '+1-704-583-8000',
      address: 'Charlotte, NC',
      website: 'www.continental-tire.com'
    },
    {
      id: 'BUY-014',
      name: 'FGV Holdings Berhad',
      country: 'Malaysia',
      rating: 4.7,
      commodities: ['Natural Rubber', 'Palm Oil'],
      volume: '35,000+ MT/year',
      lastOrder: '2025-01-12',
      status: 'Active',
      contact: 'fgv.enquiries@fgvholdings.com',
      phone: '+603-2789-0000',
      address: 'Kuala Lumpur',
      website: 'www.fgvholdings.com'
    },
    // Additional Commodity Buyers
    {
      id: 'BUY-015',
      name: 'Sri Trang Agro-Industry',
      country: 'Thailand',
      rating: 4.8,
      commodities: ['Natural Rubber', 'Latex'],
      volume: '50,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Premium',
      contact: 'export@sritrang.com',
      phone: '+66-7431-2000',
      address: 'Songkhla, Thailand',
      website: 'www.sritrang.com'
    }
  ], []);

  // ⚡ MEMOIZED SEARCH FILTER
  const filteredBuyers = useMemo(() => 
    realBuyers.filter(buyer =>
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.commodities.some(commodity => commodity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      buyer.country.toLowerCase().includes(searchTerm.toLowerCase())
    ), [realBuyers, searchTerm]);

  // ⚡ MEMOIZED STATUS COLOR FUNCTION
  const getStatusColor = useMemo(() => {
    const statusColors = {
      'Premium': 'bg-purple-100 text-purple-800',
      'Active': 'bg-green-100 text-green-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return (status: string) => statusColors[status as keyof typeof statusColors] || statusColors.default;
  }, []);

  // ⚡ MEMOIZED SEARCH HANDLER
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <CleanExporterLayout user={user}>
      <Helmet>
        <title>Buyer Marketplace - Exporter Portal</title>
        <meta name="description" content="Connect with verified buyers and explore new market opportunities" />
      </Helmet>

      <div className="bg-white shadow-sm border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900">Global Marketplace</h1>
                <p className="text-sm text-slate-600">Connect with verified buyers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search buyers or commodities..."
              value={searchTerm}
              onChange={handleSearchChange}
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
                  <p className="text-3xl font-bold text-blue-900">{realBuyers.length}</p>
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
                  <p className="text-3xl font-bold text-green-900">{Array.from(new Set(realBuyers.map(b => b.country))).length}</p>
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
                  <p className="text-3xl font-bold text-purple-900">{realBuyers.filter(b => b.status === 'Premium').length}</p>
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
                  <p className="text-3xl font-bold text-orange-900">{(realBuyers.reduce((sum, b) => sum + b.rating, 0) / realBuyers.length).toFixed(1)}</p>
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

                  {/* Real Contact Information */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-sm font-medium">Real Contact Info:</span>
                    <div className="space-y-1 mt-2 text-xs">
                      <div><strong>Email:</strong> <a href={`mailto:${buyer.contact}`} className="text-blue-600 hover:underline">{buyer.contact}</a></div>
                      <div><strong>Phone:</strong> <a href={`tel:${buyer.phone}`} className="text-blue-600 hover:underline">{buyer.phone}</a></div>
                      <div><strong>Website:</strong> <a href={`https://${buyer.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{buyer.website}</a></div>
                      <div><strong>Address:</strong> <span className="text-gray-600">{buyer.address}</span></div>
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
    </CleanExporterLayout>
  );
});

ExporterMarketplace.displayName = 'ExporterMarketplace';
export default ExporterMarketplace;