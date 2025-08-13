import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserCheck, 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Home,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function FieldAgentLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOffline] = useState(true); // Simulate offline mode

  // Test credentials for demo
  const testCredentials = [
    { username: 'agent001', password: 'password123', name: 'John Smith' },
    { username: 'agent002', password: 'password123', name: 'Sarah Johnson' },
    { username: 'field001', password: 'password123', name: 'Mike Wilson' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check test credentials
    const validUser = testCredentials.find(
      cred => cred.username === credentials.username && cred.password === credentials.password
    );

    if (validUser) {
      // Store user session
      localStorage.setItem('fieldAgent', JSON.stringify({
        username: validUser.username,
        name: validUser.name,
        loginTime: new Date().toISOString(),
        isOffline: isOffline
      }));
      
      // Redirect to field agent dashboard
      setLocation('/field-agent-dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center border-2 border-white shadow-lg">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Field Agent Portal</h1>
                  <p className="text-xs text-slate-600">AgriTrace360™ Mobile Access</p>
                </div>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Badge variant={isOffline ? "destructive" : "default"} className="flex items-center gap-1">
                {isOffline ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                {isOffline ? 'Offline Mode' : 'Online'}
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          
          {/* Offline Alert */}
          {isOffline && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Offline Mode Active:</strong> You can still log in and access core features. 
                Data will sync when connection is restored.
              </AlertDescription>
            </Alert>
          )}

          {/* Login Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Field Agent Login
              </CardTitle>
              <p className="text-slate-600">
                Access your mobile inspection and data collection tools
              </p>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Agent ID / Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your agent ID"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
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
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700"
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
                      Login to Portal
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
                  <p><strong>Username:</strong> agent001 | <strong>Password:</strong> password123</p>
                  <p><strong>Username:</strong> agent002 | <strong>Password:</strong> password123</p>
                  <p><strong>Username:</strong> field001 | <strong>Password:</strong> password123</p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-slate-900">Available Features:</h4>
                <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Offline Farmer Registration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>GPS Land Mapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Inspection Data Collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Automatic Data Sync</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}