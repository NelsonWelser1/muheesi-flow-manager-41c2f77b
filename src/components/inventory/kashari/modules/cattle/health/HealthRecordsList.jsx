import React, { useState } from 'react';
import { useCattleHealthRecords } from '@/hooks/useCattleHealthRecords';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Syringe, 
  Pill, 
  HeartPulse, 
  Calendar, 
  Filter, 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  Loader2,
  RefreshCw,
  Eye,
  Edit
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import HealthRecordCard from './HealthRecordCard';
import HealthRecordDialog from './HealthRecordDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HealthRecordsList = ({ cattleId = null }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  
  const { records, isLoading, error, refetch } = useCattleHealthRecords(cattleId);

  const filteredRecords = React.useMemo(() => {
    if (!records) return [];
    
    return records.filter(record => {
      const matchesType = recordTypeFilter === "all" || record.record_type === recordTypeFilter;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        record.description?.toLowerCase().includes(searchLower) ||
        record.treatment?.toLowerCase().includes(searchLower) ||
        record.administered_by?.toLowerCase().includes(searchLower) ||
        record.cattle_inventory?.tag_number?.toLowerCase().includes(searchLower) ||
        record.cattle_inventory?.name?.toLowerCase().includes(searchLower);
      
      return matchesType && matchesSearch;
    });
  }, [records, searchTerm, recordTypeFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (nextDueDate) => {
    if (!nextDueDate) return null;
    
    const now = new Date();
    const dueDate = new Date(nextDueDate);
    const daysDiff = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysDiff <= 7) {
      return <Badge variant="warning" className="bg-amber-500 text-white">Due soon</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

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
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            className="pl-9 pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="w-[180px]">
            <Select
              value={recordTypeFilter}
              onValueChange={setRecordTypeFilter}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{recordTypeFilter === 'all' ? 'All records' : recordTypeFilter}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All records</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="examination">Examination</SelectItem>
                <SelectItem value="deworming">Deworming</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-1 border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-10 w-10"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon" 
              className="h-10 w-10"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading health records...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-semibold">Error loading health records</p>
          <p>{error.message}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </div>
      )}
      
      {!isLoading && !error && filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No health records found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || recordTypeFilter !== 'all' 
              ? "Try adjusting your search or filters" 
              : "Add your first health record to get started"}
          </p>
        </div>
      )}
      
      {!isLoading && !error && filteredRecords.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map(record => (
            <HealthRecordCard
              key={record.id}
              record={record}
              onEdit={(record) => setEditRecord(record)}
              onView={(record) => setViewRecord(record)}
            />
          ))}
        </div>
      )}
      
      {!isLoading && !error && filteredRecords.length > 0 && viewMode === "list" && (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Cattle</th>
                <th className="text-left p-3 hidden md:table-cell">Description</th>
                <th className="text-left p-3 hidden lg:table-cell">Next Due</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(record.record_type)}
                      <span className="capitalize">{record.record_type}</span>
                    </div>
                  </td>
                  <td className="p-3">{formatDate(record.record_date)}</td>
                  <td className="p-3">
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {record.cattle_inventory?.tag_number || 'Unknown'}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {record.cattle_inventory?.name || 'Unnamed'}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 max-w-[300px] truncate hidden md:table-cell">
                    {record.description}
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    {record.next_due_date ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{formatDate(record.next_due_date)}</span>
                        {getStatusBadge(record.next_due_date)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewRecord(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditRecord(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="capitalize flex items-center gap-2">
              {viewRecord && getTypeIcon(viewRecord.record_type)}
              {viewRecord?.record_type} Record
            </DialogTitle>
          </DialogHeader>
          
          {viewRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Cattle</p>
                  <p className="font-medium">{viewRecord.cattle_inventory?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tag Number</p>
                  <p className="font-medium">{viewRecord.cattle_inventory?.tag_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Record Date</p>
                  <p className="font-medium">{formatDate(viewRecord.record_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Due Date</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {viewRecord.next_due_date ? formatDate(viewRecord.next_due_date) : 'None'}
                    </p>
                    {getStatusBadge(viewRecord.next_due_date)}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{viewRecord.description}</p>
                </div>
                
                {viewRecord.treatment && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Treatment</p>
                    <p>{viewRecord.treatment}</p>
                  </div>
                )}
                
                {viewRecord.administered_by && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Administered By</p>
                    <p>{viewRecord.administered_by}</p>
                  </div>
                )}
                
                {viewRecord.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p>{viewRecord.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setEditRecord(viewRecord)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {editRecord && (
        <HealthRecordDialog
          title="Edit Health Record"
          initialValues={editRecord}
          onSuccess={() => {
            setEditRecord(null);
            setViewRecord(null);
          }}
          trigger={<div />} // Hidden trigger
          open={!!editRecord}
          onOpenChange={(open) => {
            if (!open) setEditRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default HealthRecordsList;
