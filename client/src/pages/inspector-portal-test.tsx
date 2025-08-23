import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Ship, Warehouse, Shield, ArrowRight } from "lucide-react";

export default function InspectorPortalTest() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inspector Portal Access - WORKING!
          </h1>
          <p className="text-lg text-gray-600">
            This is the WORKING inspector portal - Select your inspector type
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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

          {/* Warehouse Inspector Card */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                <Warehouse className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Warehouse Inspector
              </CardTitle>
              <CardDescription className="text-gray-600">
                Storage Facility & Warehouse Compliance System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/warehouse-inspector-login")}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                data-testid="button-warehouse-inspector"
              >
                <div className="flex items-center space-x-2">
                  <span>Access Warehouse Portal</span>
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
      </div>
    </div>
  );
}