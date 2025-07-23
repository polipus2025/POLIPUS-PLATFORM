import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { ConflictResolutionDialog } from '@/components/sync/conflict-resolution-dialog';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Trash2,
  Download,
  Upload,
  Database,
  Smartphone
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function OfflineSyncPage() {
  const { 
    isOnline, 
    isSyncing, 
    queuedOperations, 
    pendingConflicts, 
    lastSyncTime,
    syncNow,
    resolveConflict,
    clearQueue
  } = useOfflineSync();

  const [showConflictDialog, setShowConflictDialog] = useState(false);

  const syncProgress = isSyncing ? 50 : (queuedOperations === 0 ? 100 : 0);

  const getStatusIcon = () => {
    if (isSyncing) return <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />;
    if (!isOnline) return <WifiOff className="h-6 w-6 text-red-500" />;
    if (pendingConflicts.length > 0) return <AlertTriangle className="h-6 w-6 text-orange-500" />;
    if (queuedOperations > 0) return <Upload className="h-6 w-6 text-yellow-500" />;
    return <CheckCircle className="h-6 w-6 text-green-500" />;
  };

  const getStatusMessage = () => {
    if (isSyncing) return 'Syncing data with server...';
    if (!isOnline) return 'Device is offline. Data will sync when connection is restored.';
    if (pendingConflicts.length > 0) return `${pendingConflicts.length} conflicts require manual resolution.`;
    if (queuedOperations > 0) return `${queuedOperations} operations queued for sync.`;
    return 'All data is synchronized.';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offline Data Sync</h1>
          <p className="text-muted-foreground">
            Manage offline data synchronization and resolve conflicts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
              <Wifi className="h-4 w-4 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="h-4 w-4 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <CardTitle>Sync Status</CardTitle>
                <CardDescription>{getStatusMessage()}</CardDescription>
              </div>
            </div>
            
            <Button 
              onClick={() => syncNow()}
              disabled={!isOnline || isSyncing || queuedOperations === 0}
              className="gap-2"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync Now
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Sync Progress</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">{queuedOperations}</div>
                <div className="text-sm text-muted-foreground">Queued Operations</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">{pendingConflicts.length}</div>
                <div className="text-sm text-muted-foreground">Pending Conflicts</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {lastSyncTime ? formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true }) : 'Never'}
                </div>
                <div className="text-sm text-muted-foreground">Last Sync</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {localStorage.length}
                </div>
                <div className="text-sm text-muted-foreground">Cached Items</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Offline Capabilities
            </CardTitle>
            <CardDescription>
              Features available when working offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">View cached commodity data</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Create new inspection records</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Update farm plot information</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Generate batch codes</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Access GIS mapping data</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Manage local data and cache
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download className="h-4 w-4" />
              Download Data for Offline Use
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={clearQueue}
              disabled={queuedOperations === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear Sync Queue ({queuedOperations})
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => localStorage.clear()}
            >
              <Trash2 className="h-4 w-4" />
              Clear All Cached Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Conflict Resolution */}
      {pendingConflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Sync Conflicts ({pendingConflicts.length})
            </CardTitle>
            <CardDescription>
              These conflicts require manual resolution before sync can continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Conflicts occur when the same data was modified both offline and on the server. 
                Choose how to resolve each conflict.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => setShowConflictDialog(true)}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Resolve Conflicts
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Offline operations and sync history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {queuedOperations > 0 ? (
                <div className="text-sm text-muted-foreground">
                  {queuedOperations} operations queued for sync when online
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No pending operations
                </div>
              )}
              
              {lastSyncTime && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Last successful sync: {formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Conflict Resolution Dialog */}
      <ConflictResolutionDialog
        open={showConflictDialog}
        onOpenChange={setShowConflictDialog}
        conflicts={pendingConflicts}
        onResolve={resolveConflict}
      />
    </div>
  );
}