import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Building2, DollarSign, Settings, ArrowRight, Database, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// Temporarily comment out asset import to debug routing
// import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

export default function RegulatoryLogin() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-slate-600" />
            {/* <img 
              src={lacraLogo} 
              alt="LACRA Logo" 
              className="w-16 h-16 object-contain rounded-full"
            /> */}
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">LACRA Regulatory Portal</h1>
          <p className="text-slate-700 text-lg">Three-Tier Access System</p>
          <p className="text-slate-600 text-sm mt-2">Liberia Agriculture Commodity Regulatory Authority</p>
        </div>

        {/* Three-Tier Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* DG Portal */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group" 
                onClick={() => navigate('/dg-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" />
                Director General
              </CardTitle>
              <CardDescription className="text-slate-600">
                Executive Leadership Portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-blue-500 text-blue-600 bg-blue-50">
                Executive Level Access
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Strategic oversight and governance</li>
                <li>• Policy formulation and approval</li>
                <li>• Executive decision-making</li>
                <li>• Board reporting and compliance</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/dg-login'); }}
              >
                Access DG Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* DDGOTS Portal */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => navigate('/ddgots-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                DDGOTS
              </CardTitle>
              <CardDescription className="text-slate-600">
                Operations & Technical Services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-emerald-500 text-emerald-600 bg-emerald-50">
                Operations Level Access
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Field operations management</li>
                <li>• Quality control and certifications</li>
                <li>• Technical standards compliance</li>
                <li>• Inspection coordination</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/ddgots-login'); }}
              >
                Access DDGOTS Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* DDGAF Portal */}
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => navigate('/ddgaf-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                DDGAF
              </CardTitle>
              <CardDescription className="text-slate-600">
                Administration & Finance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-amber-500 text-amber-600 bg-amber-50">
                Finance Level Access
              </Badge>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Budget planning and management</li>
                <li>• HR administration and procurement</li>
                <li>• Financial compliance and reporting</li>
                <li>• Revenue and cost management</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/ddgaf-login'); }}
              >
                Access DDGAF Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Independent Access Portals */}
        <div className="mt-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Independent Access Portals</h2>
            <p className="text-slate-600">Alternative portal access for system administrators and regulatory staff</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* System Administrator Portal */}
            <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group" 
                  onClick={() => navigate('/system-admin-login')}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                  <Database className="w-5 h-5" />
                  System Administrator
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Platform Control Center
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="outline" className="w-full justify-center border-slate-500 text-slate-600 bg-slate-50">
                  System Level Access
                </Badge>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Cross-module connectivity monitoring</li>
                  <li>• Database management and control</li>
                  <li>• System health oversight</li>
                  <li>• Platform administration</li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white group"
                  onClick={(e) => { e.stopPropagation(); navigate('/system-admin-login'); }}
                >
                  Access System Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Regulatory Portal Classic */}
            <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all cursor-pointer group"
                  onClick={() => navigate('/regulatory-classic-login')}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900 flex items-center justify-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Regulatory (Classic)
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Original Unified Interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="outline" className="w-full justify-center border-green-500 text-green-600 bg-green-50">
                  Unified Access
                </Badge>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• EUDR compliance monitoring</li>
                  <li>• Export control and management</li>
                  <li>• Inspection oversight</li>
                  <li>• Unified regulatory interface</li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white group"
                  onClick={(e) => { e.stopPropagation(); navigate('/regulatory-classic-login'); }}
                >
                  Access Classic Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-white shadow-lg border border-slate-200 rounded-lg p-6 text-center">
          <Shield className="w-8 h-8 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Access Portal</h3>
          <p className="text-slate-600 text-sm mb-4">
            Each departmental portal provides role-specific access controls and specialized functionality. 
            All sessions are secured with JWT authentication and audit logging.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-slate-500">
            <span>✓ Multi-factor Authentication</span>
            <span>✓ Session Timeout Protection</span>
            <span>✓ Audit Trail Monitoring</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>AgriTrace360™ Three-Tier Regulatory Portal System</p>
          <p className="text-xs mt-1">Authorized Personnel Only • All Access Attempts are Logged</p>
        </div>
      </div>
    </div>
  );
}