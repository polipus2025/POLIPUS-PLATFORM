import { Link, useLocation } from "wouter";
import { useState, useMemo, useCallback } from "react";
import { 
  BarChart3, 
  Leaf, 
  MapPin, 
  ClipboardCheck, 
  Tag, 
  FileText, 
  Plus, 
  Users,
  Calendar,
  Building2,
  Satellite,
  Shield,
  QrCode,
  Globe,
  Map,
  Smartphone,
  Award,
  MessageSquare,
  TrendingUp,
  DollarSign,
  UserPlus,
  Eye,
  Receipt,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Helper function to check user role and type
const getUserInfo = () => {
  const token = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');
  const userRole = localStorage.getItem('userRole');
  if (!token) return { role: null, userType: null, userRole: null };
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { role: payload.role || userRole, userType, userRole };
  } catch {
    return { role: userRole, userType, userRole };
  }
};

// DG (Director General) Navigation - Strategic oversight and final approvals
const dgNavigation = [
  { name: "Strategic Dashboard", href: "/dg-dashboard", icon: BarChart3 },
  { name: "Portal Oversight", href: "/dg-portal-oversight", icon: Eye },
  { name: "Final Approvals", href: "/dg-final-approvals", icon: Award },
  { name: "Strategic Reports", href: "/dg-strategic-reports", icon: FileText },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
];

// DDGOTS (Deputy Director General Operations & Technical Services) Navigation
const ddgotsNavigation = [
  { name: "DDGOTS Dashboard", href: "/ddgots-dashboard", icon: BarChart3 },
  { name: "Inspector Management", href: "/regulatory/inspector-management", icon: Users },
  { name: "Buyer Management", href: "/regulatory/buyer-management", icon: UserPlus },
  { name: "Exporter Management", href: "/regulatory/exporter-management", icon: Building2 },
  { name: "Farmer Oversight", href: "/ddgots-farmer-oversight", icon: Leaf },
  { name: "Technical Compliance", href: "/ddgots-technical-compliance", icon: ClipboardCheck },
  { name: "Operations Reports", href: "/ddgots-operations-reports", icon: FileText },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
];

// DDGAF (Deputy Director General Administration & Finance) Navigation
const ddgafNavigation = [
  { name: "DDGAF Dashboard", href: "/ddgaf-dashboard", icon: BarChart3 },
  { name: "Payment Validation", href: "/ddgaf-payment-validation", icon: DollarSign },
  { name: "Financial Records", href: "/ddgaf-financial-records", icon: Receipt },
  { name: "Account Management", href: "/ddgaf-account-management", icon: CreditCard },
  { name: "Financial Reports", href: "/ddgaf-financial-reports", icon: FileText },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
];

// Legacy LACRA Officer/Regulatory Staff Navigation (for backward compatibility)
const regulatoryNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Economic Reporting", href: "/economic-reporting", icon: TrendingUp },
  { name: "Commodities", href: "/commodities", icon: Leaf },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Inspector Management", href: "/regulatory/inspector-management", icon: Users },
  { name: "Buyer Management", href: "/regulatory/buyer-management", icon: UserPlus },
  { name: "Exporter Management", href: "/regulatory/exporter-management", icon: Building2 },
  { name: "Export Certifications", href: "/certifications", icon: Tag },
  { name: "Document Verification", href: "/verification", icon: Shield },
  { name: "Real-Time Verification", href: "/verification-dashboard", icon: Award },
  { name: "Payment Services", href: "/regulatory-payment-services", icon: DollarSign },
  { name: "GIS Mapping", href: "/gis-mapping", icon: Satellite },
  { name: "Government Integration", href: "/government-integration", icon: Building2 },
  { name: "International Standards", href: "/international-standards", icon: Globe },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Data Entry", href: "/data-entry", icon: Plus },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
];

// Farmer Navigation - Only farm management features (GIS, Crop Planning, and Internal Messaging restricted to LACRA only)
const farmerNavigation = [
  { name: "Farm Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "My Farm Plots", href: "/farm-plots", icon: MapPin },
  { name: "Batch Code Generator", href: "/batch-code-generator", icon: QrCode },
  { name: "Document Verification", href: "/verification", icon: Shield },
];

// Field Agent Navigation - Territory-limited inspection and verification (GIS restricted to LACRA only)
const fieldAgentNavigation = [
  { name: "Field Operations", href: "/dashboard", icon: BarChart3 },
  { name: "Territory Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Farmer Registration", href: "/farmers", icon: Users },
  { name: "Document Verification", href: "/verification", icon: Shield },
  { name: "Real-Time Verification", href: "/verification-dashboard", icon: Award },
  { name: "Mobile Data Entry", href: "/data-entry", icon: Plus },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
];

// Exporter Navigation - Only exporter-LACRA interaction features
const exporterNavigation = [
  { name: "Export Dashboard", href: "/exporter-dashboard", icon: BarChart3 },
  { name: "Export License Management", href: "/export-license", icon: Award },
  { name: "Document Verification", href: "/verification", icon: Shield },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
];

// Agricultural Buyer Navigation - Commerce-focused for agricultural trade
const buyerNavigation = [
  { name: "Business Overview", href: "/agricultural-buyer-dashboard", icon: BarChart3 },
  { name: "Farmer Connections", href: "/agricultural-buyer-dashboard?tab=farmers", icon: Leaf },
  { name: "Exporter Network", href: "/agricultural-buyer-dashboard?tab=exporters", icon: Building2 },
  { name: "Transaction Dashboard", href: "/buyer-transaction-dashboard", icon: DollarSign },
  { name: "Available Harvests", href: "/buyer-harvests", icon: Calendar },
  { name: "Business Metrics", href: "/buyer-metrics", icon: TrendingUp },
];

// Land Inspector Navigation - Land management and farmer registration
const landInspectorNavigation = [
  { name: "Inspector Dashboard", href: "/landmap360/inspector-dashboard", icon: BarChart3 },
  { name: "Farmer Registration", href: "/farmers", icon: Users },
  { name: "GPS Mapping", href: "/farmer-gps-mapping", icon: Map },
  { name: "Farm Inspections", href: "/livetrace/farm-registrations", icon: ClipboardCheck },
  { name: "Land Parcels", href: "/landmap360/parcels", icon: MapPin },
  { name: "GIS Analysis", href: "/landmap360/gis-mapping", icon: Satellite },
  { name: "Compliance Monitoring", href: "/landmap360/compliance", icon: Shield },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
];

// Memoized function to get navigation items based on user type and role
const getNavigationItems = (userType: string | null, role: string | null) => {
  // Check for three-tier regulatory system first
  const ddgotsToken = localStorage.getItem('ddgotsToken');
  const dgToken = localStorage.getItem('dgToken');
  const ddgafToken = localStorage.getItem('ddgafToken');

  if (ddgotsToken) {
    return ddgotsNavigation;
  }
  if (dgToken) {
    return dgNavigation;
  }
  if (ddgafToken) {
    return ddgafNavigation;
  }

  // Legacy user type switching
  switch (userType) {
    case 'regulatory':
      return regulatoryNavigation;
    case 'farmer':
      return farmerNavigation;
    case 'field_agent':
      return fieldAgentNavigation;
    case 'buyer':
      return buyerNavigation;
    case 'exporter':
      return exporterNavigation;
    case 'land_inspector':
      return landInspectorNavigation;
    default:
      return regulatoryNavigation; // Default fallback
  }
};

export default function Sidebar() {
  const [location] = useLocation();
  const { role, userType } = getUserInfo();
  
  // Get current user ID for messaging notifications
  const [currentUserId] = useState(() => 
    localStorage.getItem("username") || 
    localStorage.getItem("agentId") || 
    localStorage.getItem("farmerId") || 
    localStorage.getItem("exporterId") || 
    "admin001"
  );

  // Fetch unread message count - optimized for performance
  const { data: unreadData } = useQuery({
    queryKey: ["/api/messages", currentUserId, "unread-count"],
    queryFn: () => apiRequest(`/api/messages/${currentUserId}/unread-count`),
    refetchInterval: 60000, // Check every 60 seconds to reduce load
    staleTime: 50000, // Consider data fresh for 50 seconds
    enabled: !!currentUserId, // Only fetch if user ID exists
  });

  const unreadCount = unreadData?.count || 0;

  // Memoize navigation items to prevent unnecessary recalculations
  const navigationItems = useMemo(() => getNavigationItems(userType, role), [userType, role]);
  
  // Navigation handler - use proper routing instead of window.location
  const handleNavigation = useCallback((href: string) => {
    // Use wouter's programmatic navigation instead of full page reload
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  return (
    <aside className="hidden lg:block w-64 bg-white shadow-lg h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto shrink-0">
      <nav className="p-4 lg:p-6">
        {/* Main Navigation Section */}
        <div className="mb-6 lg:mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {localStorage.getItem('ddgotsToken') ? 'DDGOTS OPERATIONS' :
             localStorage.getItem('dgToken') ? 'DG STRATEGIC OVERSIGHT' :
             localStorage.getItem('ddgafToken') ? 'DDGAF ADMINISTRATION' :
             userType === 'farmer' ? 'Farm Management' : 
             userType === 'field_agent' ? 'Field Operations' : 
             userType === 'buyer' ? 'Agricultural Buyer Portal' :
             userType === 'exporter' ? 'Export Operations' :
             userType === 'land_inspector' ? 'Land Inspector Portal' :
             'Regulatory Compliance'}
          </h3>
          <ul className="space-y-1 lg:space-y-2">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium transition-colors relative text-sm lg:text-base cursor-pointer hover:cursor-pointer w-full text-left",
                      isActive
                        ? userType === 'farmer' 
                          ? "text-green-700 bg-green-50"
                          : userType === 'field_agent'
                          ? "text-orange-700 bg-orange-50"
                          : userType === 'buyer'
                          ? "text-blue-700 bg-blue-50"
                          : userType === 'exporter'
                          ? "text-purple-700 bg-purple-50"
                          : "text-lacra-blue bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50"
                    )}>
                    <item.icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                    {/* Show blinking red notification for Internal Messaging */}
                    {item.name === "Internal Messaging" && unreadCount > 0 && (
                      <div className="ml-auto flex items-center space-x-1">
                        <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full blink-red"></div>
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-1 lg:px-2 py-1 rounded-full animate-pulse">
                          {unreadCount}
                        </span>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Role Information */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Role</div>
          <div className="text-sm font-medium text-gray-700">
            {userType === 'farmer' ? 'Farmer' : 
             userType === 'field_agent' ? 'Field Agent' : 
             userType === 'buyer' ? 'Agricultural Buyer' :
             userType === 'exporter' ? 'Licensed Exporter' :
             'LACRA Officer'}
          </div>
          {role && (
            <div className="text-xs text-gray-500 mt-1 capitalize">
              {role.replace('_', ' ')}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}