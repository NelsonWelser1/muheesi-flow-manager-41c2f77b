
import React, { useState, useEffect } from 'react';
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
import { Plus, Search, Filter, ArrowUpDown, FileDown, Beef, Tag, RefreshCw } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/supabase';
import CattleProfile from './CattleProfile';

const CattleList = () => {
  const [cattle, setCattle] = useState([]);
  const [filteredCattle, setFilteredCattle] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterBreed, setFilterBreed] = useState('all');
  const [sortField, setSortField] = useState('tag_number');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCattleId, setSelectedCattleId] = useState(null);
  const { toast } = useToast();

  // Fetch cattle data
  const fetchCattle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      setCattle(data || []);
      applyFilters(data || [], searchTerm, filterType, filterBreed);
    } catch (err) {
      console.error('Error fetching cattle data:', err);
      toast({
        title: "Error",
        description: "Failed to load cattle data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to cattle list
  const applyFilters = (cattleList, search, type, breed) => {
    let filtered = [...cattleList];
    
    // Apply search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(item => 
        (item.tag_number && item.tag_number.toLowerCase().includes(lowerSearch)) ||
        (item.name && item.name.toLowerCase().includes(lowerSearch)) ||
        (item.breed && item.breed.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Apply type filter
    if (type && type !== 'all') {
      filtered = filtered.filter(item => item.cattle_type === type);
    }
    
    // Apply breed filter
    if (breed && breed !== 'all') {
      filtered = filtered.filter(item => item.breed === breed);
    }
    
    setFilteredCattle(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(cattle, value, filterType, filterBreed);
  };

  // Handle type filter change
  const handleTypeChange = (value) => {
    setFilterType(value);
    applyFilters(cattle, searchTerm, value, filterBreed);
  };

  // Handle breed filter change
  const handleBreedChange = (value) => {
    setFilterBreed(value);
    applyFilters(cattle, searchTerm, filterType, value);
  };

  // Handle sort change
  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    fetchCattle();
  };

  // Handle view cattle profile
  const handleViewCattle = (id) => {
    setSelectedCattleId(id);
  };

  // Export to CSV
  const handleExport = () => {
    try {
      if (!filteredCattle.length) {
        toast({
          title: "No Data",
          description: "No cattle data available to export",
          variant: "destructive"
        });
        return;
      }
      
      // Format data for CSV
      const headers = [
        'Tag Number', 'Name', 'Type', 'Breed', 'DOB', 'Weight', 'Health Status', 'Status', 'Notes'
      ];
      
      const csvRows = [
        headers.join(',')
      ];
      
      filteredCattle.forEach(item => {
        const row = [
          item.tag_number,
          `"${item.name || ''}"`,
          item.cattle_type,
          item.breed,
          item.date_of_birth || '',
          item.weight || '',
          item.health_status,
          item.status,
          `"${item.notes?.replace(/"/g, '""') || ''}"`
        ];
        
        csvRows.push(row.join(','));
      });
      
      // Create and download CSV
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `cattle_list_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Cattle data has been exported to CSV"
      });
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      toast({
        title: "Export Failed",
        description: "Failed to export data: " + err.message,
        variant: "destructive"
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCattle();
  }, []);

  // If viewing a specific cattle profile
  if (selectedCattleId) {
    return <CattleProfile cattleId={selectedCattleId} onBack={() => setSelectedCattleId(null)} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Beef className="h-5 w-5 text-green-600" />
              <CardTitle>Cattle Management</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchCattle}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-1"
              >
                <FileDown className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Add New Cattle</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by tag, name, or breed..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filterType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="beef">Beef</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="dual">Dual Purpose</SelectItem>
                    <SelectItem value="calf">Calf</SelectItem>
                    <SelectItem value="bull">Bull</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={filterBreed} onValueChange={handleBreedChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Breeds</SelectItem>
                  <SelectItem value="Boran">Boran</SelectItem>
                  <SelectItem value="Ankole Longhorn">Ankole Longhorn</SelectItem>
                  <SelectItem value="Hereford">Hereford</SelectItem>
                  <SelectItem value="Aberdeen">Aberdeen</SelectItem>
                  <SelectItem value="Angus">Angus</SelectItem>
                  <SelectItem value="Charolais">Charolais</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            </div>
          ) : filteredCattle.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <Tag className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No cattle found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Add New Cattle
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('tag_number')}>
                      <div className="flex items-center gap-1">
                        Tag Number
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Name
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('date_of_birth')}>
                      <div className="flex items-center gap-1">
                        Age
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('weight')}>
                      <div className="flex items-center gap-1">
                        Weight
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCattle.map((cattle) => {
                    // Calculate age if date_of_birth exists
                    let ageText = "N/A";
                    if (cattle.date_of_birth) {
                      const birthDate = new Date(cattle.date_of_birth);
                      const ageInMs = new Date() - birthDate;
                      const ageInMonths = ageInMs / (1000 * 60 * 60 * 24 * 30.4375);
                      
                      if (ageInMonths < 1) {
                        ageText = `${Math.floor(ageInMonths * 30)} days`;
                      } else if (ageInMonths < 24) {
                        ageText = `${Math.floor(ageInMonths)} months`;
                      } else {
                        ageText = `${Math.floor(ageInMonths / 12)} years`;
                      }
                    }
                    
                    return (
                      <TableRow key={cattle.id}>
                        <TableCell>
                          <div className="font-medium">{cattle.tag_number}</div>
                        </TableCell>
                        <TableCell>{cattle.name || "-"}</TableCell>
                        <TableCell>{cattle.cattle_type}</TableCell>
                        <TableCell>{cattle.breed}</TableCell>
                        <TableCell>{ageText}</TableCell>
                        <TableCell>{cattle.weight ? `${cattle.weight} kg` : "-"}</TableCell>
                        <TableCell>
                          <Badge className={`${
                            cattle.health_status === 'good' ? 'bg-green-100 text-green-800' : 
                            cattle.health_status === 'fair' ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {cattle.health_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-200">
                            {cattle.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewCattle(cattle.id)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleList;
