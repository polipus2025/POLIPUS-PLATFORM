import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Shield, Building2, User, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function DGLogin() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    departmentLevel: 'dg'
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
      const response = await fetch('/api/auth/dg-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('dgToken', data.token);
        localStorage.setItem('dgUser', JSON.stringify(data.regulator));
        navigate('/dg-dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error - please try again');
      console.error('DG Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Back to Regulatory Login Button */}
      <div className="absolute top-6 left-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => navigate('/regulatory-login')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login Page
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Director General Portal</h1>
          <p className="text-slate-600">LACRA Executive Access System</p>
        </div>

        <Card className="bg-white shadow-xl border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-slate-900 flex items-center justify-center gap-2">
              <Building2 className="w-5 h-5" />
              DG Level Access
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Executive leadership authentication
            </CardDescription>
            
            {/* Access Level Badge */}
            <div className="flex justify-center mt-4">
              <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                <Shield className="w-4 h-4 mr-1" />
                Executive Level
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Test Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700 font-medium">Test Credentials:</p>
              <p className="text-xs text-blue-600">Username: <code className="bg-blue-100 px-1 rounded">director_general</code></p>
              <p className="text-xs text-blue-600">Password: <code className="bg-blue-100 px-1 rounded">dgpassword123</code></p>
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
                    placeholder="director_general"
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3"
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
                    <Shield className="w-4 h-4" />
                    Access DG Portal
                  </div>
                )}
              </Button>
            </form>

            {/* Test Credentials Helper */}
            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h3 className="text-sm font-medium text-blue-300 mb-2">Development Credentials:</h3>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Username: <code className="text-blue-300">director_general</code></div>
                <div>Password: <code className="text-blue-300">dgpassword123</code></div>
              </div>
            </div>

            {/* Additional Access Links */}
            <div className="flex justify-between text-sm">
              <button 
                onClick={() => navigate('/ddgots-login')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                DDGOTS Portal →
              </button>
              <button 
                onClick={() => navigate('/ddgaf-login')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                DDGAF Portal →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Liberia Agriculture Commodity Regulatory Authority</p>
          <p className="text-xs mt-1">Three-Tier Regulatory Portal System</p>
        </div>
      </div>
    </div>
  );
}