import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  DollarSign, 
  Shield, 
  CheckCircle,
  ArrowLeft 
} from "lucide-react";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

interface PaymentService {
  id: number;
  serviceName: string;
  serviceType: string;
  basePrice: string;
  lacraShare: string;
  poliposShare: string;
  description: string;
}

const CheckoutForm = ({ 
  service, 
  clientSecret,
  onSuccess 
}: { 
  service: PaymentService;
  clientSecret: string;
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: `Your ${service.serviceName} payment has been processed successfully.`,
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Payment Methods Accepted</h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Credit/Debit Cards</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Bank Transfers</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span>Mobile Money (MTN, Orange)</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Secure Payment</span>
          </div>
        </div>
      </div>

      <PaymentElement 
        options={{
          layout: "tabs",
          paymentMethodOrder: ['card', 'sepa_debit', 'sofort', 'bancontact']
        }}
      />

      <Button 
        type="submit" 
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </div>
        ) : (
          <>
            <DollarSign className="h-4 w-4 mr-2" />
            Pay ${service.basePrice} USD
          </>
        )}
      </Button>

      <div className="text-center text-sm text-gray-600">
        <p className="flex items-center justify-center gap-1">
          <Shield className="h-4 w-4" />
          Secured by Stripe • 256-bit SSL encryption
        </p>
      </div>
    </form>
  );
};

export default function PaymentCheckout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  
  // Get service ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('service');

  // Get service details
  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: ['/api/payment-services', serviceId],
    enabled: !!serviceId,
  });

  // Create payment intent
  useEffect(() => {
    if (service && serviceId) {
      const authToken = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");

      if (!authToken || !userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to proceed with payment.",
          variant: "destructive",
        });
        setLocation("/regulatory-login");
        return;
      }

      // Create payment intent
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          serviceId: parseInt(serviceId),
          userId,
          customerName: username || "AgriTrace User",
          customerEmail: `${username}@agritrace360.com`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setClientSecret(data.clientSecret);
          } else {
            toast({
              title: "Payment Setup Failed",
              description: data.message || "Failed to initialize payment.",
              variant: "destructive",
            });
          }
        })
        .catch(() => {
          toast({
            title: "Connection Error",
            description: "Failed to connect to payment system.",
            variant: "destructive",
          });
        });
    }
  }, [service, serviceId, toast, setLocation]);

  const handlePaymentSuccess = () => {
    setLocation("/payment-success");
  };

  if (!serviceId) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Invalid payment request. Please select a service first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (serviceLoading || !service) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/payment-services")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Secure Payment</h1>
          <p className="text-gray-600 mt-2">Complete your payment for AgriTrace360 services</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Service Summary
              </CardTitle>
              <CardDescription>
                Review your selected service details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                <Badge className="mt-2 capitalize">
                  {service.serviceType.replace('_', ' ')}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold">${service.basePrice} USD</span>
                </div>
                <div className="text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>• LACRA Share ({service.lacraShare}%)</span>
                    <span>${(parseFloat(service.basePrice) * parseFloat(service.lacraShare) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Platform Fee ({service.poliposShare}%)</span>
                    <span>${(parseFloat(service.basePrice) * parseFloat(service.poliposShare) / 100).toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${service.basePrice} USD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Enter your payment information securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#16a34a',
                    }
                  }
                }}
              >
                <CheckoutForm 
                  service={service}
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}