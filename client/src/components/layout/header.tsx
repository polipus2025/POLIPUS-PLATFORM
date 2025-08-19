import { Bell, Sprout, LogOut, User, Clock, Calendar, Cloud, Sun, CloudRain } from "lucide-react";
import agriTraceLogo from "@assets/IMG-20250724-WA0007_1753362990630.jpg";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";
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
import { useState, useEffect } from "react";

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

  // Time, Date, and Weather State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    condition: 'sunny',
    temperature: '28°C',
    location: 'Monrovia, Liberia'
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate weather updates (in a real app, this would fetch from a weather API)
  useEffect(() => {
    const weatherConditions = [
      { condition: 'sunny', temperature: '28°C', icon: Sun },
      { condition: 'cloudy', temperature: '26°C', icon: Cloud },
      { condition: 'partly-cloudy', temperature: '25°C', icon: Cloud },
      { condition: 'rainy', temperature: '24°C', icon: CloudRain }
    ];
    
    // Update weather every 5 minutes (simulated)
    const weatherTimer = setInterval(() => {
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      setWeather(prev => ({ ...prev, ...randomWeather }));
    }, 300000); // 5 minutes

    return () => clearInterval(weatherTimer);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return Sun;
      case 'rainy': return CloudRain;
      case 'cloudy':
      case 'partly-cloudy':
      default: return Cloud;
    }
  };

  const WeatherIcon = getWeatherIcon();

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
              userType === 'buyer' ? 'Agricultural Buyer' :
              userType === 'exporter' ? 'Licensed Exporter' :
              'LACRA Officer'
      };
    }
    return {
      name: username || 'User',
      initials: username ? username.substring(0, 2).toUpperCase() : 'U',
      role: userType === 'farmer' ? 'Farmer' : 
            userType === 'field_agent' ? 'Field Agent' :
            userType === 'buyer' ? 'Agricultural Buyer' :
            userType === 'exporter' ? 'Licensed Exporter' :
            'LACRA Officer'
    };
  };

  const userDisplay = getUserDisplayInfo();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full max-w-full overflow-x-hidden">
      <div className="px-2 sm:px-4 md:px-6 py-2 md:py-4 w-full max-w-full">
        <div className="flex justify-between items-center w-full max-w-full">
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-1 min-w-0 max-w-[60%] sm:max-w-[70%]">
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={lacraLogo} 
                  alt="LACRA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={agriTraceLogo} 
                  alt="AgriTrace360" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden hidden xs:block">
                <h1 className="text-xs sm:text-sm md:text-xl font-bold text-neutral truncate mobile-menu-item">AgriTrace360™</h1>
                <p className="text-xs text-gray-500 truncate mobile-menu-item hidden sm:block">LACRA Dashboard</p>
              </div>
            </div>
            
            {/* Time, Date, and Weather Widget */}
            <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 rounded-lg border border-blue-100">
              {/* Date and Time */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              </div>
              
              {/* Weather */}
              <div className="flex items-center space-x-2 border-l border-blue-200 pl-4">
                <WeatherIcon className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            {/* Mobile compact view */}
            <div className="lg:hidden flex items-center space-x-1 bg-gradient-to-r from-blue-50 to-green-50 px-1 sm:px-2 py-1 rounded border border-blue-100 flex-shrink-0 mobile-responsive-text">
              <Clock className="h-3 w-3 text-green-600 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-900 mobile-responsive-text">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
              <WeatherIcon className="h-3 w-3 text-orange-600 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-900 mobile-responsive-text">{weather.temperature}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 flex-shrink-0">            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 min-w-[16px] h-4 sm:h-5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-3 hover:bg-gray-50 p-1 sm:p-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs sm:text-sm font-medium text-neutral truncate mobile-menu-item">{userDisplay.name}</p>
                    <p className="text-xs text-gray-500 truncate mobile-menu-item">{userDisplay.role}</p>
                  </div>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    userType === 'farmer' ? 'bg-green-600' :
                    userType === 'field_agent' ? 'bg-orange-600' :
                    'bg-lacra-blue'
                  }`}>
                    <span className="text-white text-xs sm:text-sm font-medium">{userDisplay.initials}</span>
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
