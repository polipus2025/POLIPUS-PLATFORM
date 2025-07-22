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
  Package,
  Building2,
  Satellite
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Commodities", href: "/commodities", icon: Leaf },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Export Certifications", href: "/certifications", icon: Tag },
  { name: "Government Integration", href: "/government-integration", icon: Building2 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Data Entry", href: "/data-entry", icon: Plus },
];

const farmManagementNavigation = [
  { name: "Farmer Onboarding", href: "/farmers", icon: Users },
  { name: "Farm Plot Mapping", href: "/farm-plots", icon: MapPin },
  { name: "GPS Farm Mapping", href: "/gps-mapping", icon: Satellite },
  { name: "Crop Planning", href: "/crop-planning", icon: Calendar },
  { name: "Input Management", href: "/input-management", icon: Package },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <nav className="p-6">
        {/* Regulatory Compliance Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Regulatory Compliance
          </h3>
          <ul className="space-y-2">
            {navigation.map((item) => {
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
