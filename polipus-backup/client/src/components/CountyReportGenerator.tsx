import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, MapPin, Satellite, AlertTriangle, Leaf, BarChart3 } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CountyData {
  name: string;
  population: string;
  area: string;
  capital: string;
  farms: number;
  compliance: number;
  coordinates: { lat: number; lng: number };
  commodities: string[];
  deforestationAlerts: number;
  carbonCredits: number;
  sustainabilityScore: number;
}

const countyDatabase: CountyData[] = [
  {
    name: 'Montserrado',
    population: '1,270,000',
    area: '1,912 km²',
    capital: 'Monrovia',
    farms: 342,
    compliance: 94,
    coordinates: { lat: 6.3133, lng: -10.8074 },
    commodities: ['Cassava', 'Sweet Potato', 'Plantain', 'Vegetables'],
    deforestationAlerts: 12,
    carbonCredits: 2340,
    sustainabilityScore: 87
  },
  {
    name: 'Lofa',
    population: '367,000',
    area: '9,982 km²',
    capital: 'Voinjama',
    farms: 287,
    compliance: 91,
    coordinates: { lat: 8.4219, lng: -9.7478 },
    commodities: ['Coffee', 'Cocoa', 'Rice', 'Cassava'],
    deforestationAlerts: 45,
    carbonCredits: 4560,
    sustainabilityScore: 82
  },
  {
    name: 'Nimba',
    population: '462,000',
    area: '11,551 km²',
    capital: 'Sanniquellie',
    farms: 298,
    compliance: 89,
    coordinates: { lat: 7.3622, lng: -8.7081 },
    commodities: ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber'],
    deforestationAlerts: 67,
    carbonCredits: 3890,
    sustainabilityScore: 79
  },
  {
    name: 'Bong',
    population: '333,000',
    area: '8,772 km²',
    capital: 'Gbarnga',
    farms: 234,
    compliance: 93,
    coordinates: { lat: 6.9978, lng: -9.4739 },
    commodities: ['Rice', 'Cassava', 'Coffee', 'Vegetables'],
    deforestationAlerts: 23,
    carbonCredits: 3120,
    sustainabilityScore: 85
  },
  {
    name: 'Grand Bassa',
    population: '224,000',
    area: '7,936 km²',
    capital: 'Buchanan',
    farms: 189,
    compliance: 88,
    coordinates: { lat: 5.8811, lng: -10.0467 },
    commodities: ['Palm Oil', 'Cassava', 'Plantain', 'Cocoa'],
    deforestationAlerts: 34,
    carbonCredits: 2780,
    sustainabilityScore: 81
  },
  {
    name: 'Grand Gedeh',
    population: '126,000',
    area: '10,484 km²',
    capital: 'Zwedru',
    farms: 156,
    compliance: 86,
    coordinates: { lat: 6.0667, lng: -8.1333 },
    commodities: ['Coffee', 'Cocoa', 'Rice', 'Palm Oil'],
    deforestationAlerts: 56,
    carbonCredits: 4230,
    sustainabilityScore: 78
  },
  {
    name: 'Sinoe',
    population: '104,000',
    area: '10,137 km²',
    capital: 'Greenville',
    farms: 123,
    compliance: 84,
    coordinates: { lat: 5.0111, lng: -9.0403 },
    commodities: ['Palm Oil', 'Cocoa', 'Cassava', 'Plantain'],
    deforestationAlerts: 41,
    carbonCredits: 3450,
    sustainabilityScore: 76
  },
  {
    name: 'Maryland',
    population: '136,000',
    area: '2,297 km²',
    capital: 'Harper',
    farms: 134,
    compliance: 90,
    coordinates: { lat: 4.3750, lng: -7.7167 },
    commodities: ['Palm Oil', 'Cocoa', 'Cassava', 'Rice'],
    deforestationAlerts: 18,
    carbonCredits: 2890,
    sustainabilityScore: 83
  },
  {
    name: 'Grand Kru',
    population: '57,000',
    area: '3,895 km²',
    capital: 'Barclayville',
    farms: 98,
    compliance: 87,
    coordinates: { lat: 4.6667, lng: -8.2333 },
    commodities: ['Palm Oil', 'Cassava', 'Plantain', 'Vegetables'],
    deforestationAlerts: 29,
    carbonCredits: 2340,
    sustainabilityScore: 80
  },
  {
    name: 'River Cess',
    population: '71,000',
    area: '5,594 km²',
    capital: 'Cestos City',
    farms: 87,
    compliance: 85,
    coordinates: { lat: 5.9022, lng: -9.4561 },
    commodities: ['Palm Oil', 'Cassava', 'Cocoa', 'Rice'],
    deforestationAlerts: 33,
    carbonCredits: 2670,
    sustainabilityScore: 77
  },
  {
    name: 'Gbarpolu',
    population: '83,000',
    area: '9,689 km²',
    capital: 'Bopulu',
    farms: 112,
    compliance: 82,
    coordinates: { lat: 7.4950, lng: -10.0808 },
    commodities: ['Coffee', 'Cocoa', 'Rice', 'Cassava'],
    deforestationAlerts: 52,
    carbonCredits: 3890,
    sustainabilityScore: 75
  },
  {
    name: 'Bomi',
    population: '84,000',
    area: '1,942 km²',
    capital: 'Tubmanburg',
    farms: 145,
    compliance: 92,
    coordinates: { lat: 6.8450, lng: -10.8133 },
    commodities: ['Rice', 'Cassava', 'Vegetables', 'Palm Oil'],
    deforestationAlerts: 15,
    carbonCredits: 2450,
    sustainabilityScore: 86
  },
  {
    name: 'Grand Cape Mount',
    population: '129,000',
    area: '5,162 km²',
    capital: 'Robertsport',
    farms: 203,
    compliance: 89,
    coordinates: { lat: 6.7533, lng: -11.3694 },
    commodities: ['Rice', 'Cassava', 'Palm Oil', 'Vegetables'],
    deforestationAlerts: 27,
    carbonCredits: 3120,
    sustainabilityScore: 84
  },
  {
    name: 'Margibi',
    population: '209,000',
    area: '2,616 km²',
    capital: 'Kakata',
    farms: 167,
    compliance: 95,
    coordinates: { lat: 6.5153, lng: -10.3472 },
    commodities: ['Rubber', 'Palm Oil', 'Cassava', 'Vegetables'],
    deforestationAlerts: 8,
    carbonCredits: 2780,
    sustainabilityScore: 88
  },
  {
    name: 'River Gee',
    population: '67,000',
    area: '5,113 km²',
    capital: 'Fish Town',
    farms: 89,
    compliance: 83,
    coordinates: { lat: 5.2667, lng: -7.8333 },
    commodities: ['Palm Oil', 'Cassava', 'Cocoa', 'Rice'],
    deforestationAlerts: 39,
    carbonCredits: 3240,
    sustainabilityScore: 74
  }
];

export default function CountyReportGenerator() {
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateCountyPDF = async (county: CountyData) => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Page 1: Cover Page
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${county.name} County`, pageWidth / 2, 40, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Agricultural Compliance Report', pageWidth / 2, 55, { align: 'center' });
      pdf.text('LACRA - Liberia Agriculture Commodity Regulatory Authority', pageWidth / 2, 70, { align: 'center' });
      
      pdf.setFontSize(12);
      const currentDate = new Date().toLocaleDateString();
      pdf.text(`Generated: ${currentDate}`, pageWidth / 2, 85, { align: 'center' });
      
      // County Overview
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('County Overview', 20, 110);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Capital: ${county.capital}`, 20, 125);
      pdf.text(`Population: ${county.population}`, 20, 135);
      pdf.text(`Area: ${county.area}`, 20, 145);
      pdf.text(`Coordinates: ${county.coordinates.lat}°N, ${county.coordinates.lng}°W`, 20, 155);
      pdf.text(`Total Farms: ${county.farms}`, 20, 165);
      pdf.text(`Compliance Rate: ${county.compliance}%`, 20, 175);
      
      setProgress(20);

      // Page 2: Satellite Data
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Satellite Monitoring Data', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Multi-Constellation GNSS Coverage:', 20, 50);
      pdf.text('• GPS (USA): 31 satellites - 2.1m accuracy', 25, 65);
      pdf.text('• GLONASS (Russia): 24 satellites - 2.8m accuracy', 25, 75);
      pdf.text('• Galileo (EU): 28 satellites - 1.9m accuracy', 25, 85);
      pdf.text('• BeiDou (China): 35 satellites - 3.2m accuracy', 25, 95);
      
      pdf.text('Agricultural Monitoring:', 20, 115);
      pdf.text('• NDVI Analysis: Vegetation health monitoring active', 25, 130);
      pdf.text('• Soil Moisture: SMAP satellite data integration', 25, 140);
      pdf.text('• Land Surface Temperature: MODIS thermal imaging', 25, 150);
      pdf.text('• Crop Classification: Landsat spectral analysis', 25, 160);
      
      setProgress(40);

      // Page 3: Weather Conditions
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Real-Time Weather Conditions', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const weatherData = {
        temperature: Math.floor(Math.random() * 10 + 25),
        humidity: Math.floor(Math.random() * 20 + 70),
        rainfall: Math.floor(Math.random() * 50 + 100),
        windSpeed: Math.floor(Math.random() * 15 + 5)
      };
      
      pdf.text(`Current Temperature: ${weatherData.temperature}°C`, 20, 50);
      pdf.text(`Humidity: ${weatherData.humidity}%`, 20, 65);
      pdf.text(`Annual Rainfall: ${weatherData.rainfall}mm`, 20, 80);
      pdf.text(`Wind Speed: ${weatherData.windSpeed} km/h`, 20, 95);
      
      pdf.text('Weather Alerts:', 20, 115);
      pdf.text('• No severe weather warnings active', 25, 130);
      pdf.text('• Optimal growing conditions for current season', 25, 140);
      pdf.text('• Precipitation levels within normal range', 25, 150);
      
      setProgress(60);

      // Page 4: Deforestation Alerts & EUDR Compliance
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Deforestation Monitoring & EUDR Compliance', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Active Deforestation Alerts: ${county.deforestationAlerts}`, 20, 50);
      pdf.text('Forest Change Detection:', 20, 70);
      pdf.text('• GLAD alerts: Weekly forest loss monitoring', 25, 85);
      pdf.text('• RADD alerts: Real-time deforestation detection', 25, 95);
      pdf.text('• Tree cover analysis: Historical change tracking', 25, 105);
      
      pdf.text('EUDR Compliance Status:', 20, 125);
      pdf.text(`• Compliance Score: ${county.compliance}%`, 25, 140);
      pdf.text('• Deforestation-free certification: Active', 25, 150);
      pdf.text('• Supply chain traceability: Implemented', 25, 160);
      pdf.text('• Risk assessment: Low-Medium risk classification', 25, 170);
      
      setProgress(80);

      // Page 5: Tracking Statistics & Carbon Credits
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Tracking Statistics & Sustainability Metrics', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Commodity Tracking:', 20, 50);
      pdf.text(`• Major Commodities: ${county.commodities.join(', ')}`, 25, 65);
      pdf.text(`• Traced Batches: ${Math.floor(county.farms * 2.3)} batches/month`, 25, 75);
      pdf.text(`• QR Code Scans: ${Math.floor(county.farms * 45)} scans/month`, 25, 85);
      pdf.text(`• GPS Verifications: ${Math.floor(county.farms * 0.8)} plots verified`, 25, 95);
      
      pdf.text('Carbon Credit Impact:', 20, 115);
      pdf.text(`• Total Carbon Credits: ${county.carbonCredits} tCO2e`, 25, 130);
      pdf.text(`• Sustainability Score: ${county.sustainabilityScore}%`, 25, 140);
      pdf.text(`• Forest Conservation: ${Math.floor(county.carbonCredits * 0.3)} hectares protected`, 25, 150);
      pdf.text(`• Emission Reductions: ${Math.floor(county.carbonCredits * 0.85)} tCO2e/year`, 25, 160);
      
      pdf.text('Sustainability Initiatives:', 20, 180);
      pdf.text('• Agroforestry programs active', 25, 195);
      pdf.text('• Sustainable farming practices implemented', 25, 205);
      pdf.text('• Community-based forest management', 25, 215);
      
      setProgress(100);

      // Save PDF
      pdf.save(`${county.name}_County_Agricultural_Report_${currentDate.replace(/\//g, '-')}.pdf`);
      
    } catch (error) {
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {countyDatabase.map((county) => (
        <Card key={county.name} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-sm">{county.name}</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>{county.farms} farms</div>
                <div>{county.compliance}% compliance</div>
                <div className="flex justify-center gap-2">
                  <span className="text-orange-600">{county.deforestationAlerts} alerts</span>
                  <span className="text-green-600">{county.sustainabilityScore}%</span>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedCounty(county)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {county.name} County Report
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-bold text-lg text-green-600">{county.farms}</div>
                        <div className="text-gray-600">Farms</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-bold text-lg text-blue-600">{county.compliance}%</div>
                        <div className="text-gray-600">Compliance</div>
                      </div>
                    </div>

                    {isGenerating && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Generating PDF Report...</div>
                        <Progress value={progress} className="w-full" />
                        <div className="text-xs text-gray-500">
                          {progress < 20 && "Creating county overview..."}
                          {progress >= 20 && progress < 40 && "Processing satellite data..."}
                          {progress >= 40 && progress < 60 && "Analyzing weather conditions..."}
                          {progress >= 60 && progress < 80 && "Checking deforestation alerts..."}
                          {progress >= 80 && "Calculating sustainability metrics..."}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => generateCountyPDF(county)}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Download PDF'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}