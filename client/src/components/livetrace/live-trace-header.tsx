import { useState, useEffect } from "react";
import { Calendar, Clock, Cloud, Sun, CloudRain, Bell, User, Settings, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
// LiveTrace uses its own branding, independent from AgriTrace

export default function LiveTraceHeader() {
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

  // Get user info from localStorage
  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "";
  const userRole = localStorage.getItem("userRole") || "Staff";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
          
          {/* LiveTrace Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LiveTrace</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Livestock Monitoring System</p>
              </div>
            </div>
          </div>

          {/* Time, Date, and Weather Widget */}
          <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-2 rounded-lg border border-orange-100">
            {/* Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-600" />
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
            
            {/* Time */}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
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
            <div className="flex items-center space-x-2 border-l border-orange-200 pl-4">
              <WeatherIcon className="h-4 w-4 text-red-600" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {weather.temperature}
                </div>
                <div className="text-xs text-gray-600">
                  {weather.location}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center gap-4">
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-medium">
                    {firstName.charAt(0)}{lastName.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{firstName} {lastName}</div>
                    <div className="text-xs text-gray-500">{userRole}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}