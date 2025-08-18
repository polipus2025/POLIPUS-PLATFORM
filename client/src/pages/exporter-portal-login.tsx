import { useState } from "react";
import { useNavigate, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Ship, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";

interface LoginFormData {
  username: string;
  password: string;
}

interface PasswordChangeData {
  newPassword: string;
  confirmPassword: string;
}

export default function ExporterPortalLogin() {
  const [, navigate] = useNavigate();
  const [location] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check existing session
  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ['/api/auth/exporter/session'],
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      return await apiRequest('POST', '/api/auth/exporter/login', credentials);
    },
    onSuccess: (data: any) => {
      setIsAuthenticated(true);
      if (data.mustChangePassword) {
        setMustChangePassword(true);
        toast({
          title: "Password Change Required",
          description: "You must change your password before accessing the portal.",
        });
      } else {
        toast({
          title: "Login Successful",
          description: `Welcome to the Exporter Portal, ${data.exporter.contactPerson}!`,
        });
        navigate('/exporter-portal');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: { newPassword: string }) => {
      return await apiRequest('POST', '/api/auth/exporter/change-password', passwordData);
    },
    onSuccess: () => {
      setMustChangePassword(false);
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully. You can now access the portal.",
      });
      navigate('/exporter-portal');
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both password fields match",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    changePasswordMutation.mutate({ newPassword: passwordData.newPassword });
  };

  // Redirect if already authenticated and doesn't need password change
  if (sessionData && !sessionData.mustChangePassword) {
    navigate('/exporter-portal');
    return null;
  }

  // Handle existing session with password change requirement
  if (sessionData && sessionData.mustChangePassword && !mustChangePassword) {
    setMustChangePassword(true);
    setIsAuthenticated(true);
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Ship className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {mustChangePassword ? "Set New Password" : "Exporter Portal Login"}
          </CardTitle>
          <CardDescription className="text-slate-600">
            {mustChangePassword 
              ? "You must set a new password to continue" 
              : "Access your export management dashboard"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {!mustChangePassword ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  data-testid="input-exporter-username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    data-testid="input-exporter-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Use the credentials provided by LACRA regulatory staff after your exporter application approval.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
                data-testid="button-exporter-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In to Portal"
                )}
              </Button>
            </form>
          ) : (
            // Password Change Form
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  For security, you must set a new password before accessing your portal.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min 8 characters)"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    data-testid="input-new-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  data-testid="input-confirm-password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={changePasswordMutation.isPending}
                data-testid="button-update-password"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password & Continue"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-slate-600">
              Need help? Contact LACRA Support
            </p>
            <p className="text-xs text-slate-500 mt-1">
              info@lacra.gov.lr | +231-XXX-XXXX
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}