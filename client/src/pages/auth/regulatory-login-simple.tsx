import { Button } from "@/components/ui/button";

export default function RegulatoryLoginSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Regulatory Login</h1>
        <p className="text-gray-600 text-center mb-6">
          LACRA Administrator Portal Access
        </p>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Administrator ID" 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Login
          </Button>
        </div>
        <div className="mt-6 text-center">
          <a href="/portals" className="text-blue-600 hover:underline">
            ← Back to Portal Selection
          </a>
        </div>
      </div>
    </div>
  );
}