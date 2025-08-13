import React from 'react';

export default function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          ✅ Polipus Platform - React Working
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Platform successfully initialized and React is rendering correctly.
        </p>
        <div style={{ 
          backgroundColor: '#059669', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          System Status: Active
        </div>
      </div>
    </div>
  );
}