import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus } from "lucide-react";
import { getCommodityIcon, getStatusColor } from "@/lib/types";
import type { Commodity, Inspection } from "@shared/schema";

export default function InspectionsTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: commodities = [], isLoading: commoditiesLoading } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const { data: inspections = [], isLoading: inspectionsLoading } = useQuery<Inspection[]>({
    queryKey: ["/api/inspections"],
  });

  const isLoading = commoditiesLoading || inspectionsLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Combine commodity and inspection data
  const combinedData = commodities.map(commodity => {
    const latestInspection = inspections
      .filter(i => i.commodityId === commodity.id)
      .sort((a, b) => new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime())[0];
    
    return {
      ...commodity,
      inspection: latestInspection
    };
  });

  const filteredData = combinedData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = getStatusColor(status);
    const statusText = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return (
      <Badge className={`${colors} bg-opacity-10 text-xs font-medium rounded-full`}>
        {statusText}
      </Badge>
    );
  };

  const getGradeBadge = (grade: string) => {
    const isGoodGrade = grade.includes('7.5') || grade.includes('A') || grade.includes('1');
    return (
      <Badge className={`${isGoodGrade ? 'text-success bg-success' : 'text-warning bg-warning'} bg-opacity-10 text-xs font-medium rounded-full`}>
        {grade}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-neutral">Recent Commodity Inspections</CardTitle>
          <div className="flex space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search commodities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <Button className="bg-lacra-green hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>County</TableHead>
                <TableHead>Quality Grade</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No commodity data available. Add commodities and inspections to see them here.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.slice(0, 10).map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <i className={`fas fa-${getCommodityIcon(item.type)} text-amber-600 mr-3`}></i>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.batchNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">{item.county}</TableCell>
                    <TableCell>{getGradeBadge(item.qualityGrade)}</TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {item.inspection?.inspectorName || 'Not assigned'}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {item.inspection?.inspectionDate 
                        ? new Date(item.inspection.inspectionDate).toLocaleDateString()
                        : 'Not inspected'
                      }
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-lacra-blue hover:text-blue-700 mr-3">
                        View
                      </Button>
                      {item.status === 'compliant' ? (
                        <Button variant="ghost" size="sm" className="text-lacra-green hover:text-green-700">
                          Certify
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-warning hover:text-orange-700">
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredData.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 mt-4 rounded-b-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Showing 1 to {Math.min(10, filteredData.length)} of {filteredData.length} results</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button size="sm" className="bg-lacra-blue text-white">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
