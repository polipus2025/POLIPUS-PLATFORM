import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Map,
  BarChart3,
  MapPin,
  Ruler,
  FileText,
  Search,
  AlertTriangle,
  Shield,
  Users,
  Settings,
  Calendar,
  Camera,
  Globe,
  Layers,
  Navigation,
  Building,
  TreePine,
  Home,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Helper function to get user role
const getUserRole = () => {
  const userRole = localStorage.getItem('userRole');
  return userRole || 'surveyor';
};

// Navigation items based on user roles
const getNavigationItems = (role: string) => {
  const baseItems = [
    { name: "Dashboard", href: "/landmap360/main-dashboard", icon: BarChart3 },
    { name: "Land Parcels", href: "/landmap360/parcels", icon: Map },
    { name: "GIS Mapping", href: "/landmap360/gis-mapping", icon: Globe },
    { name: "Survey Records", href: "/landmap360/surveys", icon: Ruler },
  ];

  const roleSpecificItems: { [key: string]: any[] } = {
    surveyor: [
      { name: "Field Surveys", href: "/landmap360/field-surveys", icon: Navigation },
      { name: "GPS Data", href: "/landmap360/gps-data", icon: MapPin },
      { name: "Measurement Tools", href: "/landmap360/measurement", icon: Ruler },
    ],
    administrator: [
      { name: "Land Registration", href: "/landmap360/registration", icon: FileText },
      { name: "Property Records", href: "/landmap360/property-records", icon: Building },
      { name: "User Management", href: "/landmap360/users", icon: Users },
      { name: "System Settings", href: "/landmap360/settings", icon: Settings },
    ],
    registrar: [
      { name: "Title Registration", href: "/landmap360/titles", icon: FileText },
      { name: "Document Verification", href: "/landmap360/verification", icon: Shield },
      { name: "Property Search", href: "/landmap360/search", icon: Search },
    ],
    inspector: [
      { name: "Inspections", href: "/landmap360/inspections", icon: Search },
      { name: "Compliance Checks", href: "/landmap360/compliance", icon: Shield },
      { name: "Violation Reports", href: "/landmap360/violations", icon: AlertTriangle },
    ],
    analyst: [
      { name: "Spatial Analysis", href: "/landmap360/analysis", icon: Layers },
      { name: "Land Use Planning", href: "/landmap360/planning", icon: TreePine },
      { name: "Reports & Analytics", href: "/landmap360/analytics", icon: BarChart3 },
    ],
    manager: [
      { name: "Project Management", href: "/landmap360/projects", icon: Calendar },
      { name: "Team Oversight", href: "/landmap360/oversight", icon: Users },
      { name: "Performance Reports", href: "/landmap360/performance", icon: FileText },
    ],
  };

  const commonItems = [
    { name: "Dispute Management", href: "/landmap360/disputes", icon: AlertTriangle },
    { name: "Land Documentation", href: "/landmap360/documents", icon: FileText },
    { name: "Aerial Imagery", href: "/landmap360/imagery", icon: Camera },
  ];

  return [...baseItems, ...(roleSpecificItems[role] || []), ...commonItems];
};

export default function LandMapSidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userRole = getUserRole();
  const navigationItems = getNavigationItems(userRole);

  return (
    <div 
      className={cn(
        "bg-white shadow-lg h-screen fixed left-0 top-0 z-40 border-r border-slate-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{ top: '80px', height: 'calc(100vh - 80px)' }}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-2 border-b border-slate-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-emerald-100 text-emerald-900 shadow-sm border border-emerald-200" 
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                    isCollapsed && "justify-center px-2"
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-emerald-700" : "text-slate-500"
                  )} />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {!isCollapsed && isActive && (
                    <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="px-3 pt-6 border-t border-slate-200 mt-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                data-testid="quick-add-parcel"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Add New Parcel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                data-testid="quick-start-survey"
              >
                <Ruler className="h-4 w-4 mr-2" />
                Start Survey
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                data-testid="quick-generate-report"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        )}

        {/* System Status */}
        {!isCollapsed && (
          <div className="px-3 pt-6 border-t border-slate-200 mt-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              System Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">GPS Accuracy</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  High
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Satellite Coverage</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Optimal
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Data Sync</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Syncing
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isCollapsed && (
          <div className="px-3 pt-6 pb-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">
                LandMap360 v2.1.0
              </p>
              <p className="text-xs text-slate-400">
                Professional Land Management
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}