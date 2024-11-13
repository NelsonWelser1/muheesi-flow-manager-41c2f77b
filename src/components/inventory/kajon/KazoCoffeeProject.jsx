import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewCurrentStock from '../ViewCurrentStock';
import MakeReports from '../MakeReports';
import ManageFarms from '../ManageFarms';
import ManageAssociations from '../ManageAssociations';
import MakeRequisitions from '../MakeRequisitions';
import StoreManagement from './StoreManagement';
import FarmManagement from './FarmManagement';

const KazoCoffeeProject = () => {
  const [activeTab, setActiveTab] = useState('store');

  const subCounties = [
    'Kazo Town council', 'Buremba Town council', 'Kazo Sub county',
    'Buremba Sub county', 'Kanoni Sub county', 'Engari Sub county',
    'Kyampangara Sub county', 'Nkungu Sub county', 'Rwemikoma Sub county',
    'Burunga Sub county', 'Migina Sub county'
  ];

  const coffeeTypes = ['Arabica', 'Robusta'];
  
  const qualityGrades = {
    Arabica: ['Bugisu AA', 'Bugisu A', 'Bugisu PB', 'Bugisu B', 'DRUGAR', 'Parchment Arabica'],
    Robusta: ['FAQ', 'Screen 18', 'Screen 15', 'Screen 12', 'Organic Robusta']
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
            <StoreManagement 
              subCounties={subCounties}
              coffeeTypes={coffeeTypes}
              qualityGrades={qualityGrades}
            />
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
        <FarmManagement subCounties={subCounties} />
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