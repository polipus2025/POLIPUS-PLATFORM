import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wheat, ArrowLeft, ArrowRight, UserCheck, MapPin, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function FarmerPortalLogin() {
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
            <Wheat className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Farmer Portal</h1>
          <p className="text-slate-700 text-lg">Agricultural Producer Access</p>
          <p className="text-slate-600 text-sm mt-2">AgriTrace360™ - Farm Management & Compliance</p>
        </div>

        {/* Access Options Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Existing Farmer Login */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group" 
                onClick={() => navigate('/farmer-dashboard')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <UserCheck className="w-5 h-5" />
                Registered Farmer
              </CardTitle>
              <CardDescription className="text-slate-600">
                Existing producer login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-green-500 text-green-600 bg-green-50">
                Producer Level Access
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Land plot management & GPS mapping</li>
                <li>• Crop planning & harvest scheduling</li>
                <li>• Batch tracking & compliance docs</li>
                <li>• Marketplace & buyer connections</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/farmer-dashboard'); }}
              >
                Access Farmer Dashboard
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* New Farmer Registration */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => navigate('/farmer-registration')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <Sprout className="w-5 h-5" />
                New Farmer
              </CardTitle>
              <CardDescription className="text-slate-600">
                Producer registration & onboarding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-emerald-500 text-emerald-600 bg-emerald-50">
                Registration Process
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Complete farmer profile setup</li>
                <li>• GPS land plot registration</li>
                <li>• Document verification process</li>
                <li>• Access to AgriTrace360™ platform</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/farmer-registration'); }}
              >
                Register as New Farmer
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
                Contact your local agricultural extension officer or LACRA representative for account setup and technical support.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  County Agricultural Offices
                </span>
                <span>•</span>
                <span>📞 Support: +231-XXX-XXXX</span>
                <span>•</span>
                <span>📧 farmers@lacra.gov.lr</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}