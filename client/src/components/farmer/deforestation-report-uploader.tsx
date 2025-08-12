import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Upload, FileText, Calendar, CheckCircle, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeforestationReportUploaderProps {
  farmerId: string;
  farmerName: string;
  existingReports?: any[];
  onReportUploaded?: (report: any) => void;
}

export default function DeforestationReportUploader({ 
  farmerId, 
  farmerName, 
  existingReports = [],
  onReportUploaded 
}: DeforestationReportUploaderProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportDescription, setReportDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [reports, setReports] = useState(existingReports);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, JPEG, or PNG files only",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a deforestation report to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for offline storage
      const base64File = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });

      const newReport = {
        id: `doc-${Date.now()}`,
        farmerId,
        documentType: 'deforestation_report',
        documentName: selectedFile.name,
        documentUrl: base64File, // Store as base64 for offline access
        documentSize: selectedFile.size,
        mimeType: selectedFile.type,
        uploadedBy: 'farmer', // Current user
        uploadDate: new Date().toISOString(),
        description: reportDescription,
        isVerified: false,
        status: 'active',
        metadata: {
          farmerName,
          uploadedOffline: !navigator.onLine,
          originalFileName: selectedFile.name
        }
      };

      // Store in offline storage
      const storedReports = JSON.parse(localStorage.getItem('farmer_documents') || '[]');
      storedReports.push(newReport);
      localStorage.setItem('farmer_documents', JSON.stringify(storedReports));

      setReports([...reports, newReport]);

      if (onReportUploaded) {
        onReportUploaded(newReport);
      }

      toast({
        title: "Report Uploaded Successfully",
        description: `${selectedFile.name} has been attached to ${farmerName}'s profile`,
      });

      // Reset form
      setSelectedFile(null);
      setReportDescription("");
      setIsUploadDialogOpen(false);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload deforestation report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeReport = (reportId: string) => {
    const updatedReports = reports.filter(r => r.id !== reportId);
    setReports(updatedReports);
    
    // Update offline storage
    const storedReports = JSON.parse(localStorage.getItem('farmer_documents') || '[]');
    const filteredReports = storedReports.filter((r: any) => r.id !== reportId);
    localStorage.setItem('farmer_documents', JSON.stringify(filteredReports));

    toast({
      title: "Report Removed",
      description: "Deforestation report has been removed from farmer profile",
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') return <FileText className="h-5 w-5 text-red-600" />;
    if (mimeType.startsWith('image/')) return <FileText className="h-5 w-5 text-blue-600" />;
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          EUDR Deforestation Compliance Reports
        </CardTitle>
        <p className="text-sm text-orange-700">
          Upload deforestation assessment reports and compliance documentation for {farmerName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Button */}
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                data-testid="button-upload-deforestation-report"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Deforestation Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Deforestation Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-file">Select Report File</Label>
                  <Input
                    id="document-file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    data-testid="input-report-file"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Accepted formats: PDF, JPEG, PNG (max 10MB)
                  </p>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getFileIcon(selectedFile.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-600">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="report-description">Description (Optional)</Label>
                  <Textarea
                    id="report-description"
                    placeholder="Brief description of the deforestation report..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows={3}
                    data-testid="textarea-report-description"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="flex-1"
                    data-testid="button-confirm-upload"
                  >
                    {isUploading ? "Uploading..." : "Upload Report"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsUploadDialogOpen(false)}
                    data-testid="button-cancel-upload"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Existing Reports */}
          {reports.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-orange-800">Uploaded Reports ({reports.length})</h4>
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  data-testid={`report-item-${report.id}`}
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(report.mimeType)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{report.documentName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(report.uploadDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{formatFileSize(report.documentSize)}</span>
                        {report.isVerified && (
                          <>
                            <span>•</span>
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </>
                        )}
                      </div>
                      {report.description && (
                        <p className="text-xs text-gray-700 mt-1">{report.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Open document in new tab
                        if (report.documentUrl.startsWith('data:')) {
                          const link = document.createElement('a');
                          link.href = report.documentUrl;
                          link.download = report.documentName;
                          link.click();
                        }
                      }}
                      data-testid={`button-view-report-${report.id}`}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeReport(report.id)}
                      data-testid={`button-remove-report-${report.id}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EUDR Compliance Information */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">EUDR Compliance Requirements</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Forest definition: Minimum 0.5 hectares with {'>'}10% canopy cover</li>
              <li>• Plots {'>'}4 hectares require complete polygon boundary mapping</li>
              <li>• GPS coordinates must have 6+ decimal precision</li>
              <li>• Deforestation cutoff date: December 31, 2020</li>
              <li>• Compliance deadline: December 30, 2025 (large companies)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}