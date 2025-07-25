import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, ArrowLeft, Ship, Globe, Package, Users } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import lacraLogo from '@assets/LACRA LOGO_1753406166355.jpg';

export default function ExporterLogin() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (loginData: { username: string; password: string }) => {
      const response = await apiRequest('/api/auth/exporter-login', {
        method: 'POST',
        body: JSON.stringify(loginData),
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
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Helmet>
        <title>Exporter Portal Login - AgriTrace360™</title>
        <meta name="description" content="Secure login portal for licensed exporters accessing AgriTrace360™ export management system" />
      </Helmet>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img 
                src={lacraLogo} 
                alt="LACRA Official Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Ship className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            LACRA Exporter Portal
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Liberia Agriculture Commodity Regulatory Authority
          </p>
          <p className="text-sm text-gray-500">
            AgriTrace360™ Licensed Export Management
          </p>
        </CardHeader>

        <CardContent>
          {/* Portal Features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 mb-1" />
              <span className="text-xs font-medium text-blue-700">Export Orders</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
              <Truck className="h-6 w-6 text-purple-600 mb-1" />
              <span className="text-xs font-medium text-purple-700">Logistics</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg">
              <Globe className="h-6 w-6 text-indigo-600 mb-1" />
              <span className="text-xs font-medium text-indigo-700">LACRA Integration</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600 mb-1" />
              <span className="text-xs font-medium text-green-700">Network Partnerships</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Exporter ID / Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="EXP-2024-001"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="bg-white/80"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="bg-white/80"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing In...' : 'Access Exporter Portal'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Main Portal
            </Button>
          </div>

          {/* Licensing Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-800 mb-2">Access Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Valid export license required</li>
              <li>• LACRA-approved exporter status</li>
              <li>• Active business registration</li>
              <li>• Compliance with export regulations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}