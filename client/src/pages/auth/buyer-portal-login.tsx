import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Building2, ShoppingCart, User, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function BuyerPortalLogin() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'buyer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/buyer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('buyerToken', data.token);
        localStorage.setItem('buyerUser', JSON.stringify(data.buyer));
        navigate('/agricultural-buyer-dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error - please try again');
      console.error('Buyer Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Back to Portal Selection Button */}
      <div className="absolute top-6 left-6">
        <Link href="/farmer-buyer-portal-select">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Portal Selection
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Buyer Portal</h1>
          <p className="text-slate-600">Agricultural Commodity Buyer Access</p>
        </div>

        <Card className="bg-white shadow-xl border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-slate-900 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Buyer Access
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Commodity buyer authentication
            </CardDescription>
            
            {/* Access Level Badge */}
            <div className="flex justify-center mt-4">
              <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                <Building2 className="w-4 h-4 mr-1" />
                Buyer Level
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Test Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700 font-medium">Test Credentials:</p>
              <p className="text-xs text-blue-600">Username: <code className="bg-blue-100 px-1 rounded">buyer_test</code></p>
              <p className="text-xs text-blue-600">Password: <code className="bg-blue-100 px-1 rounded">buyer123</code></p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="buyer_test"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                    data-testid="input-username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  data-testid="input-password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? 'Authenticating...' : 'Access Buyer Portal'}
              </Button>
            </form>

            {/* Additional Options */}
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-2">New buyer?</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/buyer-registration')}
                className="w-full"
              >
                Register New Business
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="text-center mt-6 text-slate-500 text-sm">
          <p>Need help? Contact LACRA trade department</p>
          <p className="text-xs mt-1">📞 +231-XXX-XXXX • 📧 buyers@lacra.gov.lr</p>
        </div>
      </div>
    </div>
  );
}