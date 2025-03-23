
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAssociationForm } from '@/hooks/useAssociationForm';

const AssociationDetails = ({ isKazo, selectedAssociation }) => {
  const { toast } = useToast();
  const {
    formData,
    saving,
    error,
    handleInputChange,
    handleSelectChange,
    saveAssociation
  } = useAssociationForm(selectedAssociation);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveAssociation();
    
    if (success) {
      toast({
        title: "Success",
        description: "Association details saved successfully",
        variant: "default",
        className: "bg-green-50 border-green-300 text-green-800",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: error || "Failed to save association details",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Association Name</Label>
              <Input 
                name="association_name"
                value={formData.association_name || ''}
                onChange={handleInputChange}
                placeholder="Enter association name" 
                required
              />
            </div>

            <div>
              <Label>Registration Number</Label>
              <Input 
                name="registration_number"
                value={formData.registration_number || ''}
                onChange={handleInputChange}
                placeholder="Enter registration number" 
              />
            </div>

            <div>
              <Label>Association Type</Label>
              <Select 
                name="association_type"
                value={formData.association_type || 'farmers'} 
                onValueChange={(value) => handleSelectChange('association_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmers">Farmers Association</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                  <SelectItem value="union">Farmers Union</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Member Count</Label>
              <Input 
                name="member_count"
                type="number" 
                value={formData.member_count || ''}
                onChange={handleInputChange}
                placeholder="Enter number of members" 
              />
            </div>

            <div>
              <Label>Total Farm Area (Acres)</Label>
              <Input 
                name="total_farm_area"
                type="number" 
                step="0.01"
                value={formData.total_farm_area || ''}
                onChange={handleInputChange}
                placeholder="Enter total farm area" 
              />
            </div>

            <div>
              <Label>Coffee Types</Label>
              <Select 
                name="coffee_types"
                value={formData.coffee_types || 'arabica'} 
                onValueChange={(value) => handleSelectChange('coffee_types', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select coffee types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabica">Arabica</SelectItem>
                  <SelectItem value="robusta">Robusta</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Association Details'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssociationDetails;
