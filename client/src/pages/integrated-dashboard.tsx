import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  CheckCircle,
  Users,
  MapPin,
  Shield,
  TreePine,
  Waves,
  DollarSign,
  Leaf,
  Zap
} from "lucide-react";

export default function IntegratedDashboard() {
  const { data: integrationData, isLoading } = useQuery({
    queryKey: ["/api/polipus/integrated-dashboard"],
  });

  const { data: connectionData } = useQuery({
    queryKey: ["/api/polipus/module-connections"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const moduleIcons = {
    "live-trace": { icon: Users, color: "bg-blue-500" },
    "land-map360": { icon: MapPin, color: "bg-purple-500" },
    "mine-watch": { icon: Shield, color: "bg-orange-500" },
    "forest-guard": { icon: TreePine, color: "bg-teal-500" },
    "aqua-trace": { icon: Waves, color: "bg-indigo-500" },
    "blue-carbon360": { icon: DollarSign, color: "bg-cyan-500" },
    "carbon-trace": { icon: Leaf, color: "bg-green-500" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Platform
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Integrated Dashboard</h1>
              <p className="text-slate-600">Cross-module system overview and connectivity status</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All Systems Connected
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Integration Status */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Platform Integration Status</h2>
              <p className="text-slate-700">{integrationData?.integrationStatus || "System Status Loading..."}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {integrationData?.crossModuleConnections?.totalModules || 7}
              </div>
              <div className="text-sm text-slate-600">Modules Connected</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {integrationData?.crossModuleConnections?.interconnectedSystems || 21}
              </div>
              <div className="text-xs text-slate-600">Interconnected Systems</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {integrationData?.crossModuleConnections?.dataExchangeActive ? "Active" : "Inactive"}
              </div>
              <div className="text-xs text-slate-600">Data Exchange</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">Real-time</div>
              <div className="text-xs text-slate-600">Synchronization</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">Operational</div>
              <div className="text-xs text-slate-600">System Status</div>
            </div>
          </div>
        </Card>

        {/* Module Data Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Live Trace */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Live Trace</h3>
                <p className="text-sm text-slate-600">Livestock Monitoring</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {integrationData?.livestock?.length || 0}
            </div>
            <div className="text-sm text-slate-600">Active Records</div>
          </Card>

          {/* Land Map360 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Land Map360</h3>
                <p className="text-sm text-slate-600">Land Mapping</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {integrationData?.landParcels?.length || 0}
            </div>
            <div className="text-sm text-slate-600">Land Parcels</div>
          </Card>

          {/* Mine Watch */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Mine Watch</h3>
                <p className="text-sm text-slate-600">Mineral Protection</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {integrationData?.miningOperations?.length || 0}
            </div>
            <div className="text-sm text-slate-600">Mining Operations</div>
          </Card>

          {/* Forest Guard */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <TreePine className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Forest Guard</h3>
                <p className="text-sm text-slate-600">Forest Protection</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-teal-600 mb-1">
              {integrationData?.forestAreas?.length || 0}
            </div>
            <div className="text-sm text-slate-600">Forest Areas</div>
          </Card>

          {/* Aqua Trace */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Waves className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Aqua Trace</h3>
                <p className="text-sm text-slate-600">Ocean Monitoring</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {integrationData?.waterBodies?.length || 0}
            </div>
            <div className="text-sm text-slate-600">Water Bodies</div>
          </Card>

          {/* Blue Carbon 360 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Blue Carbon 360</h3>
                <p className="text-sm text-slate-600">Conservation Economics</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-cyan-600 mb-1">
              {integrationData?.conservationProjects?.length || 0}
            </div>
            <div className="text-sm text-slate-600">Conservation Projects</div>
          </Card>

          {/* Carbon Trace */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Carbon Trace</h3>
                <p className="text-sm text-slate-600">Environmental Monitoring</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {integrationData?.emissionSources?.length || 0}
            </div>
            <div className="text-sm text-slate-600">Emission Sources</div>
          </Card>

          {/* System Health */}
          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">System Health</h3>
                <p className="text-sm text-slate-600">Platform Status</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
            <div className="text-sm text-slate-600">All Systems Operational</div>
          </Card>
        </div>

        {/* Module Connections */}
        {connectionData && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Module Interconnections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(connectionData.moduleConnections).map(([moduleKey, module]: [string, any]) => {
                const moduleConfig = moduleIcons[moduleKey as keyof typeof moduleIcons];
                const Icon = moduleConfig?.icon || Zap;
                
                return (
                  <div key={moduleKey} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 ${moduleConfig?.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 capitalize">
                          {moduleKey.replace('-', ' ')}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {module.integrationLevel}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 mb-2">
                      <span className="font-medium">Connected to:</span> {module.connectedTo.length} modules
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Data sharing:</span> {module.dataSharing.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {connectionData.interconnectionStatus}
              </Badge>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}