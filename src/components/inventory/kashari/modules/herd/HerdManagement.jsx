import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Beef, Stethoscope, LineChart, PlusCircle, ChevronLeft, Activity, Scale, TagIcon } from "lucide-react";
import CattleRegistrationForm from './CattleRegistrationForm';
import CattleInventoryTable from './CattleInventoryTable';
import HealthRecordsForm from './HealthRecordsForm';
import { supabase } from '@/integrations/supabase/supabase';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

const HerdManagement = ({ initialTab = "inventory" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [cattleData, setCattleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCattleData();
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const fetchCattleData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('farm_id', 'kashari')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCattleData(data || []);
    } catch (error) {
      console.error('Error fetching cattle data:', error);
      showErrorToast(toast, `Failed to fetch cattle data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCattle = async (formData) => {
    setIsSubmitting(true);
    try {
      const newCattle = {
        tag_number: formData.tagNumber,
        name: formData.name || null,
        cattle_type: formData.type,
        breed: formData.breed,
        date_of_birth: formData.dateOfBirth || null,
        weight: formData.weight || null,
        health_status: formData.healthStatus || 'good',
        notes: formData.notes || null,
        farm_id: 'kashari'
      };

      const { data, error } = await supabase
        .from('cattle_inventory')
        .insert([newCattle])
        .select();

      if (error) throw error;
      
      showSuccessToast(toast, "Cattle registered successfully");
      fetchCattleData();
      setShowRegistrationForm(false);
    } catch (error) {
      console.error('Error adding cattle:', error);
      showErrorToast(toast, `Failed to register cattle: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddHealthRecord = async (formData) => {
    setIsSubmitting(true);
    try {
      const newRecord = {
        cattle_id: formData.cattleId,
        record_date: formData.recordDate,
        record_type: formData.recordType,
        description: formData.description,
        treatment: formData.treatment || null,
        administered_by: formData.administeredBy || null,
        next_due_date: formData.nextDueDate || null,
        notes: formData.notes || null
      };

      const { data, error } = await supabase
        .from('cattle_health_records')
        .insert([newRecord])
        .select();

      if (error) throw error;
      
      showSuccessToast(toast, "Health record added successfully");
      setShowHealthForm(false);
    } catch (error) {
      console.error('Error adding health record:', error);
      showErrorToast(toast, `Failed to add health record: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (id) => {
    toast({
      title: "View Details",
      description: `Viewing details for cattle ID: ${id}`,
    });
  };

  const handleEdit = (id) => {
    toast({
      title: "Edit",
      description: `Editing cattle ID: ${id}`,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this cattle record?")) return;
    
    try {
      const { error } = await supabase
        .from('cattle_inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showSuccessToast(toast, "Cattle record deleted successfully");
      fetchCattleData();
    } catch (error) {
      console.error('Error deleting cattle:', error);
      showErrorToast(toast, `Failed to delete cattle: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-14 rounded-lg bg-muted/30 p-1">
          <TabsTrigger 
            value="inventory" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            <Beef className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Cattle Inventory</span>
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            <Stethoscope className="h-5 w-5 text-purple-500" />
            <span className="font-medium">Health Records</span>
          </TabsTrigger>
          <TabsTrigger 
            value="growth" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            <LineChart className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Growth Metrics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4 pt-4">
          {showRegistrationForm ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowRegistrationForm(false)}
                className="mb-2 flex items-center gap-2 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Inventory
              </Button>
              <CattleRegistrationForm 
                onSubmit={handleAddCattle}
                isSubmitting={isSubmitting}
              />
            </>
          ) : (
            <>
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowRegistrationForm(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90"
                >
                  <PlusCircle className="h-4 w-4" />
                  Register New Cattle
                </Button>
              </div>
              <CattleInventoryTable 
                cattleData={cattleData}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4 pt-4">
          {showHealthForm ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowHealthForm(false)}
                className="mb-2 flex items-center gap-2 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Health Records
              </Button>
              <HealthRecordsForm 
                cattleData={cattleData}
                onSubmit={handleAddHealthRecord}
                isSubmitting={isSubmitting}
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="p-4 border-l-4 border-purple-500 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Vaccinations</p>
                      <h3 className="text-2xl font-bold">12</h3>
                    </div>
                    <Stethoscope className="h-8 w-8 text-purple-500 opacity-80" />
                  </div>
                </Card>
                <Card className="p-4 border-l-4 border-red-500 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Treatments</p>
                      <h3 className="text-2xl font-bold">5</h3>
                    </div>
                    <Activity className="h-8 w-8 text-red-500 opacity-80" />
                  </div>
                </Card>
                <Card className="p-4 border-l-4 border-green-500 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Examinations</p>
                      <h3 className="text-2xl font-bold">8</h3>
                    </div>
                    <TagIcon className="h-8 w-8 text-green-500 opacity-80" />
                  </div>
                </Card>
              </div>
              <div className="flex justify-end">
                <AddHealthRecordDialog cattleData={cattleData} />
              </div>
              <Card className="p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Recent Health Records</h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left font-medium">Tag #</th>
                        <th className="p-3 text-left font-medium">Date</th>
                        <th className="p-3 text-left font-medium">Type</th>
                        <th className="p-3 text-left font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3">KF-2023-001</td>
                        <td className="p-3">2023-05-15</td>
                        <td className="p-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Vaccination</span></td>
                        <td className="p-3">FMD Vaccination</td>
                      </tr>
                      <tr className="border-t bg-muted/20">
                        <td className="p-3">KF-2023-003</td>
                        <td className="p-3">2023-04-28</td>
                        <td className="p-3"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Treatment</span></td>
                        <td className="p-3">Mastitis treatment</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">KF-2023-002</td>
                        <td className="p-3">2023-04-10</td>
                        <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Examination</span></td>
                        <td className="p-3">Routine health check</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="growth" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="p-4 border-l-4 border-blue-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Average Weight</p>
                  <h3 className="text-2xl font-bold">450 kg</h3>
                </div>
                <Scale className="h-8 w-8 text-blue-500 opacity-80" />
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-green-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Daily Gain</p>
                  <h3 className="text-2xl font-bold">0.8 kg</h3>
                </div>
                <LineChart className="h-8 w-8 text-green-500 opacity-80" />
              </div>
            </Card>
            <Card className="p-4 border-l-4 border-amber-500 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Feed Conversion</p>
                  <h3 className="text-2xl font-bold">1.4:1</h3>
                </div>
                <Activity className="h-8 w-8 text-amber-500 opacity-80" />
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 hover:shadow-md transition-all duration-200">
              <h3 className="text-lg font-medium mb-4">Weight Trends</h3>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Weight trend chart will appear here</p>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-200">
              <h3 className="text-lg font-medium mb-4">Growth Comparison</h3>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Growth comparison chart will appear here</p>
              </div>
            </Card>
          </div>
          
          <Card className="p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Growth Measurements</h3>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90"
              >
                <PlusCircle className="h-4 w-4" />
                Add Measurement
              </Button>
            </div>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Tag #</th>
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Weight (kg)</th>
                    <th className="p-3 text-left font-medium">Height (cm)</th>
                    <th className="p-3 text-left font-medium">Daily Gain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">KF-2023-001</td>
                    <td className="p-3">2023-06-10</td>
                    <td className="p-3">485</td>
                    <td className="p-3">142</td>
                    <td className="p-3">0.9</td>
                  </tr>
                  <tr className="border-t bg-muted/20">
                    <td className="p-3">KF-2023-003</td>
                    <td className="p-3">2023-06-08</td>
                    <td className="p-3">425</td>
                    <td className="p-3">138</td>
                    <td className="p-3">0.7</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">KF-2023-002</td>
                    <td className="p-3">2023-06-05</td>
                    <td className="p-3">510</td>
                    <td className="p-3">144</td>
                    <td className="p-3">0.8</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HerdManagement;
