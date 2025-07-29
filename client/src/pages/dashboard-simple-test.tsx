import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardSimpleTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>AgriTrace360™ LACRA Dashboard | Layout Test</title>
        <meta name="description" content="Layout test for agricultural compliance dashboard" />
      </Helmet>

      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 bg-red-500 text-white min-h-screen">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">🔴 SUCCESS! 🔴</h1>
            <p className="text-3xl mb-4">ORIGINAL LAYOUT RESTORED!</p>
            <p className="text-xl">Header and sidebar back to basic styling!</p>
            <div className="mt-8 p-4 bg-white/20 rounded">
              <p>✅ Header simplified</p>
              <p>✅ Sidebar simplified</p>
              <p>✅ Main content visible</p>
              <p>🔧 Ready to restore complete ISMS dashboard</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}