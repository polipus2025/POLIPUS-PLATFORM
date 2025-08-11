import { Bell, LogOut, User, Clock, Calendar, Waves, Sun, CloudRain, Cloud } from "lucide-react";
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
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

// Helper function to get user info for Blue Carbon 360
const getUserInfo = () => {
  const blueCarbon360User = localStorage.getItem('blue_carbon_360_user');
  if (blueCarbon360User) {
    try {
      const user = JSON.parse(blueCarbon360User);
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        position: user.position
      };
    } catch {
      return { username: 'marina.conserve', firstName: 'Marina', lastName: 'Conserve' };
    }
  }
  return { username: 'marina.conserve', firstName: 'Marina', lastName: 'Conserve' };
};

export default function BlueCarbon360Header() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Blue Carbon 360 specific alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ["/api/blue-carbon360/alerts"],
  });

  const unreadCount = alerts.length;
  const { username, firstName, lastName, organization, position } = getUserInfo();

  // Time, Date, and Weather State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    condition: 'sunny',
    temperature: '28°C',
    location: 'Monrovia Coastal Area'
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate weather updates
  useEffect(() => {
    const weatherConditions = [
      { condition: 'sunny', temperature: '28°C' },
      { condition: 'cloudy', temperature: '26°C' },
      { condition: 'partly-cloudy', temperature: '25°C' },
      { condition: 'rainy', temperature: '24°C' }
    ];
    
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

  const handleLogout = () => {
    // Clear Blue Carbon 360 specific storage
    localStorage.removeItem('blue_carbon_360_user');
    localStorage.removeItem('blue_carbon_360_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of Blue Carbon 360",
    });
    
    // Redirect to main portals page
    setLocation('/blue-carbon360');
  };

  return (
    <div className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Blue Carbon 360 Platform Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Waves className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Blue Carbon 360</h1>
          <p className="text-xs text-slate-600">Conservation Economics Platform</p>
        </div>
      </div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        
        {/* Weather and Time Display */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden md:flex items-center gap-x-2 text-sm text-slate-600">
            <WeatherIcon className="h-4 w-4" />
            <span>{weather.temperature}</span>
            <span>•</span>
            <Clock className="h-4 w-4" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          
          {/* Alerts */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 relative"
            onClick={() => {
              toast({
                title: "Conservation Alerts",
                description: `${unreadCount} new conservation updates available`,
              });
            }}
          >
            <span className="sr-only">View conservation alerts</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-cyan-600 text-white text-xs flex items-center justify-center p-0">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </button>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="-m-1.5 flex items-center p-1.5 hover:bg-cyan-50"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-slate-900" aria-hidden="true">
                    {firstName} {lastName}
                  </span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-slate-200">
                <p className="text-sm font-medium text-slate-900">{firstName} {lastName}</p>
                <p className="text-xs text-slate-600">{position || 'Marine Conservation Officer'}</p>
                <p className="text-xs text-slate-500">{organization || 'Ministry of Environment & Climate Change'}</p>
              </div>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Conservation Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout from Blue Carbon 360</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}