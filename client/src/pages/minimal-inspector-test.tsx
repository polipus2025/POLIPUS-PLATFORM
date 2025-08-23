import React from "react";

export default function MinimalInspectorTest() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🚀 INSPECTOR PORTAL IS WORKING!</h1>
        <p>SUCCESS - Routing Fixed!</p>
        <div style={{ marginTop: '20px' }}>
          <a href="/land-inspector-login" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#059669', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            margin: '0 10px'
          }}>Land Inspector</a>
          <a href="/warehouse-inspector-login" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#7c3aed', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            margin: '0 10px'
          }}>Warehouse Inspector</a>
          <a href="/port-inspector-login" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px',
            margin: '0 10px'
          }}>Port Inspector</a>
        </div>
      </div>
    </div>
  );
}