import { Helmet } from "react-helmet";
import ModernBackground from "@/components/ui/modern-background";
import EconomicReporting from "@/components/dashboard/economic-reporting";

export default function EconomicReportingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Helmet>
          <title>Economic Activity Reporting - LACRA AgriTrace360™</title>
          <meta name="description" content="Comprehensive economic activity reporting and analytics system for agricultural compliance monitoring across all Liberian counties" />
        </Helmet>
        
        <EconomicReporting />
      </div>
    </div>
  );
}