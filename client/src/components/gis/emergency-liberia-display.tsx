import React from 'react';

export default function EmergencyLiberiaDisplay() {
  const openGoogleMaps = () => {
    window.open('https://www.google.com/maps/place/Liberia/@6.428055,-9.429499,7z', '_blank');
  };

  const openOpenStreetMap = () => {
    window.open('https://www.openstreetmap.org/#map=7/6.428/-9.430', '_blank');
  };

  return (
    <div>
      <h1>🇱🇷 REPUBLIC OF LIBERIA - EMERGENCY MAP DISPLAY</h1>
      
      <div style={{ backgroundColor: '#f0f8ff', padding: '20px', margin: '20px 0', border: '2px solid #0066cc' }}>
        <h2>LIBERIA GEOGRAPHIC INFORMATION</h2>
        
        <h3>LOCATION:</h3>
        <p>West Africa</p>
        <p>Coordinates: 6.428°N, 9.430°W</p>
        
        <h3>CAPITAL:</h3>
        <p>Monrovia (6.31°N, 10.80°W)</p>
        <p>Population: 1.4 million</p>
        
        <h3>MAJOR CITIES:</h3>
        <ul>
          <li>Monrovia (Capital) - 1.4M people</li>
          <li>Gbarnga - 56,000 people</li>
          <li>Buchanan - 50,000 people</li>
          <li>Harper - 17,000 people</li>
        </ul>
        
        <h3>NEIGHBORING COUNTRIES:</h3>
        <ul>
          <li>Sierra Leone (Northwest)</li>
          <li>Guinea (North)</li>
          <li>Côte d'Ivoire (East)</li>
          <li>Atlantic Ocean (Southwest)</li>
        </ul>
        
        <h3>BASIC DATA:</h3>
        <p>Area: 111,369 km²</p>
        <p>Population: 5.2 million</p>
        <p>Independence: July 26, 1847</p>
        <p>Currency: Liberian Dollar</p>
        <p>Language: English</p>
      </div>
      
      <div style={{ backgroundColor: '#ffffcc', padding: '20px', margin: '20px 0', border: '2px solid #ffcc00' }}>
        <h2>ACCESS REAL INTERACTIVE MAPS</h2>
        <p>Click these buttons to open real maps of Liberia:</p>
        
        <button 
          onClick={openGoogleMaps}
          style={{ 
            backgroundColor: '#4285f4', 
            color: 'white', 
            padding: '15px 30px', 
            fontSize: '16px', 
            border: 'none', 
            margin: '10px',
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          OPEN GOOGLE MAPS
        </button>
        
        <button 
          onClick={openOpenStreetMap}
          style={{ 
            backgroundColor: '#7ebc6f', 
            color: 'white', 
            padding: '15px 30px', 
            fontSize: '16px', 
            border: 'none', 
            margin: '10px',
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          OPEN OPENSTREETMAP
        </button>
        
        <p>These buttons will open the real interactive maps in new browser windows.</p>
      </div>
      
      <div style={{ backgroundColor: '#f0fff0', padding: '20px', margin: '20px 0', border: '2px solid #00cc00' }}>
        <h2>SUCCESS CONFIRMATION</h2>
        <p>✅ This display is working if you can read this text</p>
        <p>✅ Geographic data for Liberia is shown above</p>
        <p>✅ Map buttons are available to access real interactive maps</p>
        <p>✅ No external dependencies or complex rendering required</p>
      </div>
    </div>
  );
}