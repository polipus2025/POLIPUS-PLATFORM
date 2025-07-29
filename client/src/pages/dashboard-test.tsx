import { Helmet } from "react-helmet";

export default function DashboardTest() {
  return (
    <div className="min-h-screen bg-red-500 text-white p-8">
      <Helmet>
        <title>AgriTrace360™ LACRA Dashboard | Test</title>
        <meta name="description" content="Dashboard test page" />
      </Helmet>

      <div className="text-center">
        <h1 className="text-8xl font-bold mb-8">🔴 CRITICAL TEST 🔴</h1>
        <p className="text-4xl mb-4">CAN YOU SEE THIS RED PAGE?</p>
        <p className="text-2xl mb-8">This bypasses all components to test basic rendering</p>
        
        <div className="bg-yellow-400 text-black p-8 rounded-lg mb-8">
          <h2 className="text-3xl font-bold">YELLOW BOX TEST</h2>
          <p className="text-xl">If you can see this, React is working</p>
        </div>
        
        <div className="bg-green-500 text-white p-8 rounded-lg mb-8">
          <h2 className="text-3xl font-bold">GREEN BOX TEST</h2>
          <p className="text-xl">If you can see this, CSS is working</p>
        </div>
        
        <div className="bg-blue-500 text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold">BLUE BOX TEST</h2>
          <p className="text-xl">If you can see this, the page is fully loading</p>
        </div>
        
        <p className="text-lg mt-8">Your sophisticated dashboard is preserved and ready to restore!</p>
      </div>
    </div>
  );
}