import { useState } from "react";
import { Helmet } from "react-helmet";

export default function GPSTest() {
  const [gpsData, setGpsData] = useState<string>("Click button to test GPS");
  const [isLoading, setIsLoading] = useState(false);

  const testGPS = () => {
    setIsLoading(true);
    setGpsData("Testing GPS...");

    if (!navigator.geolocation) {
      setGpsData("GPS not supported on this device");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsData(`GPS Working! 
Latitude: ${latitude.toFixed(6)}
Longitude: ${longitude.toFixed(6)}
Accuracy: ${Math.round(accuracy)}m
Timestamp: ${new Date().toLocaleTimeString()}`);
        setIsLoading(false);
      },
      (error) => {
        let errorMsg = "GPS Error: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += "Permission denied - Enable location access in browser settings";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += "Position unavailable - Check device location settings";
            break;
          case error.TIMEOUT:
            errorMsg += "Request timeout - Try again";
            break;
          default:
            errorMsg += error.message;
        }
        setGpsData(errorMsg);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Helmet>
        <title>GPS Test - AgriTrace360™</title>
      </Helmet>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">GPS Testing Center</h1>
          
          <div className="mb-6">
            <button
              onClick={testGPS}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? "Testing GPS..." : "Test GPS Permission"}
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">GPS Status:</h3>
            <pre className="whitespace-pre-wrap text-sm">{gpsData}</pre>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <h4 className="font-bold">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click "Test GPS Permission" button</li>
              <li>Allow location access when prompted by browser</li>
              <li>Wait for GPS coordinates to appear</li>
              <li>Check accuracy and coordinates</li>
            </ol>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Connection:</strong> {navigator.onLine ? "Online" : "Offline"}
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>GPS Support:</strong> {"geolocation" in navigator ? "Available" : "Not Available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}