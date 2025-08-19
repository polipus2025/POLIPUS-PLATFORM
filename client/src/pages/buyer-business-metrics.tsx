import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Package, Users, Target, BarChart3 } from "lucide-react";

export default function BuyerBusinessMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/buyer/business-metrics"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mt-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Metrics</h1>
          <p className="text-gray-600">Track your agricultural business performance and growth</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics?.monthlyRevenue || '0'}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{metrics?.revenueGrowth || 0}%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.activeFarmers || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">+{metrics?.farmerGrowth || 0}</span> new this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Export Partnerships</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.exportPartnerships || 0}</div>
              <p className="text-xs text-muted-foreground">
                {metrics?.partnershipGrowth || 0} new partnerships
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.profitMargin || '0'}%</div>
              <p className="text-xs text-muted-foreground">
                Industry average: {metrics?.industryAverage || '15'}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Commodity Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Commodities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.topCommodities?.map((commodity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{commodity.name}</div>
                      <div className="text-sm text-gray-600">{commodity.volume} kg traded</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${commodity.revenue}</div>
                      <Badge 
                        variant="outline" 
                        className={commodity.trend === 'up' ? 'text-green-600' : 'text-red-600'}
                      >
                        {commodity.trend === 'up' ? '↗' : '↘'} {commodity.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.regionalPerformance?.map((region: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{region.county}</span>
                      <span className="text-sm text-gray-600">${region.revenue}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${region.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Business Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">This Month's Achievements</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Connected with {metrics?.newFarmers || 0} new farmers</li>
                  <li>• Completed {metrics?.completedDeals || 0} successful transactions</li>
                  <li>• Expanded to {metrics?.newRegions || 0} new counties</li>
                  <li>• Achieved {metrics?.qualityScore || 0}% quality satisfaction rate</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Next Month's Goals</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Target ${metrics?.revenueTarget || 0} revenue</li>
                  <li>• Establish {metrics?.partnershipTarget || 0} new export partnerships</li>
                  <li>• Increase farmer network by {metrics?.farmerTarget || 0}%</li>
                  <li>• Improve profit margin to {metrics?.marginTarget || 0}%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}