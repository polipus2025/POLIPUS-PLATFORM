import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Search, Plus, Award, Download, Eye } from "lucide-react";
import type { Certification, Commodity } from "@shared/schema";

export default function Certifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: certifications = [], isLoading: certificationsLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
  });

  const { data: commodities = [], isLoading: commoditiesLoading } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const isLoading = certificationsLoading || commoditiesLoading;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combine certification and commodity data
  const certificationsWithCommodities = certifications.map(certification => {
    const commodity = commodities.find(c => c.id === certification.commodityId);
    return {
      ...certification,
      commodity
    };
  });

  const filteredCertifications = certificationsWithCommodities.filter(certification => {
    const matchesSearch = certification.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certification.exporterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certification.commodity?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || certification.status === statusFilter;
    const matchesType = typeFilter === "all" || certification.certificateType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'text-success bg-success',
      expired: 'text-warning bg-warning',
      revoked: 'text-error bg-error'
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-400'} bg-opacity-10 text-xs font-medium rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      export: 'border-lacra-blue text-lacra-blue',
      quality: 'border-lacra-green text-lacra-green',
      organic: 'border-lacra-orange text-lacra-orange'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${colors[type as keyof typeof colors] || 'border-gray-400 text-gray-600'} text-xs`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const isExpiringSoon = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Export Certifications - AgriTrace360™ LACRA</title>
        <meta name="description" content="Export certification tracking and management system for agricultural commodity compliance" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Export Certifications</h2>
            <p className="text-gray-600">Manage export certificates and track compliance documentation</p>
          </div>
          <Button className="bg-lacra-green hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-neutral">{certifications.length}</div>
                <p className="text-sm text-gray-500">Total Certificates</p>
              </div>
              <Award className="h-8 w-8 text-lacra-blue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">
              {certifications.filter(c => c.status === 'active').length}
            </div>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-warning">
              {certifications.filter(c => isExpiringSoon(c.expiryDate)).length}
            </div>
            <p className="text-sm text-gray-500">Expiring Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-error">
              {certifications.filter(c => c.status === 'expired' || c.status === 'revoked').length}
            </div>
            <p className="text-sm text-gray-500">Expired/Revoked</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by certificate number, exporter, or commodity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">
            Certificates ({filteredCertifications.length} of {certifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Exporter</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {certifications.length === 0 
                        ? "No certificates issued yet. Start by issuing your first export certificate."
                        : "No certificates match your current filters."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCertifications.map((certification) => (
                    <TableRow key={certification.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-mono text-sm font-medium">
                          {certification.certificateNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Issued by {certification.issuedBy}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(certification.certificateType)}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {certification.commodity?.name || 'Unknown Commodity'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {certification.commodity?.batchNumber || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {certification.exporterName || 'Not specified'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {certification.exportDestination || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(certification.issuedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className={isExpiringSoon(certification.expiryDate) ? 'text-warning font-medium' : ''}>
                          {new Date(certification.expiryDate).toLocaleDateString()}
                        </div>
                        {isExpiringSoon(certification.expiryDate) && (
                          <div className="text-xs text-warning">Expires soon</div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(certification.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-lacra-blue hover:text-blue-700">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-lacra-green hover:text-green-700">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
