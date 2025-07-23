import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Server, 
  GitMerge,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ConflictResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflicts: Array<{
    operation: {
      id: string;
      type: 'CREATE' | 'UPDATE' | 'DELETE';
      endpoint: string;
      data: any;
      timestamp: number;
      userId: string;
    };
    conflict: any;
  }>;
  onResolve: (conflictId: string, resolution: any) => void;
}

export function ConflictResolutionDialog({ 
  open, 
  onOpenChange, 
  conflicts, 
  onResolve 
}: ConflictResolutionDialogProps) {
  const [selectedConflict, setSelectedConflict] = useState<number>(0);
  const [resolutionStrategy, setResolutionStrategy] = useState<'client' | 'server' | 'merge'>('client');

  const currentConflict = conflicts[selectedConflict];

  if (!currentConflict) return null;

  const handleResolve = () => {
    let resolution;
    
    switch (resolutionStrategy) {
      case 'client':
        resolution = currentConflict.operation.data;
        break;
      case 'server':
        resolution = currentConflict.conflict;
        break;
      case 'merge':
        resolution = {
          ...currentConflict.conflict,
          ...currentConflict.operation.data,
          // Preserve server metadata
          id: currentConflict.conflict.id,
          createdAt: currentConflict.conflict.createdAt,
          updatedAt: new Date().toISOString()
        };
        break;
    }

    onResolve(currentConflict.operation.id, resolution);
    
    // Move to next conflict or close dialog
    if (selectedConflict < conflicts.length - 1) {
      setSelectedConflict(selectedConflict + 1);
    } else {
      onOpenChange(false);
    }
  };

  const formatValue = (obj: any): string => {
    if (typeof obj === 'object' && obj !== null) {
      return JSON.stringify(obj, null, 2);
    }
    return String(obj);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Data Sync Conflicts ({selectedConflict + 1} of {conflicts.length})
          </DialogTitle>
          <DialogDescription>
            Choose how to resolve conflicts between your offline changes and server data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conflict List */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-3">Conflicts</h3>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {conflicts.map((conflict, index) => (
                  <Card 
                    key={conflict.operation.id}
                    className={`cursor-pointer transition-colors ${
                      index === selectedConflict ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedConflict(index)}
                  >
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">
                        {conflict.operation.type} Operation
                      </CardTitle>
                      <CardDescription className="text-xs">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatDistanceToNow(new Date(conflict.operation.timestamp), { addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Conflict Details & Resolution */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Conflict Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Version */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Your Changes (Client)
                    </CardTitle>
                    <CardDescription>
                      Modified {formatDistanceToNow(new Date(currentConflict.operation.timestamp), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-32">
                      <pre className="text-xs bg-muted p-2 rounded">
                        {formatValue(currentConflict.operation.data)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Server Version */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Server className="h-4 w-4 text-green-500" />
                      Server Version
                    </CardTitle>
                    <CardDescription>
                      Current server data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-32">
                      <pre className="text-xs bg-muted p-2 rounded">
                        {formatValue(currentConflict.conflict)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Resolution Strategy */}
            <div>
              <h3 className="font-semibold mb-3">Resolution Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card 
                  className={`cursor-pointer transition-colors ${
                    resolutionStrategy === 'client' ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setResolutionStrategy('client')}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Use Your Changes
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Keep your offline modifications and overwrite server data
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className={`cursor-pointer transition-colors ${
                    resolutionStrategy === 'server' ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setResolutionStrategy('server')}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Server className="h-4 w-4 text-green-500" />
                      Use Server Version
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Discard your changes and keep current server data
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className={`cursor-pointer transition-colors ${
                    resolutionStrategy === 'merge' ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setResolutionStrategy('merge')}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <GitMerge className="h-4 w-4 text-purple-500" />
                      Smart Merge
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Combine both versions intelligently
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              
              <div className="flex gap-2">
                {selectedConflict > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedConflict(selectedConflict - 1)}
                  >
                    Previous
                  </Button>
                )}
                
                <Button onClick={handleResolve} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Resolve Conflict
                </Button>
                
                {selectedConflict < conflicts.length - 1 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedConflict(selectedConflict + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}