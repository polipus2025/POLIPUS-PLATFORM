import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, Calendar, Clock, Sprout, DollarSign, Bell, 
  TrendingUp, BarChart3, Users, Phone, Mail, Settings,
  LogOut, Home, Leaf, AlertCircle, CheckCircle,
  MessageSquare, Package, Star, Eye, User
} from "lucide-react";
import { Link } from "wouter";

interface FarmerData {
  id: number;
  farmerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  county: string;
  district?: string;
  village?: string;
  farmSize?: number;
  primaryCrop?: string;
  secondaryCrops?: string;
  landMapData?: any;
  profilePicture?: string;
}

interface HarvestSchedule {
  id: number;
  scheduleId: string;
  scheduleName: string;
  cropType: string;
  cropVariety?: string;
  plantingArea: number;
  expectedHarvestStartDate: string;
  status: string;
  expectedYield?: number;
  marketingPlan?: string;
  expectedPrice?: number;
}

interface MarketplaceListing {
  id: number;
  listingId: string;
  cropType: string;
  quantityAvailable: number;
  pricePerUnit: number;
  harvestDate: string;
  status: string;
  viewCount: number;
  inquiryCount: number;
}

export default function FarmerDashboard() {
  const { toast } = useToast();
  const [farmerId] = useState(() => localStorage.getItem("farmerId") || "");
  const [farmerName] = useState(() => localStorage.getItem("farmerName") || "Farmer");

  // Fetch farmer data
  const { data: farmer } = useQuery({
    queryKey: [`/api/farmers/${farmerId}`],
    enabled: !!farmerId
  });

  // Fetch land mappings
  const { data: landMappings } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/land-mappings`],
    enabled: !!farmerId
  });

  // Fetch harvest schedules
  const { data: harvestSchedules } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/harvest-schedules`],
    enabled: !!farmerId
  });

  // Fetch marketplace listings
  const { data: marketplaceListings } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/marketplace-listings`],
    enabled: !!farmerId
  });

  // Fetch buyer inquiries
  const { data: buyerInquiries } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/buyer-inquiries`],
    enabled: !!farmerId
  });

  // Fetch harvest alerts
  const { data: harvestAlerts } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/harvest-alerts`],
    enabled: !!farmerId
  });

  // Fetch transactions
  const { data: transactions } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/transactions`],
    enabled: !!farmerId
  });

  const handleLogout = () => {
    localStorage.removeItem("farmerId");
    localStorage.removeItem("farmerName");
    localStorage.removeItem("farmerToken");
    window.location.href = "/";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_for_harvest": return "bg-green-100 text-green-800";
      case "harvested": return "bg-blue-100 text-blue-800";
      case "planted": return "bg-yellow-100 text-yellow-800";
      case "planned": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Harvest Management Functions
  const handleStartHarvest = (schedule: HarvestSchedule) => {
    toast({
      title: "Harvest Started",
      description: `Harvest process initiated for ${schedule.cropType}. Update progress in the system.`,
    });
    // TODO: API call to update schedule status to 'harvesting'
  };

  const handleCompleteHarvest = (schedule: HarvestSchedule) => {
    toast({
      title: "Harvest Completed",
      description: `${schedule.cropType} harvest completed. Ready for marketplace listing.`,
    });
    // TODO: API call to update schedule status to 'harvested' and record actual yield
  };

  const handleCreateMarketplaceListing = (schedule: HarvestSchedule) => {
    toast({
      title: "Create Listing",
      description: `Creating marketplace listing for ${schedule.cropType}. Redirecting...`,
    });
    // TODO: Navigate to create listing page with pre-filled schedule data
  };

  const handleFindBuyers = (schedule: HarvestSchedule) => {
    toast({
      title: "Finding Buyers",
      description: `Searching for buyers interested in ${schedule.cropType} in your area.`,
    });
    // TODO: Open buyer search/recommendation modal
  };

  const handleSellToBuyers = (schedule: HarvestSchedule) => {
    toast({
      title: "Sell to Buyers",
      description: `Opening transaction interface for ${schedule.cropType} sales.`,
    });
    // TODO: Open transaction/negotiation interface
  };

  const handleViewTransactions = (schedule: HarvestSchedule) => {
    toast({
      title: "Transaction History",
      description: `Viewing sales transactions for ${schedule.cropType}.`,
    });
    // TODO: Open transaction history modal/page
  };

  // Transaction Management Functions
  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "negotiating": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleApproveTransaction = (transaction: any) => {
    toast({
      title: "Transaction Approved",
      description: `Approved sale of ${transaction.quantity}kg ${transaction.cropType} to ${transaction.buyerName}`,
    });
    // TODO: API call to approve transaction
  };

  const handleNegotiateTransaction = (transaction: any) => {
    toast({
      title: "Negotiation Started",
      description: `Opening negotiation interface with ${transaction.buyerName}`,
    });
    // TODO: Open negotiation modal/interface
  };

  const handleViewTransactionDetails = (transaction: any) => {
    toast({
      title: "Transaction Details",
      description: `Viewing complete details for transaction ${transaction.transactionId}`,
    });
    // TODO: Open transaction details modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Farmer Portal</h1>
                <p className="text-sm text-gray-600">Welcome, {farmerName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                ID: {farmerId}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Land Mappings</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(landMappings) ? landMappings.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Harvest Schedules</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(harvestSchedules) ? harvestSchedules.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Marketplace Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(marketplaceListings) ? marketplaceListings.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Buyer Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(buyerInquiries) ? buyerInquiries.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mappings">Land Mappings</TabsTrigger>
            <TabsTrigger value="schedules">Harvest Schedules</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="inquiries">Buyer Inquiries</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Farmer Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Farmer Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {farmer && (
                    <>
                      <div className="flex items-center space-x-4">
                        {farmer.profilePicture ? (
                          <img 
                            src={farmer.profilePicture} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{farmer.firstName} {farmer.lastName}</h3>
                          <p className="text-gray-600">{farmer.county}, {farmer.district}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Primary Crop</p>
                          <p className="font-medium">{farmer.primaryCrop || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Farm Size</p>
                          <p className="font-medium">{farmer.farmSize || "Not specified"} hectares</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{farmer.phoneNumber || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{farmer.email || "Not provided"}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {harvestAlerts?.slice(0, 5).map((alert: any) => (
                      <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-gray-600">{alert.message}</p>
                          <Badge size="sm" className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No recent alerts</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Land Mappings Tab */}
          <TabsContent value="mappings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  My Land Mappings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {landMappings?.map((mapping: any) => (
                    <Card key={mapping.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{mapping.landMappingName}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Area:</span>
                            <span className="font-medium">{mapping.totalArea} hectares</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Land Type:</span>
                            <span className="font-medium">{mapping.landType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Use:</span>
                            <span className="font-medium">{mapping.currentUse}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge size="sm" className={mapping.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {mapping.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No land mappings available. Contact your land inspector for mapping.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Harvest Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Harvest Schedules
                  </CardTitle>
                  <Link href="/farmer-add-harvest-schedule">
                    <Button>
                      <Sprout className="w-4 h-4 mr-2" />
                      Add Schedule
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {harvestSchedules?.map((schedule: HarvestSchedule) => (
                    <Card key={schedule.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{schedule.scheduleName}</h4>
                            <p className="text-sm text-gray-600">{schedule.cropType} {schedule.cropVariety && `- ${schedule.cropVariety}`}</p>
                          </div>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status.replace("_", " ")}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Area</p>
                            <p className="font-medium">{schedule.plantingArea} hectares</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected Harvest</p>
                            <p className="font-medium">{new Date(schedule.expectedHarvestStartDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected Yield</p>
                            <p className="font-medium">{schedule.expectedYield || "TBD"} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Expected Price</p>
                            <p className="font-medium">${schedule.expectedPrice || "TBD"}/kg</p>
                          </div>
                        </div>

                        {schedule.status === "ready_for_harvest" && (
                          <div className="mt-3 space-y-3">
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-800 text-sm font-medium mb-2">
                                🌾 Ready for harvest! Take action now:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-orange-600 hover:bg-orange-700 text-white"
                                  onClick={() => handleStartHarvest(schedule)}
                                  data-testid={`start-harvest-${schedule.id}`}
                                >
                                  <Sprout className="w-4 h-4 mr-1" />
                                  Start Harvest
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleCreateMarketplaceListing(schedule)}
                                  data-testid={`create-listing-${schedule.id}`}
                                >
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  Create Listing
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleFindBuyers(schedule)}
                                  data-testid={`find-buyers-${schedule.id}`}
                                >
                                  <Users className="w-4 h-4 mr-1" />
                                  Find Buyers
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {schedule.status === "harvesting" && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-blue-800 text-sm font-medium">
                                  🚜 Harvest in progress
                                </p>
                                <p className="text-blue-700 text-xs">Started: {new Date().toLocaleDateString()}</p>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleCompleteHarvest(schedule)}
                                data-testid={`complete-harvest-${schedule.id}`}
                              >
                                Complete Harvest
                              </Button>
                            </div>
                          </div>
                        )}

                        {schedule.status === "harvested" && (
                          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-purple-800 text-sm font-medium">
                                  ✅ Harvest completed! Ready for sale
                                </p>
                                <p className="text-purple-700 text-xs">Actual yield: {schedule.actualYield || schedule.expectedYield} kg</p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleSellToBuyers(schedule)}
                                  data-testid={`sell-to-buyers-${schedule.id}`}
                                >
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  Sell Now
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewTransactions(schedule)}
                                  data-testid={`view-transactions-${schedule.id}`}
                                >
                                  View Sales
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No harvest schedules yet. Add your first schedule to get started.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    My Marketplace Listings
                  </CardTitle>
                  <Link href="/farmer-create-listing">
                    <Button>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Create Listing
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketplaceListings?.map((listing: MarketplaceListing) => (
                    <Card key={listing.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{listing.cropType}</h4>
                            <p className="text-sm text-gray-600">Listed on {new Date(listing.harvestDate).toLocaleDateString()}</p>
                          </div>
                          <Badge className={listing.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {listing.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-medium">{listing.quantityAvailable} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium">${listing.pricePerUnit}/kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Views</p>
                            <p className="font-medium flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {listing.viewCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Inquiries</p>
                            <p className="font-medium flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {listing.inquiryCount}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No marketplace listings yet. Create your first listing to connect with buyers.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Farmer-Buyer Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions?.map((transaction: any) => (
                    <Card key={transaction.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{transaction.transactionId}</h4>
                            <p className="text-sm text-gray-600">{transaction.buyerName} - {transaction.buyerCompany}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getTransactionStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {transaction.transactionType.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Crop</p>
                            <p className="font-medium">{transaction.cropType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-medium">{transaction.quantity} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium">${transaction.pricePerKg}/kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-medium text-green-600">${transaction.totalAmount}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Payment Terms</p>
                            <p className="font-medium">{transaction.paymentTerms}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Delivery Date</p>
                            <p className="font-medium">{new Date(transaction.deliveryDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {transaction.status === "pending" && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-yellow-800 text-sm font-medium">
                                  🔄 Transaction pending your approval
                                </p>
                                <p className="text-yellow-700 text-xs">
                                  Review terms and approve or negotiate with buyer
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveTransaction(transaction)}
                                  data-testid={`approve-transaction-${transaction.id}`}
                                >
                                  ✓ Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleNegotiateTransaction(transaction)}
                                  data-testid={`negotiate-transaction-${transaction.id}`}
                                >
                                  💬 Negotiate
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {transaction.status === "completed" && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-green-800 text-sm font-medium">
                                  ✅ Transaction completed successfully
                                </p>
                                <p className="text-green-700 text-xs">
                                  Completed on: {new Date(transaction.completedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewTransactionDetails(transaction)}
                                data-testid={`view-details-${transaction.id}`}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No transactions yet.</p>
                      <p className="text-sm">Complete your harvest and create marketplace listings to start selling to buyers.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buyer Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Buyer Inquiries & Negotiations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buyerInquiries?.map((inquiry: any) => (
                    <Card key={inquiry.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">Inquiry from Buyer #{inquiry.buyerId}</h4>
                            <p className="text-sm text-gray-600">{inquiry.inquiryType.replace("_", " ")}</p>
                          </div>
                          <Badge className={inquiry.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm">{inquiry.message}</p>
                        </div>

                        {inquiry.proposedPrice && (
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-gray-600">Proposed Price</p>
                              <p className="font-medium">${inquiry.proposedPrice}/kg</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Proposed Quantity</p>
                              <p className="font-medium">{inquiry.proposedQuantity} kg</p>
                            </div>
                          </div>
                        )}

                        {inquiry.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Negotiate
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No buyer inquiries yet. Create marketplace listings to attract buyers.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Harvest Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {harvestAlerts?.map((alert: any) => (
                    <Card key={alert.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              alert.priority === "high" ? "bg-red-500" : 
                              alert.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                            }`} />
                            <div>
                              <h4 className="font-semibold">{alert.title}</h4>
                              <p className="text-sm text-gray-600">{alert.message}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge size="sm" className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {alert.alertType === "harvest_ready" && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">
                              🌾 Your crop is ready for harvest! Consider creating a marketplace listing.
                            </p>
                            <Link href="/farmer-create-listing">
                              <Button size="sm" className="mt-2">
                                Create Listing
                              </Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      No alerts at this time. Alerts will appear here when your crops are ready for harvest.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}