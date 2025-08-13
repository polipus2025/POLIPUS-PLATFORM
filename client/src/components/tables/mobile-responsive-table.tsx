import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface MobileResponsiveTableProps {
  data: any[];
  columns: {
    header: string;
    accessor: string;
    cell?: (item: any) => React.ReactNode;
    mobileLabel?: string;
  }[];
  actions?: (item: any) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  mobileCardView?: boolean;
}

export default function MobileResponsiveTable({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "No data available",
  mobileCardView = true
}: MobileResponsiveTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.accessor}>{column.header}</TableHead>
                ))}
                {actions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.accessor}>
                      {column.cell ? column.cell(item) : item[column.accessor]}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>{actions(item)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      {mobileCardView && (
        <div className="md:hidden space-y-4">
          {data.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                {columns.map((column) => (
                  <div key={column.accessor} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">
                      {column.mobileLabel || column.header}:
                    </span>
                    <div className="text-sm text-right max-w-[60%]">
                      {column.cell ? column.cell(item) : item[column.accessor]}
                    </div>
                  </div>
                ))}
                {actions && (
                  <div className="pt-3 border-t border-gray-100">
                    {actions(item)}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Mobile List View (Alternative) */}
      {!mobileCardView && (
        <div className="md:hidden">
          <Card>
            <div className="divide-y divide-gray-100">
              {data.map((item, index) => (
                <div key={index} className="p-4">
                  <div className="space-y-2">
                    {columns.slice(0, 3).map((column) => (
                      <div key={column.accessor} className="flex justify-between text-sm">
                        <span className="font-medium text-gray-600">
                          {column.mobileLabel || column.header}
                        </span>
                        <span className="text-gray-900">
                          {column.cell ? column.cell(item) : item[column.accessor]}
                        </span>
                      </div>
                    ))}
                    {actions && (
                      <div className="pt-2 flex justify-end">
                        {actions(item)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}