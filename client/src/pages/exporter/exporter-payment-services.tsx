import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from 'react-helmet';
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import { useQuery } from '@tanstack/react-query';
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
  Truck,
  Users,
  Globe,
  Package
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

export default function ExporterPaymentServices() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [services, setServices] = useState<PaymentService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // ⚡ GET USER DATA
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 30000,
  });

  // Check authentication
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  const username = localStorage.getItem("username") || "Exporter";

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
        // Filter services relevant to exporters
        const exporterServices = data.filter((service: PaymentService) => 
          service.serviceType === 'export_permit' || 
          service.serviceType === 'certification' ||
          service.serviceType === 'license'
        );
        setServices(exporterServices || []);
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
      setLocation("/exporter-login?redirect=exporter-payment-services");
      return;
    }
    setLocation(`/payment-checkout?service=${serviceId}&portal=exporter`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading exporter services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 flex items-center justify-center">
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
    <CleanExporterLayout user={user}>
      <Helmet>
        <title>Payment Services - Exporter Portal</title>
        <meta name="description" content="Export permits, EUDR compliance certificates, and licensing services for international agricultural exports" />
      </Helmet>

      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Payment Services</h1>
                <p className="text-sm text-slate-600">Export permits and compliance certificates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Exporter Benefits Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Package className="h-6 w-6" />
              Export Services Program
            </CardTitle>
            <CardDescription>
              Comprehensive export documentation and compliance services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span>Fast-track permit processing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span>EUDR compliance guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <CheckCircle className="h-4 w-4" />
                <span>International payment support</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods for Exporters */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-green-600" />
              International Payment Methods
            </CardTitle>
            <CardDescription>
              Multiple payment options for international exporters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-semibold">Credit Cards</div>
                <div className="text-gray-600">Visa, Mastercard, Amex</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-semibold">Bank Transfers</div>
                <div className="text-gray-600">SWIFT, ACH</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-semibold">Mobile Money</div>
                <div className="text-gray-600">MTN, Orange</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="font-semibold">Cryptocurrency</div>
                <div className="text-gray-600">Bitcoin, USDC</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search export services..."
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
              <SelectItem value="export_permit">Export Permits</SelectItem>
              <SelectItem value="certification">Certifications</SelectItem>
              <SelectItem value="license">Licenses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredServices.map((service) => {
            const IconComponent = serviceTypeIcons[service.serviceType as keyof typeof serviceTypeIcons];
            const colorClass = serviceTypeColors[service.serviceType as keyof typeof serviceTypeColors];
            
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-200 bg-white border-2 hover:border-blue-200">
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
                      <div className="text-3xl font-bold text-blue-600">
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
                  {/* Processing Time */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-blue-700">Processing Time:</span>
                      <span className="text-blue-600">
                        {service.serviceType === 'export_permit' ? '3-5 days' :
                         service.serviceType === 'certification' ? '1-2 days' : '2-3 days'}
                      </span>
                    </div>
                  </div>

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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
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
                    : "No payment services are currently available for exporters."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support Info */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Globe className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">Export Support Team</h3>
            <p className="text-green-700 text-sm mb-4">
              Our international trade specialists are available 24/7 to assist with export documentation and payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                Contact Export Support
              </Button>
              <Link href="/exporter-dashboard">
                <Button variant="ghost" className="text-green-700 hover:text-green-900">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </CleanExporterLayout>
  );
}