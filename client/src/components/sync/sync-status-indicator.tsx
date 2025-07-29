import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Cloud,
  CloudOff
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SyncStatusIndicator() {
  const { 
    isOnline, 
    isSyncing, 
    queuedOperations, 
    pendingConflicts, 
    lastSyncTime,
    syncNow 
  } = useOfflineSync();

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (pendingConflicts.length > 0) return 'default';
    if (queuedOperations > 0) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isSyncing) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    if (pendingConflicts.length > 0) return <AlertTriangle className="h-4 w-4" />;
    if (queuedOperations > 0) return <Cloud className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (isSyncing) return 'Syncing...';
    if (!isOnline) return 'Offline';
    if (pendingConflicts.length > 0) return `${pendingConflicts.length} Conflicts`;
    if (queuedOperations > 0) return `${queuedOperations} Queued`;
    return 'Synced';
  };

  const getLastSyncText = () => {
    if (!lastSyncTime) return 'Never';
    return formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
          {getStatusIcon()}
          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {getStatusText()}
          </div>
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 isms-card border-0 shadow-xl" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Sync Status</h4>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Queued Operations</div>
              <div className="font-medium">{queuedOperations}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Pending Conflicts</div>
              <div className="font-medium">{pendingConflicts.length}</div>
            </div>
          </div>

          <div className="text-sm">
            <div className="text-muted-foreground">Last Sync</div>
            <div className="font-medium">{getLastSyncText()}</div>
          </div>

          {queuedOperations > 0 && (
            <div className="text-sm text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              {queuedOperations} operations will sync when online
            </div>
          )}

          {pendingConflicts.length > 0 && (
            <div className="text-sm text-orange-600">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              {pendingConflicts.length} conflicts need resolution
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => syncNow()}
              disabled={!isOnline || isSyncing || queuedOperations === 0}
              className="flex-1"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync Now
            </Button>
            
            {pendingConflicts.length > 0 && (
              <Button variant="outline" size="sm" className="flex-1">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Resolve
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}