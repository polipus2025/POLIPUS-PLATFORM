import { Helmet } from "react-helmet";
import ModernBackground from "@/components/ui/modern-background";
import EconomicReporting from "@/components/dashboard/economic-reporting";

export default function EconomicReportingPage() {
  return (
    <ModernBackground>
      <Helmet>
        <title>Economic Activity Reporting - LACRA AgriTrace360™</title>
        <meta name="description" content="Comprehensive economic activity reporting and analytics system for agricultural compliance monitoring across all Liberian counties" />
      </Helmet>
      
      <div className="space-y-6">
        <EconomicReporting />
      </div>
    </ModernBackground>
  );
}