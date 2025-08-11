import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Waves, 
  TreePine, 
  DollarSign, 
  Calculator,
  Target,
  TrendingUp,
  Leaf,
  Building2,
  FileText,
  MessageSquare,
  Award,
  MapPin,
  Users,
  PiggyBank,
  Globe,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

// Helper function to check user role and type for Blue Carbon 360
const getUserInfo = () => {
  const token = localStorage.getItem('blue_carbon_360_token') || localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');
  
  if (!token) return { role: null, userType: null };
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { role: payload.role, userType };
  } catch {
    return { role: null, userType };
  }
};

// Blue Carbon 360 Navigation Items
const blueCarbon360Navigation = [
  { name: "Conservation Dashboard", href: "/blue-carbon360-dashboard", icon: BarChart3 },
  { name: "Ecosystem Monitoring", href: "/blue-carbon360/ecosystem-monitoring", icon: Waves },
  { name: "Conservation Projects", href: "/blue-carbon360/projects", icon: TreePine },
  { name: "Carbon Marketplace", href: "/blue-carbon360/marketplace", icon: DollarSign },
  { name: "Economic Impact", href: "/blue-carbon360/economic-impact", icon: Calculator },
  { name: "Conservation Metrics", href: "/blue-carbon360/metrics", icon: Target },
  { name: "Carbon Trading", href: "/blue-carbon360/trading", icon: TrendingUp },
  { name: "Mangrove Management", href: "/blue-carbon360/mangroves", icon: Leaf },
  { name: "Marine Protection Areas", href: "/blue-carbon360/protection", icon: MapPin },
  { name: "Conservation Economics", href: "/blue-carbon360/economics", icon: PiggyBank },
  { name: "Impact Reports", href: "/blue-carbon360/reports", icon: FileText },
  { name: "Conservation Network", href: "/blue-carbon360/network", icon: Users },
  { name: "EPA Inspector Request", href: "/blue-carbon360/epa-inspector", icon: Shield },
  { name: "Global Standards", href: "/blue-carbon360/standards", icon: Globe },
  { name: "Conservation Messaging", href: "/blue-carbon360/messaging", icon: MessageSquare },
];

export default function BlueCarbon360Sidebar() {
  const [location] = useLocation();
  const { role, userType } = getUserInfo();
  
  // Get current user ID for messaging notifications
  const [currentUserId] = useState(() => {
    const username = localStorage.getItem("username");
    const blueCarbon360User = localStorage.getItem("blue_carbon_360_user");
    
    if (username) return username;
    if (blueCarbon360User) {
      try {
        const user = JSON.parse(blueCarbon360User);
        return user.id || "marina.conserve";
      } catch {
        return "marina.conserve";
      }
    }
    return "marina.conserve";
  });

  // Fetch unread message count for Blue Carbon 360
  const { data: unreadData } = useQuery({
    queryKey: ["/api/blue-carbon360/messages", currentUserId, "unread-count"],
    queryFn: () => apiRequest(`/api/blue-carbon360/messages/${currentUserId}/unread-count`),
    refetchInterval: 30000,
    staleTime: 25000,
  });

  const unreadCount = unreadData?.count || 0;

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-white">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-slate-200 px-6 pb-4">
        {/* Blue Carbon 360 Logo/Header */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Waves className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Blue Carbon 360</h2>
              <p className="text-xs text-slate-600">Conservation Economics</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {blueCarbon360Navigation.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <li key={item.name}>
                      <Link href={item.href}>
                        <div
                          className={cn(
                            isActive
                              ? 'bg-cyan-50 text-cyan-700 border-r-2 border-cyan-700'
                              : 'text-slate-700 hover:text-cyan-700 hover:bg-cyan-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium cursor-pointer transition-all duration-200'
                          )}
                        >
                          <item.icon
                            className={cn(
                              isActive ? 'text-cyan-700' : 'text-slate-400 group-hover:text-cyan-700',
                              'h-5 w-5 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.name}</span>
                          {item.name === "Conservation Messaging" && unreadCount > 0 && (
                            <span className="ml-auto w-5 h-5 text-xs bg-cyan-600 text-white rounded-full flex items-center justify-center">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* User Info Section */}
            <li className="mt-auto">
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      Marina Conserve
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      Marine Conservation Officer
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-cyan-700">
                  Blue Carbon Division • Ministry of Environment
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}