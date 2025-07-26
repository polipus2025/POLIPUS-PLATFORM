import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import type { Commodity } from "@shared/schema";

const COLORS = {
  compliant: '#388E3C',
  review_required: '#FF8F00',
  non_compliant: '#D32F2F',
  pending: '#9E9E9E'
};

interface ComplianceChartProps {
  selectedCounty?: string;
}

export default function ComplianceChart({ selectedCounty = "all" }: ComplianceChartProps) {
  const { data: commodities = [], isLoading } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  // Filter commodities by selected county
  const filteredCommodities = selectedCounty === "all" 
    ? commodities 
    : commodities.filter(commodity => commodity.county === selectedCounty);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const statusCounts = filteredCommodities.reduce((acc, commodity) => {
    acc[commodity.status] = (acc[commodity.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
    color: COLORS[status as keyof typeof COLORS] || COLORS.pending
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-neutral">
            Commodity Compliance Status
            {selectedCounty !== "all" && (
              <span className="text-sm font-normal text-blue-600 ml-2">
                • {selectedCounty}
              </span>
            )}
          </CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
