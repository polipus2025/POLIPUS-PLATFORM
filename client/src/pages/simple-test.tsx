export default function SimpleTest() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: 'red', 
        fontSize: '48px', 
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        🚨 TEST SEMPLICE FUNZIONA! 🚨
      </h1>
      
      <div style={{
        backgroundColor: 'yellow',
        padding: '20px',
        border: '5px solid red',
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px'
      }}>
        Se vedi questo testo giallo, l'applicazione React funziona!
      </div>
      
      <div style={{
        backgroundColor: 'lightgreen',
        padding: '20px',
        border: '3px solid green',
        textAlign: 'center',
        fontSize: '18px'
      }}>
        <p><strong>TEST COMPONENTI:</strong></p>
        <p>✅ React rendering: OK</p>
        <p>✅ CSS styling: OK</p>
        <p>✅ Text display: OK</p>
        <p>✅ Colors: OK</p>
      </div>
      
      <div style={{
        backgroundColor: 'lightblue',
        padding: '20px',
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '16px'
      }}>
        <p>Vai su: <strong>http://localhost:5000/simple-test</strong></p>
        <p>Per vedere questa pagina direttamente</p>
      </div>
    </div>
  );
}