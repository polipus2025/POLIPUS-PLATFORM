import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TreePine, Shield, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function EUDRAssessment() {
  // Get EUDR compliance data
  const { data: eudrData, isLoading } = useQuery({
    queryKey: ["/api/eudr-compliance"],
    retry: false
  });

  const complianceData = {
    totalFarms: (eudrData as any)?.totalFarms || 0,
    compliantFarms: (eudrData as any)?.compliantFarms || 0,
    highRiskFarms: (eudrData as any)?.highRiskFarms || 0,
    pendingReview: (eudrData as any)?.pendingReview || 0,
    complianceRate: (eudrData as any)?.complianceRate || 0
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
            <h1 className="text-3xl font-bold text-gray-900">EUDR Compliance Assessment</h1>
            <p className="text-gray-600">Monitor deforestation compliance and generate EUDR reports</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Farms</p>
                <p className="text-3xl font-bold text-gray-900">{complianceData.totalFarms}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TreePine className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">EUDR Compliant</p>
                <p className="text-3xl font-bold text-green-600">{complianceData.compliantFarms}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-red-600">{complianceData.highRiskFarms}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-3xl font-bold text-purple-600">{complianceData.complianceRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EUDR Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              EUDR Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Compliance Rate</span>
                <span className="text-sm font-bold text-green-600">{complianceData.complianceRate}%</span>
              </div>
              <Progress value={complianceData.complianceRate} className="h-3" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">Compliant Farms</p>
                    <p className="text-sm text-green-600">Meeting all EUDR requirements</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">{complianceData.compliantFarms}</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-800">Under Review</p>
                    <p className="text-sm text-yellow-600">Awaiting compliance verification</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">{complianceData.pendingReview}</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">High Risk Farms</p>
                    <p className="text-sm text-red-600">Deforestation risk detected</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800">{complianceData.highRiskFarms}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TreePine className="w-5 h-5 mr-2 text-blue-600" />
              EUDR Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Available Actions:</h4>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Run Full Compliance Assessment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Generate EUDR Compliance Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TreePine className="w-4 h-4 mr-2" />
                  Download Deforestation Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Review High-Risk Farms
                </Button>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">EUDR Requirements:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• No deforestation after December 31, 2020</li>
                <li>• GPS coordinates for all production areas</li>
                <li>• Supply chain traceability documentation</li>
                <li>• Risk assessment and mitigation measures</li>
                <li>• Regular monitoring and reporting</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Documentation Required:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Due diligence statements</li>
                <li>• Geolocation data for all plots</li>
                <li>• Satellite imagery analysis</li>
                <li>• Supply chain mapping</li>
                <li>• Risk mitigation plans</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}