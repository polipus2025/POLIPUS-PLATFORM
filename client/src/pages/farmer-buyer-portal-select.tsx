import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wheat, Building2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function FarmerBuyerPortalSelect() {
  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Portal Selection - Farmer & Buyer Access | AgriTrace360™</title>
        <meta name="description" content="Choose your portal access - Farmer or Buyer authentication for AgriTrace360™" />
      </Helmet>

      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/portals">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Portals
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Portal Selection</h1>
              <p className="text-slate-600">Choose your access portal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Selection Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Farmer & Buyer Portal Access
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select your appropriate portal to access the AgriTrace360™ platform. 
            Each portal is tailored to your specific role and responsibilities.
          </p>
        </div>

        {/* Portal Options Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Farmer Portal Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-300">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-2xl isms-icon-bg-green flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Wheat className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Farmer Portal</CardTitle>
              <p className="text-slate-600">Agricultural producers and farm managers</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">Farm plot registration and GPS mapping</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">Crop planning and harvest scheduling</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">Batch code tracking and compliance documentation</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-lime-500 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">Marketplace listing and buyer connections</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="w-full isms-button-green text-white py-3 text-lg group-hover:scale-105 transition-transform"
              >
                <Link href="/farmer-portal-login">
                  Access Farmer Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Buyer Portal Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-2xl isms-icon-bg-blue flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Buyer Portal</CardTitle>
              <p className="text-slate-600">Agricultural commodity buyers and traders</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">Commodity sourcing and marketplace access</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">Transaction management and payment processing</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">Quality verification and compliance tracking</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">Export documentation and exporter networks</span>
                </div>
              </div>
              
              <Button 
                asChild 
                className="w-full isms-button-blue text-white py-3 text-lg group-hover:scale-105 transition-transform"
              >
                <Link href="/buyer-portal-login">
                  Access Buyer Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="bg-slate-50 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-slate-600">
              🔒 Secure authentication required for all portals. Contact your system administrator 
              for access credentials if you don't have them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}