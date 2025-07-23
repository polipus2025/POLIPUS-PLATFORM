import { Helmet } from "react-helmet";
import { useState } from "react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import ComplianceChart from "@/components/dashboard/compliance-chart";
import RegionalMap from "@/components/dashboard/regional-map";
import InspectionsTable from "@/components/dashboard/inspections-table";
import QuickActions from "@/components/dashboard/quick-actions";
import SystemAlerts from "@/components/dashboard/system-alerts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Shield, TreePine, FileCheck, AlertTriangle, Building2, CheckCircle, Clock, XCircle, Plus, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [isEudrDialogOpen, setIsEudrDialogOpen] = useState(false);
  const [selectedExporter, setSelectedExporter] = useState<string>("all");
  const [isExportApplicationOpen, setIsExportApplicationOpen] = useState(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);

  // Check user type for role-specific content
  const userType = localStorage.getItem("userType");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // Sample EUDR compliance data
  const eudrMetrics = {
    totalCommodities: 1247,
    compliantCommodities: 1089,
    riskAssessments: 892,
    deforestationFree: 1156,
    complianceRate: 87.3,
    pendingVerifications: 158
  };

  // Sample exporter data
  const exporters = [
    {
      id: "EXP-001",
      name: "Liberian Coffee Corporation",
      type: "Coffee",
      complianceStatus: "compliant",
      licensesValid: true,
      lastInspection: "2024-12-15",
      nextDeadline: "2025-01-15",
      documentsStatus: "complete",
      riskLevel: "low"
    },
    {
      id: "EXP-002", 
      name: "West African Cocoa Traders",
      type: "Cocoa",
      complianceStatus: "pending",
      licensesValid: true,
      lastInspection: "2024-12-10", 
      nextDeadline: "2024-12-30",
      documentsStatus: "missing",
      riskLevel: "medium"
    },
    {
      id: "EXP-003",
      name: "Firestone Natural Rubber Company",
      type: "Rubber", 
      complianceStatus: "compliant",
      licensesValid: true,
      lastInspection: "2024-12-12",
      nextDeadline: "2025-02-12",
      documentsStatus: "complete",
      riskLevel: "low"
    },
    {
      id: "EXP-004",
      name: "Golden Veroleum Liberia",
      type: "Palm Oil",
      complianceStatus: "non-compliant",
      licensesValid: false,
      lastInspection: "2024-11-20",
      nextDeadline: "2024-12-25",
      documentsStatus: "incomplete",
      riskLevel: "high"
    },
    {
      id: "EXP-005",
      name: "Liberian Rice Development Company",
      type: "Rice",
      complianceStatus: "compliant",
      licensesValid: true,
      lastInspection: "2024-12-08",
      nextDeadline: "2025-01-08", 
      documentsStatus: "complete",
      riskLevel: "low"
    }
  ];

  const getFilteredExporters = () => {
    if (selectedExporter === "all") return exporters;
    return exporters.filter(exp => exp.id === selectedExporter);
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "non-compliant":
        return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  // Show authentication message if not logged in
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the dashboard</p>
          <Button onClick={() => window.location.href = '/regulatory-login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Helmet>
        <title>Dashboard - AgriTrace360™ LACRA</title>
        <meta name="description" content="Real-time agricultural commodity compliance monitoring dashboard for Liberia Agriculture Commodity Regulatory Authority" />
      </Helmet>

      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Compliance Overview</h2>
            <p className="text-gray-600">Real-time agricultural commodity compliance monitoring</p>
          </div>
          <div className="flex space-x-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                <SelectItem value="bomi">Bomi County</SelectItem>
                <SelectItem value="bong">Bong County</SelectItem>
                <SelectItem value="gbarpolu">Gbarpolu County</SelectItem>
                <SelectItem value="grand_bassa">Grand Bassa County</SelectItem>
                <SelectItem value="grand_cape_mount">Grand Cape Mount County</SelectItem>
                <SelectItem value="grand_gedeh">Grand Gedeh County</SelectItem>
                <SelectItem value="grand_kru">Grand Kru County</SelectItem>
                <SelectItem value="lofa">Lofa County</SelectItem>
                <SelectItem value="margibi">Margibi County</SelectItem>
                <SelectItem value="maryland">Maryland County</SelectItem>
                <SelectItem value="montserrado">Montserrado County</SelectItem>
                <SelectItem value="nimba">Nimba County</SelectItem>
                <SelectItem value="rivercess">River Cess County</SelectItem>
                <SelectItem value="river_gee">River Gee County</SelectItem>
                <SelectItem value="sinoe">Sinoe County</SelectItem>
              </SelectContent>
            </Select>
            
            {/* EUDR Compliance Button */}
            <Dialog open={isEudrDialogOpen} onOpenChange={setIsEudrDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  EUDR Compliance
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    EU Deforestation Regulation (EUDR) Compliance Dashboard
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* EUDR Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <TreePine className="h-8 w-8 text-green-600" />
                          <div className="ml-3">
                            <div className="text-2xl font-bold text-green-600">{eudrMetrics.deforestationFree}</div>
                            <p className="text-sm text-gray-500">Deforestation-Free</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <FileCheck className="h-8 w-8 text-blue-600" />
                          <div className="ml-3">
                            <div className="text-2xl font-bold text-blue-600">{eudrMetrics.riskAssessments}</div>
                            <p className="text-sm text-gray-500">Risk Assessments</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-8 w-8 text-orange-600" />
                          <div className="ml-3">
                            <div className="text-2xl font-bold text-orange-600">{eudrMetrics.pendingVerifications}</div>
                            <p className="text-sm text-gray-500">Pending Verifications</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* EUDR Compliance Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle>EUDR Compliance Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Overall Compliance Rate</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${eudrMetrics.complianceRate}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-green-600">{eudrMetrics.complianceRate}%</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Commodity Breakdown</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              <div className="flex justify-between">
                                <span>Cocoa</span>
                                <Badge variant="default">92% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Coffee</span>
                                <Badge variant="default">89% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Palm Oil</span>
                                <Badge variant="secondary">78% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Rubber</span>
                                <Badge variant="default">95% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Cashew</span>
                                <Badge variant="default">87% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Rice</span>
                                <Badge variant="secondary">74% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Cassava</span>
                                <Badge variant="default">91% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Kola Nut</span>
                                <Badge variant="default">88% Compliant</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Regional Compliance (Top Counties)</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              <div className="flex justify-between">
                                <span>Montserrado County</span>
                                <Badge variant="default">96% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Lofa County</span>
                                <Badge variant="default">94% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Bong County</span>
                                <Badge variant="default">91% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Margibi County</span>
                                <Badge variant="default">89% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Grand Gedeh County</span>
                                <Badge variant="default">88% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Grand Bassa County</span>
                                <Badge variant="default">86% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Nimba County</span>
                                <Badge variant="secondary">82% Compliant</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Maryland County</span>
                                <Badge variant="secondary">79% Compliant</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Due Diligence Requirements */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Due Diligence Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Required Documentation</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Geolocation coordinates of production plots
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Deforestation-free certificates
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Supply chain traceability records
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              Risk assessment documentation
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              Legal compliance verification
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Compliance Actions</h4>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                              <FileCheck className="h-4 w-4 mr-2" />
                              Generate EUDR Compliance Report
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Download className="h-4 w-4 mr-2" />
                              Export Deforestation Certificates
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <TreePine className="h-4 w-4 mr-2" />
                              View Satellite Monitoring Data
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Shield className="h-4 w-4 mr-2" />
                              Schedule Risk Assessment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent EUDR Alerts */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent EUDR Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">High-Risk Area Detected</p>
                            <p className="text-sm text-red-600">Satellite data shows potential deforestation activity in Nimba County plot NMB-2024-156</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-800">Documentation Missing</p>
                            <p className="text-sm text-yellow-600">15 cocoa batches require updated geolocation certificates for EUDR compliance</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">Compliance Verified</p>
                            <p className="text-sm text-green-600">Lofa County palm oil operations successfully passed EUDR due diligence audit</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isExportApplicationOpen} onOpenChange={setIsExportApplicationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-lacra-green hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Export Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-lacra-green" />
                    Export Compliance Application Form
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 p-1">
                  {/* Exporter Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Exporter Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name *
                          </label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="Enter your company name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Export License Number *
                          </label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="EXP-YYYY-XXXX"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Person *
                          </label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="Full name of authorized representative"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input 
                            type="tel" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="+231 XX XXX XXXX"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input 
                            type="email" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="contact@company.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Registration Number *
                          </label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="Business registration number"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Commodity Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Commodity Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Commodity Type *
                          </label>
                          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent">
                            <option value="">Select commodity type</option>
                            <option value="coffee">Coffee</option>
                            <option value="cocoa">Cocoa</option>
                            <option value="rubber">Rubber</option>
                            <option value="palm_oil">Palm Oil</option>
                            <option value="rice">Rice</option>
                            <option value="cassava">Cassava</option>
                            <option value="cashew">Cashew</option>
                            <option value="kola_nut">Kola Nut</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quality Grade *
                          </label>
                          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent">
                            <option value="">Select quality grade</option>
                            <option value="premium">Premium</option>
                            <option value="grade_a">Grade A</option>
                            <option value="grade_b">Grade B</option>
                            <option value="standard">Standard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity (MT) *
                          </label>
                          <input 
                            type="number" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="Enter quantity in metric tons"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Value (USD) *
                          </label>
                          <input 
                            type="number" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="Enter estimated export value"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Origin County *
                          </label>
                          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent">
                            <option value="">Select origin county</option>
                            <option value="bomi">Bomi County</option>
                            <option value="bong">Bong County</option>
                            <option value="gbarpolu">Gbarpolu County</option>
                            <option value="grand_bassa">Grand Bassa County</option>
                            <option value="grand_gedeh">Grand Gedeh County</option>
                            <option value="lofa">Lofa County</option>
                            <option value="margibi">Margibi County</option>
                            <option value="nimba">Nimba County</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Destination Country *
                          </label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent"
                            placeholder="Country of destination"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Production Details
                        </label>
                        <textarea 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lacra-green focus:border-transparent h-24"
                          placeholder="Describe production methods, farm locations, and harvest details..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compliance Documentation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Documentation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { label: "Quality Certificate", required: true },
                          { label: "Phytosanitary Certificate", required: true },
                          { label: "Certificate of Origin", required: true },
                          { label: "GPS Coordinates of Production Areas", required: true },
                          { label: "EUDR Deforestation-Free Declaration", required: true },
                          { label: "Tax Compliance Certificate", required: true },
                          { label: "Export Permit Application", required: true },
                          { label: "Insurance Documentation", required: false },
                          { label: "Additional Supporting Documents", required: false }
                        ].map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <span className="font-medium">{doc.label}</span>
                              {doc.required && <span className="text-red-500 ml-1">*</span>}
                            </div>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Declaration and Submission */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Declaration & Submission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <input type="checkbox" className="mt-1 h-4 w-4 text-lacra-green" />
                          <label className="text-sm text-gray-700">
                            I declare that all information provided is accurate and complete to the best of my knowledge.
                          </label>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input type="checkbox" className="mt-1 h-4 w-4 text-lacra-green" />
                          <label className="text-sm text-gray-700">
                            I understand that providing false information may result in rejection of this application and potential legal action.
                          </label>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input type="checkbox" className="mt-1 h-4 w-4 text-lacra-green" />
                          <label className="text-sm text-gray-700">
                            I agree to comply with all LACRA regulations and EUDR requirements for this export.
                          </label>
                        </div>
                        <div className="flex items-start space-x-3">
                          <input type="checkbox" className="mt-1 h-4 w-4 text-lacra-green" />
                          <label className="text-sm text-gray-700">
                            I authorize LACRA to conduct inspections and verification procedures as necessary.
                          </label>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Application Process</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Your application will be reviewed within 3-5 business days</li>
                          <li>• You will receive email notifications about the status</li>
                          <li>• Additional documentation may be requested</li>
                          <li>• Approved applications will receive export certificates</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end gap-3 p-6 pt-0">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsExportApplicationOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-lacra-green hover:bg-green-700"
                    onClick={() => {
                      // In a real implementation, this would submit the application
                      setIsExportApplicationOpen(false);
                      // Show success message
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
            className="bg-lacra-blue hover:bg-blue-700"
            onClick={() => setIsExportReportOpen(true)}
          >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="mb-6">
        <MetricsCards />
      </div>

      {/* Exporter Compliance Tracking */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-lacra-blue" />
              Exporter Compliance Management
            </CardTitle>
            <Select value={selectedExporter} onValueChange={setSelectedExporter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Exporter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exporters ({exporters.length})</SelectItem>
                {exporters.map((exporter) => (
                  <SelectItem key={exporter.id} value={exporter.id}>
                    {exporter.name} - {exporter.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredExporters().map((exporter) => (
              <div key={exporter.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{exporter.name}</h3>
                    <p className="text-sm text-gray-600">ID: {exporter.id} • {exporter.type} Exporter</p>
                  </div>
                  <div className="flex gap-2">
                    {getComplianceStatusBadge(exporter.complianceStatus)}
                    {getRiskLevelBadge(exporter.riskLevel)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {exporter.licensesValid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      Licenses: {exporter.licensesValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {exporter.documentsStatus === 'complete' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : exporter.documentsStatus === 'missing' ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className="text-sm">
                      Documents: {exporter.documentsStatus === 'complete' ? 'Complete' : 
                                 exporter.documentsStatus === 'missing' ? 'Missing' : 'Incomplete'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      Last Inspection: {new Date(exporter.lastInspection).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      new Date(exporter.nextDeadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
                        ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <span className="text-sm">
                      Next Deadline: {new Date(exporter.nextDeadline).toLocaleDateString()}
                      {new Date(exporter.nextDeadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
                        <span className="text-red-600 font-medium"> (Due Soon!)</span>
                      }
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="text-lacra-blue border-lacra-blue hover:bg-blue-50">
                    <FileCheck className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {exporter.complianceStatus === 'non-compliant' && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Urgent Action Required
                    </Button>
                  )}
                  {exporter.complianceStatus === 'pending' && (
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      <Clock className="h-4 w-4 mr-1" />
                      Review Pending
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-lacra-green border-lacra-green hover:bg-green-50">
                    <Download className="h-4 w-4 mr-1" />
                    Download Certificate
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {exporters.filter(e => e.complianceStatus === 'compliant').length}
                </div>
                <div className="text-sm text-gray-600">Compliant Exporters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {exporters.filter(e => e.complianceStatus === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {exporters.filter(e => e.complianceStatus === 'non-compliant').length}
                </div>
                <div className="text-sm text-gray-600">Non-Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {exporters.filter(e => new Date(e.nextDeadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-gray-600">Due Soon</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Regional Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ComplianceChart />
        <RegionalMap />
      </div>

      {/* Commodity Details Table */}
      <div className="mb-6">
        <InspectionsTable />
      </div>

      {/* Quick Actions and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <SystemAlerts />
      </div>

      {/* Export Report Dialog */}
      <Dialog open={isExportReportOpen} onOpenChange={setIsExportReportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Export Compliance Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Report Type</label>
              <Select defaultValue="compliance">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliance">Compliance Overview Report</SelectItem>
                  <SelectItem value="eudr">EUDR Compliance Report</SelectItem>
                  <SelectItem value="county">County-wise Compliance Report</SelectItem>
                  <SelectItem value="commodity">Commodity-wise Report</SelectItem>
                  <SelectItem value="inspection">Inspection Summary Report</SelectItem>
                  <SelectItem value="export">Export Performance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Time Period</label>
              <Select defaultValue="current_month">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="current_month">Current Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="quarter">Current Quarter</SelectItem>
                  <SelectItem value="year">Current Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">County Filter</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  <SelectItem value="bomi">Bomi County</SelectItem>
                  <SelectItem value="bong">Bong County</SelectItem>
                  <SelectItem value="lofa">Lofa County</SelectItem>
                  <SelectItem value="nimba">Nimba County</SelectItem>
                  <SelectItem value="margibi">Margibi County</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 p-3 rounded border">
              <h4 className="font-medium text-blue-900 mb-2">Report Preview</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Compliance metrics and statistics</li>
                <li>• County-wise performance breakdown</li>
                <li>• Recent inspection summaries</li>
                <li>• EUDR compliance status</li>
                <li>• Alert and recommendation summary</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsExportReportOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-1" />
              Generate & Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
