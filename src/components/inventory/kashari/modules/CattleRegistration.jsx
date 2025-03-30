
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';

const CattleRegistration = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Convert number strings to actual numbers
      if (data.weight) data.weight = parseFloat(data.weight);
      
      console.log("Submitting cattle data:", data);
      
      // Here would be the actual submission to Supabase or other backend
      // const { data: result, error } = await supabase.from('cattle_inventory').insert(data);
      
      // For now, just simulate success
      setTimeout(() => {
        toast({
          title: "Cattle registered successfully",
          description: `${data.name || 'New cattle'} has been added to inventory`,
        });
        
        if (onBack) onBack();
      }, 1000);
    } catch (error) {
      console.error("Error registering cattle:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {onBack && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      )}
      
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
          <CardTitle>Cattle Registration</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tag_number">Tag Number *</Label>
                <Input 
                  id="tag_number" 
                  name="tag_number" 
                  placeholder="Enter unique tag number"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Enter cattle name (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cattle_type">Cattle Type *</Label>
                <Select name="cattle_type" defaultValue="beef" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beef">Beef</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="dual">Dual Purpose</SelectItem>
                    <SelectItem value="calf">Calf</SelectItem>
                    <SelectItem value="bull">Bull</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <Select name="breed" defaultValue="Boran" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select breed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boran">Boran</SelectItem>
                    <SelectItem value="Ankole Longhorn">Ankole Longhorn</SelectItem>
                    <SelectItem value="Hereford">Hereford</SelectItem>
                    <SelectItem value="Aberdeen">Aberdeen</SelectItem>
                    <SelectItem value="Angus">Angus</SelectItem>
                    <SelectItem value="Charolais">Charolais</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input 
                  id="date_of_birth" 
                  name="date_of_birth" 
                  type="date"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Initial Weight (kg)</Label>
                <Input 
                  id="weight" 
                  name="weight" 
                  type="number" 
                  step="0.1"
                  min="0"
                  placeholder="Enter weight in kg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select name="gender" defaultValue="female" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="health_status">Health Status *</Label>
                <Select name="health_status" defaultValue="good" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select health status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select name="source" defaultValue="purchased">
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchased">Purchased</SelectItem>
                    <SelectItem value="born">Born on Farm</SelectItem>
                    <SelectItem value="donated">Donated</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select name="status" defaultValue="active" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="fattening">In Fattening</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="deceased">Deceased</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                placeholder="Any additional notes about the cattle"
                rows={3}
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Cattle"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleRegistration;
