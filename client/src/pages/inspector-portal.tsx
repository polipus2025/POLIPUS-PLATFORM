import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Ship, Warehouse, Users, Shield, ArrowRight } from "lucide-react";

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
            Inspector Login Portal
          </h1>
          <p className="text-lg text-gray-600">
            Choose your inspector type to login to your portal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Land Inspector Login */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => navigate("/land-inspector-login")}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-20 h-20 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 transition-colors">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Land Inspector
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Agricultural Land & Crop Inspection
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => navigate("/land-inspector-login")}
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg"
                data-testid="button-land-inspector"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="w-5 h-5" />
                  <span>LOGIN</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Port Inspector Login */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => navigate("/port-inspector-login")}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <Ship className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Port Inspector
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Maritime Port & Export Inspection
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => navigate("/port-inspector-login")}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg"
                data-testid="button-port-inspector"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="w-5 h-5" />
                  <span>LOGIN</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Warehouse Inspector Login */}
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => navigate("/warehouse-inspector-login")}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                <Warehouse className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Warehouse Inspector
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Storage Facility & Warehouse Compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => navigate("/warehouse-inspector-login")}
                className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg"
                data-testid="button-warehouse-inspector"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="w-5 h-5" />
                  <span>LOGIN</span>
                  <ArrowRight className="w-5 h-5" />
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