import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>AgriTrace360™ LACRA Dashboard | Test</title>
        <meta name="description" content="Dashboard test page" />
      </Helmet>

      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-6 bg-red-500 text-white min-h-screen">
          <div className="text-center pt-20">
            <h1 className="text-6xl font-bold mb-4">🔴 LAYOUT TEST SUCCESS! 🔴</h1>
            <p className="text-2xl mb-2">Main content area is now rendering correctly!</p>
            <p className="text-lg">Header and sidebar components are working!</p>
            <div className="mt-8 p-4 bg-white/20 rounded-lg">
              <p className="text-sm">✅ Header working</p>
              <p className="text-sm">✅ Sidebar working</p>
              <p className="text-sm">✅ Main content area working</p>
              <p className="text-sm">🔧 Ready to restore full dashboard functionality</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}