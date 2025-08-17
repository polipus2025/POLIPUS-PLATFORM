import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  DollarSign, 
  FileText, 
  Shield, 
  Globe, 
  Truck,
  Users,
  ChevronRight,
  Download,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'wouter';

interface PaymentService {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  processingFee: number;
  totalPrice: number;
  lacraShare: number;
  polipusShare: number;
  lacraAmount: number;
  polipusAmount: number;
  currency: string;
  estimatedProcessingTime: string;
  requiredDocuments: string[];
  targetUsers: string[];
  icon: any;
  popular?: boolean;
}

export default function RegulatoryPaymentServices() {
  const [services, setServices] = useState<PaymentService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/payment-services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching payment services:', error);
        // Fallback data for demonstration
        setServices([
          {
            id: 'export-permit',
            name: 'Export Permit Application',
            description: 'Official export permit for agricultural commodities',
            category: 'export',
            basePrice: 250,
            processingFee: 25,
            totalPrice: 275,
            lacraShare: 70,
            polipusShare: 30,
            lacraAmount: 192.50,
            polipusAmount: 82.50,
            currency: 'USD',
            estimatedProcessingTime: '5-7 business days',
            requiredDocuments: ['Export Application', 'Company Registration', 'Tax Clearance'],
            targetUsers: ['Exporters', 'Trading Companies'],
            icon: FileText,
            popular: true
          },
          {
            id: 'eudr-certificate',
            name: 'EUDR Compliance Certificate',
            description: 'EU Deforestation Regulation compliance certification',
            category: 'certification',
            basePrice: 400,
            processingFee: 50,
            totalPrice: 450,
            lacraShare: 75,
            polipusShare: 25,
            lacraAmount: 337.50,
            polipusAmount: 112.50,
            currency: 'USD',
            estimatedProcessingTime: '7-10 business days',
            requiredDocuments: ['Farm GPS Data', 'Deforestation Assessment', 'Chain of Custody'],
            targetUsers: ['Exporters', 'Farmers', 'Cooperatives'],
            icon: Globe
          },
          {
            id: 'business-license',
            name: 'Agricultural Business License',
            description: 'License for agricultural commodity trading business',
            category: 'license',
            basePrice: 150,
            processingFee: 15,
            totalPrice: 165,
            lacraShare: 85,
            polipusShare: 15,
            lacraAmount: 140.25,
            polipusAmount: 24.75,
            currency: 'USD',
            estimatedProcessingTime: '3-5 business days',
            requiredDocuments: ['Business Registration', 'Tax ID', 'Bank Statement'],
            targetUsers: ['New Businesses', 'Traders'],
            icon: Building2
          },
          {
            id: 'quality-inspection',
            name: 'Quality Inspection Service',
            description: 'Professional quality inspection and certification',
            category: 'inspection',
            basePrice: 300,
            processingFee: 30,
            totalPrice: 330,
            lacraShare: 80,
            polipusShare: 20,
            lacraAmount: 264,
            polipusAmount: 66,
            currency: 'USD',
            estimatedProcessingTime: '2-3 business days',
            requiredDocuments: ['Sample Request', 'Facility Access'],
            targetUsers: ['Exporters', 'Processing Plants'],
            icon: Shield
          },
          {
            id: 'transport-permit',
            name: 'Transport Permit',
            description: 'Permit for agricultural commodity transportation',
            category: 'transport',
            basePrice: 100,
            processingFee: 10,
            totalPrice: 110,
            lacraShare: 60,
            polipusShare: 40,
            lacraAmount: 66,
            polipusAmount: 44,
            currency: 'USD',
            estimatedProcessingTime: '1-2 business days',
            requiredDocuments: ['Vehicle Registration', 'Driver License', 'Route Plan'],
            targetUsers: ['Transport Companies', 'Logistics Providers'],
            icon: Truck
          },
          {
            id: 'monitoring-service',
            name: 'Continuous Monitoring Service',
            description: 'Real-time compliance and quality monitoring',
            category: 'monitoring',
            basePrice: 200,
            processingFee: 20,
            totalPrice: 220,
            lacraShare: 50,
            polipusShare: 50,
            lacraAmount: 110,
            polipusAmount: 110,
            currency: 'USD',
            estimatedProcessingTime: 'Immediate activation',
            requiredDocuments: ['Monitoring Agreement', 'Facility Access'],
            targetUsers: ['Large Exporters', 'Processing Facilities'],
            icon: Users
          },
          {
            id: 'consultation-service',
            name: 'Regulatory Consultation',
            description: 'Expert consultation on regulatory compliance',
            category: 'consultation',
            basePrice: 180,
            processingFee: 20,
            totalPrice: 200,
            lacraShare: 65,
            polipusShare: 35,
            lacraAmount: 130,
            polipusAmount: 70,
            currency: 'USD',
            estimatedProcessingTime: '1 business day',
            requiredDocuments: ['Consultation Request', 'Company Profile'],
            targetUsers: ['All Business Types', 'New Entrants'],
            icon: AlertCircle
          },
          {
            id: 'certification-renewal',
            name: 'Certificate Renewal Service',
            description: 'Renewal of existing certifications and permits',
            category: 'renewal',
            basePrice: 120,
            processingFee: 15,
            totalPrice: 135,
            lacraShare: 70,
            polipusShare: 30,
            lacraAmount: 94.50,
            polipusAmount: 40.50,
            currency: 'USD',
            estimatedProcessingTime: '2-4 business days',
            requiredDocuments: ['Current Certificate', 'Renewal Application'],
            targetUsers: ['Existing License Holders', 'Certified Exporters'],
            icon: CheckCircle
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'export', name: 'Export Services', count: services.filter(s => s.category === 'export').length },
    { id: 'certification', name: 'Certifications', count: services.filter(s => s.category === 'certification').length },
    { id: 'license', name: 'Licenses', count: services.filter(s => s.category === 'license').length },
    { id: 'inspection', name: 'Inspections', count: services.filter(s => s.category === 'inspection').length },
    { id: 'monitoring', name: 'Monitoring', count: services.filter(s => s.category === 'monitoring').length }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Helmet>
        <title>Payment Services - LACRA Regulatory Authority</title>
        <meta name="description" content="Official payment services for LACRA regulatory compliance, permits, and certifications" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Regulatory Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <DollarSign className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LACRA Payment Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
            Official payment portal for LACRA regulatory services, permits, certifications, and compliance requirements
          </p>
          <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>Revenue Sharing Partnership:</strong> Services operated jointly by LACRA (Regulatory Authority) and Polipus (Technology Provider) with transparent revenue distribution
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="relative hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
                {service.popular && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-red-500 text-white">Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${service.totalPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.currency}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 mt-4">
                    {service.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {service.description}
                  </p>

                  {/* Revenue Split */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-700 mb-2">Revenue Distribution</div>
                    <div className="flex justify-between text-xs">
                      <div>
                        <div className="text-blue-600 font-medium">LACRA: {service.lacraShare}%</div>
                        <div className="text-blue-800">${service.lacraAmount}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">Polipus: {service.polipusShare}%</div>
                        <div className="text-green-800">${service.polipusAmount}</div>
                      </div>
                    </div>
                  </div>

                  {/* Processing Time */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Processing:</span>
                    <span className="font-medium text-gray-900">{service.estimatedProcessingTime}</span>
                  </div>

                  {/* Target Users */}
                  <div className="flex flex-wrap gap-1">
                    {service.targetUsers.slice(0, 2).map((user, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {user}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-700 transition-colors">
                    Select Service
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Payment Methods */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Accepted Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">Credit Cards</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">Bank Transfer</div>
                  <div className="text-sm text-gray-600">Local & International</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">Mobile Money</div>
                  <div className="text-sm text-gray-600">MTN, Orange Money</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">Digital Wallet</div>
                  <div className="text-sm text-gray-600">Secure payments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Payment Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium text-gray-900">LACRA Payment Department</div>
                <div className="text-sm text-gray-600">Phone: +231 77 555 1234</div>
                <div className="text-sm text-gray-600">Email: payments@lacra.gov.lr</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Technical Support</div>
                <div className="text-sm text-gray-600">Phone: +231 77 555 5678</div>
                <div className="text-sm text-gray-600">Email: support@polipus.com</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm text-yellow-800">
                  <strong>Business Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM GMT
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Notice */}
        <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-lg">
          <p className="text-gray-600 text-sm mb-2">
            All payments are processed securely through our certified payment gateway. 
            Revenue is automatically distributed between LACRA (regulatory oversight) and Polipus (technology services).
          </p>
          <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
            <span>🔒 SSL Encrypted</span>
            <span>•</span>
            <span>🏦 Bank-grade Security</span>
            <span>•</span>
            <span>✅ PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}