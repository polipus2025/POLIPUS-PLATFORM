import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, Smartphone, MapPin, Wifi, WifiOff, Users, Activity } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Alert } from "@shared/schema";

export default function SystemAlerts() {
  const queryClient = useQueryClient();
  
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  // Mobile device monitoring data for field agents and inspectors
  const { data: mobileDevices = [] } = useQuery({
    queryKey: ["/api/mobile-devices/status"],
    queryFn: async () => {
      // Real-time mobile device status simulation
      const devices = [
        {
          id: "AGT-2024-001",
          name: "Sarah Konneh",
          role: "Field Agent",
          county: "Lofa County",
          isOnline: true,
          lastActivity: new Date(Date.now() - 5 * 60000), // 5 minutes ago
          currentLocation: "Voinjama Market",
          batteryLevel: 78,
          signalStrength: 4,
          activeTask: "Cocoa Inspection"
        },
        {
          id: "AGT-2024-002", 
          name: "Marcus Johnson",
          role: "Field Agent",
          county: "Nimba County",
          isOnline: true,
          lastActivity: new Date(Date.now() - 2 * 60000), // 2 minutes ago
          currentLocation: "Sanniquellie Processing Center",
          batteryLevel: 45,
          signalStrength: 3,
          activeTask: "Quality Assessment"
        },
        {
          id: "INS-2024-001",
          name: "Grace Williams",
          role: "Inspector",
          county: "Montserrado County",
          isOnline: false,
          lastActivity: new Date(Date.now() - 25 * 60000), // 25 minutes ago
          currentLocation: "Monrovia Port",
          batteryLevel: 12,
          signalStrength: 2,
          activeTask: "Export Verification"
        },
        {
          id: "AGT-2024-003",
          name: "David Clarke",
          role: "Field Agent", 
          county: "Bong County",
          isOnline: true,
          lastActivity: new Date(Date.now() - 1 * 60000), // 1 minute ago
          currentLocation: "Gbarnga Central Farm",
          batteryLevel: 89,
          signalStrength: 5,
          activeTask: "Farmer Registration"
        },
        {
          id: "INS-2024-002",
          name: "Rebecca Davis",
          role: "Inspector",
          county: "Grand Bassa County",
          isOnline: true,
          lastActivity: new Date(Date.now() - 8 * 60000), // 8 minutes ago
          currentLocation: "Buchanan Collection Point",
          batteryLevel: 63,
          signalStrength: 4,
          activeTask: "Compliance Check"
        },
        {
          id: "AGT-2024-004",
          name: "James Roberts",
          role: "Field Agent",
          county: "Maryland County",
          isOnline: false,
          lastActivity: new Date(Date.now() - 45 * 60000), // 45 minutes ago
          currentLocation: "Harper Processing Unit",
          batteryLevel: 8,
          signalStrength: 1,
          activeTask: "Equipment Maintenance"
        }
      ];
      
      return devices;
    },
    refetchInterval: 15000, // Update every 15 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: (alertId: number) =>
      apiRequest(`/api/alerts/${alertId}/read`, {
        method: "PUT"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return AlertTriangle;
      case 'warning':
        return Clock;
      case 'success':
        return CheckCircle;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-error bg-opacity-5 border-error border-opacity-20 text-error';
      case 'warning':
        return 'bg-warning bg-opacity-5 border-warning border-opacity-20 text-warning';
      case 'success':
        return 'bg-success bg-opacity-5 border-success border-opacity-20 text-success';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
      {/* Mobile Device Monitoring Section - NOW AT TOP */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Smartphone className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Mobile Device Monitoring</h4>
            <p className="text-sm text-slate-600">Real-time field agent & inspector status</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1" />
              Live Updates
            </Badge>
            <div className="text-xs text-slate-500">
              {mobileDevices.filter(d => d.isOnline).length} online
            </div>
          </div>
        </div>

        {/* Scrolling Mobile Status Feed */}
        <div className="bg-slate-50 rounded-lg p-4 border">
          <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <div className="space-y-3">
              {mobileDevices.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    device.isOnline 
                      ? 'bg-white border-green-200 shadow-sm hover:shadow-md' 
                      : 'bg-gray-50 border-gray-200 opacity-75'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${
                      device.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {device.isOnline && (
                        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                      )}
                    </div>
                  </div>

                  {/* Device Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-slate-900 truncate">
                        {device.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {device.id}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          device.role === 'Inspector' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {device.role}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{device.county}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="truncate">{device.currentLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-medium text-green-700">
                        {device.activeTask}
                      </span>
                      <span className="text-xs text-slate-500">
                        • {formatTimeAgo(device.lastActivity)}
                      </span>
                    </div>
                  </div>

                  {/* Device Status Icons */}
                  <div className="flex items-center gap-2">
                    {/* Signal Strength */}
                    <div className="flex items-center gap-1">
                      {device.isOnline ? (
                        <Wifi className={`h-4 w-4 ${
                          device.signalStrength >= 4 ? 'text-green-600' :
                          device.signalStrength >= 3 ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      ) : (
                        <WifiOff className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-xs text-slate-500">{device.signalStrength}/5</span>
                    </div>

                    {/* Battery Level */}
                    <div className="flex items-center gap-1">
                      <div className={`w-6 h-3 border rounded-sm relative ${
                        device.batteryLevel > 20 ? 'border-gray-400' : 'border-red-400'
                      }`}>
                        <div 
                          className={`h-full rounded-sm ${
                            device.batteryLevel > 50 ? 'bg-green-500' :
                            device.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${device.batteryLevel}%` }}
                        />
                      </div>
                      <span className={`text-xs ${
                        device.batteryLevel > 20 ? 'text-slate-500' : 'text-red-600 font-medium'
                      }`}>
                        {device.batteryLevel}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Footer */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  <Users className="h-3 w-3 inline mr-1" />
                  {mobileDevices.length} Total Devices
                </span>
                <span className="text-green-600">
                  {mobileDevices.filter(d => d.isOnline).length} Online
                </span>
                <span className="text-red-600">
                  {mobileDevices.filter(d => !d.isOnline).length} Offline
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 animate-pulse" />
                <span>Auto-refresh: 15s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts Section - NOW AT BOTTOM */}
      <div className="mt-6 border-t pt-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">System Alerts</h3>
          <p className="text-slate-600">Real-time notifications and compliance monitoring</p>
        </div>
        <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                <p>No alerts at this time</p>
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => {
                const IconComponent = getAlertIcon(alert.type);
                const colors = getAlertColors(alert.type);
                
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start space-x-3 p-4 border rounded-xl transition-all duration-300 hover:shadow-sm ${colors} ${
                      alert.isRead ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white bg-opacity-50">
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                      <p className="text-xs text-slate-700 mt-1 opacity-90">{alert.message}</p>
                      <p className="text-xs text-slate-600 opacity-70 mt-2">{formatTimeAgo(alert.createdAt!)}</p>
                    </div>
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => markAsReadMutation.mutate(alert.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                );
              })
            )}
        </div>
      </div>
    </div>
  );
}
