import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function SimpleWorkingMap() {
  return (
    <div style={{ width: '100%', minHeight: '600px' }}>
      {/* Test if basic HTML renders */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #10b981 100%)', 
        padding: '20px', 
        borderRadius: '8px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
          🇱🇷 REPUBLIC OF LIBERIA
        </h1>
        <div style={{ fontSize: '16px' }}>West Africa • Capital: Monrovia</div>
        <div style={{ fontSize: '14px', opacity: '0.9' }}>6.428°N, 9.430°W</div>
      </div>

      {/* Simple country representation */}
      <div style={{ 
        background: '#e0f2fe', 
        padding: '40px', 
        borderRadius: '8px', 
        position: 'relative',
        minHeight: '300px',
        border: '2px solid #0369a1'
      }}>
        
        {/* Ocean background */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'linear-gradient(to right, #bfdbfe, #93c5fd)',
          borderRadius: '6px'
        }}></div>
        
        {/* Liberia shape */}
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '80px',
          width: '160px',
          height: '100px',
          background: 'linear-gradient(135deg, #16a34a, #15803d)',
          borderRadius: '20px 40px 30px 15px',
          border: '3px solid #166534',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          <span style={{ 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '18px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            LIBERIA
          </span>
        </div>
        
        {/* Monrovia marker */}
        <div style={{
          position: 'absolute',
          top: '90px',
          left: '110px',
          width: '12px',
          height: '12px',
          background: '#dc2626',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}></div>
        
        {/* Monrovia label */}
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '130px',
          background: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#dc2626',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          Monrovia ⭐
        </div>
        
        {/* Neighboring countries */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#7c3aed',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          SIERRA LEONE
        </div>
        
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '60px',
          color: '#7c3aed',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          GUINEA
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: '#7c3aed',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          CÔTE D'IVOIRE
        </div>
        
        {/* Atlantic Ocean */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          color: '#1e40af',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          ATLANTIC OCEAN
        </div>
      </div>

      {/* Information grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        <div style={{ 
          background: '#f0f9ff', 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid #0ea5e9' 
        }}>
          <h3 style={{ color: '#0369a1', fontWeight: 'bold', marginBottom: '12px' }}>
            Basic Information
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div><strong>Capital:</strong> Monrovia</div>
            <div><strong>Population:</strong> 5.2 million</div>
            <div><strong>Area:</strong> 111,369 km²</div>
            <div><strong>Independence:</strong> July 26, 1847</div>
          </div>
        </div>
        
        <div style={{ 
          background: '#f0fdf4', 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid #22c55e' 
        }}>
          <h3 style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '12px' }}>
            Geographic Coordinates
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div><strong>Center:</strong> 6.428°N, 9.430°W</div>
            <div><strong>Capital:</strong> 6.31°N, 10.80°W</div>
            <div><strong>Region:</strong> West Africa</div>
            <div><strong>Coastline:</strong> 680 km</div>
          </div>
        </div>
      </div>

      {/* Map access buttons */}
      <div style={{ 
        background: '#fefce8', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '2px solid #eab308',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#a16207', fontWeight: 'bold', marginBottom: '16px' }}>
          Open Full Interactive Maps
        </h3>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open('https://www.google.com/maps/place/Liberia/@6.428055,-9.429499,7z', '_blank')}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗺️ Google Maps
          </button>
          <button
            onClick={() => window.open('https://www.openstreetmap.org/#map=7/6.428/-9.430', '_blank')}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🌍 OpenStreetMap
          </button>
          <button
            onClick={() => window.open('https://www.bing.com/maps?q=Liberia', '_blank')}
            style={{
              background: '#8b5cf6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗺️ Bing Maps
          </button>
        </div>
        <div style={{ fontSize: '12px', color: '#a16207', marginTop: '12px' }}>
          These buttons open real interactive maps of Liberia in new windows
        </div>
      </div>
    </div>
  );
}