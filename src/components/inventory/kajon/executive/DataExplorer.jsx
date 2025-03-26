
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpDown, 
  RefreshCcw, 
  FileText, 
  FileSpreadsheet, 
  Download,
  LayoutList,
  Table as TableIcon,
  MapPin,
  BarChart3,
  Calendar,
  Search,
  Package,
  ShoppingCart,
  ArrowLeftRight,
  Truck,
  CoffeeIcon,
  FileBarChart,
  Warehouse,
  Users,
  List
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import TableView from './data-explorer/TableView';
import CardsView from './data-explorer/CardsView';
import LocationView from './data-explorer/LocationView';
import InsightsView from './data-explorer/InsightsView';
import ReportsView from './data-explorer/ReportsView';
import FarmInformationView from './data-explorer/FarmInformationView';
import AssociationView from './data-explorer/AssociationView';
import RequisitionsView from './data-explorer/RequisitionsView';

const DataExplorer = () => {
  const [activeView, setActiveView] = useState('table');
  const [activeFeature, setActiveFeature] = useState('operations');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [operationTypeFilter, setOperationTypeFilter] = useState('all');

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Define feature tabs for the main navigation
  const featureTabs = [
    { id: 'operations', label: 'Coffee Operations', icon: CoffeeIcon },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'farm', label: 'Farm Information', icon: Warehouse },
    { id: 'association', label: 'Association', icon: Users },
    { id: 'requisitions', label: 'Requisitions', icon: List }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Kazo Coffee Project Data Explorer</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCcw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                Refresh Data
              </Button>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Feature Tabs Navigation */}
          <Tabs
            defaultValue="operations"
            value={activeFeature}
            onValueChange={setActiveFeature}
            className="space-y-4 mb-6"
          >
            <TabsList className="grid grid-cols-5 h-14">
              {featureTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex flex-col items-center py-1 h-full"
                >
                  <tab.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Operations Data Feature */}
          {activeFeature === 'operations' && (
            <>
              {/* Data Filters */}
              <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Range</label>
                    <div className="flex bg-gray-100 rounded-md p-1">
                      {['hour', 'day', 'week', 'month', 'year', 'all'].map((range) => (
                        <Button 
                          key={range}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "text-xs flex-1 h-7",
                            timeRangeFilter === range ? "bg-white shadow-sm" : "hover:bg-gray-200"
                          )}
                          onClick={() => setTimeRangeFilter(range)}
                        >
                          {range.charAt(0).toUpperCase() + range.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Operation Type</label>
                    <div className="flex overflow-x-auto bg-gray-100 rounded-md p-1">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-xs flex-1 h-7",
                          operationTypeFilter === 'all' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        )}
                        onClick={() => setOperationTypeFilter('all')}
                      >
                        All Types
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-xs flex-1 h-7 flex gap-1 items-center whitespace-nowrap",
                          operationTypeFilter === 'receive-new' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        )}
                        onClick={() => setOperationTypeFilter('receive-new')}
                      >
                        <Package className="h-3 w-3" />
                        Receive New
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-xs flex-1 h-7 flex gap-1 items-center whitespace-nowrap",
                          operationTypeFilter === 'sell' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        )}
                        onClick={() => setOperationTypeFilter('sell')}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Sell Stock
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-xs flex-1 h-7 flex gap-1 items-center whitespace-nowrap",
                          operationTypeFilter === 'relocate' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        )}
                        onClick={() => setOperationTypeFilter('relocate')}
                      >
                        <ArrowLeftRight className="h-3 w-3" />
                        Relocate
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "text-xs flex-1 h-7 flex gap-1 items-center whitespace-nowrap",
                          operationTypeFilter === 'receive-partner' ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        )}
                        onClick={() => setOperationTypeFilter('receive-partner')}
                      >
                        <Truck className="h-3 w-3" />
                        Partner Stock
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location Type</label>
                    <div className="flex bg-gray-100 rounded-md p-1">
                      {['all', 'farm', 'store', 'factory', 'warehouse'].map((category) => (
                        <Button 
                          key={category}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "text-xs flex-1 h-7",
                            categoryFilter === category ? "bg-white shadow-sm" : "hover:bg-gray-200"
                          )}
                          onClick={() => setCategoryFilter(category)}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <div className="flex bg-gray-100 rounded-md p-1">
                        {['all', 'pending', 'completed', 'declined'].map((status) => (
                          <Button 
                            key={status}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "text-xs flex-1 h-7",
                              statusFilter === status ? "bg-white shadow-sm" : "hover:bg-gray-200"
                            )}
                            onClick={() => setStatusFilter(status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-500" />
                        <input
                          type="text"
                          className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Search by any field..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Selector Tabs for Operations */}
              <Tabs
                defaultValue="table"
                value={activeView}
                onValueChange={setActiveView}
                className="space-y-4"
              >
                <TabsList className="grid grid-cols-4 h-12">
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    <span>Table View</span>
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="flex items-center gap-2">
                    <LayoutList className="h-4 w-4" />
                    <span>Cards View</span>
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location View</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Insights</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="table" className="space-y-4">
                  <TableView 
                    isLoading={isLoading} 
                    timeRange={timeRangeFilter}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    operationType={operationTypeFilter}
                  />
                </TabsContent>
                
                <TabsContent value="cards" className="space-y-4">
                  <CardsView 
                    isLoading={isLoading} 
                    timeRange={timeRangeFilter}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    operationType={operationTypeFilter}
                  />
                </TabsContent>
                
                <TabsContent value="location" className="space-y-4">
                  <LocationView 
                    isLoading={isLoading} 
                    timeRange={timeRangeFilter}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    operationType={operationTypeFilter}
                  />
                </TabsContent>
                
                <TabsContent value="insights" className="space-y-4">
                  <InsightsView 
                    isLoading={isLoading} 
                    timeRange={timeRangeFilter}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    operationType={operationTypeFilter}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* Reports Feature */}
          {activeFeature === 'reports' && (
            <ReportsView isLoading={isLoading} handleRefresh={handleRefresh} />
          )}

          {/* Farm Information Feature */}
          {activeFeature === 'farm' && (
            <FarmInformationView isLoading={isLoading} handleRefresh={handleRefresh} />
          )}

          {/* Association Feature */}
          {activeFeature === 'association' && (
            <AssociationView isLoading={isLoading} handleRefresh={handleRefresh} />
          )}

          {/* Requisitions Feature */}
          {activeFeature === 'requisitions' && (
            <RequisitionsView isLoading={isLoading} handleRefresh={handleRefresh} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExplorer;
