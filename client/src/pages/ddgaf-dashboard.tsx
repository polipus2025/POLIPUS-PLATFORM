import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  Calculator, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  LogOut,
  FileText,
  Users,
  Building,
  Flag
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function DDGAFDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('payments');

  // Fetch DDGAF-specific data
  const { data: paymentValidations, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/ddgaf/payment-validations'],
    queryFn: () => apiRequest('/api/ddgaf/payment-validations'),
  });

  const { data: financialRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['/api/ddgaf/financial-records'],
    queryFn: () => apiRequest('/api/ddgaf/financial-records'),
  });

  const { data: unpaidAccounts, isLoading: unpaidLoading } = useQuery({
    queryKey: ['/api/ddgaf/unpaid-accounts'],
    queryFn: () => apiRequest('/api/ddgaf/unpaid-accounts'),
  });

  const handleLogout = () => {
    localStorage.removeItem('ddgafToken');
    localStorage.removeItem('ddgafUser');
    navigate('/regulatory-login');
  };

  // Mock data for DDGAF operations
  const mockFinancialData = {
    totalRevenue: 1250000,
    pendingPayments: 45000,
    licensingFees: 340000,
    exportPermitFees: 180000,
    complianceFees: 95000,
    unpaidAccounts: 12,
    overdueAmount: 28000
  };

  const mockPaymentValidations = [
    {
      id: 1,
      entityName: "ABC Trading Company",
      entityType: "Buyer",
      paymentType: "Licensing Fee",
      amount: 5000,
      currency: "USD",
      status: "Pending Validation",
      submittedDate: "2025-08-18",
      referenceNumber: "PAY-2025-001"
    },
    {
      id: 2,
      entityName: "Global Exports Ltd",
      entityType: "Exporter",
      paymentType: "Export Permit Fee",
      amount: 12000,
      currency: "USD",
      status: "Requires Review",
      submittedDate: "2025-08-17",
      referenceNumber: "PAY-2025-002"
    },
    {
      id: 3,
      entityName: "Farmer Cooperative Union",
      entityType: "Farmer",
      paymentType: "Compliance Fee",
      amount: 750,
      currency: "USD",
      status: "Payment Verified",
      submittedDate: "2025-08-16",
      referenceNumber: "PAY-2025-003"
    }
  ];

  const mockUnpaidAccounts = [
    {
      id: 1,
      entityName: "XYZ Import/Export",
      entityType: "Buyer",
      outstandingAmount: 8500,
      daysOverdue: 15,
      lastPaymentDate: "2025-07-20",
      accountStatus: "Warning"
    },
    {
      id: 2,
      entityName: "Premium Coffee Exports",
      entityType: "Exporter",
      outstandingAmount: 15000,
      daysOverdue: 32,
      lastPaymentDate: "2025-06-30",
      accountStatus: "Critical"
    },
    {
      id: 3,
      entityName: "Nimba Farmers Collective",
      entityType: "Farmer",
      outstandingAmount: 1200,
      daysOverdue: 8,
      lastPaymentDate: "2025-08-05",
      accountStatus: "Normal"
    }
  ];

  const mockRevenueBreakdown = [
    { category: "Licensing Fees", amount: 340000, percentage: 42.5 },
    { category: "Export Permit Fees", amount: 180000, percentage: 22.5 },
    { category: "Compliance Fees", amount: 95000, percentage: 11.9 },
    { category: "Inspection Fees", amount: 85000, percentage: 10.6 },
    { category: "Other Fees", amount: 100000, percentage: 12.5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">DDGAF Dashboard</h1>
                <p className="text-slate-700 text-lg">Administration & Finance</p>
                <p className="text-slate-600 text-sm">Liberia Agriculture Commodity Regulatory Authority</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 shadow-sm">
                <DollarSign className="w-4 h-4 mr-1" />
                Finance Access
              </Badge>
              <Button 
                onClick={handleLogout} 
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <Card className="bg-white shadow-xl border-slate-200">
            <CardContent className="p-2">
              <TabsList className="grid w-full grid-cols-4 bg-slate-50">
                <TabsTrigger value="payments" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <CreditCard className="w-4 h-4" />
                  Payment Validation
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <FileText className="w-4 h-4" />
                  Financial Records
                </TabsTrigger>
                <TabsTrigger value="accounts" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <AlertTriangle className="w-4 h-4" />
                  Unpaid Accounts
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <TrendingUp className="w-4 h-4" />
                  Financial Reports
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* Payment Validation */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">Total Revenue</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    ${mockFinancialData.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">Year to date</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">Pending Payments</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    ${mockFinancialData.pendingPayments.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">Awaiting validation</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">Unpaid Accounts</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {mockFinancialData.unpaidAccounts}
                  </div>
                  <p className="text-sm text-slate-600">Requiring attention</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">Overdue Amount</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    ${mockFinancialData.overdueAmount.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">Past due</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Validation Queue */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Payment Validation Queue</h2>
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  DDGAF validates all payments including licensing fees, export permits, and compliance fees.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                {mockPaymentValidations.map((payment) => (
                  <Card key={payment.id} className="bg-white shadow-lg border-0">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{payment.entityName}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            {payment.entityType === 'Buyer' ? <Building className="w-4 h-4" /> :
                             payment.entityType === 'Exporter' ? <FileText className="w-4 h-4" /> :
                             <Users className="w-4 h-4" />}
                            {payment.entityType} | {payment.paymentType}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={payment.status === 'Payment Verified' ? 'default' : 
                                         payment.status === 'Requires Review' ? 'destructive' : 'secondary'}>
                            {payment.status}
                          </Badge>
                          <Badge variant="outline">{payment.currency} {payment.amount.toLocaleString()}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Ref: {payment.referenceNumber} | Submitted: {payment.submittedDate}</span>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Flag className="w-4 h-4 mr-1" />
                            Flag
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Financial Records */}
          <TabsContent value="financial" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Financial Records & Revenue Tracking</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockRevenueBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.category}</span>
                        <div className="text-sm text-slate-600">{item.percentage}% of total</div>
                      </div>
                      <span className="font-bold text-green-600">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Generate Monthly Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export Financial Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    Update Fee Structure
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Audit Trail
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Unpaid Accounts */}
          <TabsContent value="accounts" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Unpaid Accounts Management</h2>

            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                DDGAF can flag unpaid accounts and coordinate with other departments for account suspensions.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {mockUnpaidAccounts.map((account) => (
                <Card key={account.id} className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{account.entityName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {account.entityType === 'Buyer' ? <Building className="w-4 h-4" /> :
                           account.entityType === 'Exporter' ? <FileText className="w-4 h-4" /> :
                           <Users className="w-4 h-4" />}
                          {account.entityType} | {account.daysOverdue} days overdue
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={account.accountStatus === 'Critical' ? 'destructive' : 
                                       account.accountStatus === 'Warning' ? 'default' : 'secondary'}>
                          {account.accountStatus}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-slate-600">Outstanding</div>
                        <div className="font-bold text-red-600">${account.outstandingAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Days Overdue</div>
                        <div className="font-bold">{account.daysOverdue}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Last Payment</div>
                        <div className="text-sm">{account.lastPaymentDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Status</div>
                        <div className="text-sm font-medium">{account.accountStatus}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Account requires immediate attention</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive">
                          <Flag className="w-4 h-4 mr-1" />
                          Flag Account
                        </Button>
                        <Button size="sm" variant="outline">
                          Send Notice
                        </Button>
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                          Contact Entity
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Financial Reports */}
          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Financial Reports & Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Current month performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-2">$95,000</div>
                  <div className="text-sm text-slate-600">+8.2% from last month</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Collection Rate</CardTitle>
                  <CardDescription>Payment collection efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-2">94.2%</div>
                  <div className="text-sm text-slate-600">Above target (90%)</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Outstanding Debt</CardTitle>
                  <CardDescription>Total unpaid amounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 mb-2">$28,000</div>
                  <div className="text-sm text-slate-600">12 accounts affected</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create financial reports for different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white h-16">
                    Daily Report
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white h-16">
                    Weekly Summary
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white h-16">
                    Monthly Analysis
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white h-16">
                    Quarterly Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}