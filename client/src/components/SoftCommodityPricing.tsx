import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, DollarSign, Calendar, Edit, Plus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface SoftCommodity {
  id: number;
  commodityType: string;
  grade: string;
  pricePerTon: string;
  currency: string;
  effectiveDate: string;
  updatedBy: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface SoftCommodityPricingProps {
  canEdit?: boolean; // Only DDGOTS can edit
  compact?: boolean; // For menu display
}

export function SoftCommodityPricing({ canEdit = false, compact = false }: SoftCommodityPricingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCommodity, setSelectedCommodity] = useState<SoftCommodity | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: commodities = [], isLoading } = useQuery<SoftCommodity[]>({
    queryKey: ['/api/soft-commodities'],
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: async (data: Partial<SoftCommodity>) => {
      return apiRequest('/api/soft-commodities', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/soft-commodities'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Soft commodity pricing added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add commodity pricing",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<SoftCommodity>) => {
      return apiRequest(`/api/soft-commodities/${selectedCommodity?.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/soft-commodities'] });
      setIsEditDialogOpen(false);
      setSelectedCommodity(null);
      toast({
        title: "Success",
        description: "Soft commodity pricing updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update commodity pricing",
        variant: "destructive",
      });
    },
  });

  const commodityTypes = ['Cocoa', 'Coffee', 'Rubber', 'Palm Oil', 'Rice', 'Cassava', 'Plantain'];
  const grades = ['Subgrade', 'Grade 2', 'Grade 1', 'Premium'];

  const groupedCommodities = commodities.reduce((acc: Record<string, SoftCommodity[]>, commodity: SoftCommodity) => {
    if (!acc[commodity.commodityType]) {
      acc[commodity.commodityType] = [];
    }
    acc[commodity.commodityType].push(commodity);
    return acc;
  }, {});

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">LACRA Soft Commodity Prices</h3>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          )}
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {Object.entries(groupedCommodities).map(([type, items]: [string, SoftCommodity[]]) => (
            <div key={type} className="border rounded-lg p-2">
              <div className="font-medium text-sm text-slate-800 mb-1">{type}</div>
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">{item.grade}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">${item.pricePerTon}</span>
                      <span className="text-slate-500">/{item.currency}</span>
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                          onClick={() => {
                            setSelectedCommodity(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {commodities.length === 0 && !isLoading && (
          <div className="text-center text-sm text-slate-500 py-4">
            No commodity pricing data available
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">LACRA Soft Commodity Pricing</h2>
          <p className="text-slate-600">Current market prices for agricultural commodities</p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Commodity Price
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedCommodities).map(([type, items]: [string, SoftCommodity[]]) => (
          <Card key={type} className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                {type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{item.grade}</Badge>
                      <div className="text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.effectiveDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                          <DollarSign className="h-4 w-4" />
                          {item.pricePerTon}
                        </div>
                        <div className="text-sm text-slate-500">per ton ({item.currency})</div>
                      </div>
                      
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCommodity(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {commodities.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No Commodity Pricing Data</h3>
            <p className="text-slate-500">
              {canEdit ? "Add the first commodity price to get started." : "Pricing data will be displayed here once available."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Commodity Dialog */}
      <CommodityDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={(data) => addMutation.mutate(data)}
        commodityTypes={commodityTypes}
        grades={grades}
        isLoading={addMutation.isPending}
        title="Add Commodity Price"
      />

      {/* Edit Commodity Dialog */}
      <CommodityDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedCommodity(null);
        }}
        onSubmit={(data) => updateMutation.mutate(data)}
        commodityTypes={commodityTypes}
        grades={grades}
        isLoading={updateMutation.isPending}
        title="Edit Commodity Price"
        initialData={selectedCommodity}
      />
    </div>
  );
}

interface CommodityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  commodityTypes: string[];
  grades: string[];
  isLoading: boolean;
  title: string;
  initialData?: SoftCommodity | null;
}

function CommodityDialog({
  isOpen,
  onClose,
  onSubmit,
  commodityTypes,
  grades,
  isLoading,
  title,
  initialData
}: CommodityDialogProps) {
  const [formData, setFormData] = useState({
    commodityType: initialData?.commodityType || '',
    grade: initialData?.grade || '',
    pricePerTon: initialData?.pricePerTon || '',
    currency: initialData?.currency || 'USD',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pricePerTon: parseFloat(formData.pricePerTon),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="commodityType">Commodity Type</Label>
            <Select
              value={formData.commodityType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, commodityType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select commodity type" />
              </SelectTrigger>
              <SelectContent>
                {commodityTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="grade">Grade</Label>
            <Select
              value={formData.grade}
              onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pricePerTon">Price per Ton</Label>
            <Input
              id="pricePerTon"
              type="number"
              step="0.01"
              value={formData.pricePerTon}
              onChange={(e) => setFormData(prev => ({ ...prev, pricePerTon: e.target.value }))}
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="LRD">LRD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about pricing"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}