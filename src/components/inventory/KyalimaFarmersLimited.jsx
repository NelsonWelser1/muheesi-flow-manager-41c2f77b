import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Landmark, Plus, Database, Users, BarChart } from 'lucide-react';

const KyalimaFarmersLimited = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="associations" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Associations</span>
          </TabsTrigger>
          <TabsTrigger value="loans" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            <span>Loans</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
              <p className="text-gray-600">
                Kyalima Farmers Limited manages assets, cooperations, and agricultural business.
                View detailed reports on inventory, associations, and loans in their respective tabs.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/loans')}
                >
                  <Landmark className="mr-2 h-4 w-4" />
                  Manage Loans
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Inventory Management</h3>
            <p className="text-gray-600 mb-4">
              Manage agricultural products, grains, and livestock inventory.
            </p>
            {/* Inventory content would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="associations" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Farmer Associations</h3>
            <p className="text-gray-600 mb-4">
              Manage farmer cooperatives and association memberships.
            </p>
            {/* Associations content would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="loans" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Loan Management</h3>
            <p className="text-gray-600 mb-4">
              Manage loans for farmers and agricultural businesses.
            </p>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Active Loans</h4>
              <Button 
                onClick={() => navigate('/loans/add')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Loan
              </Button>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded">
              <Button 
                onClick={() => navigate('/loans')}
                variant="outline"
                className="w-full"
              >
                <Landmark className="mr-2 h-4 w-4" />
                View All Loans
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KyalimaFarmersLimited;
