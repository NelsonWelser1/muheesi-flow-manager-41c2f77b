
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Beef, Stethoscope, LineChart, PlusCircle } from "lucide-react";
import CattleRegistrationForm from './CattleRegistrationForm';
import CattleInventoryTable from './CattleInventoryTable';
import HealthRecordsForm from './HealthRecordsForm';
import { supabase } from '@/integrations/supabase/supabase';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

const HerdManagement = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [cattleData, setCattleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCattleData();
  }, []);

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
      // Format data for Supabase
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
      // Format data for Supabase
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
    // View details functionality to be implemented
    toast({
      title: "View Details",
      description: `Viewing details for cattle ID: ${id}`,
    });
  };

  const handleEdit = (id) => {
    // Edit functionality to be implemented
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
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Beef className="h-4 w-4" />
            Cattle Inventory
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Health Records
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Growth Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          {showRegistrationForm ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowRegistrationForm(false)}
                className="mb-2"
              >
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
                  className="flex items-center gap-2"
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
        
        <TabsContent value="health" className="space-y-4">
          {showHealthForm ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowHealthForm(false)}
                className="mb-2"
              >
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
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowHealthForm(true)}
                  disabled={cattleData.length === 0}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Health Record
                </Button>
              </div>
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Health Records Coming Soon</h3>
                <p className="text-muted-foreground">
                  This section will display health records for your cattle, including vaccinations, 
                  treatments, and regular health checks. Add your first health record to get started.
                </p>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="growth" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Growth Metrics Coming Soon</h3>
            <p className="text-muted-foreground">
              Track the growth and development of your cattle over time with metrics like weight gain, 
              height measurements, and body condition scores. This feature is coming soon.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HerdManagement;
