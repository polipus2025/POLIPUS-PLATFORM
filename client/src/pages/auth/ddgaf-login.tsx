import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, DollarSign, Calculator, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function DDGAFLogin() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    departmentLevel: 'ddgaf'
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
      const response = await fetch('/api/auth/ddgaf-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('ddgafToken', data.token);
        localStorage.setItem('ddgafUser', JSON.stringify(data.regulator));
        navigate('/ddgaf-dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error - please try again');
      console.error('DDGAF Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">DDGAF Portal</h1>
          <p className="text-slate-600">Administration & Finance</p>
        </div>

        <Card className="bg-white shadow-xl border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-slate-900 flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              Finance Access
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Financial administration authentication
            </CardDescription>
            
            {/* Access Level Badge */}
            <div className="flex justify-center mt-4">
              <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">
                <DollarSign className="w-4 h-4 mr-1" />
                Finance Level
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Test Credentials Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <p className="text-sm text-amber-700 font-medium">Test Credentials:</p>
              <p className="text-xs text-amber-600">Username: <code className="bg-amber-100 px-1 rounded">ddg_finance</code></p>
              <p className="text-xs text-amber-600">Password: <code className="bg-amber-100 px-1 rounded">ddgafpassword123</code></p>
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
                    placeholder="ddg_finance"
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
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Access DDGAF Portal
                  </div>
                )}
              </Button>
            </form>

            {/* Test Credentials Helper */}
            <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <h3 className="text-sm font-medium text-amber-300 mb-2">Development Credentials:</h3>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Username: <code className="text-amber-300">ddg_finance</code></div>
                <div>Password: <code className="text-amber-300">ddgafpassword123</code></div>
              </div>
            </div>

            {/* Additional Access Links */}
            <div className="flex justify-between text-sm">
              <button 
                onClick={() => navigate('/auth/ddgots-login')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                ← DDGOTS Portal
              </button>
              <button 
                onClick={() => navigate('/auth/dg-login')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                DG Portal →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Administration & Finance Division</p>
          <p className="text-xs mt-1">Budget Planning • HR Management • Procurement</p>
        </div>
      </div>
    </div>
  );
}