
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Coffee, 
  RefreshCcw, 
  Clock, 
  Repeat, 
  UserPlus, 
  Warehouse,
  Sheet, 
  List,
  Users,
  Search,
  Download
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import TableView from './data-explorer/TableView';
import ReportsView from './data-explorer/ReportsView';
import RequisitionsView from './data-explorer/RequisitionsView';
import FarmInformationView from './data-explorer/FarmInformationView';
import AssociationsView from './data-explorer/AssociationsView';
import CardsView from './data-explorer/CardsView';

// Import hooks for data fetching
import { useCoffeeStockData } from '@/hooks/useCoffeeStockData';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';
import { useRequisitions } from '@/hooks/useRequisitions';
import { useFarmData } from '@/hooks/useFarmData';
import { useAssociationsData } from '@/hooks/useAssociationsData';
import { useReportsData } from '@/hooks/useReportsData';

// Import export utilities
import { exportToPDF, exportToExcel, exportToCSV } from '@/utils/coffee/coffeeExport';

const DataExplorer = () => {
  const [viewMode, setViewMode] = useState('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('receive-new');
  const [activeSubTab, setActiveSubTab] = useState('requisitions');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  
  // Fetch data using custom hooks
  const { stockData: coffeeStockData, isLoading: isLoadingStock, fetchCoffeeStockData } = useCoffeeStockData();
  const { transfers: stockTransfers, loading: isLoadingTransfers, fetchTransfers } = useCoffeeStockTransfers();
  const { requisitions, loading: isLoadingRequisitions, fetchRequisitions } = useRequisitions();
  const { farms, loading: isLoadingFarms, fetchFarmData } = useFarmData();
  const { associations, loading: isLoadingAssociations, fetchAssociations } = useAssociationsData();
  const { reports, loading: isLoadingReports, fetchReports } = useReportsData();

  // Effect to apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [timeRange, searchTerm]);

  const applyFilters = async () => {
    const filters = {
      timeRange,
      searchTerm: searchTerm.trim() || undefined
    };

    // Apply filters based on active tab
    switch (activeTab) {
      case 'receive-new':
        await fetchCoffeeStockData(filters);
        break;
      case 'sell-stock':
        await fetchCoffeeStockData({...filters, status: 'sold'});
        break;
      case 'relocate-stock':
        await fetchTransfers(filters);
        break;
      case 'partner-stock':
        await fetchTransfers({...filters, isPartnerTransfer: true});
        break;
      case 'reports':
        await fetchReports(filters);
        break;
      case 'more':
        switch (activeSubTab) {
          case 'requisitions':
            await fetchRequisitions(filters);
            break;
          case 'farm-info':
            await fetchFarmData(filters);
            break;
          case 'associations':
            await fetchAssociations(filters);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await applyFilters();
    setIsRefreshing(false);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    // Reset filters when changing tabs
    setTimeRange('all');
    setSearchTerm('');
    
    // Apply appropriate filters for the new tab
    const filters = { timeRange: 'all' };
    
    switch (value) {
      case 'receive-new':
        fetchCoffeeStockData(filters);
        break;
      case 'sell-stock':
        fetchCoffeeStockData({...filters, status: 'sold'});
        break;
      case 'relocate-stock':
        fetchTransfers(filters);
        break;
      case 'partner-stock':
        fetchTransfers({...filters, isPartnerTransfer: true});
        break;
      case 'reports':
        fetchReports(filters);
        break;
      case 'more':
        switch (activeSubTab) {
          case 'requisitions':
            fetchRequisitions(filters);
            break;
          case 'farm-info':
            fetchFarmData(filters);
            break;
          case 'associations':
            fetchAssociations(filters);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  const handleSubTabChange = (value) => {
    setActiveSubTab(value);
    // Reset filters when changing sub-tabs
    setTimeRange('all');
    setSearchTerm('');
    
    // Apply appropriate filters for the new sub-tab
    const filters = { timeRange: 'all' };
    
    switch (value) {
      case 'requisitions':
        fetchRequisitions(filters);
        break;
      case 'farm-info':
        fetchFarmData(filters);
        break;
      case 'associations':
        fetchAssociations(filters);
        break;
      default:
        break;
    }
  };

  // Get filtered data based on active tab
  const getActiveFilteredData = () => {
    switch (activeTab) {
      case 'receive-new':
        return coffeeStockData;
      case 'sell-stock':
        return coffeeStockData.filter(item => item.status === 'sold');
      case 'relocate-stock':
        return stockTransfers;
      case 'partner-stock':
        return stockTransfers.filter(item => item.is_partner_transfer === true);
      case 'reports':
        return reports;
      case 'more':
        switch (activeSubTab) {
          case 'requisitions':
            return requisitions;
          case 'farm-info':
            return farms;
          case 'associations':
            return associations;
          default:
            return [];
        }
      default:
        return [];
    }
  };
  
  // Get export filename based on active tab
  const getExportFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    switch (activeTab) {
      case 'receive-new':
        return `coffee_stock_${date}`;
      case 'sell-stock':
        return `sold_coffee_${date}`;
      case 'relocate-stock':
        return `stock_transfers_${date}`;
      case 'partner-stock':
        return `partner_transfers_${date}`;
      case 'reports':
        return `coffee_reports_${date}`;
      case 'more':
        switch (activeSubTab) {
          case 'requisitions':
            return `requisitions_${date}`;
          case 'farm-info':
            return `farm_information_${date}`;
          case 'associations':
            return `coffee_associations_${date}`;
          default:
            return `export_${date}`;
        }
      default:
        return `export_${date}`;
    }
  };

  // Handle exports
  const handleExport = (format) => {
    const data = getActiveFilteredData();
    const filename = getExportFilename();
    
    if (!data || data.length === 0) {
      console.error('No data to export');
      return;
    }
    
    switch (format) {
      case 'pdf':
        exportToPDF(data, filename, activeTab);
        break;
      case 'excel':
        exportToExcel(data, filename);
        break;
      case 'csv':
        exportToCSV(data, filename);
        break;
      default:
        console.error('Unsupported export format:', format);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Explorer</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="receive-new" value={activeTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="receive-new" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              <span>Receive New</span>
            </TabsTrigger>
            <TabsTrigger value="sell-stock" className="flex items-center gap-2">
              <Sheet className="h-4 w-4" />
              <span>Sell Stock</span>
            </TabsTrigger>
            <TabsTrigger value="relocate-stock" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              <span>Relocate Stock</span>
            </TabsTrigger>
            <TabsTrigger value="partner-stock" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Partner Stock</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="more" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>More</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 ml-4">
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button 
              variant={viewMode === 'cards' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
          </div>
        </div>

        {/* Filters and Export Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-grow-0 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="receive-new">
          {viewMode === 'table' ? (
            <TableView 
              data={coffeeStockData} 
              isLoading={isLoadingStock} 
              handleRefresh={fetchCoffeeStockData} 
              title="Receive New Coffee Stock"
              sourceTable="coffee_stock"
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          ) : (
            <CardsView 
              data={coffeeStockData} 
              isLoading={isLoadingStock} 
              handleRefresh={fetchCoffeeStockData} 
              title="Receive New Coffee Stock"
              sourceTable="coffee_stock"
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          )}
        </TabsContent>

        <TabsContent value="sell-stock">
          {viewMode === 'table' ? (
            <TableView 
              data={coffeeStockData.filter(item => item.status === 'sold')} 
              isLoading={isLoadingStock} 
              handleRefresh={fetchCoffeeStockData} 
              title="Sell Coffee Stock"
              sourceTable="coffee_stock"
              filterStatus="sold"
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          ) : (
            <CardsView 
              data={coffeeStockData.filter(item => item.status === 'sold')} 
              isLoading={isLoadingStock} 
              handleRefresh={fetchCoffeeStockData} 
              title="Sell Coffee Stock"
              sourceTable="coffee_stock"
              filterStatus="sold"
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          )}
        </TabsContent>

        <TabsContent value="relocate-stock">
          {viewMode === 'table' ? (
            <TableView 
              data={stockTransfers} 
              isLoading={isLoadingTransfers} 
              handleRefresh={fetchTransfers} 
              title="Relocate Coffee Stock"
              sourceTable="coffee_stock_transfers"
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          ) : (
            <CardsView 
              data={stockTransfers} 
              isLoading={isLoadingTransfers} 
              handleRefresh={fetchTransfers} 
              title="Relocate Coffee Stock"
              sourceTable="coffee_stock_transfers"
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          )}
        </TabsContent>

        <TabsContent value="partner-stock">
          {viewMode === 'table' ? (
            <TableView 
              data={stockTransfers.filter(item => item.is_partner_transfer === true)} 
              isLoading={isLoadingTransfers} 
              handleRefresh={fetchTransfers} 
              title="Partner Stock Transfers"
              sourceTable="coffee_stock_transfers"
              filterPartner={true}
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          ) : (
            <CardsView 
              data={stockTransfers.filter(item => item.is_partner_transfer === true)} 
              isLoading={isLoadingTransfers} 
              handleRefresh={fetchTransfers} 
              title="Partner Stock Transfers"
              sourceTable="coffee_stock_transfers"
              filterPartner={true}
              timeRange={timeRange}
              searchTerm={searchTerm}
            />
          )}
        </TabsContent>

        <TabsContent value="reports">
          <ReportsView 
            isLoading={isLoadingReports} 
            handleRefresh={fetchReports}
            timeRange={timeRange}
            searchTerm={searchTerm}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="more">
          <Tabs defaultValue="requisitions" value={activeSubTab} onValueChange={handleSubTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="requisitions" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>Requisitions</span>
              </TabsTrigger>
              <TabsTrigger value="farm-info" className="flex items-center gap-2">
                <Warehouse className="h-4 w-4" />
                <span>Farm Information</span>
              </TabsTrigger>
              <TabsTrigger value="associations" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Associations</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requisitions">
              <RequisitionsView 
                isLoading={isLoadingRequisitions} 
                handleRefresh={fetchRequisitions}
                timeRange={timeRange}
                searchTerm={searchTerm}
                onExport={handleExport}
              />
            </TabsContent>

            <TabsContent value="farm-info">
              <FarmInformationView 
                isLoading={isLoadingFarms} 
                handleRefresh={fetchFarmData}
                timeRange={timeRange}
                searchTerm={searchTerm}
                onExport={handleExport}
              />
            </TabsContent>

            <TabsContent value="associations">
              <AssociationsView 
                isLoading={isLoadingAssociations} 
                handleRefresh={fetchAssociations}
                timeRange={timeRange}
                searchTerm={searchTerm}
                onExport={handleExport}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataExplorer;

