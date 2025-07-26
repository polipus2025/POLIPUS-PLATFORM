import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Alert } from "@shared/schema";

export default function SystemAlerts() {
  const queryClient = useQueryClient();
  
  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
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
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral">System Alerts</CardTitle>
      </CardHeader>
      <CardContent>
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
                  className={`flex items-start space-x-3 p-3 border rounded-lg ${colors} ${
                    alert.isRead ? 'opacity-60' : ''
                  }`}
                >
                  <IconComponent className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral">{alert.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(alert.createdAt!)}</p>
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
      </CardContent>
    </Card>
  );
}
