import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Heart, 
  Truck, 
  Activity, 
  Users, 
  MapPin, 
  Calendar,
  Thermometer,
  Stethoscope,
  Shield,
  Navigation,
  Camera,
  FileText,
  Route,
  Package,
  Plus,
  Search,
  Bell,
  Settings,
  Database,
  TrendingUp,
  Eye,
  Clipboard,
  Syringe,
  FlaskConical,
  Scan,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

// Veterinary/Animal Health Specialist Navigation
const veterinaryNavigation = [
  { name: "Dashboard", href: "/livetrace/dashboard", icon: BarChart3 },
  { name: "Health Monitoring", href: "/livetrace/health-monitoring", icon: Heart },
  { name: "Disease Tracking", href: "/livetrace/disease-tracking", icon: Activity },
  { name: "Vaccination Records", href: "/livetrace/vaccination-records", icon: Syringe },
  { name: "Treatment Plans", href: "/livetrace/treatment-plans", icon: Stethoscope },
  { name: "Lab Results", href: "/livetrace/lab-results", icon: FlaskConical },
  { name: "Animal Registry", href: "/livetrace/animal-registry", icon: Users },
  { name: "Health Inspections", href: "/livetrace/health-inspections", icon: Clipboard },
  { name: "Emergency Response", href: "/livetrace/emergency-response", icon: Shield },
  { name: "Reports & Analytics", href: "/livetrace/reports", icon: FileText },
  { name: "Internal Messaging", href: "/livetrace/messaging", icon: MessageSquare },
];

// Rancher/Farm Owner Navigation
const rancherNavigation = [
  { name: "Farm Dashboard", href: "/livetrace/dashboard", icon: BarChart3 },
  { name: "My Livestock", href: "/livetrace/my-livestock", icon: Users },
  { name: "Health Records", href: "/livetrace/health-records", icon: Heart },
  { name: "Vaccination Schedule", href: "/livetrace/vaccination-schedule", icon: Calendar },
  { name: "Feed Management", href: "/livetrace/feed-management", icon: Package },
  { name: "Breeding Records", href: "/livetrace/breeding-records", icon: Database },
  { name: "GPS Tracking", href: "/livetrace/gps-tracking", icon: MapPin },
  { name: "Farm Reports", href: "/livetrace/farm-reports", icon: FileText },
  { name: "QR Code Scanner", href: "/livetrace/qr-scanner", icon: Scan },
];

// Field Agent Navigation
const fieldAgentNavigation = [
  { name: "Field Operations", href: "/livetrace/dashboard", icon: BarChart3 },
  { name: "Farm Inspections", href: "/livetrace/farm-inspections", icon: Clipboard },
  { name: "Mobile Data Entry", href: "/livetrace/mobile-data-entry", icon: Plus },
  { name: "GPS Farm Mapping", href: "/livetrace/gps-mapping", icon: MapPin },
  { name: "Animal Tagging", href: "/livetrace/animal-tagging", icon: Package },
  { name: "Photo Documentation", href: "/livetrace/photo-docs", icon: Camera },
  { name: "Health Assessments", href: "/livetrace/health-assessments", icon: Heart },
  { name: "Field Reports", href: "/livetrace/field-reports", icon: FileText },
  { name: "Emergency Alerts", href: "/livetrace/emergency-alerts", icon: Bell },
];

// Transport Coordinator Navigation
const transportNavigation = [
  { name: "Transport Dashboard", href: "/livetrace/dashboard", icon: BarChart3 },
  { name: "Live Tracking", href: "/livetrace/live-tracking", icon: Navigation },
  { name: "Route Planning", href: "/livetrace/route-planning", icon: Route },
  { name: "Vehicle Management", href: "/livetrace/vehicle-management", icon: Truck },
  { name: "Shipment Scheduling", href: "/livetrace/shipment-scheduling", icon: Calendar },
  { name: "Health Certificates", href: "/livetrace/health-certificates", icon: Shield },
  { name: "Delivery Tracking", href: "/livetrace/delivery-tracking", icon: Package },
  { name: "Transport Reports", href: "/livetrace/transport-reports", icon: FileText },
  { name: "Emergency Protocols", href: "/livetrace/emergency-protocols", icon: Bell },
];

// Regulatory/Government Navigation
const regulatoryNavigation = [
  { name: "Regulatory Dashboard", href: "/livetrace/dashboard", icon: BarChart3 },
  { name: "System Overview", href: "/livetrace/system-overview", icon: TrendingUp },
  { name: "Compliance Monitoring", href: "/livetrace/compliance-monitoring", icon: Shield },
  { name: "Disease Surveillance", href: "/livetrace/disease-surveillance", icon: Eye },
  { name: "Farm Registrations", href: "/livetrace/farm-registrations", icon: Users },
  { name: "Health Inspections", href: "/livetrace/health-inspections", icon: Clipboard },
  { name: "Quarantine Management", href: "/livetrace/quarantine-management", icon: Activity },
  { name: "Export Certifications", href: "/livetrace/export-certifications", icon: FileText },
  { name: "Analytics & Reports", href: "/livetrace/analytics", icon: BarChart3 },
  { name: "Policy Management", href: "/livetrace/policy-management", icon: Settings },
  { name: "Inter-agency Messaging", href: "/livetrace/messaging", icon: MessageSquare },
];

export default function LiveTraceSidebar() {
  const [location] = useLocation();
  const { userType, userRole } = getUserInfo();

  // Determine navigation based on user role
  let navigation = regulatoryNavigation; // Default
  
  if (userRole === 'veterinary' || userType === 'veterinary') {
    navigation = veterinaryNavigation;
  } else if (userRole === 'rancher' || userType === 'rancher' || userType === 'farmer') {
    navigation = rancherNavigation;
  } else if (userRole === 'field_agent' || userType === 'field_agent') {
    navigation = fieldAgentNavigation;
  } else if (userRole === 'transport' || userType === 'transport') {
    navigation = transportNavigation;
  }

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r z-40 overflow-y-auto">
      <div className="p-4">
        
        {/* LiveTrace Module Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">LiveTrace</h2>
              <p className="text-xs text-gray-600">Livestock Monitoring</p>
            </div>
          </div>
          
          {/* User Role Badge */}
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {userRole === 'veterinary' ? 'Veterinary Specialist' :
             userRole === 'rancher' || userType === 'farmer' ? 'Farm Owner' :
             userRole === 'field_agent' ? 'Field Agent' :
             userRole === 'transport' ? 'Transport Coordinator' :
             'Regulatory Officer'}
          </Badge>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || 
                           (item.href === '/livetrace/dashboard' && location.startsWith('/livetrace') && 
                            !navigation.some(nav => nav.href === location && nav.href !== '/livetrace/dashboard'));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-orange-100 to-red-50 text-orange-700 border-l-4 border-orange-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-orange-600"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {item.name}
                
                {/* Notification badges for specific items */}
                {item.name === "Emergency Response" && (
                  <Badge className="ml-auto bg-red-100 text-red-700 text-xs">2</Badge>
                )}
                {item.name === "Disease Tracking" && (
                  <Badge className="ml-auto bg-orange-100 text-orange-700 text-xs">5</Badge>
                )}
                {item.name === "Health Inspections" && (
                  <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs">12</Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-100">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Animals</span>
              <span className="font-medium text-orange-700">15,420</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Health Alerts</span>
              <span className="font-medium text-red-600">7</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Transports</span>
              <span className="font-medium text-blue-600">23</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Emergency</span>
          </div>
          <p className="text-xs text-red-700">
            Report health emergencies immediately
          </p>
          <button className="mt-2 w-full bg-red-600 text-white text-xs py-1 px-2 rounded hover:bg-red-700 transition-colors">
            Report Emergency
          </button>
        </div>
      </div>
    </div>
  );
}