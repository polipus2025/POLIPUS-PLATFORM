import { memo, ReactNode } from 'react';
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
  User
} from 'lucide-react';
import lacraLogo from '@assets/LACRA LOGO_1753406166355.jpg';

interface CleanExporterLayoutProps {
  children: ReactNode;
  user?: any;
}

const CleanExporterLayout = memo(({ children, user }: CleanExporterLayoutProps) => {
  const [location] = useLocation();

  const sidebarItems = [
    { href: '/exporter-dashboard', label: 'Dashboard', icon: Home, description: 'Overview & metrics' },
    { href: '/world-market-pricing', label: 'World Market', icon: DollarSign, description: 'Live commodity prices' },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        {/* SINGLE SIDEBAR NAVIGATION - NO DUPLICATES */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 z-50">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src={lacraLogo} 
                  alt="LACRA Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Exporter Portal</h1>
                <p className="text-xs text-gray-600">AgriTrace360™</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.companyName || 'Demo Export Company'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  ID: {user?.exporterId || 'EXP-DEMO-001'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/api/logout'}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* MAIN CONTENT AREA - ONLY ONE */}
        <div className="flex-1 ml-64">
          {children}
        </div>
      </div>
    </div>
  );
});

CleanExporterLayout.displayName = 'CleanExporterLayout';
export default CleanExporterLayout;