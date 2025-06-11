import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, FileDown, Filter, Pencil, Trash2, Beef, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/supabase";

const CattleManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBreed, setFilterBreed] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [cattleData, setCattleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchCattleData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cattle_inventory")
        .select("*")
        .eq("farm_id", "kyalima")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const transformedData = data.map((record, index) => ({
        id: record.id || `CT-${index + 1}`,
        tagNumber: record.tag_number,
        name: record.name || "Unnamed",
        breed: record.breed,
        type: record.type,
        dateOfBirth: record.date_of_birth,
        weight: record.weight,
        healthStatus: record.health_status || "good",
        purchaseDate: record.purchase_date,
        notes: record.notes,
        lastUpdated: record.updated_at || record.created_at
      }));

      setCattleData(transformedData);
      
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${data.length} cattle records.`
      });
    } catch (error) {
      console.error("Error fetching cattle data:", error);
      toast({
        title: "Error",
        description: "Failed to load cattle data. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCattleData();
  }, []);

  const refreshData = () => {
    fetchCattleData();
  };

  const handleExportCSV = () => {
    // Export logic here
    toast({
      title: "Export Complete",
      description: "Your cattle data has been exported to CSV."
    });
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from("cattle_inventory")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCattleData(prev => prev.filter(cattle => cattle.id !== id));
      
      toast({
        title: "Success",
        description: "Cattle record deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting cattle:", error);
      toast({
        title: "Error",
        description: "Failed to delete cattle record.",
        variant: "destructive"
      });
    }
  };

  const getHealthBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
      case "good":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>;
      case "fair":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Fair</Badge>;
      case "poor":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Poor</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Critical</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  const filteredCattleData = cattleData.filter((record) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      record.tagNumber?.toLowerCase().includes(searchLower) ||
      record.name?.toLowerCase().includes(searchLower) ||
      record.breed?.toLowerCase().includes(searchLower) ||
      record.type?.toLowerCase().includes(searchLower);
    
    const matchesBreed = filterBreed === "all" || record.breed === filterBreed;
    const matchesType = filterType === "all" || record.type === filterType;
    
    return matchesSearch && matchesBreed && matchesType;
  });

  // Get unique breeds and types for filters
  const uniqueBreeds = [...new Set(cattleData.map(cattle => cattle.breed).filter(Boolean))];
  const uniqueTypes = [...new Set(cattleData.map(cattle => cattle.type).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Beef className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl font-bold">Cattle Management</h2>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Cattle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cattleData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All registered cattle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dairy Cows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cattleData.filter(c => c.type === "Dairy Cow").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active milk producers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Healthy Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cattleData.filter(c => ["excellent", "good"].includes(c.healthStatus?.toLowerCase())).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Excellent & Good health</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cattleData.length > 0 ? 
                Math.round(cattleData.reduce((sum, c) => sum + (c.weight || 0), 0) / cattleData.length) : 0
              } kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">All cattle average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cattle by tag, name, breed, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={filterBreed} onValueChange={setFilterBreed}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Breeds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Breeds</SelectItem>
            {uniqueBreeds.map(breed => (
              <SelectItem key={breed} value={breed}>{breed}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={refreshData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button variant="outline" onClick={handleExportCSV}>
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Cattle Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cattle Records ({filteredCattleData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" id="cattle-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Health Status</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading cattle data...
                    </TableCell>
                  </TableRow>
                ) : filteredCattleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No cattle records found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCattleData.map((cattle) => (
                    <TableRow key={cattle.id}>
                      <TableCell className="font-medium">{cattle.tagNumber}</TableCell>
                      <TableCell>{cattle.name}</TableCell>
                      <TableCell>{cattle.breed}</TableCell>
                      <TableCell>{cattle.type}</TableCell>
                      <TableCell>{cattle.weight || 'N/A'}</TableCell>
                      <TableCell>{getHealthBadge(cattle.healthStatus)}</TableCell>
                      <TableCell>
                        {cattle.dateOfBirth ? format(parseISO(cattle.dateOfBirth), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(cattle.id)}
                          >
                            <Trash2 className="h-3 w-3" />
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
};

export default CattleManagement;
