import { useState, useEffect } from "react";
import { Bell, Map, LogOut, User, Clock, Calendar, Cloud, Sun, CloudRain, MapPin, Satellite } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// Helper function to get user info
const getUserInfo = () => {
  const token = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const county = localStorage.getItem('county');
  if (!token) return { role: null, userType: null, username: null };
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { 
      role: payload.role || userRole, 
      userType, 
      username: payload.username || userName,
      firstName: payload.firstName,
      lastName: payload.lastName,
      county
    };
  } catch {
    return { role: userRole, userType, username: userName, county };
  }
};

export default function LandMapHeader() {
  const { toast } = useToast();
  const { role, userType, username, firstName, lastName, county } = getUserInfo();

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

  // Simulate weather updates
  useEffect(() => {
    const weatherConditions = [
      { condition: 'sunny', temperature: '28°C', icon: Sun },
      { condition: 'cloudy', temperature: '26°C', icon: Cloud },
      { condition: 'partly-cloudy', temperature: '25°C', icon: Cloud },
      { condition: 'rainy', temperature: '24°C', icon: CloudRain }
    ];
    
    const weatherTimer = setInterval(() => {
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      setWeather(prev => ({ ...prev, ...randomWeather }));
    }, 300000); // 5 minutes

    return () => clearInterval(weatherTimer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-4 w-4 text-blue-500" />;
      default: return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all auth data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userType");
      localStorage.removeItem("userName");
      localStorage.removeItem("county");
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out of LandMap360",
      });
      
      // Redirect to login
      window.location.href = "/landmap360-login";
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      "surveyor": "Land Surveyor",
      "administrator": "Land Administrator", 
      "registrar": "Land Registrar",
      "inspector": "Land Inspector",
      "analyst": "GIS Analyst",
      "manager": "Land Manager"
    };
    return roleMap[role] || role;
  };

  return (
    <div className="bg-white shadow-sm border-b border-slate-200 px-4 sm:px-6" style={{ height: '80px' }}>
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <img
                src={lacraLogo}
                alt="LACRA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
              <Map className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">LandMap360</h1>
            <p className="text-sm text-slate-600">Land Management System</p>
          </div>
        </div>

        {/* Center Section - Time and Weather */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Clock className="h-6 w-6 text-emerald-600" />
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              {formatDate(currentTime)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              {getWeatherIcon()}
              {weather.temperature}
            </div>
            <div className="text-xs text-slate-600">
              {weather.location}
            </div>
          </div>
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            data-testid="notifications-button"
          >
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {firstName && lastName ? `${firstName} ${lastName}` : username}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                  {getRoleDisplay(role || "")}
                </Badge>
                {county && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500">{county}</span>
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full bg-emerald-100 hover:bg-emerald-200"
                  data-testid="user-menu-button"
                >
                  <User className="h-4 w-4 text-emerald-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {firstName && lastName ? `${firstName} ${lastName}` : username}
                  </p>
                  <p className="text-xs leading-none text-slate-600">
                    {getRoleDisplay(role || "")}
                  </p>
                  {county && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <p className="text-xs text-slate-500">{county}</p>
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}