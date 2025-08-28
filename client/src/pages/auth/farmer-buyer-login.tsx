import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Wheat, Building2, User, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function FarmerBuyerLogin() {
  const [, navigate] = useLocation();
  
  // Farmer form state
  const [farmerData, setFarmerData] = useState({
    username: '',
    password: ''
  });
  const [farmerLoading, setFarmerLoading] = useState(false);
  const [farmerError, setFarmerError] = useState('');

  // Buyer form state
  const [buyerData, setBuyerData] = useState({
    username: '',
    password: ''
  });
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [buyerError, setBuyerError] = useState('');

  const handleFarmerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFarmerData(prev => ({ ...prev, [name]: value }));
  };

  const handleBuyerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerData(prev => ({ ...prev, [name]: value }));
  };

  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFarmerLoading(true);
    setFarmerError('');

    try {
      const response = await fetch('/api/auth/farmer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...farmerData, userType: 'farmer' })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('farmerToken', data.token);
        localStorage.setItem('farmerUser', JSON.stringify(data.farmer));
        navigate('/farmer-dashboard');
      } else {
        setFarmerError(data.message || 'Login failed');
      }
    } catch (error) {
      setFarmerError('Network error - please try again');
      console.error('Farmer Login error:', error);
    } finally {
      setFarmerLoading(false);
    }
  };

  const handleBuyerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyerLoading(true);
    setBuyerError('');

    try {
      const response = await fetch('/api/auth/buyer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...buyerData, userType: 'buyer' })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('buyerToken', data.token);
        localStorage.setItem('buyerUser', JSON.stringify(data.buyer));
        navigate('/agricultural-buyer-dashboard');
      } else {
        setBuyerError(data.message || 'Login failed');
      }
    } catch (error) {
      setBuyerError('Network error - please try again');
      console.error('Buyer Login error:', error);
    } finally {
      setBuyerLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Back to Platform Button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Polipus Platform
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Agricultural Portal Access</h1>
          <p className="text-slate-600">Choose your portal to access AgriTrace360™</p>
        </div>

        {/* Two Login Boxes Side by Side */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* FARMER LOGIN BOX */}
          <Card className="bg-white shadow-xl border-slate-200">
            <CardHeader className="space-y-1 pb-4">
              <div className="text-center mb-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-3">
                  <Wheat className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl text-center text-slate-900 flex items-center justify-center gap-2">
                <Wheat className="w-4 h-4" />
                Farmer Portal
              </CardTitle>
              <CardDescription className="text-center text-slate-600 text-sm">
                Agricultural producer authentication
              </CardDescription>
              
              {/* Access Level Badge */}
              <div className="flex justify-center mt-3">
                <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 text-xs">
                  <Wheat className="w-3 h-3 mr-1" />
                  Producer Level
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 pt-0">
              {/* Test Credentials Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                <p className="text-xs text-green-700 font-medium">Test Credentials:</p>
                <p className="text-xs text-green-600">Username: <code className="bg-green-100 px-1 rounded text-xs">farmer_test</code></p>
                <p className="text-xs text-green-600">Password: <code className="bg-green-100 px-1 rounded text-xs">farmer123</code></p>
              </div>
              
              <form onSubmit={handleFarmerLogin} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="farmer-username" className="text-slate-700 text-sm">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="farmer-username"
                      name="username"
                      type="text"
                      placeholder="farmer_test"
                      value={farmerData.username}
                      onChange={handleFarmerInputChange}
                      className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-9"
                      data-testid="farmer-input-username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="farmer-password" className="text-slate-700 text-sm">Password</Label>
                  <Input
                    id="farmer-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={farmerData.password}
                    onChange={handleFarmerInputChange}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-9"
                    data-testid="farmer-input-password"
                    required
                  />
                </div>

                {farmerError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{farmerError}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  disabled={farmerLoading}
                  data-testid="farmer-button-login"
                >
                  {farmerLoading ? 'Authenticating...' : 'Access Farmer Portal'}
                </Button>
              </form>

              {/* Additional Options */}
              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-600 mb-2">New farmer?</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/farmer-registration')}
                  className="w-full h-8 text-xs"
                >
                  Register New Farm
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* BUYER LOGIN BOX */}
          <Card className="bg-white shadow-xl border-slate-200">
            <CardHeader className="space-y-1 pb-4">
              <div className="text-center mb-3">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl text-center text-slate-900 flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4" />
                Buyer Portal
              </CardTitle>
              <CardDescription className="text-center text-slate-600 text-sm">
                Commodity buyer authentication
              </CardDescription>
              
              {/* Access Level Badge */}
              <div className="flex justify-center mt-3">
                <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 text-xs">
                  <Building2 className="w-3 h-3 mr-1" />
                  Buyer Level
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 pt-0">
              {/* Test Credentials Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                <p className="text-xs text-blue-700 font-medium">Test Credentials:</p>
                <p className="text-xs text-blue-600">Username: <code className="bg-blue-100 px-1 rounded text-xs">buyer_test</code></p>
                <p className="text-xs text-blue-600">Password: <code className="bg-blue-100 px-1 rounded text-xs">buyer123</code></p>
              </div>
              
              <form onSubmit={handleBuyerLogin} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="buyer-username" className="text-slate-700 text-sm">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="buyer-username"
                      name="username"
                      type="text"
                      placeholder="buyer_test"
                      value={buyerData.username}
                      onChange={handleBuyerInputChange}
                      className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-9"
                      data-testid="buyer-input-username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="buyer-password" className="text-slate-700 text-sm">Password</Label>
                  <Input
                    id="buyer-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={buyerData.password}
                    onChange={handleBuyerInputChange}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-9"
                    data-testid="buyer-input-password"
                    required
                  />
                </div>

                {buyerError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{buyerError}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  disabled={buyerLoading}
                  data-testid="buyer-button-login"
                >
                  {buyerLoading ? 'Authenticating...' : 'Access Buyer Portal'}
                </Button>
              </form>

              {/* Additional Options */}
              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-600 mb-2">New buyer?</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/buyer-registration')}
                  className="w-full h-8 text-xs"
                >
                  Register New Business
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="text-center mt-6 text-slate-500 text-xs">
          <p>Need help? Contact your local agricultural extension officer or LACRA representative</p>
          <p className="text-xs mt-1">📞 +231-XXX-XXXX • 📧 support@lacra.gov.lr</p>
        </div>
      </div>
    </div>
  );
}