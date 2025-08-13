import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Shield, WifiOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function FieldAgentLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      agentId: '',
      password: '',
    },
  });

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      // Test credentials for offline functionality
      const testCredentials = [
        { agentId: 'agent001', password: 'password123' },
        { agentId: 'agent002', password: 'password123' },
        { agentId: 'field001', password: 'password123' }
      ];
      
      const isValidCredential = testCredentials.some(
        cred => cred.agentId === data.agentId && cred.password === data.password
      );
      
      if (isValidCredential) {
        // Simulate authentication success
        localStorage.setItem('authToken', 'field-agent-token');
        localStorage.setItem('userRole', 'field_agent');
        localStorage.setItem('agentId', data.agentId);
        
        toast({
          title: "Login Successful",
          description: isOffline ? "Offline authentication successful" : "Welcome to the field agent portal",
        });
        
        // Redirect to field agent dashboard
        window.location.href = '/field-agent-dashboard';
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please check your Agent ID and password. Test credentials: agent001/password123",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: isOffline ? "Using offline authentication" : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Field Agent Login</CardTitle>
          <p className="text-slate-600">Access your field inspection portal</p>
          
          {isOffline && (
            <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <WifiOff className="h-4 w-4 text-orange-600" />
              <span className="text-orange-700 text-sm">Offline Mode Active</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="agentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your agent ID"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full h-12 bg-orange-600 hover:bg-orange-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-medium text-sm">Test Credentials Available</span>
            </div>
            <p className="text-green-600 text-sm">
              agent001/password123 • agent002/password123 • field001/password123
            </p>
          </div>
          
          <div className="text-center mt-6">
            <a href="/" className="text-slate-600 hover:text-slate-900 text-sm">
              ← Back to Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}