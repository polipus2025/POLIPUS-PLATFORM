// AgriTrace360™ LACRA Mobile App Dashboard Page
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  MapPin, 
  QrCode, 
  Users, 
  Shield, 
  Zap,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  ArrowLeft,
  LogOut
} from 'lucide-react';

const MobileAppDashboard: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'android' | 'ios' | 'both'>('both');

  const appFeatures = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "GPS Field Mapping",
      description: "Precision boundary mapping with real-time GPS coordinates",
      status: "Active",
      color: "bg-green-500"
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "QR Code Scanner",
      description: "Commodity tracking through barcode scanning",
      status: "Active",
      color: "bg-blue-500"
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Offline Sync",
      description: "Work without internet, sync when connected",
      status: "Active",
      color: "bg-purple-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-Role Access",
      description: "Farmer, Field Agent, Regulatory, Exporter portals",
      status: "Active",
      color: "bg-orange-500"
    }
  ];

  const downloadStats = {
    totalDownloads: 1247,
    activeUsers: 892,
    avgRating: 4.8,
    lastUpdate: "2025-01-30"
  };

  const platformStats = {
    android: { users: 567, version: "1.0.0", status: "Published" },
    ios: { users: 325, version: "1.0.0", status: "Review" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Mobile App Dashboard</h1>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/monitoring-dashboard'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Monitoring
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userType");
                window.location.href = "/monitoring-dashboard";
              }}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        <p className="text-gray-600 text-lg">
          AgriTrace360™ LACRA Mobile Application Management & Analytics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{downloadStats.totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{downloadStats.activeUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">App Rating</p>
                <p className="text-2xl font-bold text-gray-900">{downloadStats.avgRating}/5.0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Update</p>
                <p className="text-2xl font-bold text-gray-900">{downloadStats.lastUpdate}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* App Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  App Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">App Name:</span>
                  <span>AgriTrace360™ LACRA Mobile</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Version:</span>
                  <Badge variant="outline">v1.0.0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Framework:</span>
                  <span>React Native + Expo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Bundle Size:</span>
                  <span>15.2 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Min OS Version:</span>
                  <span>Android 8.0+ / iOS 12.0+</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download APK (Android)
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  View on App Store (iOS)
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Push Notifications
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mobile App Architecture */}
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Architecture</CardTitle>
              <CardDescription>
                Technical overview of the AgriTrace360™ LACRA mobile application structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold mb-2">Frontend</h3>
                  <p className="text-sm text-gray-600">React Native with Expo</p>
                  <p className="text-sm text-gray-600">TypeScript & Navigation</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-2">Backend API</h3>
                  <p className="text-sm text-gray-600">Express.js REST API</p>
                  <p className="text-sm text-gray-600">JWT Authentication</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold mb-2">Security</h3>
                  <p className="text-sm text-gray-600">Encrypted Storage</p>
                  <p className="text-sm text-gray-600">Role-based Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Features</CardTitle>
              <CardDescription>
                Comprehensive feature set for agricultural compliance management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <Badge variant="secondary">{feature.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Portals */}
          <Card>
            <CardHeader>
              <CardTitle>User Portals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold">F</span>
                  </div>
                  <h3 className="font-semibold text-green-700">Farmer Portal</h3>
                  <p className="text-sm text-green-600">GPS Mapping, Commodity Registration</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-orange-50">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <h3 className="font-semibold text-orange-700">Field Agent</h3>
                  <p className="text-sm text-orange-600">QR Scanner, Inspections</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-blue-50">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold">R</span>
                  </div>
                  <h3 className="font-semibold text-blue-700">Regulatory</h3>
                  <p className="text-sm text-blue-600">Compliance, Certificates</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-purple-50">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <h3 className="font-semibold text-purple-700">Exporter</h3>
                  <p className="text-sm text-purple-600">Export Permits, EUDR</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Android Platform */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Android Platform
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {platformStats.android.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-semibold">{platformStats.android.users}</span>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-semibold">{platformStats.android.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Min SDK:</span>
                  <span className="font-semibold">API 26 (Android 8.0)</span>
                </div>
                <div className="flex justify-between">
                  <span>Target SDK:</span>
                  <span className="font-semibold">API 34 (Android 14)</span>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download APK
                </Button>
              </CardContent>
            </Card>

            {/* iOS Platform */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    iOS Platform
                  </span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {platformStats.ios.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-semibold">{platformStats.ios.users}</span>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-semibold">{platformStats.ios.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Min iOS:</span>
                  <span className="font-semibold">iOS 12.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Target iOS:</span>
                  <span className="font-semibold">iOS 17.0</span>
                </div>
                <Button className="w-full" variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  View on App Store
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Platform Features Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Feature Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { feature: "GPS Mapping", android: true, ios: true },
                  { feature: "QR Code Scanner", android: true, ios: true },
                  { feature: "Offline Storage", android: true, ios: true },
                  { feature: "Push Notifications", android: true, ios: false },
                  { feature: "Background Location", android: true, ios: true },
                  { feature: "Biometric Auth", android: true, ios: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b">
                    <span className="font-medium">{item.feature}</span>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Android</span>
                        {item.android ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">iOS</span>
                        {item.ios ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                Mobile app usage statistics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">89%</div>
                  <div className="text-sm text-gray-600">User Retention (30 days)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">12.3</div>
                  <div className="text-sm text-gray-600">Avg Session Duration (min)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">456</div>
                  <div className="text-sm text-gray-600">GPS Maps Created (Week)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>GPS Field Mapping</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="w-24 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>QR Code Scanner</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="w-20 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">62%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Commodity Registration</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="w-16 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">48%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Offline Mode</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Configuration</CardTitle>
              <CardDescription>
                Mobile app build and deployment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Build Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Build Type:</span>
                      <Badge variant="outline">Production</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Bundle ID:</span>
                      <span>com.lacra.agritrace360</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Version Code:</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API URL:</span>
                      <span>https://api.lacra.gov.lr</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Distribution</h3>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Build Android APK
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Globe className="h-4 w-4 mr-2" />
                      Submit to App Store
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure OTA Updates
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Core functionality implementation</span>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>GPS mapping and offline sync</span>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Push notifications system</span>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Biometric authentication</span>
                  <Badge variant="outline">Planned</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Multi-language support</span>
                  <Badge variant="outline">Planned</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileAppDashboard;