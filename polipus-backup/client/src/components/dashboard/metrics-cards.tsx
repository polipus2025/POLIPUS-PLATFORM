import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, CheckCircle, Clock, Award } from "lucide-react";
import type { DashboardMetrics } from "@/lib/types";

interface MetricsCardsProps {
  selectedCounty?: string;
}

export default function MetricsCards({ selectedCounty = "all" }: MetricsCardsProps) {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  // Add county filter indicator (metrics are aggregated so we show the filter context)
  const getFilteredLabel = (label: string) => {
    if (selectedCounty === "all") return label;
    return `${label} (${selectedCounty})`;
  };

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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {cards.map((card, index) => (
        <div key={card.title} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-xl ${
              index === 0 ? 'bg-blue-50' :
              index === 1 ? 'bg-green-50' :
              index === 2 ? 'bg-orange-50' : 'bg-purple-50'
            }`}>
              <card.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${
                index === 0 ? 'text-blue-600' :
                index === 1 ? 'text-green-600' :
                index === 2 ? 'text-orange-600' : 'text-purple-600'
              }`} />
            </div>
            <h3 className="font-semibold text-slate-700 text-sm sm:text-base">{card.title}</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{card.value}</div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className={`h-2 w-2 rounded-full ${
                index === 2 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'
              }`}></div>
              <span className={`font-medium ${
                index === 2 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {card.change}
              </span>
              <span className="text-slate-500 hidden sm:inline">{card.changeText}</span>
            </div>
            {index === 1 && (
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics?.complianceRate || 0}%` }}
                ></div>
              </div>
            )}
            {index === 2 && (
              <div className="text-xs text-slate-500 mt-2">
                {(metrics?.pendingInspections || 0) > 10 ? "High priority queue" : "Normal processing"}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
