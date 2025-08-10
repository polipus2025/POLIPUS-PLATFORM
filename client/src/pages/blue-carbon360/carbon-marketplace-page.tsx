import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Eye,
  Plus,
  Filter,
  Leaf,
  Waves,
  TreePine,
  BarChart3,
  Calendar,
  MapPin,
  Award,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import CarbonMarketplace from "@/components/blue-carbon360/carbon-marketplace";

export default function CarbonMarketplacePage() {
  // Fetch marketplace data
  const { data: marketplaceData = [], isLoading: marketplaceLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/marketplace"],
  });

  // Mock marketplace listings data
  const carbonListings = [
    {
      id: 1,
      title: "Monrovia Mangrove Carbon Credits",
      creditType: "Blue Carbon - Mangrove",
      pricePerCredit: 18,
      totalCredits: 2500,
      availableCredits: 1800,
      seller: "Monrovia Conservation Trust",
      location: "Montserrado County",
      verification: "Verified Gold Standard",
      vintage: "2024",
      projectType: "Restoration",
      carbonPerHectare: 5.2,
      areaSize: 480,
      status: "active",
      rating: 4.8,
      buyers: 12,
      description: "High-quality blue carbon credits from mangrove restoration project protecting coastal communities and creating sustainable carbon sequestration."
    },
    {
      id: 2,
      title: "Grand Bassa Seagrass Credits",
      creditType: "Blue Carbon - Seagrass",
      pricePerCredit: 22,
      totalCredits: 1900,
      availableCredits: 1200,
      seller: "Liberia Marine Conservation",
      location: "Grand Bassa County",
      verification: "VCS Verified",
      vintage: "2024",
      projectType: "Protection",
      carbonPerHectare: 3.8,
      areaSize: 320,
      status: "active",
      rating: 4.9,
      buyers: 8,
      description: "Premium seagrass protection credits supporting marine biodiversity while generating verified carbon offsets for international markets."
    },
    {
      id: 3,
      title: "Sinoe Salt Marsh Initiative",
      creditType: "Blue Carbon - Salt Marsh",
      pricePerCredit: 16,
      totalCredits: 1200,
      availableCredits: 950,
      seller: "Sinoe Environmental Group",
      location: "Sinoe County",
      verification: "Climate Action Reserve",
      vintage: "2024",
      projectType: "Rehabilitation",
      carbonPerHectare: 4.1,
      areaSize: 280,
      status: "active",
      rating: 4.6,
      buyers: 6,
      description: "Salt marsh rehabilitation credits from community-led conservation project with proven environmental and social benefits."
    },
    {
      id: 4,
      title: "River Cess Mixed Ecosystem",
      creditType: "Blue Carbon - Mixed",
      pricePerCredit: 25,
      totalCredits: 3200,
      availableCredits: 800,
      seller: "River Cess Blue Carbon Co-op",
      location: "River Cess County",
      verification: "Verified Gold Standard",
      vintage: "2023",
      projectType: "Comprehensive",
      carbonPerHectare: 6.5,
      areaSize: 680,
      status: "limited",
      rating: 5.0,
      buyers: 15,
      description: "Premium mixed ecosystem credits from comprehensive blue carbon project covering mangroves, seagrass, and salt marshes."
    }
  ];

  const marketStats = [
    {
      title: 'Active Listings',
      value: carbonListings.filter(l => l.status === 'active').length,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+3 new'
    },
    {
      title: 'Total Credits Available',
      value: carbonListings.reduce((sum, l) => sum + l.availableCredits, 0),
      unit: 'tonnes CO2',
      icon: Leaf,
      color: 'bg-emerald-500',
      change: '+12%'
    },
    {
      title: 'Average Price',
      value: Math.round(carbonListings.reduce((sum, l) => sum + l.pricePerCredit, 0) / carbonListings.length),
      unit: '$/tonne',
      icon: DollarSign,
      color: 'bg-blue-500',
      change: '+8%'
    },
    {
      title: 'Total Market Value',
      value: Math.round(carbonListings.reduce((sum, l) => sum + (l.availableCredits * l.pricePerCredit), 0) / 1000),
      unit: 'k USD',
      icon: TrendingUp,
      color: 'bg-cyan-500',
      change: '+15%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold_out': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCreditTypeIcon = (type: string) => {
    if (type.includes('Mangrove')) return TreePine;
    if (type.includes('Seagrass')) return Waves;
    if (type.includes('Salt Marsh')) return MapPin;
    return Leaf;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Carbon Marketplace - Blue Carbon 360</title>
        <meta name="description" content="Blue carbon credits trading marketplace and economic opportunities" />
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
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Carbon Marketplace</h1>
                      <p className="text-slate-600">Blue carbon credits trading and economic opportunities</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      List Credits
                    </Button>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  Live Marketplace • {carbonListings.reduce((sum, l) => sum + l.availableCredits, 0).toLocaleString()} Credits Available
                </Badge>
              </div>

              {/* Market Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {marketStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                            <p className="text-3xl font-bold text-slate-900">
                              {stat.value.toLocaleString()}
                            </p>
                            {stat.unit && <p className="text-sm text-slate-500">{stat.unit}</p>}
                            <p className="text-sm text-green-600 font-medium mt-1">{stat.change}</p>
                          </div>
                          <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Carbon Listings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {carbonListings.map((listing) => {
                  const CreditIcon = getCreditTypeIcon(listing.creditType);
                  const percentSold = ((listing.totalCredits - listing.availableCredits) / listing.totalCredits) * 100;
                  
                  return (
                    <Card key={listing.id} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{listing.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <CreditIcon className="h-4 w-4" />
                                <span>{listing.creditType}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{listing.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(listing.status)}>
                                {listing.status}
                              </Badge>
                              <Badge variant="outline">
                                <Award className="h-3 w-3 mr-1" />
                                {listing.verification}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">${listing.pricePerCredit}</p>
                            <p className="text-xs text-slate-500">per tonne CO2</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4 text-sm">{listing.description}</p>
                        
                        {/* Availability Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>Available Credits</span>
                            <span>{listing.availableCredits.toLocaleString()} / {listing.totalCredits.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${100 - percentSold}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-lg font-bold text-slate-900">{listing.areaSize}</p>
                            <p className="text-xs text-slate-600">Hectares</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-lg font-bold text-slate-900">{listing.carbonPerHectare}</p>
                            <p className="text-xs text-slate-600">tCO2/hectare</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-lg font-bold text-slate-900">{listing.rating}</p>
                            <p className="text-xs text-slate-600">Rating</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-lg font-bold text-slate-900">{listing.buyers}</p>
                            <p className="text-xs text-slate-600">Buyers</p>
                          </div>
                        </div>

                        {/* Seller & Vintage */}
                        <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
                          <span>Seller: {listing.seller}</span>
                          <span>Vintage: {listing.vintage}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Buy Credits
                          </Button>
                          <Button variant="outline" size="default">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Trading Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      <span>Market Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Highest Demand</p>
                          <p className="text-sm text-slate-600">Mangrove Blue Carbon</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">$18-25</p>
                          <p className="text-xs text-slate-500">per tonne</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Best Value</p>
                          <p className="text-sm text-slate-600">Salt Marsh Credits</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">$16</p>
                          <p className="text-xs text-slate-500">per tonne</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Limited Stock</p>
                          <p className="text-sm text-slate-600">Mixed Ecosystem</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-600">800</p>
                          <p className="text-xs text-slate-500">credits left</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        List Your Credits
                      </Button>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Market Analysis
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        Find Buyers
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Award className="h-4 w-4 mr-2" />
                        Verification Services
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Marketplace Component */}
              <div className="mb-8">
                <CarbonMarketplace />
              </div>
              
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}