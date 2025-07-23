import { Bell, Sprout, LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Alert } from "@shared/schema";

// Helper function to get user info
const getUserInfo = () => {
  const token = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');
  if (!token) return { role: null, userType: null, username: null };
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { 
      role: payload.role, 
      userType, 
      username: payload.username || payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName
    };
  } catch {
    return { role: null, userType: null, username: null };
  }
};

export default function Header() {
  const { toast } = useToast();
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts", "unreadOnly=true"],
  });

  const unreadCount = alerts.length;
  const { role, userType, username, firstName, lastName } = getUserInfo();

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // Clear all localStorage data regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userType');
      localStorage.removeItem('farmerId');
      localStorage.removeItem('agentId');
      localStorage.removeItem('jurisdiction');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the system",
      });
      
      // Redirect to landing page
      window.location.href = "/";
      
    } catch (error) {
      // Even if API call fails, clear localStorage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userType');
      localStorage.removeItem('farmerId');
      localStorage.removeItem('agentId');
      localStorage.removeItem('jurisdiction');
      
      toast({
        title: "Logged out",
        description: "You have been logged out of the system",
      });
      
      window.location.href = "/";
    }
  };

  const getUserDisplayInfo = () => {
    if (firstName && lastName) {
      return {
        name: `${firstName} ${lastName}`,
        initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
        role: userType === 'farmer' ? 'Farmer' : 
              userType === 'field_agent' ? 'Field Agent' : 
              'LACRA Officer'
      };
    }
    return {
      name: username || 'User',
      initials: username ? username.substring(0, 2).toUpperCase() : 'U',
      role: userType === 'farmer' ? 'Farmer' : 
            userType === 'field_agent' ? 'Field Agent' : 
            'LACRA Officer'
    };
  };

  const userDisplay = getUserDisplayInfo();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lacra-blue rounded-lg flex items-center justify-center">
                <Sprout className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral">AgriTrace360™</h1>
                <p className="text-sm text-gray-500">LACRA Regulatory Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-gray-600">System Online</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral">{userDisplay.name}</p>
                    <p className="text-xs text-gray-500">{userDisplay.role}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    userType === 'farmer' ? 'bg-green-600' :
                    userType === 'field_agent' ? 'bg-orange-600' :
                    'bg-lacra-blue'
                  }`}>
                    <span className="text-white text-sm font-medium">{userDisplay.initials}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>{userDisplay.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <span className="text-xs text-gray-500">{userDisplay.role}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
