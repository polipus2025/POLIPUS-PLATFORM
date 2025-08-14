import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Satellite, Activity, RefreshCw } from "lucide-react";

interface SatelliteStatusWidgetProps {
  satelliteStatus: any;
  isConnecting: boolean;
  onRefresh: () => void;
}

export default function SatelliteStatusWidget({ 
  satelliteStatus, 
  isConnecting, 
  onRefresh 
}: SatelliteStatusWidgetProps) {
  if (!satelliteStatus) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <Satellite className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">No satellite connection</p>
          <Button onClick={onRefresh} disabled={isConnecting} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Satellite className="h-4 w-4" />
          Satellite Status
          <Badge variant="default" className="bg-green-500 text-xs">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-blue-600 font-bold">{satelliteStatus.gps.available}</span>
            <div className="text-gray-600">GPS</div>
          </div>
          <div>
            <span className="text-green-600 font-bold">{satelliteStatus.glonass.available}</span>
            <div className="text-gray-600">GLONASS</div>
          </div>
          <div>
            <span className="text-purple-600 font-bold">{satelliteStatus.galileo.available}</span>
            <div className="text-gray-600">Galileo</div>
          </div>
          <div>
            <span className="text-red-600 font-bold">{satelliteStatus.beidou.available}</span>
            <div className="text-gray-600">BeiDou</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-green-600">
          Accuracy: {satelliteStatus.gps.accuracy}
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm" className="w-full mt-2">
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
}