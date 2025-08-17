import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Download, 
  Home, 
  Receipt, 
  ArrowRight,
  DollarSign,
  Calendar
} from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get payment details from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const authToken = localStorage.getItem("authToken");

    if (paymentIntent && authToken) {
      // Fetch transaction details
      fetch(`/api/payment-confirmation/${paymentIntent}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTransactionDetails(data.transaction);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch payment details:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleDownloadReceipt = () => {
    if (transactionDetails) {
      // Generate and download receipt
      window.open(`/api/payment-receipt/${transactionDetails.transactionId}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Confirming payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Your payment has been processed successfully and revenue has been automatically distributed.
          </p>
        </div>

        {/* Transaction Details */}
        {transactionDetails ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Transaction ID</span>
                  <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                    {transactionDetails.transactionId}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Payment Date</span>
                  <div className="font-semibold mt-1">
                    {new Date(transactionDetails.completedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Service Details</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-semibold">{transactionDetails.service?.serviceName}</div>
                  <div className="text-sm text-gray-600">{transactionDetails.service?.description}</div>
                  <Badge className="mt-2 capitalize">
                    {transactionDetails.service?.serviceType?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Payment Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span className="font-semibold">${transactionDetails.totalAmount} USD</span>
                  </div>
                  <div className="ml-4 space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>• LACRA Share</span>
                      <span>${transactionDetails.lacraAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Platform Fee</span>
                      <span>${transactionDetails.poliposAmount}</span>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Payment Method</span>
                    <span className="capitalize">{transactionDetails.paymentMethod?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Confirmed</h2>
              <p className="text-gray-600">
                Your payment has been successfully processed. A confirmation email will be sent to you shortly.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Revenue Distribution Info */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Revenue Distribution</h3>
            </div>
            <p className="text-blue-700 text-sm mb-3">
              Your payment has been automatically distributed according to the partnership agreement:
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-gray-900">LACRA (Regulatory Authority)</div>
                <div className="text-gray-600">Receives majority share for regulatory oversight</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-semibold text-gray-900">Polipus (Service Provider)</div>
                <div className="text-gray-600">Platform maintenance and development</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Your Actions:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check your email for confirmation</li>
                  <li>• Download your receipt for records</li>
                  <li>• Track service processing status</li>
                  <li>• Contact support if needed</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Processing Timeline:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Certificate generation: 1-2 business days</li>
                  <li>• Permit approval: 3-5 business days</li>
                  <li>• License processing: 2-3 business days</li>
                  <li>• Status updates via email</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {transactionDetails && (
            <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          )}
          
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Questions about your payment? Contact our support team at{" "}
            <a href="mailto:support@agritrace360.com" className="text-blue-600 hover:underline">
              support@agritrace360.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}