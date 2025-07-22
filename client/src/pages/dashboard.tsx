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
import { Download, Shield, TreePine, FileCheck, AlertTriangle, Building2, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [isEudrDialogOpen, setIsEudrDialogOpen] = useState(false);
  const [selectedExporter, setSelectedExporter] = useState<string>("all");

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

            <Button className="bg-lacra-blue hover:bg-blue-700">
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
    </div>
  );
}
