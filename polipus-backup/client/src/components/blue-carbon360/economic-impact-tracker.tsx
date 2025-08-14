import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Home,
  MapPin,
  Calendar,
  Target,
  PieChart
} from "lucide-react";

interface EconomicImpactTrackerProps {
  data?: any[];
  isLoading?: boolean;
}

export default function EconomicImpactTracker({ data = [], isLoading = false }: EconomicImpactTrackerProps) {
  const mockData = [
    {
      id: 1,
      projectId: 1,
      projectName: "Robertsport Mangrove Restoration",
      recordType: "ecosystem_valuation",
      impactCategory: "direct",
      economicValue: 875000,
      currency: "USD",
      jobsCreated: 45,
      jobsSupported: 120,
      householdsBenefited: 280,
      tourismRevenue: 156000,
      fishingRevenue: 89000,
      propertyValueIncrease: 12.5,
      verificationStatus: "verified",
      recordDate: "2024-08-01"
    },
    {
      id: 2,
      projectId: 2,
      projectName: "Buchanan Bay Seagrass Conservation",
      recordType: "job_creation",
      impactCategory: "indirect",
      economicValue: 520000,
      currency: "USD",
      jobsCreated: 32,
      jobsSupported: 78,
      householdsBenefited: 195,
      tourismRevenue: 98000,
      fishingRevenue: 145000,
      propertyValueIncrease: 8.7,
      verificationStatus: "verified",
      recordDate: "2024-07-28"
    }
  ];

  const impactData = data.length > 0 ? data : mockData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'published': return 'text-blue-600 bg-blue-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'direct': return 'text-green-600 bg-green-100';
      case 'indirect': return 'text-blue-600 bg-blue-100';
      case 'induced': return 'text-purple-600 bg-purple-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const totalEconomicValue = impactData.reduce((sum, record) => sum + record.economicValue, 0);
  const totalJobsCreated = impactData.reduce((sum, record) => sum + record.jobsCreated, 0);
  const totalHouseholds = impactData.reduce((sum, record) => sum + record.householdsBenefited, 0);

  if (isLoading) {
    return (
      <Card className="isms-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-emerald-600" />
            <span>Economic Impact Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-slate-600 mt-2">Loading impact data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="isms-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-600">${totalEconomicValue.toLocaleString()}</div>
            <div className="text-sm text-slate-600 mt-1">Total Economic Value</div>
          </CardContent>
        </Card>

        <Card className="isms-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{totalJobsCreated}</div>
            <div className="text-sm text-slate-600 mt-1">Jobs Created</div>
          </CardContent>
        </Card>

        <Card className="isms-card text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Home className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{totalHouseholds}</div>
            <div className="text-sm text-slate-600 mt-1">Households Benefited</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Impact Records */}
      <Card className="isms-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-emerald-600" />
              <span>Economic Impact Records</span>
            </div>
            <Button size="sm">
              Add Impact Record
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {impactData.map((record) => (
              <div key={record.id} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-900 mb-2">{record.projectName}</h4>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className={getCategoryColor(record.impactCategory)}>
                        {record.impactCategory} impact
                      </Badge>
                      <Badge className={getStatusColor(record.verificationStatus)}>
                        {record.verificationStatus}
                      </Badge>
                      <Badge variant="outline" className="text-slate-600">
                        {record.recordType.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-emerald-600">${record.economicValue.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">{record.currency} Value</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xl font-bold text-green-700">{record.jobsCreated}</div>
                    <div className="text-sm text-green-600">Jobs Created</div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xl font-bold text-blue-700">{record.jobsSupported}</div>
                    <div className="text-sm text-blue-600">Jobs Supported</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xl font-bold text-purple-700">{record.householdsBenefited}</div>
                    <div className="text-sm text-purple-600">Households</div>
                  </div>

                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-xl font-bold text-orange-700">+{record.propertyValueIncrease}%</div>
                    <div className="text-sm text-orange-600">Property Value</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Tourism Revenue</span>
                      <span className="text-sm font-bold text-slate-900">${record.tourismRevenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(record.tourismRevenue / record.economicValue) * 100} className="h-2" />
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Fishing Revenue</span>
                      <span className="text-sm font-bold text-slate-900">${record.fishingRevenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(record.fishingRevenue / record.economicValue) * 100} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Recorded: {record.recordDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>Project ID: {record.projectId}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Analysis
                  </Button>
                  <Button size="sm" variant="outline">
                    Export Report
                  </Button>
                  <Button size="sm" variant="outline">
                    Update Record
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {impactData.length === 0 && (
            <div className="text-center py-8">
              <PieChart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No economic impact records</p>
              <p className="text-sm text-slate-500 mb-4">Start tracking your conservation project's economic benefits</p>
              <Button>
                Create First Record
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}