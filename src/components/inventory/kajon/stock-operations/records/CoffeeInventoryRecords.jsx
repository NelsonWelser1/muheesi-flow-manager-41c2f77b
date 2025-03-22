
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";
import { useKAJONCoffees } from '@/integrations/supabase/hooks/useKAJONCoffee';
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert, AlertDescription, AlertTitle
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CoffeeInventoryRecords = ({ onBack, isKazo, location }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Set up filters for the API call
  const filters = {};
  if (location) {
    filters.location = location;
  }
  
  // Fetch coffee inventory data
  const { data: inventoryData, isLoading, error } = useKAJONCoffees(filters);
  
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button onClick={onBack} variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-semibold">Coffee Inventory Records</h2>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load inventory records"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Filter the data based on search term
  const filteredData = inventoryData?.filter(item => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (item.coffeeType && item.coffeeType.toLowerCase().includes(searchTermLower)) ||
      (item.qualityGrade && item.qualityGrade.toLowerCase().includes(searchTermLower)) ||
      (item.source && item.source.toLowerCase().includes(searchTermLower)) ||
      (item.location && item.location.toLowerCase().includes(searchTermLower)) ||
      (item.manager && item.manager.toLowerCase().includes(searchTermLower))
    );
  }) || [];
  
  // Filter based on active tab
  const tabFilteredData = activeTab === 'all' 
    ? filteredData 
    : filteredData.filter(item => item.status === activeTab);
  
  // Format currency
  const formatCurrency = (amount, currency) => {
    if (!amount) return '0';
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (e) {
      console.error('Error formatting currency:', e);
      return `${amount} ${currency || 'UGX'}`;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm" className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-xl font-semibold flex-1">Coffee Inventory Records</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by type, grade, source, location..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="processed">Processed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            {location 
              ? `Showing coffee inventory for ${location}` 
              : 'Showing all coffee inventory'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-2 items-center">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : tabFilteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coffee Details</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Specifications</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tabFilteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.coffeeType || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{item.qualityGrade || 'Ungraded'}</div>
                    </TableCell>
                    <TableCell>
                      <div>{item.source || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{item.location}</div>
                    </TableCell>
                    <TableCell>
                      <div>Humidity: {item.humidity || 0}%</div>
                      <div className="text-sm text-gray-500">Manager: {item.manager}</div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.buying_price, item.currency)}
                    </TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'active' ? 'default' : 'secondary'}
                      >
                        {item.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(item.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No coffee inventory records found.</p>
              {searchTerm && (
                <p className="text-gray-400 mt-2">
                  Try adjusting your search term or filters.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoffeeInventoryRecords;
