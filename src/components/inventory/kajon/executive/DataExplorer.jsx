
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Users
} from 'lucide-react';

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

const DataExplorer = () => {
  const [viewMode, setViewMode] = useState('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch data using custom hooks
  const { stockData: coffeeStockData, isLoading: isLoadingStock, fetchCoffeeStockData } = useCoffeeStockData();
  const { transfers: stockTransfers, loading: isLoadingTransfers, fetchTransfers } = useCoffeeStockTransfers();
  const { requisitions, loading: isLoadingRequisitions, fetchRequisitions } = useRequisitions();
  const { farms, loading: isLoadingFarms, fetchFarmData } = useFarmData();
  const { associations, loading: isLoadingAssociations, fetchAssociations } = useAssociationsData();
  const { reports, loading: isLoadingReports, fetchReports } = useReportsData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchCoffeeStockData(),
        fetchTransfers(),
        fetchRequisitions(),
        fetchFarmData(),
        fetchAssociations(),
        fetchReports()
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
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

      <Tabs defaultValue="receive-new">
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

        <TabsContent value="receive-new">
          {viewMode === 'table' ? (
            <TableView 
              data={coffeeStockData} 
              isLoading={isLoadingStock} 
              handleRefresh={fetchCoffeeStockData} 
              title="Receive New Coffee Stock"
              sourceTable="coffee_stock"
            />
          ) : (
            <CardsView 
              data={coffeeStockData} 
              isLoading={isLoadingStock} 
              handleRefresh={fetchCoffeeStockData} 
              title="Receive New Coffee Stock"
              sourceTable="coffee_stock"
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
            />
          ) : (
            <CardsView 
              data={coffeeStockData.filter(item => item.status === 'sold')} 
              isLoading={isLoadingStock} 
              handleRefresh={fetchCoffeeStockData} 
              title="Sell Coffee Stock"
              sourceTable="coffee_stock"
              filterStatus="sold"
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
            />
          ) : (
            <CardsView 
              data={stockTransfers} 
              isLoading={isLoadingTransfers} 
              handleRefresh={fetchTransfers} 
              title="Relocate Coffee Stock"
              sourceTable="coffee_stock_transfers"
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
            />
          ) : (
            <CardsView 
              data={stockTransfers.filter(item => item.is_partner_transfer === true)} 
              isLoading={isLoadingTransfers} 
              handleRefresh={fetchTransfers} 
              title="Partner Stock Transfers"
              sourceTable="coffee_stock_transfers"
              filterPartner={true}
            />
          )}
        </TabsContent>

        <TabsContent value="reports">
          <ReportsView 
            isLoading={isLoadingReports} 
            handleRefresh={fetchReports} 
          />
        </TabsContent>

        <TabsContent value="more">
          <Tabs defaultValue="requisitions">
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
              />
            </TabsContent>

            <TabsContent value="farm-info">
              <FarmInformationView 
                isLoading={isLoadingFarms} 
                handleRefresh={fetchFarmData} 
              />
            </TabsContent>

            <TabsContent value="associations">
              <AssociationsView 
                isLoading={isLoadingAssociations} 
                handleRefresh={fetchAssociations} 
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataExplorer;
