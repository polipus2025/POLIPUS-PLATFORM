import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Package, Clock } from "lucide-react";

export default function BuyerTransactionDashboard() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/buyer/transactions"],
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/buyer/metrics"],
  });

  if (isLoading || metricsLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Dashboard</h1>
          <p className="text-gray-600">Track your commodity purchases and sales performance</p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics?.totalPurchases || '0'}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.activeDeals || 0}</div>
              <p className="text-xs text-muted-foreground">
                3 pending approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.avgProfit || '0'}%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.pendingPayments || 0}</div>
              <p className="text-xs text-muted-foreground">
                2 overdue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{transaction.commodity}</div>
                    <div className="text-sm text-gray-600">
                      From: {transaction.farmer} • To: {transaction.exporter}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${transaction.amount}</div>
                    <Badge 
                      variant={
                        transaction.status === 'Completed' ? 'default' :
                        transaction.status === 'Pending' ? 'secondary' : 'destructive'
                      }
                      className={
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {transactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No transactions yet. Start connecting with farmers and exporters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}