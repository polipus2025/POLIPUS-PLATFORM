export default function SimpleTest() {
  console.log('SimpleTest component loaded');
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <h1>Simple Test Page</h1>
      <p>If you can see this, React is working correctly.</p>
      <div>Current URL: {window.location.pathname}</div>
      <div>Time: {new Date().toLocaleString()}</div>
    </div>
  );
}