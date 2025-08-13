function App() {
  console.log('App component rendering...');
  
  return (
    <div style={{ 
      padding: '20px', 
      fontSize: '18px', 
      background: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'red' }}>DEBUG: React App is Working</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Current URL: {window.location.href}</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}

export default App;