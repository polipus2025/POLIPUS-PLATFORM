import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowLeft, ArrowRight, UserCheck, MapPin, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function BuyerPortalLogin() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Back to Platform Button */}
      <div className="absolute top-6 left-6">
        <Link href="/farmer-buyer-portal-select">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Portal Selection
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Buyer Portal</h1>
          <p className="text-slate-700 text-lg">Agricultural Commodity Buyer Access</p>
          <p className="text-slate-600 text-sm mt-2">AgriTrace360™ - Commodity Trading & Compliance</p>
        </div>

        {/* Access Options Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Existing Buyer Login */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group" 
                onClick={() => navigate('/agricultural-buyer-dashboard')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <UserCheck className="w-5 h-5" />
                Registered Buyer
              </CardTitle>
              <CardDescription className="text-slate-600">
                Existing commodity buyer login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-blue-500 text-blue-600 bg-blue-50">
                Buyer Level Access
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Commodity sourcing & marketplace access</li>
                <li>• Transaction management & payments</li>
                <li>• Quality verification & compliance</li>
                <li>• Export documentation & networks</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/agricultural-buyer-dashboard'); }}
              >
                Access Buyer Dashboard
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* New Buyer Registration */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => navigate('/buyer-registration')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                New Buyer
              </CardTitle>
              <CardDescription className="text-slate-600">
                Commodity buyer registration & verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-cyan-500 text-cyan-600 bg-cyan-50">
                Registration Process
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Complete buyer profile setup</li>
                <li>• Business verification process</li>
                <li>• Financial credential validation</li>
                <li>• Access to commodity marketplace</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/buyer-registration'); }}
              >
                Register as New Buyer
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="text-center">
          <Card className="bg-white shadow-lg border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Need Assistance?</h3>
              <p className="text-slate-600 text-sm mb-4">
                Contact LACRA trade department or your designated commodity representative for account setup and market access.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  LACRA Trade Department
                </span>
                <span>•</span>
                <span>📞 Support: +231-XXX-XXXX</span>
                <span>•</span>
                <span>📧 buyers@lacra.gov.lr</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}