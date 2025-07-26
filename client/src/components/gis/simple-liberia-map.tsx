import React from 'react';

export default function SimpleLiberiaMap() {
  return (
    <div className="w-full h-full bg-blue-50 relative">
      {/* Simple, clear map of Liberia */}
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Atlantic Ocean Background */}
        <rect width="800" height="600" fill="#3B82F6" opacity="0.2" />
        
        {/* Liberia Country Shape - Simplified but recognizable */}
        <path
          d="M 100 250 
             L 150 240 
             L 200 235 
             L 250 230 
             L 300 228 
             L 350 230 
             L 400 235 
             L 450 240 
             L 500 248 
             L 540 260 
             L 570 275 
             L 590 295 
             L 600 320 
             L 605 350 
             L 600 380 
             L 590 410 
             L 570 435 
             L 540 455 
             L 500 470 
             L 450 480 
             L 400 485 
             L 350 488 
             L 300 485 
             L 250 480 
             L 200 470 
             L 150 455 
             L 110 435 
             L 80 410 
             L 60 380 
             L 50 350 
             L 55 320 
             L 60 295 
             L 80 275 
             L 100 250 Z"
          fill="#22C55E"
          stroke="#16A34A"
          strokeWidth="3"
          className="drop-shadow-lg"
        />
        
        {/* Country Name - Large and Clear */}
        <text 
          x="325" 
          y="370" 
          textAnchor="middle" 
          className="text-3xl font-bold fill-white drop-shadow-md"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          LIBERIA
        </text>
        
        {/* Major Cities with Clear Labels */}
        <g>
          {/* Monrovia - Capital */}
          <circle cx="120" cy="280" r="8" fill="#DC2626" stroke="white" strokeWidth="3" />
          <rect x="135" y="270" width="80" height="20" fill="white" stroke="#DC2626" strokeWidth="1" rx="4" />
          <text x="175" y="283" textAnchor="middle" className="text-sm font-bold fill-red-700">
            MONROVIA
          </text>
          <text x="175" y="295" textAnchor="middle" className="text-xs fill-red-600">
            (Capital City)
          </text>
          
          {/* Gbarnga */}
          <circle cx="280" cy="340" r="6" fill="#DC2626" stroke="white" strokeWidth="2" />
          <rect x="295" y="332" width="60" height="16" fill="white" stroke="#DC2626" strokeWidth="1" rx="3" />
          <text x="325" y="343" textAnchor="middle" className="text-sm font-semibold fill-red-700">
            Gbarnga
          </text>
          
          {/* Buchanan */}
          <circle cx="200" cy="380" r="6" fill="#DC2626" stroke="white" strokeWidth="2" />
          <rect x="215" y="372" width="60" height="16" fill="white" stroke="#DC2626" strokeWidth="1" rx="3" />
          <text x="245" y="383" textAnchor="middle" className="text-sm font-semibold fill-red-700">
            Buchanan
          </text>
          
          {/* Harper */}
          <circle cx="480" cy="450" r="6" fill="#DC2626" stroke="white" strokeWidth="2" />
          <rect x="495" y="442" width="50" height="16" fill="white" stroke="#DC2626" strokeWidth="1" rx="3" />
          <text x="520" y="453" textAnchor="middle" className="text-sm font-semibold fill-red-700">
            Harper
          </text>
        </g>
        
        {/* Neighboring Countries with Clear Labels */}
        <g className="text-purple-600 font-semibold">
          <text x="150" y="200" className="text-lg">SIERRA LEONE</text>
          <text x="350" y="180" className="text-lg">GUINEA</text>
          <text x="550" y="220" className="text-lg">CÔTE D'IVOIRE</text>
        </g>
        
        {/* Atlantic Ocean Label */}
        <text 
          x="50" 
          y="450" 
          className="text-xl font-bold fill-blue-600" 
          transform="rotate(-90 50 450)"
        >
          ATLANTIC OCEAN
        </text>
        
        {/* Geographic Information Box */}
        <g>
          <rect x="620" y="50" width="160" height="120" fill="white" stroke="#374151" strokeWidth="2" rx="8" />
          <text x="700" y="75" textAnchor="middle" className="text-lg font-bold fill-gray-800">
            REPUBLIC OF LIBERIA
          </text>
          <text x="630" y="95" className="text-sm fill-gray-600">
            Capital: Monrovia
          </text>
          <text x="630" y="110" className="text-sm fill-gray-600">
            Population: 5.2 million
          </text>
          <text x="630" y="125" className="text-sm fill-gray-600">
            Area: 111,369 km²
          </text>
          <text x="630" y="140" className="text-sm fill-gray-600">
            Currency: Liberian Dollar
          </text>
          <text x="630" y="155" className="text-sm fill-gray-600">
            Founded: 1847
          </text>
        </g>
        
        {/* Scale Bar */}
        <g transform="translate(650, 500)">
          <line x1="0" y1="0" x2="80" y2="0" stroke="#374151" strokeWidth="3" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#374151" strokeWidth="3" />
          <line x1="80" y1="-5" x2="80" y2="5" stroke="#374151" strokeWidth="3" />
          <text x="40" y="-10" textAnchor="middle" className="text-sm font-bold fill-gray-700">
            100 km
          </text>
        </g>
        
        {/* Compass */}
        <g transform="translate(720, 100)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#374151" strokeWidth="2" />
          <polygon points="0,-20 5,5 0,0 -5,5" fill="#DC2626" />
          <text x="0" y="-35" textAnchor="middle" className="text-lg font-bold fill-gray-700">
            N
          </text>
        </g>
      </svg>
    </div>
  );
}