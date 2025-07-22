import { Bell, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Alert } from "@shared/schema";

export default function Header() {
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ["/api/alerts", "unreadOnly=true"],
  });

  const unreadCount = alerts.length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lacra-blue rounded-lg flex items-center justify-center">
                <Sprout className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral">AgriTrace360™</h1>
                <p className="text-sm text-gray-500">LACRA Regulatory Dashboard</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-gray-600">System Online</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral">James Kollie</p>
                <p className="text-xs text-gray-500">Quality Control Officer</p>
              </div>
              <div className="w-8 h-8 bg-lacra-green rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
