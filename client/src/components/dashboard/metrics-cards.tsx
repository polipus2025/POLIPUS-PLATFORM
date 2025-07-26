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
    <div className="mobile-container">
      <div className="mobile-safe-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={card.title} className="border border-gray-100 w-full max-w-full">
            <CardContent className="mobile-card">
              <div className="flex items-center justify-between mobile-hide-overflow">
                <div className="min-w-0 flex-1 mobile-text-safe">
                  <p className="text-xs md:text-sm font-medium text-gray-500 mobile-text-safe">{card.title}</p>
                  <p className="text-base md:text-2xl font-bold text-neutral mt-1 mobile-text-safe">{card.value}</p>
                </div>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 ${card.color} bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <card.icon className={`text-xs sm:text-sm md:text-xl ${card.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className="mt-2 md:mt-4 w-full">
                <div className="flex items-center text-xs md:text-sm text-gray-600">
                  <span className={`font-medium truncate ${index === 2 ? 'text-error' : 'text-success'}`}>
                    {card.change}
                  </span>
                  <span className="ml-1 truncate">{card.changeText}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
