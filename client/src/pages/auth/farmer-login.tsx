import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Home,
  Leaf,
  MapPin
} from 'lucide-react';

export default function FarmerLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ farmerId: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Test farmer credentials
  const testFarmers = [
    { farmerId: 'LR001', password: 'farmer123', name: 'John Doe', farm: 'Green Valley Farm' },
    { farmerId: 'LR002', password: 'farmer123', name: 'Mary Johnson', farm: 'Sunrise Plantation' },
    { farmerId: 'LR003', password: 'farmer123', name: 'David Wilson', farm: 'Hillside Crops' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check test credentials
    const validFarmer = testFarmers.find(
      farmer => farmer.farmerId === credentials.farmerId && farmer.password === credentials.password
    );

    if (validFarmer) {
      // Store farmer session
      localStorage.setItem('farmer', JSON.stringify({
        farmerId: validFarmer.farmerId,
        name: validFarmer.name,
        farm: validFarmer.farm,
        loginTime: new Date().toISOString()
      }));
      
      // Redirect to farmer dashboard
      setLocation('/farmer-dashboard');
    } else {
      setError('Invalid farmer ID or password. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/portals">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center border-2 border-white shadow-lg">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Farmer Portal</h1>
                  <p className="text-xs text-slate-600">AgriTrace360™ Farm Management</p>
                </div>
              </div>
            </Link>
            
            <Link href="/portals">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Back to Portals
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Farmer Login
              </CardTitle>
              <p className="text-slate-600">
                Access your farm management and compliance tools
              </p>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farmerId">Farmer ID</Label>
                  <Input
                    id="farmerId"
                    type="text"
                    placeholder="Enter your farmer ID (e.g., LR001)"
                    value={credentials.farmerId}
                    onChange={(e) => setCredentials({...credentials, farmerId: e.target.value})}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                      required
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Access Farm Portal
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Demo Credentials
                </h4>
                <div className="space-y-1 text-sm text-slate-600">
                  <p><strong>Farmer ID:</strong> LR001 | <strong>Password:</strong> farmer123</p>
                  <p><strong>Farmer ID:</strong> LR002 | <strong>Password:</strong> farmer123</p>
                  <p><strong>Farmer ID:</strong> LR003 | <strong>Password:</strong> farmer123</p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-slate-900">Portal Features:</h4>
                <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Farm Profile Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Crop Planning & Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Compliance Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>EUDR Documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>GPS Land Mapping</span>
                  </div>
                </div>
              </div>

              {/* Registration Link */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-slate-600 mb-2">
                  Don't have a farmer account?
                </p>
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                  Register New Farm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}