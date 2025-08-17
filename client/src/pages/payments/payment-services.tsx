import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  FileText, 
  Shield, 
  BarChart3, 
  Search, 
  DollarSign,
  CheckCircle,
  Building2,
  ArrowRight,
  Filter
} from "lucide-react";

interface PaymentService {
  id: number;
  serviceName: string;
  serviceType: string;
  basePrice: string;
  lacraShare: string;
  poliposShare: string;
  description: string;
}

const serviceTypeIcons = {
  export_permit: FileText,
  certification: Shield,
  license: Building2,
  monitoring: BarChart3,
};

const serviceTypeColors = {
  export_permit: "bg-blue-500",
  certification: "bg-green-500", 
  license: "bg-purple-500",
  monitoring: "bg-orange-500",
};

export default function PaymentServices() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Check authentication
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['/api/payment-services'],
  });

  // Filter services based on search and type
  const filteredServices = services.filter((service: PaymentService) => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || service.serviceType === filterType;
    return matchesSearch && matchesType;
  });

  const handlePaymentStart = (serviceId: number) => {
    if (!authToken) {
      setLocation("/regulatory-login?redirect=payment-services");
      return;
    }
    setLocation(`/payment-checkout?service=${serviceId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AgriTrace360 Payment Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure payment processing for agricultural compliance services, licenses, and certifications. 
            Revenue automatically shared between LACRA and Polipus according to partnership agreement.
          </p>
        </div>

        {/* Payment Methods Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Accepted Payment Methods
            </CardTitle>
            <CardDescription>
              Multiple payment options available for your convenience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <CreditCard className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-semibold">Cards</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Building2 className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-semibold">Bank Transfer</div>
                  <div className="text-sm text-gray-600">Local & International</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Shield className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="font-semibold">Mobile Money</div>
                  <div className="text-sm text-gray-600">MTN, Orange Money</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <CheckCircle className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="font-semibold">Secure</div>
                  <div className="text-sm text-gray-600">256-bit SSL encryption</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="export_permit">Export Permits</SelectItem>
                <SelectItem value="certification">Certifications</SelectItem>
                <SelectItem value="license">Licenses</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: PaymentService) => {
            const IconComponent = serviceTypeIcons[service.serviceType as keyof typeof serviceTypeIcons] || Shield;
            const colorClass = serviceTypeColors[service.serviceType as keyof typeof serviceTypeColors] || "bg-gray-500";
            
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-3`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {service.serviceType.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{service.serviceName}</CardTitle>
                  <CardDescription className="text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Display */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        ${service.basePrice}
                      </div>
                      <div className="text-sm text-gray-600">USD</div>
                    </div>
                  </div>

                  {/* Revenue Split */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>LACRA ({service.lacraShare}%)</span>
                      <span>${(parseFloat(service.basePrice) * parseFloat(service.lacraShare) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Platform ({service.poliposShare}%)</span>
                      <span>${(parseFloat(service.basePrice) * parseFloat(service.poliposShare) / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button 
                    onClick={() => handlePaymentStart(service.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pay Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  {authToken && (
                    <div className="text-xs text-gray-500 text-center">
                      Logged in as {userType} user
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No services found</div>
            <div className="text-gray-500">Try adjusting your search or filter criteria</div>
          </div>
        )}

        {/* Authentication Notice */}
        {!authToken && (
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Login Required</h3>
              <p className="text-yellow-700 mb-4">
                Please log in to your account to proceed with payments
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/regulatory-login">
                  <Button variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-100">
                    Regulatory Login
                  </Button>
                </Link>
                <Link href="/farmer-login">
                  <Button variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-100">
                    Farmer Login
                  </Button>
                </Link>
                <Link href="/exporter-login">
                  <Button variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-100">
                    Exporter Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}