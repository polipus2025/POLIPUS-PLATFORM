import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ComplianceByCounty } from "@/lib/types";

export default function RegionalMap() {
  const { data: countyData = [], isLoading } = useQuery<ComplianceByCounty[]>({
    queryKey: ["/api/dashboard/compliance-by-county"],
  });

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

  const getStatusColor = (rate: number) => {
    const safeRate = rate || 0;
    if (safeRate >= 95) return 'bg-success';
    if (safeRate >= 85) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral">Regional Compliance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="relative h-64 bg-gray-50 rounded-lg overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 text-white">
              {countyData.map((county) => (
                <div key={county.county} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${getStatusColor(county.complianceRate || 0)} rounded-full`}></div>
                    <span className="text-sm font-medium">{county.county}</span>
                  </div>
                  <p className="text-xs mt-1 opacity-90">{(county.complianceRate || 0).toFixed(1)}% Compliant</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
