import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Waves, 
  Fish, 
  TreePine, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar,
  Thermometer,
  Eye
} from "lucide-react";

interface EcosystemMonitoringProps {
  data?: any[];
  isLoading?: boolean;
}

export default function EcosystemMonitoring({ data = [], isLoading = false }: EcosystemMonitoringProps) {
  const mockData = [
    {
      id: 1,
      projectName: "Robertsport Mangrove Restoration",
      ecosystemType: "mangrove",
      location: "Grand Cape Mount County",
      health: "excellent",
      carbonStock: 285.7,
      vegetationCover: 92,
      speciesDiversity: 34,
      threatLevel: "low",
      lastMonitored: "2024-08-10",
      monitoringType: "satellite_monitoring"
    },
    {
      id: 2,
      projectName: "Buchanan Bay Seagrass Conservation",
      ecosystemType: "seagrass",
      location: "Grand Bassa County",
      health: "good",
      carbonStock: 156.3,
      vegetationCover: 78,
      speciesDiversity: 28,
      threatLevel: "moderate",
      lastMonitored: "2024-08-09",
      monitoringType: "drone_survey"
    }
  ];

  const monitoringData = data.length > 0 ? data : mockData;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'severe': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getEcosystemIcon = (type: string) => {
    switch (type) {
      case 'mangrove': return TreePine;
      case 'seagrass': return Waves;
      case 'coral_reef': return Fish;
      default: return Waves;
    }
  };

  if (isLoading) {
    return (
      <Card className="isms-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Ecosystem Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-2">Loading monitoring data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="isms-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <span>Ecosystem Monitoring</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {monitoringData.map((monitoring) => {
            const EcosystemIcon = getEcosystemIcon(monitoring.ecosystemType);
            
            return (
              <div key={monitoring.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <EcosystemIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{monitoring.projectName}</h4>
                      <p className="text-sm text-slate-600 flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{monitoring.location}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getHealthColor(monitoring.health)}>
                      {monitoring.health}
                    </Badge>
                    <Badge className={getThreatColor(monitoring.threatLevel)}>
                      {monitoring.threatLevel} threat
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-700">{monitoring.carbonStock}</div>
                    <div className="text-sm text-green-600">tonnes CO2</div>
                    <div className="text-xs text-slate-600">Carbon Stock</div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">{monitoring.vegetationCover}%</div>
                    <div className="text-sm text-blue-600">Coverage</div>
                    <div className="text-xs text-slate-600">Vegetation</div>
                    <Progress value={monitoring.vegetationCover} className="mt-1" />
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-700">{monitoring.speciesDiversity}</div>
                    <div className="text-sm text-purple-600">Species</div>
                    <div className="text-xs text-slate-600">Biodiversity</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Last monitored: {monitoring.lastMonitored}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span className="capitalize">{monitoring.monitoringType.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="mt-3 flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Download Report
                  </Button>
                  <Button size="sm" variant="outline">
                    Schedule Monitoring
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {monitoringData.length === 0 && (
          <div className="text-center py-8">
            <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">No monitoring data available</p>
            <p className="text-sm text-slate-500 mb-4">Start monitoring your conservation projects</p>
            <Button>
              Set Up Monitoring
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}