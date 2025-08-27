import { Button } from "@/components/ui/button";

export default function ExporterLoginSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Exporter Login</h1>
        <p className="text-gray-600 text-center mb-6">
          Commodity Exporter Portal Access
        </p>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Exporter ID" 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
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