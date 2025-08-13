function App() {
  console.log('🔍 Debug App: Component rendering started');
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'blue', 
      color: 'white', 
      fontSize: '24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div>
        <h1>REACT IS WORKING</h1>
        <p>Time: {new Date().toLocaleString()}</p>
        <p>If you can see this, React is functional</p>
      </div>
    </div>
  );
}

export default App;