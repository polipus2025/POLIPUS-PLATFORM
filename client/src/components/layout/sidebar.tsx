import { Link, useLocation } from "wouter";
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
  RefreshCw,
  Award,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

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

// LACRA Officer/Regulatory Staff Navigation
const regulatoryNavigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Commodities", href: "/commodities", icon: Leaf },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Export Certifications", href: "/certifications", icon: Tag },
  { name: "Document Verification", href: "/verification", icon: Shield },
  { name: "Real-Time Verification", href: "/verification-dashboard", icon: Award },
  { name: "Enhanced GIS Mapping", href: "/enhanced-gis-mapping", icon: Satellite },
  { name: "Government Integration", href: "/government-integration", icon: Building2 },
  { name: "International Standards", href: "/international-standards", icon: Globe },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Data Entry", href: "/data-entry", icon: Plus },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
  { name: "Offline Sync", href: "/offline-sync", icon: RefreshCw },
];

// Farmer Navigation - Only farm management features
const farmerNavigation = [
  { name: "Farm Dashboard", href: "/", icon: BarChart3 },
  { name: "My Farm Plots", href: "/farm-plots", icon: MapPin },
  { name: "GPS Farm Mapping", href: "/gps-mapping", icon: Satellite },
  { name: "Enhanced GIS Mapping", href: "/enhanced-gis-mapping", icon: Satellite },
  { name: "Crop Planning", href: "/crop-planning", icon: Calendar },
  { name: "Batch Code Generator", href: "/batch-code-generator", icon: QrCode },
  { name: "Document Verification", href: "/verification", icon: Shield },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
  { name: "Offline Sync", href: "/offline-sync", icon: RefreshCw },
];

// Field Agent Navigation - Territory-limited inspection and verification
const fieldAgentNavigation = [
  { name: "Field Operations", href: "/", icon: BarChart3 },
  { name: "Territory Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Farmer Registration", href: "/farmers", icon: Users },
  { name: "GPS Territory Mapping", href: "/gps-mapping", icon: Satellite },
  { name: "Document Verification", href: "/verification", icon: Shield },
  { name: "Real-Time Verification", href: "/verification-dashboard", icon: Award },
  { name: "Mobile Data Entry", href: "/data-entry", icon: Plus },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
  { name: "Offline Sync", href: "/offline-sync", icon: RefreshCw },
];

// Exporter Navigation - Only exporter-LACRA interaction features
const exporterNavigation = [
  { name: "Export Dashboard", href: "/exporter-dashboard", icon: BarChart3 },
  { name: "Export License Management", href: "/export-license", icon: Award },
  { name: "Document Verification", href: "/verification", icon: Shield },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare },
];

// Function to get navigation items based on user type and role
const getNavigationItems = (userType: string | null, role: string | null) => {
  switch (userType) {
    case 'regulatory':
      return regulatoryNavigation;
    case 'farmer':
      return farmerNavigation;
    case 'field_agent':
      return fieldAgentNavigation;
    case 'exporter':
      return exporterNavigation;
    default:
      return regulatoryNavigation; // Default fallback
  }
};

export default function Sidebar() {
  const [location] = useLocation();
  const { role, userType } = getUserInfo();

  // Get the appropriate navigation items based on user type
  const navigationItems = getNavigationItems(userType, role);

  return (
    <aside className="w-64 bg-white shadow-lg h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto shrink-0">
      <nav className="p-6">
        {/* Main Navigation Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {userType === 'farmer' ? 'Farm Management' : 
             userType === 'field_agent' ? 'Field Operations' : 
             userType === 'exporter' ? 'Export Operations' :
             'Regulatory Compliance'}
          </h3>
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link href={item.href} className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                    isActive
                      ? userType === 'farmer' 
                        ? "text-green-700 bg-green-50"
                        : userType === 'field_agent'
                        ? "text-orange-700 bg-orange-50"
                        : userType === 'exporter'
                        ? "text-purple-700 bg-purple-50"
                        : "text-lacra-blue bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  )}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
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