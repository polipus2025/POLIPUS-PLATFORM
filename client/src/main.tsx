import { createRoot } from "react-dom/client";

// Ultra-basic React component with zero dependencies
function UltraBasicApp() {
  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
      <h1 style={{color: 'green', fontSize: '24px'}}>🎉 REACT FIXED - POLIPUS WORKING!</h1>
      <p>React application is mounting successfully!</p>
      <div style={{background: 'lightgray', padding: '10px', margin: '10px 0'}}>
        Service Worker and complex imports removed to isolate issue
      </div>
    </div>
  );
}

// Render without service worker or complex setup
createRoot(document.getElementById("root")!).render(<UltraBasicApp />);
