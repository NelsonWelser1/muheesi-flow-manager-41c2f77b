
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Farm, Sprout, Calendar, User, RefreshCcw, Download, Filter, Coffee } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/supabase';

const FarmInformationView = ({ isLoading, handleRefresh }) => {
  const [farms, setFarms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('farm-info');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });

  const fetchFarmData = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would fetch actual farm data from Supabase
      // For now, we'll use mock data since the table may not exist yet
      
      // Mock farm information data
      const mockFarms = [
        {
          id: 1,
          name: 'Kanoni Coffee Farm',
          location: 'Kanoni-Mbogo, Kazo',
          size: '5.2 hectares',
          manager: 'John Kagaba',
          coffee_type: 'Arabica',
          trees: 2500,
          elevation: '1520m',
          soil_type: 'Loamy',
          status: 'active',
          last_inspection: '2024-07-01T10:30:00Z',
          created_at: '2023-12-01T08:00:00Z'
        },
        {
          id: 2,
          name: 'Engari Plantation',
          location: 'Engari-Kyengando, Kazo',
          size: '8.7 hectares',
          manager: 'Sarah Mutesi',
          coffee_type: 'Robusta',
          trees: 4200,
          elevation: '1380m',
          soil_type: 'Clay loam',
          status: 'active',
          last_inspection: '2024-06-28T14:15:00Z',
          created_at: '2023-11-15T09:30:00Z'
        },
        {
          id: 3,
          name: 'Migina Community Farm',
          location: 'Migina, Kazo',
          size: '12.3 hectares',
          manager: 'David Muwonge',
          coffee_type: 'Mixed (Arabica & Robusta)',
          trees: 5800,
          elevation: '1450m',
          soil_type: 'Sandy loam',
          status: 'active',
          last_inspection: '2024-06-25T11:00:00Z',
          created_at: '2024-01-10T10:15:00Z'
        }
      ];
      
      // Mock planting and harvesting schedule data
      const mockSchedules = [
        {
          id: 1,
          farm_name: 'Kanoni Coffee Farm',
          activity_type: 'Planting',
          start_date: '2024-08-15T08:00:00Z',
          end_date: '2024-08-30T17:00:00Z',
          coffee_variety: 'SL28 Arabica',
          area: '1.2 hectares',
          manager: 'John Kagaba',
          status: 'scheduled',
          notes: 'New planting area on eastern slope',
          created_at: '2024-06-10T09:30:00Z'
        },
        {
          id: 2,
          farm_name: 'Engari Plantation',
          activity_type: 'Harvesting',
          start_date: '2024-09-05T07:00:00Z',
          end_date: '2024-10-15T17:00:00Z',
          coffee_variety: 'Robusta',
          area: '4.5 hectares',
          manager: 'Sarah Mutesi',
          status: 'scheduled',
          notes: 'Main harvest season, expected yield 8.2 tons',
          created_at: '2024-05-20T14:00:00Z'
        },
        {
          id: 3,
          farm_name: 'Migina Community Farm',
          activity_type: 'Pruning',
          start_date: '2024-07-10T08:00:00Z',
          end_date: '2024-07-25T17:00:00Z',
          coffee_variety: 'Mixed Varieties',
          area: '7.8 hectares',
          manager: 'David Muwonge',
          status: 'in-progress',
          notes: 'Regular maintenance pruning after harvest',
          created_at: '2024-06-01T11:45:00Z'
        }
      ];
      
      // Filter farms by search term
      let filteredFarms = mockFarms;
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        filteredFarms = mockFarms.filter(farm => 
          farm.name?.toLowerCase().includes(lowercaseSearch) ||
          farm.location?.toLowerCase().includes(lowercaseSearch) ||
          farm.manager?.toLowerCase().includes(lowercaseSearch) ||
          farm.coffee_type?.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      // Filter schedules by search term
      let filteredSchedules = mockSchedules;
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        filteredSchedules = mockSchedules.filter(schedule => 
          schedule.farm_name?.toLowerCase().includes(lowercaseSearch) ||
          schedule.activity_type?.toLowerCase().includes(lowercaseSearch) ||
          schedule.manager?.toLowerCase().includes(lowercaseSearch) ||
          schedule.coffee_variety?.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      // Sort farms based on sortConfig
      filteredFarms.sort((a, b) => {
        const aValue = a[sortConfig.field] || '';
        const bValue = b[sortConfig.field] || '';
        
        if (aValue < bValue) {
          return sortConfig.ascending ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.ascending ? 1 : -1;
        }
        return 0;
      });
      
      // Sort schedules based on sortConfig
      filteredSchedules.sort((a, b) => {
        const aValue = a[sortConfig.field] || '';
        const bValue = b[sortConfig.field] || '';
        
        if (aValue < bValue) {
          return sortConfig.ascending ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.ascending ? 1 : -1;
        }
        return 0;
      });
      
      setFarms(filteredFarms);
      setSchedules(filteredSchedules);
    } catch (error) {
      console.error('Error fetching farm data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmData();
  }, [searchTerm, sortConfig, activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);
  };

  // Function to render the coffee type badge
  const getCoffeeTypeBadge = (type) => {
    if (type?.toLowerCase().includes('arabica')) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Coffee className="h-3 w-3" />
          {type}
        </Badge>
      );
    } else if (type?.toLowerCase().includes('robusta')) {
      return (
        <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
          <Coffee className="h-3 w-3" />
          {type}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Coffee className="h-3 w-3" />
          {type || 'Mixed'}
        </Badge>
      );
    }
  };

  // Function to render activity type badge
  const getActivityBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'planting':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Sprout className="h-3 w-3" />
            Planting
          </Badge>
        );
      case 'harvesting':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Coffee className="h-3 w-3" />
            Harvesting
          </Badge>
        );
      case 'pruning':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Sprout className="h-3 w-3" />
            Pruning
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{type || 'Other'}</Badge>
        );
    }
  };

  // Function to render status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Scheduled
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status || 'Unknown'}</Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kazo Coffee Project Farm Information</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchFarmData}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search farms or schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="farm-info" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="farm-info" className="flex items-center gap-2">
            <Farm className="h-4 w-4" />
            Farm Information
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planting & Harvesting Schedule
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="farm-info" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
              <p className="ml-2 text-amber-800">Loading farm information...</p>
            </div>
          ) : farms.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
              <Farm className="h-12 w-12 mx-auto text-amber-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Farm Information Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'name', ascending: !sortConfig.ascending })} className="flex items-center">
                        Farm Name
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'location', ascending: !sortConfig.ascending })} className="flex items-center">
                        Location
                      </Button>
                    </TableHead>
                    <TableHead>Coffee Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'manager', ascending: !sortConfig.ascending })} className="flex items-center">
                        Manager
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'last_inspection', ascending: !sortConfig.ascending })} className="flex items-center">
                        Last Inspection
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farms.map((farm) => (
                    <TableRow key={farm.id}>
                      <TableCell className="font-medium">{farm.name}</TableCell>
                      <TableCell>{farm.location}</TableCell>
                      <TableCell>{getCoffeeTypeBadge(farm.coffee_type)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{farm.size}</span>
                          <span className="text-xs text-gray-500">{farm.trees} trees</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {farm.manager}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(farm.status)}</TableCell>
                      <TableCell>{formatDate(farm.last_inspection)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
              <p className="ml-2 text-amber-800">Loading schedule information...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
              <Calendar className="h-12 w-12 mx-auto text-amber-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Schedule Information Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'farm_name', ascending: !sortConfig.ascending })} className="flex items-center">
                        Farm
                      </Button>
                    </TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'start_date', ascending: !sortConfig.ascending })} className="flex items-center">
                        Schedule
                      </Button>
                    </TableHead>
                    <TableHead>Coffee Variety</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'manager', ascending: !sortConfig.ascending })} className="flex items-center">
                        Manager
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.farm_name}</TableCell>
                      <TableCell>{getActivityBadge(schedule.activity_type)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(schedule.start_date)}</span>
                          <span className="text-xs text-gray-500">to {formatDate(schedule.end_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{schedule.coffee_variety}</TableCell>
                      <TableCell>{schedule.area}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {schedule.manager}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmInformationView;
