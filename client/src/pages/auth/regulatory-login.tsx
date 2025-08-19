import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Building2, DollarSign, Settings, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

export default function RegulatoryLogin() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <img 
              src={lacraLogo} 
              alt="LACRA Logo" 
              className="w-16 h-16 object-contain rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">LACRA Regulatory Portal</h1>
          <p className="text-slate-300 text-lg">Three-Tier Access System</p>
          <p className="text-slate-400 text-sm mt-2">Liberia Agriculture Commodity Regulatory Authority</p>
        </div>

        {/* Three-Tier Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* DG Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer group" 
                onClick={() => navigate('/auth/dg-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" />
                Director General
              </CardTitle>
              <CardDescription className="text-slate-300">
                Executive Leadership Portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-blue-400 text-blue-300 bg-blue-500/20">
                Executive Level Access
              </Badge>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Strategic oversight and governance</li>
                <li>• Policy formulation and approval</li>
                <li>• Executive decision-making</li>
                <li>• Board reporting and compliance</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/auth/dg-login'); }}
              >
                Access DG Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* DDGOTS Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                onClick={() => navigate('/auth/ddgots-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                DDGOTS
              </CardTitle>
              <CardDescription className="text-emerald-200">
                Operations & Technical Services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-emerald-400 text-emerald-300 bg-emerald-500/20">
                Operations Level Access
              </Badge>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Field operations management</li>
                <li>• Quality control and certifications</li>
                <li>• Technical standards compliance</li>
                <li>• Inspection coordination</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/auth/ddgots-login'); }}
              >
                Access DDGOTS Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* DDGAF Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                onClick={() => navigate('/auth/ddgaf-login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                DDGAF
              </CardTitle>
              <CardDescription className="text-amber-200">
                Administration & Finance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center border-amber-400 text-amber-300 bg-amber-500/20">
                Finance Level Access
              </Badge>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Budget planning and management</li>
                <li>• HR administration and procurement</li>
                <li>• Financial compliance and reporting</li>
                <li>• Revenue and cost management</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white group"
                onClick={(e) => { e.stopPropagation(); navigate('/auth/ddgaf-login'); }}
              >
                Access DDGAF Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
          <Shield className="w-8 h-8 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Secure Access Portal</h3>
          <p className="text-slate-300 text-sm mb-4">
            Each departmental portal provides role-specific access controls and specialized functionality. 
            All sessions are secured with JWT authentication and audit logging.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-slate-400">
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