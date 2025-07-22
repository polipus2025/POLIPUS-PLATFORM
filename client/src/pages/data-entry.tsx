import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, ClipboardCheck, Award } from "lucide-react";
import CommodityForm from "@/components/forms/commodity-form";
import InspectionForm from "@/components/forms/inspection-form";
import CertificationForm from "@/components/forms/certification-form";

export default function DataEntry() {
  const [activeTab, setActiveTab] = useState("commodity");

  const entryTypes = [
    {
      id: "commodity",
      title: "Register Commodity",
      description: "Add new agricultural commodities to the system",
      icon: Package,
      color: "bg-lacra-blue"
    },
    {
      id: "inspection",
      title: "Record Inspection",
      description: "Document quality control inspections",
      icon: ClipboardCheck,
      color: "bg-lacra-green"
    },
    {
      id: "certification",
      title: "Issue Certificate",
      description: "Generate export certifications",
      icon: Award,
      color: "bg-lacra-orange"
    }
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Data Entry - AgriTrace360™ LACRA</title>
        <meta name="description" content="Manual data entry system for agricultural commodities, inspections, and certifications" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral mb-2">Data Entry</h2>
        <p className="text-gray-600">Manually enter commodity data, inspection results, and certifications</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {entryTypes.map((type) => (
          <Card 
            key={type.id} 
            className={`cursor-pointer hover:shadow-lg transition-all ${activeTab === type.id ? 'ring-2 ring-lacra-blue' : ''}`}
            onClick={() => setActiveTab(type.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${type.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  <type.icon className={`h-6 w-6 ${type.color.replace('bg-', 'text-')}`} />
                </div>
                <Button
                  size="sm"
                  variant={activeTab === type.id ? "default" : "outline"}
                  className={activeTab === type.id ? "bg-lacra-blue hover:bg-blue-700" : ""}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Select
                </Button>
              </div>
              <h3 className="font-semibold text-neutral mb-2">{type.title}</h3>
              <p className="text-sm text-gray-500">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Entry Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">
            {entryTypes.find(t => t.id === activeTab)?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="commodity">Commodity</TabsTrigger>
              <TabsTrigger value="inspection">Inspection</TabsTrigger>
              <TabsTrigger value="certification">Certification</TabsTrigger>
            </TabsList>

            <TabsContent value="commodity" className="mt-6">
              <CommodityForm />
            </TabsContent>

            <TabsContent value="inspection" className="mt-6">
              <InspectionForm />
            </TabsContent>

            <TabsContent value="certification" className="mt-6">
              <CertificationForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
