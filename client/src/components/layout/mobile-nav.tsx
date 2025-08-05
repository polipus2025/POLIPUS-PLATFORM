import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Leaf, 
  MapPin, 
  ClipboardCheck, 
  Tag, 
  Users,
  Plus,
  MessageSquare,
  Home
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

// Mobile Navigation Items based on user type
const getMobileNavItems = (userType: string | null, role: string | null) => {
  if (userType === 'farmer') {
    return [
      { name: "Home", href: "/", icon: Home },
      { name: "Plots", href: "/farm-plots", icon: MapPin },
      { name: "Batch", href: "/batch-code-generator", icon: Plus },
      { name: "Verify", href: "/verification", icon: ClipboardCheck },
    ];
  }
  
  if (userType === 'field_agent') {
    return [
      { name: "Home", href: "/", icon: Home },
      { name: "Inspect", href: "/inspections", icon: ClipboardCheck },
      { name: "Farmers", href: "/farmers", icon: Users },
      { name: "Verify", href: "/verification", icon: Tag },
    ];
  }
  
  if (userType === 'exporter') {
    return [
      { name: "Home", href: "/", icon: Home },
      { name: "Orders", href: "/export-orders", icon: Leaf },
      { name: "Certs", href: "/certifications", icon: Tag },
      { name: "Messages", href: "/messaging", icon: MessageSquare },
    ];
  }
  
  // Default regulatory navigation
  return [
    { name: "Home", href: "/", icon: Home },
    { name: "Commodities", href: "/commodities", icon: Leaf },
    { name: "Inspect", href: "/inspections", icon: ClipboardCheck },
    { name: "Certs", href: "/certifications", icon: Tag },
  ];
};

export default function MobileNav() {
  const [location] = useLocation();
  const { userType, role } = getUserInfo();
  
  // Get current user ID for messaging
  const currentUserId = localStorage.getItem("currentUserId") || 
                       localStorage.getItem("farmerId") || 
                       localStorage.getItem("agentId") || 
                       localStorage.getItem("exporterId") || 
                       "admin001";

  // Fetch unread message count for mobile nav indicator
  const { data: unreadData } = useQuery({
    queryKey: ["/api/messages", currentUserId, "unread-count"],
    queryFn: () => apiRequest(`/api/messages/${currentUserId}/unread-count`),
    refetchInterval: 30000,
    staleTime: 25000,
  });

  const unreadCount = unreadData?.count || 0;
  const navigationItems = getMobileNavItems(userType, role);

  // Don't show mobile nav if user is not authenticated
  if (!localStorage.getItem('authToken')) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const isActive = location === item.href;
          const isMessaging = item.name === "Messages";
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors relative",
                isActive
                  ? userType === 'farmer' 
                    ? "text-green-700 bg-green-50"
                    : userType === 'field_agent'
                    ? "text-orange-700 bg-orange-50"
                    : userType === 'exporter'
                    ? "text-purple-700 bg-purple-50"
                    : "text-blue-700 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
              
              {/* Show notification badge for messaging */}
              {isMessaging && unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}