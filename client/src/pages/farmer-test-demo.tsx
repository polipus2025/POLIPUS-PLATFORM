import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Key, User, MapPin, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function FarmerTestDemo() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [testFarmer, setTestFarmer] = useState(null);

  const createTestFarmerMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/create-test-farmer", {
        method: "GET"
      });
    },
    onSuccess: (response: any) => {
      setTestFarmer(response);
      toast({
        title: "Test Farmer Created!",
        description: `Login credentials: ${response.credentials.credentialId}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create test farmer",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farmer System Demo</h1>
            <p className="text-gray-600">Test the complete farmer onboarding to portal workflow</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Create Test Farmer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Step 1: Create Test Farmer Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Create a test farmer account with complete land mapping data to demonstrate the full farmer portal functionality.
            </p>
            
            <Button 
              onClick={() => createTestFarmerMutation.mutate()}
              disabled={createTestFarmerMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
              data-testid="create-test-farmer"
            >
              {createTestFarmerMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Test Farmer...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Create Test Farmer Account
                </>
              )}
            </Button>

            {testFarmer && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-900">Test Farmer Created Successfully!</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Farmer Details:</p>
                    <p className="text-green-800">Name: {testFarmer.farmer.firstName} {testFarmer.farmer.lastName}</p>
                    <p className="text-green-800">Location: {testFarmer.farmer.county}, {testFarmer.farmer.district}</p>
                    <p className="text-green-800">Farm Size: {testFarmer.farmer.farmSize} hectares</p>
                    <p className="text-green-800">Primary Crop: {testFarmer.farmer.primaryCrop}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-green-700 font-medium">Login Credentials:</p>
                    <div className="bg-white p-2 rounded border">
                      <p className="font-mono text-green-900">ID: {testFarmer.credentials.credentialId}</p>
                      <p className="font-mono text-green-900">Password: {testFarmer.credentials.temporaryPassword}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Test Data Includes:</strong>
                  </p>
                  <ul className="text-blue-700 text-sm mt-1 space-y-1">
                    <li>• Complete land mapping with GPS boundaries (5.2 hectares)</li>
                    <li>• 2 harvest schedules (Cocoa ready, Coffee growing)</li>
                    <li>• 1 active marketplace listing (1200kg Cocoa available)</li>
                    <li>• 2 buyer inquiries for price negotiation</li>
                    <li>• 3 harvest alerts and notifications</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Step 2: Test Farmer Portal Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Use the generated credentials to login to the farmer portal and explore all features.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Demo Login Credentials</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Login ID:</span>
                    <span className="font-mono font-bold text-gray-900">FRM434923</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Password:</span>
                    <span className="font-mono font-bold text-gray-900">Test2025!</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Portal Features</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• View land mapping data</li>
                  <li>• Manage harvest schedules</li>
                  <li>• Access marketplace listings</li>
                  <li>• Connect with buyers</li>
                  <li>• Receive harvest alerts</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link href="/farmer-login-portal">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Farmer Login Portal
                </Button>
              </Link>
              
              <Link href="/onboard-farmer">
                <Button variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Test Farmer Onboarding Process
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Step 3: Complete Onboarding to Portal Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This demonstrates the complete workflow from land inspector onboarding to farmer portal access.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Workflow Steps:</h4>
              <ol className="text-yellow-800 text-sm space-y-2">
                <li>1. <strong>Land Inspector Onboards Farmer:</strong> Inspector uses onboard-farmer page to register farmer with GPS mapping</li>
                <li>2. <strong>Automatic Credential Generation:</strong> System generates FRM credentials (ID + password) automatically</li>
                <li>3. <strong>Farmer Receives Credentials:</strong> Inspector provides farmer with login credentials</li>
                <li>4. <strong>Farmer Accesses Portal:</strong> Farmer logs in to farmer-login-portal with credentials</li>
                <li>5. <strong>Full Portal Access:</strong> Farmer can view land data, manage schedules, access marketplace, connect with buyers</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/unified-land-inspector-dashboard">
                <Button variant="outline" className="w-full h-auto p-4">
                  <div className="text-center">
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Land Inspector Dashboard</div>
                    <div className="text-xs text-gray-600">Start farmer onboarding</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/farmer-login-portal">
                <Button variant="outline" className="w-full h-auto p-4">
                  <div className="text-center">
                    <Key className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Farmer Login Portal</div>
                    <div className="text-xs text-gray-600">Farmer portal access</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/farmer-dashboard">
                <Button variant="outline" className="w-full h-auto p-4">
                  <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Farmer Dashboard</div>
                    <div className="text-xs text-gray-600">Portal main interface</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Success Confirmation */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              System Integration Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-700 space-y-2">
              <p>✅ <strong>Farmer Onboarding System:</strong> Land inspector can onboard farmers with automatic credential generation</p>
              <p>✅ <strong>Farmer Portal Access:</strong> Farmers can login with generated credentials to access their portal</p>
              <p>✅ <strong>Land Mapping Integration:</strong> GPS boundary data flows from onboarding to farmer portal</p>
              <p>✅ <strong>Harvest Management:</strong> Farmers can manage schedules, marketplace listings, and buyer connections</p>
              <p>✅ <strong>Buyer-Farmer Connectivity:</strong> Direct farmer-buyer interaction without exporter involvement</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}