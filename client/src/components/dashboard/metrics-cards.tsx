import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, CheckCircle, Clock, Award } from "lucide-react";
import type { DashboardMetrics } from "@/lib/types";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Commodities",
      value: metrics?.totalCommodities ?? 0,
      icon: Package,
      color: "bg-lacra-blue",
      change: "+12.5%",
      changeText: "from last month"
    },
    {
      title: "Compliance Rate",
      value: `${metrics?.complianceRate ?? 0}%`,
      icon: CheckCircle,
      color: "bg-success",
      change: "+2.1%",
      changeText: "from last month"
    },
    {
      title: "Pending Inspections",
      value: metrics?.pendingInspections ?? 0,
      icon: Clock,
      color: "bg-warning",
      change: "+5",
      changeText: "from yesterday"
    },
    {
      title: "Export Certificates",
      value: metrics?.exportCertificates ?? 0,
      icon: Award,
      color: "bg-lacra-green",
      change: "+8",
      changeText: "this week"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={card.title} className="border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-neutral mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <card.icon className={`text-xl ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${index === 2 ? 'text-error' : 'text-success'}`}>
                {card.change}
              </span>
              <span className="text-gray-500 text-sm ml-1">{card.changeText}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
