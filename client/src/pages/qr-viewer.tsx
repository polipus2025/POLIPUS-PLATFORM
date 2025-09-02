import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Package, CheckCircle, AlertCircle } from 'lucide-react';

interface QRBatchData {
  batchCode: string;
  buyerName: string;
  farmerName: string;
  commodityType: string;
  totalWeight: string;
  qrCodeData: string;
  status: string;
  createdAt: string;
}

export default function QRViewer() {
  const [match, params] = useRoute<{ batchCode: string }>('/qr/:batchCode');
  const [qrData, setQrData] = useState<QRBatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (match && params?.batchCode) {
      fetchQRData(params.batchCode);
    }
  }, [match, params]);

  const fetchQRData = async (batchCode: string) => {
    try {
      setLoading(true);
      setError(null);

      // Try multiple API endpoints to find the QR data
      let response = await fetch(`/api/qr-batches/${batchCode}`);
      
      if (!response.ok) {
        // Try warehouse inspector lookup
        response = await fetch(`/api/warehouse-inspector/lookup-qr/${batchCode}`);
      }

      if (!response.ok) {
        throw new Error(`QR code ${batchCode} not found`);
      }

      const data = await response.json();
      setQrData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load QR data');
    } finally {
      setLoading(false);
    }
  };

  if (!match) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading QR code data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">QR Code Not Found</h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">No Data Available</h2>
            <p className="text-slate-600 mb-4">QR code data could not be retrieved</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">QR Code Details</h1>
            <p className="text-slate-600">Agricultural Traceability Information</p>
          </div>
        </div>

        {/* QR Code Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Batch Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Batch Code</label>
                <p className="text-lg font-mono bg-slate-100 p-2 rounded">{qrData.batchCode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Status</label>
                <div className="mt-1">
                  <Badge className={qrData.status === 'generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {qrData.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Commodity</label>
                <p className="text-lg font-semibold">{qrData.commodityType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Total Weight</label>
                <p className="text-lg font-semibold">{qrData.totalWeight} MT</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Farmer</label>
                <p className="text-lg">{qrData.farmerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Buyer</label>
                <p className="text-lg">{qrData.buyerName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed QR Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Complete Traceability Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono overflow-x-auto">
                {qrData.qrCodeData}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}