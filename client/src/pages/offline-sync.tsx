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
    <div className="min-h-screen isms-gradient">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header Section - ISMS Style */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl isms-icon-bg-blue flex items-center justify-center">
            <Database className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900">Offline Data Sync</h1>
            <p className="text-slate-600 text-lg">Manage offline data synchronization and resolve conflicts</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isOnline ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg border border-green-200">
                <Wifi className="h-4 w-4" />
                <span className="text-sm font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-lg border border-red-200">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm font-medium">Offline</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Overview - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                {getStatusIcon()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Sync Status</h3>
                <p className="text-slate-600">{getStatusMessage()}</p>
              </div>
            </div>
            
            <Button 
              onClick={() => syncNow()}
              disabled={!isOnline || isSyncing || queuedOperations === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync Now
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-700 font-medium">Sync Progress</span>
                <span className="text-slate-900 font-semibold">{syncProgress}%</span>
              </div>
              <div className="isms-progress-bar">
                <div 
                  className="isms-progress-fill" 
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="isms-metric-number text-blue-600">{queuedOperations}</div>
                <div className="text-sm text-slate-600 font-medium">Queued Operations</div>
              </div>
              <div className="text-center">
                <div className="isms-metric-number text-orange-600">{pendingConflicts.length}</div>
                <div className="text-sm text-slate-600 font-medium">Pending Conflicts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {lastSyncTime ? formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true }) : 'Never'}
                </div>
                <div className="text-sm text-slate-600 font-medium">Last Sync</div>
              </div>
              <div className="text-center">
                <div className="isms-metric-number text-slate-900">
                  {localStorage.length}
                </div>
                <div className="text-sm text-slate-600 font-medium">Cached Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Offline Features - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="isms-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Offline Capabilities</h3>
                <p className="text-slate-600">Features available when working offline</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-700">View cached commodity data</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-700">Create new inspection records</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-700">Update farm plot information</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-700">Generate batch codes</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-700">Access GIS mapping data</span>
              </div>
            </div>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Data Management</h3>
                <p className="text-slate-600">Manage local data and cache</p>
              </div>
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                <Download className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Download Data for Offline Use</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={clearQueue}
                disabled={queuedOperations === 0}
              >
                <Trash2 className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Clear Sync Queue ({queuedOperations})</span>
              </button>
              
              <button 
                className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                onClick={() => localStorage.clear()}
              >
                <Trash2 className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Clear All Cached Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conflict Resolution - ISMS Style */}
        {pendingConflicts.length > 0 && (
          <div className="isms-card border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl isms-icon-bg-orange flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Sync Conflicts ({pendingConflicts.length})</h3>
                <p className="text-slate-600">These conflicts require manual resolution before sync can continue</p>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <p className="text-orange-800 text-sm">
                  Conflicts occur when the same data was modified both offline and on the server. 
                  Choose how to resolve each conflict.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowConflictDialog(true)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
            >
              <AlertTriangle className="h-5 w-5" />
              Resolve Conflicts
            </button>
          </div>
        )}

        {/* Sync History - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl isms-icon-bg-slate flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
              <p className="text-slate-600">Offline operations and sync history</p>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 h-64 overflow-y-auto">
            <div className="space-y-4">
              {queuedOperations > 0 ? (
                <div className="text-slate-600">
                  {queuedOperations} operations queued for sync when online
                </div>
              ) : (
                <div className="text-slate-600">
                  No pending operations
                </div>
              )}
              
              {lastSyncTime && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-slate-700">Last successful sync: {formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conflict Resolution Dialog */}
        <ConflictResolutionDialog
          open={showConflictDialog}
          onOpenChange={setShowConflictDialog}
          conflicts={pendingConflicts}
          onResolve={resolveConflict}
        />
      </div>
    </div>
  );
}