import React from "react";

function SimpleTestApp() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      color: "white",
      fontFamily: "system-ui"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🎉 Platform is Working!
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
          Your Polipus Platform is now running successfully
        </p>
        <div style={{ 
          marginTop: "2rem", 
          padding: "1rem",
          backgroundColor: "rgba(5, 150, 105, 0.2)",
          borderRadius: "8px",
          border: "1px solid #059669"
        }}>
          <p>✅ Server: Active</p>
          <p>✅ React: Mounting</p>
          <p>✅ Frontend: Operational</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleTestApp;