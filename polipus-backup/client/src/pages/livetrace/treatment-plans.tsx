import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
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
  Pill,
  Stethoscope
} from "lucide-react";

export default function TreatmentPlans() {
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

  // Mock treatment plans - would come from API
  const treatmentPlans = [
    {
      id: "TP-001",
      animalId: "COW-4751",
      species: "Cattle",
      breed: "Friesian",
      location: "Bong County - Farm #12",
      condition: "Mastitis",
      severity: "moderate",
      status: "active",
      startDate: "2025-01-02",
      expectedEndDate: "2025-01-09",
      veterinarian: "Dr. James Wilson",
      medications: [
        { name: "Penicillin G", dosage: "20,000 IU/kg", frequency: "BID", duration: "7 days", route: "IM" },
        { name: "Meloxicam", dosage: "0.5 mg/kg", frequency: "SID", duration: "5 days", route: "IV" }
      ],
      instructions: "Administer antibiotics as prescribed. Monitor udder for improvement. Milk withholding period: 72 hours post-treatment.",
      progress: "Day 3: Significant improvement in udder swelling. Continue treatment as planned.",
      nextCheckup: "2025-01-06",
      notes: "Response to treatment is excellent. Owner educated on proper milking hygiene."
    },
    {
      id: "TP-002",
      animalId: "GOAT-2834",
      species: "Goat",
      breed: "West African Dwarf",
      location: "Margibi County - Cooperativa",
      condition: "Internal Parasites",
      severity: "mild",
      status: "active",
      startDate: "2025-01-01",
      expectedEndDate: "2025-01-15",
      veterinarian: "Dr. Mary Kpehe",
      medications: [
        { name: "Ivermectin", dosage: "0.2 mg/kg", frequency: "Single dose", duration: "1 day", route: "SC" },
        { name: "Multivitamin", dosage: "5ml", frequency: "SID", duration: "14 days", route: "PO" }
      ],
      instructions: "Deworm with ivermectin. Provide nutritional support with vitamins. Monitor fecal consistency.",
      progress: "Day 4: Fecal egg count reduced by 80%. Animal showing improved appetite.",
      nextCheckup: "2025-01-08",
      notes: "Recommend follow-up fecal examination in 2 weeks to confirm parasite clearance."
    },
    {
      id: "TP-003",
      animalId: "PIG-1567",
      species: "Pig",
      breed: "Large White",
      location: "Montserrado County - LivCorp",
      condition: "Respiratory Infection",
      severity: "severe",
      status: "critical",
      startDate: "2024-12-30",
      expectedEndDate: "2025-01-10",
      veterinarian: "Dr. Samuel Roberts",
      medications: [
        { name: "Enrofloxacin", dosage: "2.5 mg/kg", frequency: "BID", duration: "10 days", route: "IM" },
        { name: "Dexamethasone", dosage: "0.1 mg/kg", frequency: "SID", duration: "3 days", route: "IM" },
        { name: "Bromhexine", dosage: "0.5 mg/kg", frequency: "TID", duration: "7 days", route: "PO" }
      ],
      instructions: "Intensive antibiotic therapy with anti-inflammatory support. Provide adequate ventilation and reduce stress.",
      progress: "Day 6: Breathing improved, appetite returning. Continue treatment protocol.",
      nextCheckup: "2025-01-05",
      notes: "Monitor closely for signs of improvement. May need to extend treatment if no response."
    },
    {
      id: "TP-004",
      animalId: "SHEEP-8923",
      species: "Sheep",
      breed: "West African",
      location: "Bong County - Agri Center",
      condition: "Foot Rot",
      severity: "moderate",
      status: "completed",
      startDate: "2024-12-20",
      expectedEndDate: "2025-01-03",
      veterinarian: "Dr. Grace Tubman",
      medications: [
        { name: "Zinc Sulfate", dosage: "10% solution", frequency: "Daily", duration: "14 days", route: "Topical" },
        { name: "Oxytetracycline", dosage: "20 mg/kg", frequency: "SID", duration: "5 days", route: "IM" }
      ],
      instructions: "Daily foot baths with zinc sulfate. Trim hooves and apply topical treatment. Keep animal in dry conditions.",
      progress: "Treatment completed successfully. Full recovery achieved.",
      nextCheckup: "2025-01-17",
      notes: "Excellent response to treatment. Educate farmer on prevention strategies."
    },
    {
      id: "TP-005",
      animalId: "CHICK-5432",
      species: "Poultry",
      breed: "Broiler",
      location: "Grand Bassa - Poultry Farm",
      condition: "Coccidiosis",
      severity: "moderate",
      status: "monitoring",
      startDate: "2024-12-28",
      expectedEndDate: "2025-01-11",
      veterinarian: "Dr. Joseph Clarke",
      medications: [
        { name: "Amprolium", dosage: "1g/L water", frequency: "Continuous", duration: "14 days", route: "Water" },
        { name: "Electrolyte solution", dosage: "2g/L water", frequency: "Continuous", duration: "7 days", route: "Water" }
      ],
      instructions: "Medicate drinking water with amprolium. Provide electrolyte support. Improve hygiene and ventilation.",
      progress: "Day 8: Mortality reduced, droppings normalizing. Flock responding well.",
      nextCheckup: "2025-01-07",
      notes: "Implement strict biosecurity measures to prevent recurrence."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'mild': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'monitoring': return <Eye className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'suspended': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredPlans = treatmentPlans.filter(plan => {
    const matchesSearch = plan.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.species.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Treatment Plans - LiveTrace Veterinary Portal</title>
        <meta name="description" content="Comprehensive treatment plan management and tracking system" />
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Vaccination Records
            </a>
            <a 
              href="/livetrace-treatment-plans" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 font-medium"
            >
              <FileText className="h-4 w-4" />
              Treatment Plans
            </a>
          </nav>

          <div className="p-4 border-t border-slate-200 mt-auto">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Treatment Plan
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Treatment Plans</h2>
                <p className="text-slate-600">Manage and track animal treatment protocols and progress</p>
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
                  placeholder="Search by animal ID, condition, or location..." 
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Plans
              </Button>
            </div>

            {/* Treatment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Active Plans</p>
                      <p className="text-2xl font-bold">127</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-200" />
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

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Completed (7 days)</p>
                      <p className="text-2xl font-bold">45</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Success Rate</p>
                      <p className="text-2xl font-bold">94%</p>
                    </div>
                    <Stethoscope className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Treatment Plans List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Treatment Plans ({filteredPlans.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredPlans.map((plan) => (
                  <div key={plan.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-slate-900">{plan.animalId}</div>
                        <Badge className={getStatusColor(plan.status)}>
                          {getStatusIcon(plan.status)}
                          <span className="ml-1 capitalize">{plan.status}</span>
                        </Badge>
                        <Badge className={getSeverityColor(plan.severity)}>
                          {plan.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Plan
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Species & Breed</p>
                        <p className="font-medium text-slate-900">{plan.species} - {plan.breed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Condition</p>
                        <p className="font-medium text-slate-900">{plan.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Location</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {plan.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Veterinarian</p>
                        <p className="font-medium text-slate-900">{plan.veterinarian}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Start Date</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(plan.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Expected End</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(plan.expectedEndDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Next Checkup</p>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(plan.nextCheckup).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Medications */}
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 mb-2">Medications</p>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {plan.medications.map((med, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Pill className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <span className="font-medium text-slate-900">{med.name}</span>
                                <span className="text-slate-600"> - {med.dosage}, {med.frequency} for {med.duration} ({med.route})</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Instructions and Progress */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Treatment Instructions</p>
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{plan.instructions}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Progress Notes</p>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{plan.progress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-500 mb-1">Additional Notes</p>
                      <p className="text-sm text-slate-700">{plan.notes}</p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPlans.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No treatment plans found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}