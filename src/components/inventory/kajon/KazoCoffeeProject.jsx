import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ViewCurrentStock from '../ViewCurrentStock';
import MakeReports from '../MakeReports';
import ManageFarms from '../ManageFarms';
import ManageAssociations from '../ManageAssociations';
import MakeRequisitions from '../MakeRequisitions';
import StoreManagement from './StoreManagement';

const KazoCoffeeProject = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [selectedStore, setSelectedStore] = useState('');

  const stores = {
    'Kanoni Sub County': ['Mbogo store', 'Rwakahaya store'],
    'Engari Sub County': ['Kaichumu store', 'Kyengando store'],
    'Migina Sub County': ['Migina Store'],
    'Nkungu Sub County': ['Kagarama Store'],
    'Kyampangara Sub County': ['Kyampangara Store']
  };

  return (
    <Tabs defaultValue="update-stock" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-nowrap md:flex-wrap">
        <TabsTrigger value="update-stock">Update Stock</TabsTrigger>
        <TabsTrigger value="view-stock">View Stock</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="farms">Farms</TabsTrigger>
        <TabsTrigger value="associations">Associations</TabsTrigger>
        <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
      </TabsList>

      <TabsContent value="update-stock">
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'store' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('store')}
              className="bg-navy-900"
            >
              Store Management
            </Button>
          </div>

          {activeTab === 'store' && (
            <div className="space-y-4">
              <div>
                <Label>Select Store Location</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(stores).map(([subCounty, storeList]) => (
                      <React.Fragment key={subCounty}>
                        <SelectItem value={subCounty} disabled className="font-bold">
                          {subCounty}
                        </SelectItem>
                        {storeList.map(store => (
                          <SelectItem key={store} value={store} className="pl-4">
                            {store}
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedStore && <StoreManagement selectedStore={selectedStore} />}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="view-stock">
        <ViewCurrentStock />
      </TabsContent>

      <TabsContent value="reports">
        <MakeReports />
      </TabsContent>

      <TabsContent value="farms">
        <ManageFarms />
      </TabsContent>

      <TabsContent value="associations">
        <ManageAssociations />
      </TabsContent>

      <TabsContent value="requisitions">
        <MakeRequisitions />
      </TabsContent>
    </Tabs>
  );
};

export default KazoCoffeeProject;