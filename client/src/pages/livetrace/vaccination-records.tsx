import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
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
  CheckCircle,
  AlertTriangle,
  Syringe
} from "lucide-react";

export default function VaccinationRecords() {
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

  // Mock vaccination records - would come from API
  const vaccinationRecords = [
    {
      id: "VAC-001",
      animalId: "COW-4751",
      species: "Cattle",
      breed: "Friesian",
      location: "Bong County - Farm #12",
      vaccineType: "Foot-and-Mouth Disease (FMD)",
      manufacturer: "Boehringer Ingelheim",
      batchNumber: "FMD-2024-B47",
      administeredDate: "2024-12-15",
      nextDueDate: "2025-06-15",
      veterinarian: "Dr. James Wilson",
      status: "current",
      dosage: "2ml",
      route: "Intramuscular",
      notes: "Animal showed good response, no adverse reactions observed"
    },
    {
      id: "VAC-002",
      animalId: "GOAT-2834",
      species: "Goat", 
      breed: "West African Dwarf",
      location: "Margibi County - Cooperativa",
      vaccineType: "Peste des Petits Ruminants (PPR)",
      manufacturer: "PANVAC",
      batchNumber: "PPR-2024-A23",
      administeredDate: "2024-11-20",
      nextDueDate: "2025-11-20",
      veterinarian: "Dr. Mary Kpehe",
      status: "current",
      dosage: "1ml",
      route: "Subcutaneous",
      notes: "Routine annual vaccination, animal in excellent health"
    },
    {
      id: "VAC-003",
      animalId: "PIG-1567",
      species: "Pig",
      breed: "Large White", 
      location: "Montserrado County - LivCorp",
      vaccineType: "Classical Swine Fever (CSF)",
      manufacturer: "CEVA Animal Health",
      batchNumber: "CSF-2024-C89",
      administeredDate: "2024-10-05",
      nextDueDate: "2025-01-15",
      veterinarian: "Dr. Samuel Roberts",
      status: "due_soon",
      dosage: "2ml",
      route: "Intramuscular",
      notes: "Booster vaccination due in 10 days, reminder sent to farm"
    },
    {
      id: "VAC-004", 
      animalId: "SHEEP-8923",
      species: "Sheep",
      breed: "West African",
      location: "Bong County - Agri Center",
      vaccineType: "Bluetongue",
      manufacturer: "Zoetis",
      batchNumber: "BTV-2024-D12",
      administeredDate: "2024-08-30",
      nextDueDate: "2024-12-30",
      veterinarian: "Dr. Grace Tubman",
      status: "overdue",
      dosage: "1ml",
      route: "Subcutaneous", 
      notes: "Vaccination overdue by 5 days, urgent follow-up required"
    },
    {
      id: "VAC-005",
      animalId: "CHICK-5432",
      species: "Poultry",
      breed: "Broiler",
      location: "Grand Bassa - Poultry Farm",
      vaccineType: "Newcastle Disease",
      manufacturer: "Merck Animal Health",
      batchNumber: "ND-2024-E67",
      administeredDate: "2024-12-20",
      nextDueDate: "2025-03-20",
      veterinarian: "Dr. Joseph Clarke",
      status: "current",
      dosage: "0.3ml",
      route: "Eye drop",
      notes: "Mass vaccination of flock, 500 birds vaccinated simultaneously"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800 border-green-200';
      case 'due_soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <CheckCircle className="h-4 w-4" />;
      case 'due_soon': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredRecords = vaccinationRecords.filter(record => {
    const matchesSearch = record.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vaccineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.species.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Vaccination Records - LiveTrace Veterinary Portal</title>
        <meta name="description" content="Comprehensive vaccination tracking and management system" />
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              Disease Tracking
            </a>
            <a 
              href="/livetrace-vaccination-records" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-medium"
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
              Record Vaccination
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Vaccination Records</h2>
                <p className="text-slate-600">Track vaccination schedules and maintain immunity records</p>
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
                  placeholder="Search by animal ID, vaccine type, or location..." 
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
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="due_soon">Due Soon</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Records
              </Button>
            </div>

            {/* Vaccination Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Up to Date</p>
                      <p className="text-2xl font-bold">1,847</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Due Soon</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Overdue</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">This Month</p>
                      <p className="text-2xl font-bold">342</p>
                    </div>
                    <Syringe className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Vaccination Records List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Vaccination Records ({filteredRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-slate-900">{record.animalId}</div>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1 capitalize">{record.status.replace('_', ' ')}</span>
                        </Badge>
                        {record.status === 'due_soon' && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Due in {getDaysUntilDue(record.nextDueDate)} days
                          </Badge>
                        )}
                        {record.status === 'overdue' && (
                          <Badge variant="destructive">
                            Overdue {Math.abs(getDaysUntilDue(record.nextDueDate))} days
                          </Badge>
                        )}
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
                        <p className="text-sm text-slate-500 mb-1">Location</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {record.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Vaccine Type</p>
                        <p className="font-medium text-slate-900">{record.vaccineType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Veterinarian</p>
                        <p className="font-medium text-slate-900">{record.veterinarian}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Administered Date</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.administeredDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Next Due Date</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.nextDueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Dosage & Route</p>
                        <p className="font-medium text-slate-900">{record.dosage} - {record.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Batch Number</p>
                        <p className="font-medium text-slate-900">{record.batchNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Manufacturer</p>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700 font-medium">{record.manufacturer}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Notes</p>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{record.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No vaccination records found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}