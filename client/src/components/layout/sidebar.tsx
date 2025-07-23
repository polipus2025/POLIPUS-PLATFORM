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
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper function to check user role
const getUserRole = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
};

// Base navigation items
const baseNavigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Commodities", href: "/commodities", icon: Leaf },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Export Certifications", href: "/certifications", icon: Tag },
  { name: "Document Verification", href: "/verification", icon: Shield },
  { name: "Government Integration", href: "/government-integration", icon: Building2 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Data Entry", href: "/data-entry", icon: Plus },
];

// Admin/Staff only navigation items
const adminStaffNavigation = [
  { name: "International Standards", href: "/international-standards", icon: Globe },
];

// Function to get navigation items based on user role
const getNavigationItems = (userRole: string | null) => {
  const navigation = [...baseNavigation];
  
  // Add admin/staff only items for authorized users
  if (userRole === 'regulatory_admin' || userRole === 'regulatory_staff') {
    // Insert International Standards before Reports
    const reportsIndex = navigation.findIndex(item => item.name === "Reports");
    navigation.splice(reportsIndex, 0, ...adminStaffNavigation);
  }
  
  return navigation;
};

const farmManagementNavigation = [
  { name: "Farmer Onboarding", href: "/farmers", icon: Users },
  { name: "Farm Plot Mapping", href: "/farm-plots", icon: MapPin },
  { name: "GPS Farm Mapping", href: "/gps-mapping", icon: Satellite },
  { name: "Batch Code Generator", href: "/batch-code-generator", icon: QrCode },
  { name: "Certificate Verification", href: "/verification", icon: Shield },
  { name: "Crop Planning", href: "/crop-planning", icon: Calendar },
];

export default function Sidebar() {
  const [location] = useLocation();
  const userRole = getUserRole();

  return (
    <aside className="w-64 bg-white shadow-lg h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <nav className="p-6">
        {/* Regulatory Compliance Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Regulatory Compliance
          </h3>
          <ul className="space-y-2">
            {getNavigationItems(userRole).map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                        isActive
                          ? "text-lacra-blue bg-blue-50"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Farm Management Platform Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Farm Management Platform
          </h3>
          <ul className="space-y-2">
            {farmManagementNavigation.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                        isActive
                          ? "text-lacra-green bg-green-50"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
