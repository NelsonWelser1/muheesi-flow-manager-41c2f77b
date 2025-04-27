
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { 
  FileText, Filter, RefreshCw, Calendar, 
  Syringe, Pill, HeartPulse, Search, X, Eye
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

const RecentHealthRecords = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch records on component mount
  useEffect(() => {
    fetchHealthRecords();
  }, []);

  // Function to fetch health records from Supabase
  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching health records from Supabase...");
      
      const { data, error } = await supabase
        .from('cattle_health_records')
        .select(`
          *,
          cattle_inventory:cattle_id (
            id,
            tag_number,
            name
          )
        `)
        .order('record_date', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Health records fetched:", data.length, data);
      setRecords(data || []);
    } catch (err) {
      console.error("Error fetching health records:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Failed to load health records",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter records by search term and selected type
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      (record.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.cattle_inventory?.tag_number?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.cattle_inventory?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.administered_by?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || record.record_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Get the type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-4 w-4 text-blue-500" />;
      case 'treatment':
        return <Pill className="h-4 w-4 text-orange-500" />;
      case 'examination':
        return <HeartPulse className="h-4 w-4 text-green-500" />;
      case 'deworming':
        return <Pill className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get status badge for next due date
  const getStatusBadge = (record) => {
    if (!record.next_due_date) return null;
    
    const now = new Date();
    const dueDate = new Date(record.next_due_date);
    const daysDiff = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return <Badge className="bg-red-500">Overdue ({-daysDiff} days)</Badge>;
    } else if (daysDiff <= 7) {
      return <Badge className="bg-yellow-500">Due soon ({daysDiff} days)</Badge>;
    } else {
      return <Badge className="bg-green-500">Upcoming</Badge>;
    }
  };

  // Open record details dialog
  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Health Records
          </CardTitle>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchHealthRecords}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and filter section */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 pr-10"
              placeholder="Search by tag number, description, admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter by type</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All records</SelectItem>
                <SelectItem value="vaccination">Vaccinations</SelectItem>
                <SelectItem value="treatment">Treatments</SelectItem>
                <SelectItem value="examination">Examinations</SelectItem>
                <SelectItem value="deworming">Deworming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
            <p className="flex items-center">
              <span className="font-medium">Error:</span>
              <span className="ml-2">{error}</span>
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading health records...</p>
            </div>
          </div>
        )}

        {/* No records state */}
        {!loading && filteredRecords.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-md">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2 opacity-50" />
            <p className="text-muted-foreground">No health records found.</p>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria.</p>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={fetchHealthRecords}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        )}

        {/* Records table */}
        {!loading && filteredRecords.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Tag Number</TableHead>
                  <TableHead>Cattle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Next Due</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.slice(0, 5).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {formatDate(record.record_date)}
                    </TableCell>
                    <TableCell>
                      {record.cattle_inventory?.tag_number || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.cattle_inventory?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(record.record_type)}
                        <span className="capitalize">{record.record_type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell max-w-[200px] truncate">
                      {record.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.next_due_date ? (
                        <div className="flex flex-col">
                          <span className="text-xs">{formatDate(record.next_due_date)}</span>
                          {getStatusBadge(record)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => viewRecordDetails(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Footer showing record count and view more */}
            <div className="flex justify-between items-center mt-4 px-2">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min(filteredRecords.length, 5)} of {filteredRecords.length} records
              </p>
              {filteredRecords.length > 5 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => {
                    toast({
                      title: "View All Records",
                      description: "This would open a full view of all health records.",
                    });
                  }}
                >
                  View all records
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Record details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Health Record Details</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(selectedRecord.record_type)}
                <span className="capitalize text-lg font-medium">
                  {selectedRecord.record_type} Record
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Cattle</p>
                  <p className="font-medium">{selectedRecord.cattle_inventory?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tag Number</p>
                  <p className="font-medium">{selectedRecord.cattle_inventory?.tag_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Record Date</p>
                  <p className="font-medium">{formatDate(selectedRecord.record_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Due Date</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {selectedRecord.next_due_date ? formatDate(selectedRecord.next_due_date) : 'None'}
                    </p>
                    {getStatusBadge(selectedRecord)}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedRecord.description}</p>
                </div>
                {selectedRecord.treatment && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Treatment</p>
                    <p>{selectedRecord.treatment}</p>
                  </div>
                )}
                {selectedRecord.administered_by && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Administered By</p>
                    <p>{selectedRecord.administered_by}</p>
                  </div>
                )}
                {selectedRecord.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p>{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RecentHealthRecords;
