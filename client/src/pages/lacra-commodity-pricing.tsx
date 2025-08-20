import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, ArrowLeft, Building2, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import { SoftCommodityPricing } from '@/components/SoftCommodityPricing';

export default function LACRACommodityPricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>LACRA Commodity Pricing - Official Rates</title>
        <meta name="description" content="Official LACRA commodity pricing with quality grades for agricultural commodities" />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">LACRA Commodity Pricing</h1>
                <p className="text-sm text-slate-600">Official pricing with quality grades for all agricultural commodities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/exporter-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/polipus">
                <Button variant="outline" size="sm">
                  Back to Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Information Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-900 mb-2">Official LACRA Pricing System</h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>• All pricing is set and managed by LACRA (Liberia Agricultural Commodity Regulatory Agency)</p>
                <p>• Prices are updated regularly based on international market conditions</p>
                <p>• Quality grades: Premium {'>'} Grade 1 {'>'} Grade 2 {'>'} Subgrade</p>
                <p>• Pricing applies to all registered farmers, buyers, and exporters in Liberia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Commodities</p>
                  <p className="text-3xl font-bold text-blue-900">6</p>
                  <p className="text-xs text-blue-600 mt-1">Cocoa, Coffee, Palm Oil, Rubber, Cashew, Rice</p>
                </div>
                <TrendingUp className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Quality Grades</p>
                  <p className="text-3xl font-bold text-green-900">4</p>
                  <p className="text-xs text-green-600 mt-1">Premium to Subgrade classifications</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Currency</p>
                  <p className="text-3xl font-bold text-purple-900">USD</p>
                  <p className="text-xs text-purple-600 mt-1">United States Dollars per metric ton</p>
                </div>
                <Building2 className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Pricing Table */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-100">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <DollarSign className="h-6 w-6 text-green-600" />
              Complete LACRA Commodity Pricing Table
            </CardTitle>
            <p className="text-sm text-green-700">
              Current official pricing for all agricultural commodities with quality grade classifications
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <SoftCommodityPricing 
              canEdit={false}
              compact={false}
            />
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Grade Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span className="font-medium">Premium Grade</span>
                  <span className="text-green-600">Highest quality, export ready</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span className="font-medium">Grade 1</span>
                  <span className="text-blue-600">High quality, meets standards</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span className="font-medium">Grade 2</span>
                  <span className="text-yellow-600">Good quality, minor variations</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">Subgrade</span>
                  <span className="text-gray-600">Basic quality, local processing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">LACRA Pricing Department</p>
                  <p className="text-gray-600">Email: pricing@lacra.gov.lr</p>
                </div>
                <div>
                  <p className="font-medium">Market Analysis Unit</p>
                  <p className="text-gray-600">Phone: +231 77 LACRA (52272)</p>
                </div>
                <div>
                  <p className="font-medium">Office Hours</p>
                  <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                </div>
                <div>
                  <p className="font-medium">Emergency Contact</p>
                  <p className="text-gray-600">24/7 Market Hotline: +231 88 MARKET</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}