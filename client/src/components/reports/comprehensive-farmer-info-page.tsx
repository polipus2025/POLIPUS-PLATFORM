import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  Crop, 
  Target, 
  TrendingUp, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Leaf,
  TreePine,
  BarChart3,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Home,
  Landmark
} from "lucide-react";

interface FarmerProfile {
  // Basic Information
  farmerId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  idNumber?: string;
  profilePicture?: string;
  
  // Location Information
  county: string;
  district?: string;
  village?: string;
  address?: string;
  gpsCoordinates: string;
  
  // Farm Information
  farmSize: number;
  farmSizeUnit: string;
  farmBoundaries?: Array<{lat: number, lng: number, point: number}>;
  totalPlots: number;
  cultivatedArea: number;
  fallowArea: number;
  
  // Agricultural Details
  primaryCrops: string[];
  secondaryCrops: string[];
  farmingMethods: string[];
  irrigationSystems: string[];
  soilType: string;
  
  // Registration Details
  registrationDate: string;
  lastUpdated: string;
  agreementSigned: boolean;
  registrationStatus: 'active' | 'pending' | 'suspended' | 'inactive';
  
  // Compliance & Certifications
  complianceScore: number;
  certifications: string[];
  inspectionHistory: Array<{
    date: string;
    type: string;
    result: 'passed' | 'failed' | 'conditional';
    notes: string;
  }>;
  
  // Production & Performance
  annualProduction: number;
  productionUnit: string;
  yieldPerHectare: number;
  qualityRating: number;
  
  // Financial Information
  estimatedFarmValue: number;
  annualIncome: number;
  cooperativeMembership?: string;
  bankAccount?: string;
  
  // Environmental Data
  environmentalScore: number;
  sustainablePractices: string[];
  forestCoverPercent: number;
  carbonFootprint: number;
  waterUsage: number;
  
  // Technology & Equipment
  technologyAdoption: string[];
  equipmentOwned: string[];
  internetAccess: boolean;
  smartphoneOwner: boolean;
  
  // Social & Economic Impact
  employeesHired: number;
  communityInvolvement: string[];
  trainingCompleted: string[];
  
  // Reports & Documentation
  reportsGenerated: Array<{
    type: 'deforestation' | 'eudr' | 'inspection' | 'financial';
    date: string;
    status: 'completed' | 'pending' | 'expired';
    id: string;
  }>;
}

interface ComprehensiveFarmerInfoPageProps {
  farmer: FarmerProfile;
  onDownloadProfile?: () => void;
  onViewReport?: (reportId: string, reportType: string) => void;
  onEditProfile?: () => void;
}

export default function ComprehensiveFarmerInfoPageComponent({ 
  farmer, 
  onDownloadProfile,
  onViewReport,
  onEditProfile 
}: ComprehensiveFarmerInfoPageProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'passed': case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': case 'conditional': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'suspended': case 'failed': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'inactive': case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateFarmUtilization = () => {
    return farmer.farmSize > 0 ? (farmer.cultivatedArea / farmer.farmSize) * 100 : 0;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 bg-gray-50">
      {/* Header Section */}
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={farmer.profilePicture} alt={`${farmer.firstName} ${farmer.lastName}`} />
              <AvatarFallback className="text-2xl bg-green-100 text-green-800">
                {farmer.firstName[0]}{farmer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {farmer.firstName} {farmer.lastName}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">Farmer ID: {farmer.farmerId}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getStatusColor(farmer.registrationStatus)} large>
                      {farmer.registrationStatus.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Registered: {formatDate(farmer.registrationDate)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 md:mt-0">
                  <Button onClick={onEditProfile} variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button onClick={onDownloadProfile} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Crop className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{farmer.farmSize}</div>
            <p className="text-sm text-gray-600">{farmer.farmSizeUnit} Total Farm</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{farmer.yieldPerHectare}</div>
            <p className="text-sm text-gray-600">Yield/Hectare</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <div className={`text-2xl font-bold ${getScoreColor(farmer.complianceScore)}`}>
              {farmer.complianceScore}%
            </div>
            <p className="text-sm text-gray-600">Compliance Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TreePine className="h-8 w-8 mx-auto text-teal-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{farmer.forestCoverPercent}%</div>
            <p className="text-sm text-gray-600">Forest Cover</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">{farmer.firstName} {farmer.lastName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">ID Number</label>
                <p className="text-gray-900">{farmer.idNumber || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{farmer.phoneNumber}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{farmer.email || 'Not provided'}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-gray-700">Technology Access</label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Smartphone className={`h-4 w-4 ${farmer.smartphoneOwner ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-sm">Smartphone</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className={`h-4 w-4 ${farmer.internetAccess ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-sm">Internet</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">County</label>
                <p className="text-gray-900">{farmer.county}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">District</label>
                <p className="text-gray-900">{farmer.district || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Village</label>
                <p className="text-gray-900">{farmer.village || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">GPS Coordinates</label>
                <p className="text-gray-900 font-mono text-sm">{farmer.gpsCoordinates}</p>
              </div>
            </div>
            
            {farmer.address && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <div className="flex items-start gap-2 mt-1">
                    <Home className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-gray-900">{farmer.address}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Farm Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Farm Information & Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Farm Size</h4>
              <p className="text-2xl font-bold text-gray-900">{farmer.farmSize} {farmer.farmSizeUnit}</p>
              <p className="text-sm text-gray-600">Total area</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Cultivated Area</h4>
              <p className="text-2xl font-bold text-green-600">{farmer.cultivatedArea} {farmer.farmSizeUnit}</p>
              <p className="text-sm text-gray-600">{calculateFarmUtilization().toFixed(1)}% utilization</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Total Plots</h4>
              <p className="text-2xl font-bold text-blue-600">{farmer.totalPlots}</p>
              <p className="text-sm text-gray-600">Registered plots</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Fallow Area</h4>
              <p className="text-2xl font-bold text-yellow-600">{farmer.fallowArea} {farmer.farmSizeUnit}</p>
              <p className="text-sm text-gray-600">Resting land</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Primary Crops</h4>
              <div className="flex flex-wrap gap-2">
                {farmer.primaryCrops.map((crop, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {crop}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Secondary Crops</h4>
              <div className="flex flex-wrap gap-2">
                {farmer.secondaryCrops.map((crop, index) => (
                  <Badge key={index} variant="outline">
                    {crop}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Farming Methods</h4>
              <ul className="space-y-2">
                {farmer.farmingMethods.map((method, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">{method}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Infrastructure</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Soil Type</label>
                  <p className="text-gray-900">{farmer.soilType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Irrigation Systems</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {farmer.irrigationSystems.map((system, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Production & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Annual Production:</span>
                <span className="font-medium">{farmer.annualProduction} {farmer.productionUnit}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Yield per Hectare:</span>
                <span className="font-medium">{farmer.yieldPerHectare} {farmer.productionUnit}/ha</span>
              </div>
              
              <div className="flex justify-between">
                <span>Quality Rating:</span>
                <div className="flex items-center gap-2">
                  <Progress value={farmer.qualityRating * 20} className="h-2 w-20" />
                  <span className="font-medium">{farmer.qualityRating}/5</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 p-3 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Financial Overview</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Estimated Farm Value:</span>
                  <span className="font-medium">${farmer.estimatedFarmValue?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Income:</span>
                  <span className="font-medium">${farmer.annualIncome?.toLocaleString()}</span>
                </div>
                {farmer.cooperativeMembership && (
                  <div className="flex justify-between">
                    <span>Cooperative:</span>
                    <span className="font-medium">{farmer.cooperativeMembership}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Environmental Score</span>
                  <span className={`font-medium ${getScoreColor(farmer.environmentalScore)}`}>
                    {farmer.environmentalScore}%
                  </span>
                </div>
                <Progress value={farmer.environmentalScore} className="h-2" />
              </div>
              
              <div className="flex justify-between">
                <span>Forest Cover:</span>
                <span className="font-medium">{farmer.forestCoverPercent}%</span>
              </div>
              
              <div className="flex justify-between">
                <span>Carbon Footprint:</span>
                <span className="font-medium">{farmer.carbonFootprint} tCO₂/year</span>
              </div>
              
              <div className="flex justify-between">
                <span>Water Usage:</span>
                <span className="font-medium">{farmer.waterUsage} m³/year</span>
              </div>
            </div>

            <Separator />

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Sustainable Practices</h5>
              <div className="space-y-1">
                {farmer.sustainablePractices.map((practice, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-sm text-gray-700">{practice}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports & Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports & Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmer.reportsGenerated.map((report, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">
                    {report.type.replace('_', ' ')} Report
                  </h4>
                  <Badge className={getStatusColor(report.status)} small>
                    {report.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(report.date)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onViewReport?.(report.id, report.type)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {farmer.reportsGenerated.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No reports generated yet</p>
              <p className="text-sm">Reports will appear here once generated</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-3xl font-bold ${getScoreColor(farmer.complianceScore)}`}>
                {farmer.complianceScore}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Overall Compliance</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{farmer.certifications.length}</div>
              <p className="text-sm text-gray-600 mt-1">Active Certifications</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {farmer.inspectionHistory.filter(i => i.result === 'passed').length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Passed Inspections</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Active Certifications</h4>
              <div className="space-y-2">
                {farmer.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {cert}
                    </Badge>
                  </div>
                ))}
                {farmer.certifications.length === 0 && (
                  <p className="text-sm text-gray-500">No certifications on record</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Inspections</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {farmer.inspectionHistory.slice(0, 5).map((inspection, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-3 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{inspection.type}</span>
                      <Badge className={getStatusColor(inspection.result)} small>
                        {inspection.result.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(inspection.date)}
                    </div>
                    {inspection.notes && (
                      <p className="text-xs text-gray-600 mt-1">{inspection.notes}</p>
                    )}
                  </div>
                ))}
                {farmer.inspectionHistory.length === 0 && (
                  <p className="text-sm text-gray-500">No inspection history</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community & Social Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            Community & Social Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Employment</h4>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{farmer.employeesHired}</div>
                <p className="text-sm text-blue-800">Employees Hired</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Community Involvement</h4>
              <div className="space-y-1">
                {farmer.communityInvolvement.map((activity, index) => (
                  <div key={index} className="text-sm text-gray-700">{activity}</div>
                ))}
                {farmer.communityInvolvement.length === 0 && (
                  <p className="text-sm text-gray-500">Not specified</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Training Completed</h4>
              <div className="space-y-1">
                {farmer.trainingCompleted.map((training, index) => (
                  <Badge key={index} variant="outline" small>
                    {training}
                  </Badge>
                ))}
                {farmer.trainingCompleted.length === 0 && (
                  <p className="text-sm text-gray-500">No training records</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}