import { memo, ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  Ship, 
  BarChart3, 
  CreditCard,
  DollarSign,
  LogOut,
  User,
  Clock,
  Calendar,
  Sun,
  Cloud,
  CloudRain,
  Bell,
  Store
} from 'lucide-react';
import lacraLogo from '@assets/LACRA LOGO_1753406166355.jpg';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';
import ProfileDropdown from "@/components/ProfileDropdown";

interface CleanExporterLayoutProps {
  children: ReactNode;
  user?: any;
}

const CleanExporterLayout = memo(({ children, user }: CleanExporterLayoutProps) => {
  const [location, setLocation] = useLocation();
  
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

  const sidebarItems = [
    { href: '/exporter-dashboard', label: 'Dashboard', icon: Home, description: 'Overview & metrics' },
    { href: '/world-market-pricing', label: 'World Market', icon: DollarSign, description: 'Live commodity prices' },
    { href: '/sellers-hub', label: 'Sellers Hub', icon: Store, badge: 'NEW', description: 'Browse buyer offers' },
    { href: '/exporter/orders', label: 'Orders', icon: Package, badge: '3', description: 'Manage export orders' },
    { href: '/exporter/marketplace', label: 'Marketplace', icon: ShoppingCart, description: 'Connect with buyers' },
    { href: '/exporter/certificates', label: 'Certificates', icon: FileText, badge: '2', description: 'Export documents' },
    { href: '/exporter/messages', label: 'Messages', icon: MessageSquare, badge: '5', description: 'Secure communication' },
    { href: '/exporter/shipments', label: 'Shipments', icon: Ship, description: 'Track deliveries' },
    { href: '/exporter/analytics', label: 'Analytics', icon: BarChart3, description: 'Business insights' },
    { href: '/exporter-payment-services', label: 'Payments', icon: CreditCard, description: 'Payment services' },
  ];

  const isActiveRoute = (href: string) => {
    return location === href || (href !== '/exporter-dashboard' && location.startsWith(href));
  };

  const handleLogout = async () => {
    try {
      // Show loading state briefly
      const button = document.querySelector('button');
      if (button) button.textContent = 'Logging out...';
      
      // Clear any local storage data first
      localStorage.removeItem('exporter_token');
      localStorage.removeItem('exporter_data');
      localStorage.removeItem('exporter_session');
      
      // Attempt to call logout endpoint
      await fetch('/api/auth/exporter/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      }).catch(() => {
        // Ignore errors, we'll redirect anyway
      });
      
      // Always redirect to login page regardless of API response
      window.location.href = '/exporter-login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect to login
      window.location.href = '/exporter-login';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* TOP HEADER WITH TIME, CLOCK, AND WEATHER */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* LEFT: LOGOS AND TITLE */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded overflow-hidden">
                  <img 
                    src={lacraLogo} 
                    alt="LACRA" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded overflow-hidden">
                  <img 
                    src={agriTraceLogo} 
                    alt="AgriTrace360" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Exporter Portal</h1>
                  <p className="text-xs text-gray-600">AgriTrace360™</p>
                </div>
              </div>
            </div>
            
            {/* CENTER: TIME, DATE, AND WEATHER */}
            <div className="flex items-center space-x-6 bg-gradient-to-r from-blue-50 to-green-50 px-6 py-3 rounded-lg border border-blue-100">
              {/* Date and Time */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">
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
              <div className="flex items-center space-x-3 border-l border-blue-200 pl-4">
                <WeatherIcon className="h-5 w-5 text-orange-600" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            {/* RIGHT: USER INFO AND NOTIFICATIONS */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-400" />
                <Badge variant="destructive" className="text-xs">3</Badge>
              </div>
              
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.location.href = '/exporter-login'}>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{user?.companyName || 'Loading...'}</p>
                  <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">Licensed Exporter • Click to Login Portal</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* SINGLE SIDEBAR NAVIGATION - NO DUPLICATES */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-16 z-40">

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto pt-8">
            {sidebarItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}>
                    <Icon className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge className="ml-2 bg-red-100 text-red-800 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <ProfileDropdown
              userName={user?.companyName || user?.username || "Exporter User"}
              userEmail={user?.email || "exporter@company.co"}
              userType="exporter"
              userId={user?.exporterId || user?.id}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* MAIN CONTENT AREA - ONLY ONE */}
        <div className="flex-1 ml-64 pt-16">
          {children}
        </div>
      </div>
    </div>
  );
});

CleanExporterLayout.displayName = 'CleanExporterLayout';
export default CleanExporterLayout;