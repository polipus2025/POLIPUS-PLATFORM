import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Download,
  Activity,
  MapPin,
  Calendar,
  Users,
  Plus,
  Eye,
  Heart,
  Clock,
  TrendingUp,
  Shield
} from "lucide-react";

export default function DiseaseTracking() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Mock disease tracking data - would come from API
  const diseaseOutbreaks = [
    {
      id: "OUT-001",
      disease: "Foot-and-Mouth Disease",
      severity: "critical",
      status: "active",
      reportedDate: "2025-01-03",
      location: "Bong County - Sector 7",
      affectedAnimals: 47,
      species: "Cattle",
      symptoms: "Fever, blisters on mouth and feet, drooling, lameness",
      containmentMeasures: "Quarantine established, movement restrictions, vaccination campaign",
      lastUpdate: "2025-01-04 14:30",
      reportingVet: "Dr. James Wilson"
    },
    {
      id: "OUT-002",
      disease: "Newcastle Disease",
      severity: "high",
      status: "contained",
      reportedDate: "2025-01-01",
      location: "Grand Bassa - Poultry Zone A",
      affectedAnimals: 234,
      species: "Poultry",
      symptoms: "Respiratory distress, nervous symptoms, drop in egg production",
      containmentMeasures: "Affected birds culled, vaccination of healthy birds, disinfection",
      lastUpdate: "2025-01-04 10:15",
      reportingVet: "Dr. Mary Kpehe"
    },
    {
      id: "OUT-003",
      disease: "African Swine Fever",
      severity: "critical",
      status: "investigating",
      reportedDate: "2025-01-04",
      location: "Margibi County - Farm Complex 12",
      affectedAnimals: 12,
      species: "Pigs",
      symptoms: "High fever, hemorrhages, sudden death",
      containmentMeasures: "Movement ban, enhanced surveillance, laboratory testing",
      lastUpdate: "2025-01-04 16:45",
      reportingVet: "Dr. Samuel Roberts"
    },
    {
      id: "OUT-004",
      disease: "Peste des Petits Ruminants",
      severity: "medium",
      status: "monitoring",
      reportedDate: "2024-12-28",
      location: "Bong County - Pastoral Area 3",
      affectedAnimals: 18,
      species: "Goats",
      symptoms: "Fever, nasal discharge, diarrhea, pneumonia",
      containmentMeasures: "Vaccination program, health monitoring, movement control",
      lastUpdate: "2025-01-03 09:20",
      reportingVet: "Dr. Grace Tubman"
    },
    {
      id: "OUT-005",
      disease: "Lumpy Skin Disease",
      severity: "medium",
      status: "resolved",
      reportedDate: "2024-12-15",
      location: "Montserrado County - Dairy Farm 5",
      affectedAnimals: 8,
      species: "Cattle",
      symptoms: "Skin nodules, fever, swollen lymph nodes",
      containmentMeasures: "Treatment with antibiotics, vector control, vaccination",
      lastUpdate: "2024-12-30 11:30",
      reportingVet: "Dr. Joseph Clarke"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'contained': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'investigating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const filteredOutbreaks = diseaseOutbreaks.filter(outbreak => {
    const matchesSearch = outbreak.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outbreak.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outbreak.species.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSeverity === 'all' || outbreak.severity === filterSeverity;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Disease Tracking - LiveTrace Veterinary Portal</title>
        <meta name="description" content="Comprehensive disease outbreak tracking and management system" />
      </Helmet>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">LiveTrace</h1>
                <p className="text-sm text-slate-600">Veterinary Portal</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <a 
              href="/livetrace-veterinary-dashboard" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Activity className="h-4 w-4" />
              Dashboard
            </a>
            <a 
              href="/livetrace-health-monitoring" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Health Monitoring
            </a>
            <a 
              href="/livetrace-disease-tracking" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 font-medium"
            >
              <AlertTriangle className="h-4 w-4" />
              Disease Tracking
            </a>
            <a 
              href="/livetrace-vaccination-records" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Vaccination Records
            </a>
            <a 
              href="/livetrace-treatment-plans" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Treatment Plans
            </a>
          </nav>

          <div className="p-4 border-t border-slate-200 mt-auto">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Report Outbreak
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Disease Tracking</h2>
                <p className="text-slate-600">Monitor and track disease outbreaks across livestock populations</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{formatTime(currentTime)}</div>
                <div className="text-sm text-slate-600">{formatDate(currentTime)}</div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  placeholder="Search by disease, location, or species..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Disease Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Active Outbreaks</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Under Investigation</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Animals Affected</p>
                      <p className="text-2xl font-bold">319</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Resolved (30 days)</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Disease Outbreaks List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Disease Outbreaks ({filteredOutbreaks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOutbreaks.map((outbreak) => (
                  <div key={outbreak.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-slate-900">{outbreak.disease}</div>
                        <Badge className={getSeverityColor(outbreak.severity)}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {outbreak.severity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(outbreak.status)}>
                          {outbreak.status.toUpperCase()}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Location</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {outbreak.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Species Affected</p>
                        <p className="font-medium text-slate-900">{outbreak.species}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Animals Affected</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {outbreak.affectedAnimals}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Reported Date</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(outbreak.reportedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Symptoms</p>
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{outbreak.symptoms}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Containment Measures</p>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{outbreak.containmentMeasures}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last updated: {outbreak.lastUpdate}
                      </div>
                      <div>
                        Reporting Veterinarian: <span className="font-medium text-slate-700">{outbreak.reportingVet}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOutbreaks.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No disease outbreaks found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}