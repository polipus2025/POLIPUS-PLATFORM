export default function WarehouseInspectorLogin() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Warehouse Inspector Login</h1>
          <p className="text-slate-600 mt-2">Access the warehouse inspection portal</p>
        </div>
        
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
            <input 
              id="username"
              type="text" 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <input 
              id="password"
              type="password" 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In to Warehouse Portal
          </button>
        </form>
      </div>
    </div>
  );
}