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
    <div className="min-h-screen isms-gradient">
      <div className="max-w-7xl mx-auto p-8">
        <Helmet>
          <title>Data Entry - AgriTrace360™ LACRA</title>
          <meta name="description" content="Manual data entry system for agricultural commodities, inspections, and certifications" />
        </Helmet>

        {/* Header Section - ISMS Style */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl isms-icon-bg-blue flex items-center justify-center">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Data Entry</h1>
            <p className="text-slate-600 text-lg">Manual entry system for commodities, inspections, and certifications</p>
          </div>
        </div>

        {/* Entry Type Cards - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {entryTypes.map((type) => (
            <div 
              key={type.id} 
              className={`isms-card cursor-pointer transition-all ${activeTab === type.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
              onClick={() => setActiveTab(type.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activeTab === type.id ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {activeTab === type.id ? 'Active' : 'Select'}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{type.title}</h3>
              <p className="text-slate-600">{type.description}</p>
            </div>
          ))}
        </div>

        {/* Data Entry Forms - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl isms-icon-bg-green flex items-center justify-center">
              {(() => {
                const IconComponent = entryTypes.find(t => t.id === activeTab)?.icon;
                return IconComponent ? <IconComponent className="h-5 w-5 text-white" /> : null;
              })()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {entryTypes.find(t => t.id === activeTab)?.title}
              </h3>
              <p className="text-slate-600">Complete the form below to submit your entry</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setActiveTab("commodity")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "commodity" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Commodity
              </button>
              <button
                onClick={() => setActiveTab("inspection")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "inspection" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Inspection
              </button>
              <button
                onClick={() => setActiveTab("certification")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "certification" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Certification
              </button>
            </div>

            <TabsContent value="commodity" className="mt-0">
              <CommodityForm />
            </TabsContent>

            <TabsContent value="inspection" className="mt-0">
              <InspectionForm />
            </TabsContent>

            <TabsContent value="certification" className="mt-0">
              <CertificationForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
