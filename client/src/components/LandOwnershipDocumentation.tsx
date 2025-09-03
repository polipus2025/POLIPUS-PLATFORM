import { useState, useRef, type MouseEvent, type TouchEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  FileText, 
  MapPin, 
  User, 
  Users, 
  PenTool, 
  Upload, 
  Eye, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Plus,
  X
} from "lucide-react";

interface LandOwnershipDocumentationProps {
  farmerId?: string;
  farmerName?: string;
  onComplete?: (documentData: any) => void;
  onCancel?: () => void;
}

interface PhotoData {
  id: string;
  type: 'farmer_id' | 'land_boundary' | 'land_overview' | 'land_sketch' | 'verification_document';
  title: string;
  file: File | null;
  previewUrl: string | null;
}

interface WitnessData {
  id: string;
  name: string;
  role: string;
  contact: string;
  address: string;
  statement: string;
}

interface SignatureData {
  id: string;
  signatoryName: string;
  signatoryRole: string;
  signatureData: string | null;
  timestamp: string | null;
}

export default function LandOwnershipDocumentation({
  farmerId,
  farmerName = "",
  onComplete,
  onCancel
}: LandOwnershipDocumentationProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Land ownership document data
  const [documentData, setDocumentData] = useState({
    // Land Parcel Information
    villageTown: "",
    district: "",
    county: "",
    boundaryDescription: "",
    landArea: "",
    
    // Claimant Information
    claimantFullName: farmerName,
    claimantDateOfBirth: "",
    claimantResidence: "",
    relationshipToLand: "Owner",
    
    // Ownership Details
    ownershipYears: "",
    ownershipType: "Customary",
    communityConsensus: false,
  });

  // Photos state
  const [photos, setPhotos] = useState<PhotoData[]>([
    { id: '1', type: 'farmer_id', title: 'Farmer ID Photo', file: null, previewUrl: null },
    { id: '2', type: 'land_boundary', title: 'Land Boundary Photo 1', file: null, previewUrl: null },
    { id: '3', type: 'land_boundary', title: 'Land Boundary Photo 2', file: null, previewUrl: null },
    { id: '4', type: 'land_overview', title: 'Land Overview Photo', file: null, previewUrl: null },
  ]);

  // Witnesses state
  const [witnesses, setWitnesses] = useState<WitnessData[]>([
    { id: '1', name: '', role: 'Town Chief', contact: '', address: '', statement: '' },
    { id: '2', name: '', role: 'Elder/Witness', contact: '', address: '', statement: '' },
  ]);

  // Signatures state
  const [signatures, setSignatures] = useState<SignatureData[]>([
    { id: '1', signatoryName: '', signatoryRole: 'Town Chief', signatureData: null, timestamp: null },
    { id: '2', signatoryName: '', signatoryRole: 'Elder/Witness', signatureData: null, timestamp: null },
    { id: '3', signatoryName: farmerName, signatoryRole: 'Claimant', signatureData: null, timestamp: null },
  ]);

  const [currentSignature, setCurrentSignature] = useState<string | null>(null);

  // Photo handling
  const handlePhotoCapture = (photoId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a photo smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG, etc.).",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => prev.map(photo => 
          photo.id === photoId 
            ? { ...photo, file, previewUrl: e.target?.result as string }
            : photo
        ));
      };
      reader.onerror = () => {
        toast({
          title: "Error Reading File",
          description: "Failed to read the selected image file.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Photo Captured",
        description: "Photo has been successfully captured and saved.",
      });
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, file: null, previewUrl: null }
        : photo
    ));
  };

  // Signature handling
  const startDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = (signatureId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL();
    const timestamp = new Date().toISOString();
    
    setSignatures(prev => prev.map(sig => 
      sig.id === signatureId 
        ? { ...sig, signatureData, timestamp }
        : sig
    ));
    
    setCurrentSignature(null);
    clearSignature();
    
    toast({
      title: "Signature Saved",
      description: "Digital signature has been successfully captured.",
    });
  };

  // Add witness
  const addWitness = () => {
    const newWitness: WitnessData = {
      id: Date.now().toString(),
      name: '',
      role: 'Community Member',
      contact: '',
      address: '',
      statement: ''
    };
    setWitnesses(prev => [...prev, newWitness]);
  };

  // Remove witness
  const removeWitness = (witnessId: string) => {
    setWitnesses(prev => prev.filter(w => w.id !== witnessId));
  };

  // Form validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Land Parcel Information
        return !!(documentData.villageTown && documentData.district && documentData.county && documentData.boundaryDescription);
      case 2: // Claimant Information
        return !!(documentData.claimantFullName && documentData.claimantResidence && documentData.relationshipToLand);
      case 3: // Photos
        return photos.filter(p => p.file).length >= 2; // At least 2 photos required
      case 4: // Witnesses
        return witnesses.filter(w => w.name && w.role).length >= 1; // At least 1 witness required
      case 5: // Signatures
        return signatures.filter(s => s.signatureData).length >= 2; // At least 2 signatures required
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    const allData = {
      documentData,
      photos,
      witnesses,
      signatures,
      farmerId,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    
    onComplete?.(allData);
    
    toast({
      title: "Land Ownership Documentation Complete",
      description: "All documentation has been successfully recorded.",
    });
  };

  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 mx-auto text-blue-600 mb-2" />
              <h3 className="text-xl font-semibold">Land Parcel Information</h3>
              <p className="text-gray-600">Provide details about the land location and boundaries</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="villageTown">Village/Town *</Label>
                <Input
                  id="villageTown"
                  value={documentData.villageTown}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, villageTown: e.target.value }))}
                  placeholder="Enter village or town name"
                  data-testid="input-village-town"
                />
              </div>
              
              <div>
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={documentData.district}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="Enter district name"
                  data-testid="input-district"
                />
              </div>
              
              <div>
                <Label htmlFor="county">County *</Label>
                <Input
                  id="county"
                  value={documentData.county}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, county: e.target.value }))}
                  placeholder="Enter county name"
                  data-testid="input-county"
                />
              </div>
              
              <div>
                <Label htmlFor="landArea">Land Area (hectares)</Label>
                <Input
                  id="landArea"
                  type="number"
                  step="0.01"
                  value={documentData.landArea}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, landArea: e.target.value }))}
                  placeholder="0.00"
                  data-testid="input-land-area"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="boundaryDescription">Land Boundary Description *</Label>
              <Textarea
                id="boundaryDescription"
                value={documentData.boundaryDescription}
                onChange={(e) => setDocumentData(prev => ({ ...prev, boundaryDescription: e.target.value }))}
                placeholder="Describe the land boundaries using natural landmarks, neighboring plots, or other identifiable markers"
                rows={4}
                data-testid="textarea-boundary-description"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto text-green-600 mb-2" />
              <h3 className="text-xl font-semibold">Claimant Information</h3>
              <p className="text-gray-600">Information about the land owner/claimant</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="claimantFullName">Full Name *</Label>
                <Input
                  id="claimantFullName"
                  value={documentData.claimantFullName}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, claimantFullName: e.target.value }))}
                  placeholder="Enter full name"
                  data-testid="input-claimant-name"
                />
              </div>
              
              <div>
                <Label htmlFor="claimantDateOfBirth">Date of Birth</Label>
                <Input
                  id="claimantDateOfBirth"
                  type="date"
                  value={documentData.claimantDateOfBirth}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, claimantDateOfBirth: e.target.value }))}
                  data-testid="input-date-of-birth"
                />
              </div>
              
              <div>
                <Label htmlFor="claimantResidence">Residence *</Label>
                <Input
                  id="claimantResidence"
                  value={documentData.claimantResidence}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, claimantResidence: e.target.value }))}
                  placeholder="Enter village/town residence"
                  data-testid="input-residence"
                />
              </div>
              
              <div>
                <Label htmlFor="relationshipToLand">Relationship to Land *</Label>
                <Select value={documentData.relationshipToLand} onValueChange={(value) => setDocumentData(prev => ({ ...prev, relationshipToLand: value }))}>
                  <SelectTrigger data-testid="select-relationship-land">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Family Representative">Family Representative</SelectItem>
                    <SelectItem value="Heir">Heir</SelectItem>
                    <SelectItem value="Caretaker">Caretaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="ownershipYears">Years of Ownership/Use</Label>
                <Input
                  id="ownershipYears"
                  type="number"
                  value={documentData.ownershipYears}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, ownershipYears: e.target.value }))}
                  placeholder="Number of years"
                  data-testid="input-ownership-years"
                />
              </div>
              
              <div>
                <Label htmlFor="ownershipType">Type of Ownership *</Label>
                <Select value={documentData.ownershipType} onValueChange={(value) => setDocumentData(prev => ({ ...prev, ownershipType: value }))}>
                  <SelectTrigger data-testid="select-ownership-type">
                    <SelectValue placeholder="Select ownership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customary">Customary</SelectItem>
                    <SelectItem value="Freehold">Freehold</SelectItem>
                    <SelectItem value="Leasehold">Leasehold</SelectItem>
                    <SelectItem value="Communal">Communal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Camera className="w-12 h-12 mx-auto text-purple-600 mb-2" />
              <h3 className="text-xl font-semibold">Photo Documentation</h3>
              <p className="text-gray-600">Capture photos for visual verification</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photos.map((photo) => (
                <Card key={photo.id} className="p-4">
                  <div className="space-y-3">
                    <Label className="font-medium">{photo.title}</Label>
                    
                    {photo.previewUrl ? (
                      <div className="relative">
                        <img 
                          src={photo.previewUrl} 
                          alt={photo.title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2"
                          data-testid={`button-remove-photo-${photo.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-3">No photo captured</p>
                        <Input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handlePhotoCapture(photo.id, e)}
                          className="hidden"
                          id={`photo-${photo.id}`}
                        />
                        <Label htmlFor={`photo-${photo.id}`}>
                          <Button size="sm" asChild data-testid={`button-capture-photo-${photo.id}`}>
                            <span>Capture Photo</span>
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-500">
              * At least 2 photos are required to proceed
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="w-12 h-12 mx-auto text-orange-600 mb-2" />
              <h3 className="text-xl font-semibold">Witness Information</h3>
              <p className="text-gray-600">Record information about community witnesses</p>
            </div>
            
            <div className="space-y-4">
              {witnesses.map((witness, index) => (
                <Card key={witness.id} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Witness {index + 1}</h4>
                    {witnesses.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeWitness(witness.id)}
                        data-testid={`button-remove-witness-${witness.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={witness.name}
                        onChange={(e) => setWitnesses(prev => prev.map(w => 
                          w.id === witness.id ? { ...w, name: e.target.value } : w
                        ))}
                        placeholder="Enter witness name"
                        data-testid={`input-witness-name-${witness.id}`}
                      />
                    </div>
                    
                    <div>
                      <Label>Role *</Label>
                      <Select value={witness.role} onValueChange={(value) => setWitnesses(prev => prev.map(w => 
                        w.id === witness.id ? { ...w, role: value } : w
                      ))}>
                        <SelectTrigger data-testid={`select-witness-role-${witness.id}`}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Town Chief">Town Chief</SelectItem>
                          <SelectItem value="Elder/Witness">Elder/Witness</SelectItem>
                          <SelectItem value="Community Leader">Community Leader</SelectItem>
                          <SelectItem value="Community Member">Community Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Contact</Label>
                      <Input
                        value={witness.contact}
                        onChange={(e) => setWitnesses(prev => prev.map(w => 
                          w.id === witness.id ? { ...w, contact: e.target.value } : w
                        ))}
                        placeholder="Phone number"
                        data-testid={`input-witness-contact-${witness.id}`}
                      />
                    </div>
                    
                    <div>
                      <Label>Address</Label>
                      <Input
                        value={witness.address}
                        onChange={(e) => setWitnesses(prev => prev.map(w => 
                          w.id === witness.id ? { ...w, address: e.target.value } : w
                        ))}
                        placeholder="Village/Town address"
                        data-testid={`input-witness-address-${witness.id}`}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label>Witness Statement</Label>
                    <Textarea
                      value={witness.statement}
                      onChange={(e) => setWitnesses(prev => prev.map(w => 
                        w.id === witness.id ? { ...w, statement: e.target.value } : w
                      ))}
                      placeholder="Statement confirming land ownership"
                      rows={3}
                      data-testid={`textarea-witness-statement-${witness.id}`}
                    />
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button onClick={addWitness} variant="outline" data-testid="button-add-witness">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Witness
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <PenTool className="w-12 h-12 mx-auto text-red-600 mb-2" />
              <h3 className="text-xl font-semibold">Digital Signatures</h3>
              <p className="text-gray-600">Capture digital signatures from all parties</p>
            </div>
            
            <div className="space-y-6">
              {signatures.map((signature) => (
                <Card key={signature.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{signature.signatoryRole} Signature</h4>
                        <p className="text-sm text-gray-500">{signature.signatoryName || 'Not specified'}</p>
                      </div>
                      {signature.signatureData && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Signed
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <Label>Signatory Name</Label>
                      <Input
                        value={signature.signatoryName}
                        onChange={(e) => setSignatures(prev => prev.map(s => 
                          s.id === signature.id ? { ...s, signatoryName: e.target.value } : s
                        ))}
                        placeholder="Enter signatory name"
                        data-testid={`input-signatory-name-${signature.id}`}
                      />
                    </div>
                    
                    {signature.signatureData ? (
                      <div className="space-y-2">
                        <img 
                          src={signature.signatureData} 
                          alt="Signature"
                          className="border rounded-md p-2 bg-white max-h-32"
                        />
                        <p className="text-xs text-gray-500">Signed on: {signature.timestamp ? new Date(signature.timestamp).toLocaleString() : 'Unknown'}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setCurrentSignature(signature.id)}
                          data-testid={`button-redo-signature-${signature.id}`}
                        >
                          Redo Signature
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setCurrentSignature(signature.id)}
                        variant="outline"
                        className="w-full"
                        data-testid={`button-capture-signature-${signature.id}`}
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        Capture Signature
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-500">
              * At least 2 signatures are required to complete the documentation
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Land Ownership Confirmation Document
          </CardTitle>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-2 mt-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 < currentStep 
                    ? 'bg-green-500 text-white' 
                    : i + 1 === currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {i + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-8 h-1 ${
                    i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 mt-2">
            Step {currentStep} of {totalSteps}
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              data-testid="button-previous-step"
            >
              Previous
            </Button>
            
            <div className="space-x-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} data-testid="button-cancel">
                  Cancel
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  data-testid="button-next-step"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={!validateStep(currentStep)}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-complete-documentation"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Complete Documentation
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Signature Modal */}
      {currentSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Digital Signature Capture</CardTitle>
              <p className="text-sm text-gray-600">
                Please sign in the area below using your finger or stylus
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="border border-gray-300 rounded-md cursor-crosshair w-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                data-testid="canvas-signature"
              />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearSignature} data-testid="button-clear-signature">
                  Clear
                </Button>
                
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setCurrentSignature(null)} data-testid="button-cancel-signature">
                    Cancel
                  </Button>
                  <Button onClick={() => saveSignature(currentSignature)} data-testid="button-save-signature">
                    Save Signature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}