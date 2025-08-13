// Ultra-minimal test to see if React can render anything
function TestSimple() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'green' }}>SIMPLE TEST WORKING</h1>
      <p>If you see this, React is mounting correctly.</p>
      <p>The issue is likely in the FrontPage component or its dependencies.</p>
    </div>
  );
}

export default TestSimple;