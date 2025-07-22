import { Helmet } from "react-helmet";
import MetricsCards from "@/components/dashboard/metrics-cards";
import ComplianceChart from "@/components/dashboard/compliance-chart";
import RegionalMap from "@/components/dashboard/regional-map";
import InspectionsTable from "@/components/dashboard/inspections-table";
import QuickActions from "@/components/dashboard/quick-actions";
import SystemAlerts from "@/components/dashboard/system-alerts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6">
      <Helmet>
        <title>Dashboard - AgriTrace360™ LACRA</title>
        <meta name="description" content="Real-time agricultural commodity compliance monitoring dashboard for Liberia Agriculture Commodity Regulatory Authority" />
      </Helmet>

      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Compliance Overview</h2>
            <p className="text-gray-600">Real-time agricultural commodity compliance monitoring</p>
          </div>
          <div className="flex space-x-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                <SelectItem value="lofa">Lofa County</SelectItem>
                <SelectItem value="bong">Bong County</SelectItem>
                <SelectItem value="nimba">Nimba County</SelectItem>
                <SelectItem value="grand_gedeh">Grand Gedeh County</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-lacra-blue hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="mb-6">
        <MetricsCards />
      </div>

      {/* Charts and Regional Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ComplianceChart />
        <RegionalMap />
      </div>

      {/* Commodity Details Table */}
      <div className="mb-6">
        <InspectionsTable />
      </div>

      {/* Quick Actions and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <SystemAlerts />
      </div>
    </div>
  );
}
