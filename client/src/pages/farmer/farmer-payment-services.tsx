import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
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
  Filter,
  Sprout,
  Users,
  Globe
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

export default function FarmerPaymentServices() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [services, setServices] = useState<PaymentService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Check authentication
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  const username = localStorage.getItem("username") || "Farmer";

  // Direct fetch for services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/payment-services');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Filter services relevant to farmers
        const farmerServices = data.filter((service: PaymentService) => 
          service.serviceType === 'certification' || 
          service.serviceType === 'license' ||
          service.serviceType === 'monitoring'
        );
        setServices(farmerServices || []);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search and type
  const filteredServices = services.filter((service: PaymentService) => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || service.serviceType === filterType;
    return matchesSearch && matchesType;
  });

  const handlePaymentStart = (serviceId: number) => {
    if (!authToken) {
      setLocation("/farmer-login?redirect=farmer-payment-services");
      return;
    }
    setLocation(`/payment-checkout?service=${serviceId}&portal=farmer`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading farmer services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-red-800 text-lg font-semibold mb-2">Error Loading Services</h2>
            <p className="text-red-600 mb-4">{error?.message || "Failed to load payment services"}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Farmer Payment Portal
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome {username}! Access certification services, license renewals, and monitoring packages 
            designed specifically for farmers in Liberia's agricultural sector.
          </p>
        </div>

        {/* Farmer Benefits Info */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Users className="h-6 w-6" />
              Farmer Benefits Program
            </CardTitle>
            <CardDescription>
              Special rates and payment plans available for registered farmers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Subsidized certification rates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Flexible payment plans</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Mobile money support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48 bg-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="certification">Certifications</SelectItem>
              <SelectItem value="license">Licenses</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredServices.map((service) => {
            const IconComponent = serviceTypeIcons[service.serviceType as keyof typeof serviceTypeIcons];
            const colorClass = serviceTypeColors[service.serviceType as keyof typeof serviceTypeColors];
            
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-200 bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {service.serviceType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${service.basePrice}
                      </div>
                      <div className="text-xs text-gray-500">USD</div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Revenue Split Display */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Revenue Distribution</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{service.lacraShare}%</div>
                        <div className="text-gray-600">LACRA</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{service.poliposShare}%</div>
                        <div className="text-gray-600">Polipus</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handlePaymentStart(service.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  >
                    <span>Purchase Service</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Services Message */}
        {filteredServices.length === 0 && !isLoading && (
          <Card className="text-center py-8">
            <CardContent>
              <div className="text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Services Found</h3>
                <p className="text-sm">
                  {searchTerm || filterType !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "No payment services are currently available for farmers."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Globe className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-700 text-sm mb-4">
              Our farmer support team is available to help you choose the right services and payment options.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Contact Support
              </Button>
              <Link href="/farmer-dashboard">
                <Button variant="ghost" className="text-blue-700 hover:text-blue-900">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}