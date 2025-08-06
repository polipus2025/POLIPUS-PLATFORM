import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Search, 
  Filter, 
  Download,
  Activity,
  MapPin,
  Calendar,
  Thermometer,
  Weight,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function HealthMonitoring() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  // Mock health records - would come from API
  const healthRecords = [
    {
      id: "LT-001",
      animalId: "COW-4751",
      species: "Cattle",
      breed: "Friesian",
      age: "3 years",
      location: "Bong County - Farm #12",
      healthStatus: "healthy",
      lastCheckup: "2025-01-03",
      temperature: "38.5°C",
      weight: "425 kg",
      heartRate: "72 bpm",
      notes: "Excellent health condition, all vitals normal"
    },
    {
      id: "LT-002",
      animalId: "GOAT-2834",
      species: "Goat",
      breed: "West African Dwarf",
      age: "2 years",
      location: "Margibi County - Cooperativa",
      healthStatus: "monitoring",
      lastCheckup: "2025-01-02",
      temperature: "39.2°C",
      weight: "28 kg",
      heartRate: "85 bpm",
      notes: "Slight temperature elevation, monitoring for 48 hours"
    },
    {
      id: "LT-003",
      animalId: "PIG-1567",
      species: "Pig",
      breed: "Large White",
      age: "18 months",
      location: "Montserrado County - LivCorp",
      healthStatus: "treatment",
      lastCheckup: "2025-01-01",
      temperature: "40.1°C",
      weight: "95 kg",
      heartRate: "95 bpm",
      notes: "Under treatment for respiratory infection, responding well"
    },
    {
      id: "LT-004",
      animalId: "SHEEP-8923",
      species: "Sheep",
      breed: "West African",
      age: "4 years",
      location: "Bong County - Agri Center",
      healthStatus: "critical",
      lastCheckup: "2025-01-04",
      temperature: "41.2°C",
      weight: "42 kg",
      heartRate: "110 bpm",
      notes: "High fever, suspected bacterial infection, immediate attention required"
    },
    {
      id: "LT-005",
      animalId: "CHICK-5432",
      species: "Poultry",
      breed: "Broiler",
      age: "6 weeks",
      location: "Grand Bassa - Poultry Farm",
      healthStatus: "healthy",
      lastCheckup: "2025-01-04",
      temperature: "41.0°C",
      weight: "1.8 kg",
      heartRate: "280 bpm",
      notes: "Normal development, good feed conversion rate"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'treatment': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'monitoring': return <Clock className="h-4 w-4" />;
      case 'treatment': return <Activity className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch = record.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.healthStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Health Monitoring - LiveTrace Veterinary Portal</title>
        <meta name="description" content="Comprehensive animal health monitoring and tracking system" />
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-800 font-medium"
            >
              <Heart className="h-4 w-4" />
              Health Monitoring
            </a>
            <a 
              href="/livetrace-disease-tracking" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              Disease Tracking
            </a>
            <a 
              href="/livetrace-vaccination-records" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
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
              New Health Record
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Health Monitoring</h2>
                <p className="text-slate-600">Track and monitor animal health status across all livestock</p>
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
                  placeholder="Search by animal ID, species, or location..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="treatment">Under Treatment</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Healthy Animals</p>
                      <p className="text-2xl font-bold">1,156</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Monitoring</p>
                      <p className="text-2xl font-bold">65</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Under Treatment</p>
                      <p className="text-2xl font-bold">26</p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Critical Cases</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Health Records Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-600" />
                Health Records ({filteredRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-slate-900">{record.animalId}</div>
                        <Badge className={getStatusColor(record.healthStatus)}>
                          {getStatusIcon(record.healthStatus)}
                          <span className="ml-1 capitalize">{record.healthStatus}</span>
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Species & Breed</p>
                        <p className="font-medium text-slate-900">{record.species} - {record.breed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Age</p>
                        <p className="font-medium text-slate-900">{record.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Location</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {record.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Last Checkup</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.lastCheckup).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-slate-500">Temperature:</span>
                        <span className="font-medium text-slate-900">{record.temperature}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-slate-500">Weight:</span>
                        <span className="font-medium text-slate-900">{record.weight}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-slate-500">Heart Rate:</span>
                        <span className="font-medium text-slate-900">{record.heartRate}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-600">{record.notes}</p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No health records found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}