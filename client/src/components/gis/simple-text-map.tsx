import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const LIBERIA_COUNTIES = [
  { name: 'Montserrado', farms: 342, compliance: 94, population: '1.3M' },
  { name: 'Lofa', farms: 287, compliance: 89, population: '310K' },
  { name: 'Nimba', farms: 298, compliance: 92, population: '468K' },
  { name: 'Bong', farms: 234, compliance: 88, population: '333K' },
  { name: 'Grand Gedeh', farms: 156, compliance: 85, population: '125K' },
  { name: 'Grand Cape Mount', farms: 189, compliance: 90, population: '127K' },
  { name: 'Grand Bassa', farms: 198, compliance: 91, population: '224K' },
  { name: 'Sinoe', farms: 167, compliance: 87, population: '104K' },
  { name: 'Maryland', farms: 145, compliance: 93, population: '136K' },
  { name: 'Grand Kru', farms: 134, compliance: 86, population: '57K' },
  { name: 'Rivercess', farms: 89, compliance: 84, population: '71K' },
  { name: 'Gbarpolu', farms: 112, compliance: 88, population: '83K' },
  { name: 'Margibi', farms: 156, compliance: 95, population: '209K' },
  { name: 'River Gee', farms: 98, compliance: 82, population: '67K' },
  { name: 'Bomi', farms: 87, compliance: 91, population: '84K' }
];

export default function SimpleTextMap() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  
  const selectedData = selectedCounty 
    ? LIBERIA_COUNTIES.find(c => c.name === selectedCounty)
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* CLEAR VISUAL CONFIRMATION */}
      <div className="bg-red-500 text-white p-4 rounded-lg text-center">
        <h1 className="text-2xl font-bold">✅ NUOVO SISTEMA ATTIVO - SENZA SVG</h1>
        <p className="text-lg">Se vedi questo messaggio rosso, il sistema funziona!</p>
      </div>

      {/* Liberia Map - Pure HTML/CSS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-4 border-green-500">
          <CardHeader className="bg-green-100">
            <CardTitle className="text-2xl text-green-800">
              🇱🇷 LIBERIA - 15 CONTEE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Simple Grid Layout */}
            <div className="grid grid-cols-3 gap-4">
              {LIBERIA_COUNTIES.map((county, index) => (
                <div
                  key={county.name}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedCounty === county.name 
                      ? 'bg-green-200 border-green-600 scale-105' 
                      : 'bg-blue-100 border-blue-400 hover:bg-blue-200'
                    }
                  `}
                  onClick={() => setSelectedCounty(county.name)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏛️</div>
                    <h3 className="font-bold text-sm">{county.name}</h3>
                    <p className="text-xs text-gray-600">{county.farms} farms</p>
                    <div className="mt-2">
                      <Badge 
                        variant={county.compliance >= 90 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {county.compliance}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* County Details */}
        <Card className="border-4 border-blue-500">
          <CardHeader className="bg-blue-100">
            <CardTitle className="text-xl text-blue-800">
              📊 DETTAGLI CONTEA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedData ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-green-700">
                  {selectedData.name}
                </h2>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold">🚜 Farms Attive</div>
                    <div className="text-3xl font-bold text-green-600">
                      {selectedData.farms}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold">👥 Popolazione</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {selectedData.population}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold">✅ Compliance</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {selectedData.compliance}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-gray-600">
                  Clicca su una contea per vedere i dettagli
                </h3>
                <p className="text-gray-500 mt-2">
                  Sistema completamente rinnovato senza SVG
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Buttons */}
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🧪 TEST SISTEMA</h3>
        <div className="flex gap-2 flex-wrap">
          {LIBERIA_COUNTIES.slice(0, 5).map((county) => (
            <Button
              key={county.name}
              onClick={() => setSelectedCounty(county.name)}
              variant={selectedCounty === county.name ? 'default' : 'outline'}
              size="sm"
            >
              {county.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}