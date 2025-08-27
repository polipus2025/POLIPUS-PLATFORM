import { Button } from "@/components/ui/button";

export default function InspectorLoginSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Inspector Login</h1>
        <p className="text-gray-600 text-center mb-6">
          Extension Officer Portal Access
        </p>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Inspector ID" 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <Button className="w-full bg-orange-600 hover:bg-orange-700">
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