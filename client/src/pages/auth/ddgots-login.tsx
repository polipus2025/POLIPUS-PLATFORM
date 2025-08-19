import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Settings, Cog, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function DDGOTSLogin() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    departmentLevel: 'ddgots'
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
      const response = await fetch('/api/auth/ddgots-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('ddgotsToken', data.token);
        localStorage.setItem('ddgotsUser', JSON.stringify(data.regulator));
        navigate('/ddgots-dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error - please try again');
      console.error('DDGOTS Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DDGOTS Portal</h1>
          <p className="text-emerald-200">Operations & Technical Services</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
              <Cog className="w-5 h-5" />
              Operations Access
            </CardTitle>
            <CardDescription className="text-center text-emerald-200">
              Technical operations authentication
            </CardDescription>
            
            {/* Access Level Badge */}
            <div className="flex justify-center mt-4">
              <Badge variant="outline" className="border-emerald-400 text-emerald-300 bg-emerald-500/20">
                <Settings className="w-4 h-4 mr-1" />
                Operations Level
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="ddg_operations"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                    data-testid="input-username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                  data-testid="input-password"
                  required
                />
              </div>

              {error && (
                <Alert className="bg-red-500/10 border-red-500/50">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3"
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
                    <Settings className="w-4 h-4" />
                    Access DDGOTS Portal
                  </div>
                )}
              </Button>
            </form>

            {/* Test Credentials Helper */}
            <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <h3 className="text-sm font-medium text-emerald-300 mb-2">Development Credentials:</h3>
              <div className="text-xs text-slate-300 space-y-1">
                <div>Username: <code className="text-emerald-300">ddg_operations</code></div>
                <div>Password: <code className="text-emerald-300">ddgotspassword123</code></div>
              </div>
            </div>

            {/* Additional Access Links */}
            <div className="flex justify-between text-sm">
              <button 
                onClick={() => navigate('/auth/dg-login')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                ← DG Portal
              </button>
              <button 
                onClick={() => navigate('/auth/ddgaf-login')}
                className="text-slate-300 hover:text-white transition-colors"
              >
                DDGAF Portal →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Operations & Technical Services Division</p>
          <p className="text-xs mt-1">Field Operations • Quality Control • Certifications</p>
        </div>
      </div>
    </div>
  );
}