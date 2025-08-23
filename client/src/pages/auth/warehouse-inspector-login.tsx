import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Warehouse, 
  Shield, 
  ClipboardCheck, 
  Package, 
  Truck, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Eye,
  BarChart3
} from "lucide-react";

export default function WarehouseInspectorLogin() {
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border-4 border-red-500">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-600">🚨 WAREHOUSE INSPECTOR LOGIN TEST 🚨</h1>
        <p className="text-center text-red-800 font-bold">THIS PAGE IS WORKING - WAREHOUSE INSPECTOR PORTAL</p>
        <p className="text-center text-gray-600 mt-4">If you see this, the routing is working!</p>
      </div>
    </div>
  );
}