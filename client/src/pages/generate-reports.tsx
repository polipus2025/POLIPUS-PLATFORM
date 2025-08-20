import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Download, Calendar, BarChart3, TreePine, Users, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function GenerateReports() {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (type: string) => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    
    // In a real implementation, this would trigger the actual report generation
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link href="/unified-land-inspector-dashboard">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generate Reports</h1>
            <p className="text-gray-600">Create detailed reports for farms, compliance, and land mapping activities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Report Types */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Farm Activity Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Farmer Registration Report</h4>
                <p className="text-sm text-gray-600 mb-3">Complete overview of all registered farmers, their details, and farm information</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    Farmer Data
                  </Badge>
                  <Button size="sm" onClick={() => handleGenerateReport('farmer-registration')} disabled={isGenerating}>
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Land Plot Summary Report</h4>
                <p className="text-sm text-gray-600 mb-3">Detailed analysis of all mapped land plots with GPS coordinates and area calculations</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    <MapPin className="w-3 h-3 mr-1" />
                    Land Data
                  </Badge>
                  <Button size="sm" onClick={() => handleGenerateReport('land-plot-summary')} disabled={isGenerating}>
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Inspector Activity Report</h4>
                <p className="text-sm text-gray-600 mb-3">Summary of inspector activities, approvals, and field work completed</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    <FileText className="w-3 h-3 mr-1" />
                    Activity Data
                  </Badge>
                  <Button size="sm" onClick={() => handleGenerateReport('inspector-activity')} disabled={isGenerating}>
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TreePine className="w-5 h-5 mr-2 text-green-600" />
                EUDR Compliance Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">EUDR Compliance Status Report</h4>
                <p className="text-sm text-gray-600 mb-3">Complete EUDR compliance assessment for all farms with risk analysis</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">
                    <TreePine className="w-3 h-3 mr-1" />
                    EUDR Data
                  </Badge>
                  <Button size="sm" onClick={() => handleGenerateReport('eudr-compliance')} disabled={isGenerating}>
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Deforestation Risk Analysis</h4>
                <p className="text-sm text-gray-600 mb-3">Detailed analysis of deforestation risks using satellite data and AI assessment</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-red-100 text-red-800">
                    <TreePine className="w-3 h-3 mr-1" />
                    Risk Analysis
                  </Badge>
                  <Button size="sm" onClick={() => handleGenerateReport('deforestation-risk')} disabled={isGenerating}>
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">EU Documentation Package</h4>
                <p className="text-sm text-gray-600 mb-3">Complete documentation package required for EU EUDR compliance submissions</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800">
                    <FileText className="w-3 h-3 mr-1" />
                    EU Package
                  </Badge>
                  <Button size="sm" onClick={() => handleGenerateReport('eu-documentation')} disabled={isGenerating}>
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Report Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Custom Report Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Overview</SelectItem>
                  <SelectItem value="farmer-focused">Farmer-Focused Report</SelectItem>
                  <SelectItem value="compliance-focused">Compliance-Focused Report</SelectItem>
                  <SelectItem value="land-mapping">Land Mapping Analysis</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-3-months">Last 3 months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 months</SelectItem>
                  <SelectItem value="last-year">Last year</SelectItem>
                  <SelectItem value="all-time">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Report Preview</h4>
              {reportType && dateRange ? (
                <div className="text-sm text-purple-700 space-y-1">
                  <p><strong>Type:</strong> {reportType.replace('-', ' ').toUpperCase()}</p>
                  <p><strong>Period:</strong> {dateRange.replace('-', ' ').toUpperCase()}</p>
                  <p><strong>Format:</strong> PDF with charts and graphs</p>
                  <p><strong>Includes:</strong> Data tables, visualizations, compliance status</p>
                </div>
              ) : (
                <p className="text-sm text-purple-600">Select report type and date range to see preview</p>
              )}
            </div>

            <Button 
              className="w-full" 
              onClick={() => handleGenerateReport('custom')}
              disabled={!reportType || !dateRange || isGenerating}
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? "Generating Report..." : "Generate Custom Report"}
            </Button>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Report Features:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Professional PDF formatting</li>
                <li>• Interactive charts and graphs</li>
                <li>• GPS coordinates and mapping data</li>
                <li>• EUDR compliance indicators</li>
                <li>• Farmer and land plot summaries</li>
                <li>• Statistical analysis and trends</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}