import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Ship, 
  Home, 
  FileText, 
  Package, 
  Users, 
  MessageSquare, 
  Award,
  DollarSign,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings
} from 'lucide-react';
import lacraLogo from '@assets/LACRA LOGO_1753406166355.jpg';

interface ExporterNavbarProps {
  user?: any;
}

export default function ExporterNavbar({ user }: ExporterNavbarProps) {
  const [location] = useLocation();

  const navItems = [
    { href: '/exporter-dashboard', label: 'Dashboard', icon: Home },
    { href: '/exporter/orders', label: 'Orders', icon: Package, badge: '3' },
    { href: '/exporter/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { href: '/exporter/certificates', label: 'Certificates', icon: Award, badge: '2' },
    { href: '/exporter/messages', label: 'Messages', icon: MessageSquare, badge: '5' },
    { href: '/exporter/shipments', label: 'Shipments', icon: Truck },
    { href: '/exporter/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/exporter-payment-services', label: 'Payments', icon: DollarSign },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src={lacraLogo} 
                alt="LACRA Official Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Ship className="h-5 w-5 text-blue-600" />
                Exporter Portal
              </h1>
              <p className="text-xs text-gray-600">
                {user?.companyName || 'Demo Export Company Ltd.'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:block">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link href="/polipus" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Back to Polipus
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/auth/exporter-login';
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}