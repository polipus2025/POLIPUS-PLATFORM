import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Ship, Users, Shield, ArrowRight } from "lucide-react";

export default function InspectorPortal() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inspector Portal Access
          </h1>
          <p className="text-lg text-gray-600">
            Select your inspector type to access the appropriate portal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Land Inspector Card */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Land Inspector
              </CardTitle>
              <CardDescription className="text-gray-600">
                Agricultural Land & Crop Inspection System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Farm plot inspections</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Crop quality assessments</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Land compliance monitoring</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Field data collection</span>
                </div>
              </div>
              
              <Button
                onClick={() => navigate("/land-inspector-login")}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                data-testid="button-land-inspector"
              >
                <div className="flex items-center space-x-2">
                  <span>Access Land Inspector Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Port Inspector Card */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Ship className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Port Inspector
              </CardTitle>
              <CardDescription className="text-gray-600">
                Maritime Port & Export Inspection System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Export cargo inspections</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Port facility compliance</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Maritime documentation</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Shipping quality control</span>
                </div>
              </div>
              
              <Button
                onClick={() => navigate("/port-inspector-login")}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                data-testid="button-port-inspector"
              >
                <div className="flex items-center space-x-2">
                  <span>Access Port Inspector Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Need help with onboarding or account setup?
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/inspector-onboarding")}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
              data-testid="button-onboarding"
            >
              <Users className="w-4 h-4 mr-2" />
              Inspector Onboarding
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
              data-testid="button-home"
            >
              Back to Main Portal
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            LACRA - Liberia Agriculture Commodity Regulatory Authority
          </p>
        </div>
      </div>
    </div>
  );
}