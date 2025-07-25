import { Helmet } from "react-helmet";

export default function TestDashboard() {
  return (
    <div className="p-8">
      <Helmet>
        <title>Test Dashboard - AgriTrace360™ LACRA</title>
      </Helmet>
      
      <div className="bg-green-100 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-green-800 mb-4">
          🎉 SUCCESS! Dashboard is Working!
        </h1>
        <p className="text-green-700">
          This is the TEST DASHBOARD component. If you can see this message, 
          it means the routing and authentication is working properly.
        </p>
        
        <div className="mt-4 p-4 bg-white rounded border">
          <h2 className="font-semibold mb-2">Authentication Status:</h2>
          <ul className="space-y-1 text-sm">
            <li>✅ User successfully authenticated</li>
            <li>✅ Router displaying protected content</li>
            <li>✅ Component rendering correctly</li>
          </ul>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          User: admin001 | LACRA Officer | Regulatory Portal
        </div>
      </div>
    </div>
  );
}