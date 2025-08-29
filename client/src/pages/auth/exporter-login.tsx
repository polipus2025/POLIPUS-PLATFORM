import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Truck, ArrowLeft, Ship, Globe, Package, Users, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link } from "wouter";

export default function ExporterLogin() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({ exporterId: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (loginData: { exporterId: string; password: string }) => {
      const response = await apiRequest('/api/auth/exporter-login', {
        method: 'POST',
        body: JSON.stringify({ username: loginData.exporterId, password: loginData.password }),
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.success && data.user && data.user.role === 'exporter') {
        // Store authentication token and user type
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userType', 'exporter');
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        queryClient.setQueryData(['/api/auth/user'], data.user);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${data.user.firstName}!`,
        });
        
        // Force a page reload to ensure authentication state is recognized
        window.location.href = '/exporter-dashboard';
      } else {
        setError('Access denied. Exporter credentials required.');
      }
    },
    onError: (error: any) => {
      setError(error.message || 'Login failed. Please check your credentials.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!credentials.exporterId || !credentials.password) {
      setError('Please enter both exporter ID and password');
      return;
    }
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Exporter Portal Login - AgriTrace360™</title>
        <meta name="description" content="Secure login portal for licensed exporters accessing AgriTrace360™ export management system" />
      </Helmet>

      {/* Back to Platform Button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Polipus Platform
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-lg">
            <Ship className="w-6 h-6 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">LACRA Exporter Portal</h1>
          <p className="text-slate-700 text-sm">Agricultural Export Management System</p>
          <p className="text-slate-600 text-xs mt-1">Liberia Agriculture Commodity Regulatory Authority</p>
        </div>

        {/* Exporter Login Card */}
        <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-1">
              <Ship className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-base text-slate-900 flex items-center justify-center gap-2">
              <Ship className="w-3 h-3" />
              Licensed Exporter Access
            </CardTitle>
            <CardDescription className="text-slate-600 text-xs">
              Export Operations & International Trade Management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <Badge variant="outline" className="w-full justify-center border-blue-500 text-blue-600 bg-blue-50 text-xs py-0.5">
              Export Operations Access
            </Badge>

            {/* Portal Features */}
            <div className="grid grid-cols-2 gap-1 mb-3">
              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded-lg">
                <Package className="h-3 w-3 text-slate-600 mb-0.5" />
                <span className="text-xs font-medium text-slate-700">Export Orders</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded-lg">
                <Truck className="h-3 w-3 text-slate-600 mb-0.5" />
                <span className="text-xs font-medium text-slate-700">Logistics</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded-lg">
                <Globe className="h-3 w-3 text-slate-600 mb-0.5" />
                <span className="text-xs font-medium text-slate-700">LACRA Integration</span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded-lg">
                <Users className="h-3 w-3 text-slate-600 mb-0.5" />
                <span className="text-xs font-medium text-slate-700">Trade Network</span>
              </div>
            </div>
            
            {error && (
              <Alert className="border-red-200 bg-red-50 py-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Exporter Login Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <Label htmlFor="exporterId" className="text-xs">Exporter ID *</Label>
                <Input
                  id="exporterId"
                  type="text"
                  value={credentials.exporterId}
                  onChange={(e) => setCredentials({ ...credentials, exporterId: e.target.value })}
                  className="mt-0.5 h-7 text-sm"
                  placeholder="e.g., EXP-20250818-627"
                  data-testid="input-exporter-id"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-xs">Password *</Label>
                <div className="relative mt-0.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="pr-8 h-7 text-sm"
                    placeholder="Enter your password"
                    data-testid="input-exporter-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    data-testid="button-toggle-exporter-password"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group h-7 text-xs"
                disabled={loginMutation.isPending}
                data-testid="button-exporter-login"
              >
                {loginMutation.isPending ? "Signing In..." : "Access Exporter Portal"}
              </Button>
            </form>

            {/* Licensing Info */}
            <div className="mt-3 p-2 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-xs text-slate-800 mb-1">Access Requirements:</h4>
              <ul className="text-xs text-slate-600 space-y-0.5">
                <li>• Valid export license required</li>
                <li>• LACRA-approved exporter status</li>
                <li>• Active business registration</li>
                <li>• Compliance with export regulations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-3 text-slate-400 text-xs">
          <p>AgriTrace360™ Export Management Portal System</p>
          <p className="text-xs mt-0.5">Licensed Exporters Only • All Access Attempts are Logged</p>
        </div>
      </div>
    </div>
  );
}