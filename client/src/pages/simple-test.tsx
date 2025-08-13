export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-black mb-4">Simple Test Page</h1>
      <p className="text-xl text-gray-800 mb-4">This is a basic test page to verify routing is working.</p>
      <div className="bg-green-100 p-4 rounded-lg">
        <p className="text-green-800">If you can see this, the React components are rendering correctly.</p>
      </div>
    </div>
  );
}