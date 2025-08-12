export default function FrontPage() {
  console.log('🚀 FrontPage component loading...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
            POLIPUS PLATFORM
          </h1>
          <p className="text-xl text-gray-300 mb-4">Environmental Intelligence System</p>
          <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
            ✅ SYSTEM OPERATIONAL
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
            <div className="text-3xl font-bold text-green-400">1/8</div>
            <div className="text-gray-400">Active Modules</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
            <div className="text-3xl font-bold text-blue-400">100%</div>
            <div className="text-gray-400">EUDR Compliance</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
            <div className="text-3xl font-bold text-orange-400">7</div>
            <div className="text-gray-400">In Development</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
            <div className="text-3xl font-bold text-purple-400">Global</div>
            <div className="text-gray-400">Coverage</div>
          </div>
        </div>

        {/* Access Links */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-green-500/20">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Platform Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/regulatory-login" className="block bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg transition-colors">
              🏛️ Regulatory
            </a>
            <a href="/farmer-login" className="block bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg transition-colors">
              👨‍🌾 Farmer
            </a>
            <a href="/field-agent-login" className="block bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg transition-colors">
              📱 Field Agent
            </a>
            <a href="/exporter-login" className="block bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg transition-colors">
              🚢 Exporter
            </a>
            <a href="/dashboard" className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-lg transition-colors">
              📊 Dashboard
            </a>
            <a href="/commodities" className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-lg transition-colors">
              🌾 Commodities
            </a>
            <a href="/certifications" className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-lg transition-colors">
              📜 Certifications
            </a>
            <a href="/reports" className="block bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-lg transition-colors">
              📈 Reports
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}