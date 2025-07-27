import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, TrendingUp, Eye } from 'lucide-react';

const LIBERIA_COUNTIES = [
  { name: 'Montserrado', farms: 342, compliance: 94, population: '1.3M', color: '#DC2626' },
  { name: 'Lofa', farms: 287, compliance: 89, population: '310K', color: '#EA580C' },
  { name: 'Nimba', farms: 298, compliance: 92, population: '468K', color: '#D97706' },
  { name: 'Bong', farms: 234, compliance: 88, population: '333K', color: '#CA8A04' },
  { name: 'Grand Gedeh', farms: 156, compliance: 85, population: '125K', color: '#65A30D' },
  { name: 'Grand Cape Mount', farms: 189, compliance: 90, population: '127K', color: '#059669' },
  { name: 'Grand Bassa', farms: 198, compliance: 91, population: '224K', color: '#0891B2' },
  { name: 'Sinoe', farms: 167, compliance: 87, population: '104K', color: '#0284C7' },
  { name: 'Maryland', farms: 145, compliance: 93, population: '136K', color: '#3B82F6' },
  { name: 'Grand Kru', farms: 134, compliance: 86, population: '57K', color: '#6366F1' },
  { name: 'Rivercess', farms: 89, compliance: 84, population: '71K', color: '#8B5CF6' },
  { name: 'Gbarpolu', farms: 112, compliance: 88, population: '83K', color: '#A855F7' },
  { name: 'Margibi', farms: 156, compliance: 95, population: '209K', color: '#C026D3' },
  { name: 'River Gee', farms: 98, compliance: 82, population: '67K', color: '#E11D48' },
  { name: 'Bomi', farms: 87, compliance: 91, population: '84K', color: '#F59E0B' }
];

export default function VisualLiberiaMap() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  
  const selectedData = selectedCounty 
    ? LIBERIA_COUNTIES.find(c => c.name === selectedCounty)
    : null;

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Map View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Table View
          </Button>
        </div>
        <Badge variant="outline">15 Counties</Badge>
      </div>

      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Map Representation */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Liberia Agricultural Counties - Visual Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 min-h-96">
                  {/* Visual representation using CSS blocks */}
                  <div className="relative w-full h-80">
                    {/* Liberia outline using CSS borders and positioning */}
                    <div className="absolute inset-0 bg-green-100 rounded-lg border-4 border-green-400 opacity-30"></div>
                    
                    {/* County blocks positioned to represent Liberia shape */}
                    <div className="absolute top-4 left-8 w-16 h-12 bg-red-600 rounded cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                         onClick={() => setSelectedCounty('Montserrado')}
                         style={{ backgroundColor: selectedCounty === 'Montserrado' ? '#059669' : '#DC2626' }}>
                      MON
                    </div>
                    
                    <div className="absolute top-8 left-28 w-14 h-10 bg-orange-600 rounded cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                         onClick={() => setSelectedCounty('Lofa')}
                         style={{ backgroundColor: selectedCounty === 'Lofa' ? '#059669' : '#EA580C' }}>
                      LOF
                    </div>
                    
                    <div className="absolute top-20 left-48 w-16 h-12 bg-yellow-600 rounded cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                         onClick={() => setSelectedCounty('Nimba')}
                         style={{ backgroundColor: selectedCounty === 'Nimba' ? '#059669' : '#D97706' }}>
                      NIM
                    </div>
                    
                    <div className="absolute top-36 left-20 w-14 h-10 bg-green-600 rounded cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                         onClick={() => setSelectedCounty('Bong')}
                         style={{ backgroundColor: selectedCounty === 'Bong' ? '#059669' : '#CA8A04' }}>
                      BON
                    </div>
                    
                    <div className="absolute bottom-16 left-12 w-12 h-10 bg-blue-600 rounded cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                         onClick={() => setSelectedCounty('Grand Bassa')}
                         style={{ backgroundColor: selectedCounty === 'Grand Bassa' ? '#059669' : '#0891B2' }}>
                      GBA
                    </div>
                    
                    <div className="absolute bottom-8 left-32 w-14 h-8 bg-purple-600 rounded cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                         onClick={() => setSelectedCounty('Sinoe')}
                         style={{ backgroundColor: selectedCounty === 'Sinoe' ? '#059669' : '#0284C7' }}>
                      SIN
                    </div>
                    
                    <div className="absolute bottom-4 right-20 w-12 h-10 bg-indigo-600 rounded cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                         onClick={() => setSelectedCounty('Maryland')}
                         style={{ backgroundColor: selectedCounty === 'Maryland' ? '#059669' : '#3B82F6' }}>
                      MAR
                    </div>
                    
                    {/* Additional counties */}
                    <div className="absolute top-16 right-16 w-12 h-8 bg-pink-600 rounded cursor-pointer hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                         onClick={() => setSelectedCounty('Grand Gedeh')}
                         style={{ backgroundColor: selectedCounty === 'Grand Gedeh' ? '#059669' : '#65A30D' }}>
                      GGE
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow">
                      <h4 className="font-semibold text-sm mb-2">Legend</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-600 rounded"></div>
                          <span>County</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-600 rounded"></div>
                          <span>Selected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* County Details */}
          <div>
            {selectedData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedData.name} County</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Active Farms</span>
                      </div>
                      <span className="font-bold text-green-700">{selectedData.farms}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Population</span>
                      </div>
                      <span className="font-bold text-blue-700">{selectedData.population}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Compliance Rate</span>
                      </div>
                      <Badge variant={selectedData.compliance >= 90 ? 'default' : 'secondary'}>
                        {selectedData.compliance}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click on a county to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardHeader>
            <CardTitle>Liberia Counties - Table View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">County</th>
                    <th className="text-left p-2">Active Farms</th>
                    <th className="text-left p-2">Population</th>
                    <th className="text-left p-2">Compliance</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {LIBERIA_COUNTIES.map((county) => (
                    <tr 
                      key={county.name} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCounty(county.name)}
                    >
                      <td className="p-2 font-medium">{county.name}</td>
                      <td className="p-2">{county.farms}</td>
                      <td className="p-2">{county.population}</td>
                      <td className="p-2">
                        <Badge variant={county.compliance >= 90 ? 'default' : 'secondary'}>
                          {county.compliance}%
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: county.color }}
                        ></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}