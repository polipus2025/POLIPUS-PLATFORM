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
import { SyncStatusIndicator } from "@/components/sync/sync-status-indicator";
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
    <header className="isms-gradient shadow-lg border-b border-slate-200/50 sticky top-0 z-50 w-full max-w-full overflow-x-hidden">
      <div className="px-2 sm:px-4 md:px-6 py-3 md:py-5 w-full max-w-full">
        <div className="flex justify-between items-center w-full max-w-full">
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-1 min-w-0 max-w-[70%]">
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 max-w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/50">
                <img 
                  src={lacraLogo} 
                  alt="LACRA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/50">
                <img 
                  src={agriTraceLogo} 
                  alt="AgriTrace360" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-white truncate">AgriTrace360™</h1>
                <p className="text-xs sm:text-sm text-slate-200 truncate">LACRA Dashboard</p>
              </div>
            </div>
            
            {/* Time, Date, and Weather Widget - ISMS Style */}
            <div className="hidden lg:flex items-center space-x-4 isms-card bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20 shadow-lg">
              {/* Date */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-slate-500">Today</div>
                </div>
              </div>
              
              {/* Time */}
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl isms-icon-bg-green flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </div>
                  <div className="text-xs text-slate-500">Local Time</div>
                </div>
              </div>
              
              {/* Weather */}
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl isms-icon-bg-orange flex items-center justify-center">
                  <WeatherIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{weather.temperature}</div>
                  <div className="text-xs text-slate-500">{weather.location}</div>
                </div>
              </div>
            </div>
            
            {/* Mobile compact view - ISMS Style */}
            <div className="lg:hidden flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/30 shadow-md flex-shrink-0">
              <div className="w-6 h-6 rounded-lg isms-icon-bg-green flex items-center justify-center">
                <Clock className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
              <div className="w-6 h-6 rounded-lg isms-icon-bg-orange flex items-center justify-center">
                <WeatherIcon className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-800">{weather.temperature}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sync Status Indicator */}
            <SyncStatusIndicator />
            
            {/* Notifications - ISMS Style */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer">
                <Bell className="h-5 w-5 text-white" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>
            
            {/* User Profile - ISMS Style */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all px-3 py-2 rounded-xl">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-white">{userDisplay.name}</p>
                    <p className="text-xs text-slate-200">{userDisplay.role}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    userType === 'farmer' ? 'isms-icon-bg-green' :
                    userType === 'field_agent' ? 'isms-icon-bg-orange' :
                    'isms-icon-bg-blue'
                  }`}>
                    <span className="text-white text-sm font-bold">{userDisplay.initials}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 isms-card border-0 shadow-xl">
                <DropdownMenuItem disabled className="cursor-default">
                  <User className="mr-3 h-5 w-5 text-slate-600" />
                  <span className="font-semibold text-slate-800">{userDisplay.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="cursor-default">
                  <div className="ml-8">
                    <span className="text-sm text-slate-600">{userDisplay.role}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50">
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
