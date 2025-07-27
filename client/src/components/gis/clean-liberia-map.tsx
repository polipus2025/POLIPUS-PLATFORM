import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, TrendingUp } from 'lucide-react';

const LIBERIA_COUNTIES = [
  { name: 'Montserrado', farms: 342, compliance: 94, population: '1.3M', x: 120, y: 280 },
  { name: 'Lofa', farms: 287, compliance: 89, population: '310K', x: 200, y: 200 },
  { name: 'Nimba', farms: 298, compliance: 92, population: '468K', x: 280, y: 340 },
  { name: 'Bong', farms: 234, compliance: 88, population: '333K', x: 220, y: 260 },
  { name: 'Grand Gedeh', farms: 156, compliance: 85, population: '125K', x: 380, y: 350 },
  { name: 'Grand Cape Mount', farms: 189, compliance: 90, population: '127K', x: 80, y: 220 },
  { name: 'Grand Bassa', farms: 198, compliance: 91, population: '224K', x: 180, y: 320 },
  { name: 'Sinoe', farms: 167, compliance: 87, population: '104K', x: 280, y: 380 },
  { name: 'Maryland', farms: 145, compliance: 93, population: '136K', x: 380, y: 420 },
  { name: 'Grand Kru', farms: 134, compliance: 86, population: '57K', x: 320, y: 400 },
  { name: 'Rivercess', farms: 89, compliance: 84, population: '71K', x: 220, y: 360 },
  { name: 'Gbarpolu', farms: 112, compliance: 88, population: '83K', x: 150, y: 180 },
  { name: 'Margibi', farms: 156, compliance: 95, population: '209K', x: 150, y: 300 },
  { name: 'River Gee', farms: 98, compliance: 82, population: '67K', x: 350, y: 380 },
  { name: 'Bomi', farms: 87, compliance: 91, population: '84K', x: 100, y: 260 }
];

export default function CleanLiberiaMap() {
  const [selectedCounty, setSelectedCounty] = React.useState<string | null>(null);
  
  const selectedData = selectedCounty 
    ? LIBERIA_COUNTIES.find(c => c.name === selectedCounty)
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Clean Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Liberia Agricultural Counties
                <Badge variant="outline" className="ml-2">Interactive Grid</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 h-96 relative overflow-hidden">
                {/* Clean Grid Layout */}
                <div className="grid grid-cols-3 gap-4 h-full">
                  {LIBERIA_COUNTIES.slice(0, 9).map((county, index) => (
                    <div
                      key={county.name}
                      className={`
                        border-2 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:scale-105
                        ${selectedCounty === county.name 
                          ? 'border-green-500 bg-green-100 shadow-lg' 
                          : 'border-gray-300 bg-white/80 hover:border-green-300'
                        }
                      `}
                      onClick={() => setSelectedCounty(county.name)}
                    >
                      <div className="text-center">
                        <div className="w-4 h-4 bg-red-600 mx-auto mb-2 rounded-sm"></div>
                        <h4 className="font-semibold text-xs mb-1">{county.name}</h4>
                        <p className="text-xs text-gray-600">{county.farms} farms</p>
                        <div className="mt-2">
                          <div className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${county.compliance >= 90 
                              ? 'bg-green-100 text-green-800' 
                              : county.compliance >= 85 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          `}>
                            {county.compliance}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Remaining Counties - Bottom Row */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="grid grid-cols-6 gap-2">
                    {LIBERIA_COUNTIES.slice(9).map((county) => (
                      <div
                        key={county.name}
                        className={`
                          border rounded p-2 cursor-pointer text-center text-xs transition-all
                          ${selectedCounty === county.name 
                            ? 'border-green-500 bg-green-100' 
                            : 'border-gray-300 bg-white/90 hover:border-green-300'
                          }
                        `}
                        onClick={() => setSelectedCounty(county.name)}
                      >
                        <div className="w-2 h-2 bg-red-600 mx-auto mb-1 rounded-sm"></div>
                        <div className="font-medium">{county.name.split(' ')[0]}</div>
                        <div className="text-gray-600">{county.farms}</div>
                      </div>
                    ))}
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
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-2">County Status</h4>
                  <div className="text-sm text-gray-600">
                    {selectedData.compliance >= 90 
                      ? '✅ Excellent compliance performance' 
                      : selectedData.compliance >= 85 
                        ? '⚠️ Good performance, minor improvements needed'
                        : '❌ Requires compliance enhancement'
                    }
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
                  <p className="text-sm mt-2">Interactive county grid system</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}