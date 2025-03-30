
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { ClipboardList, Tag, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';

const CattleRegistration = () => {
  const { toast } = useToast();
  const [cattle, setCattle] = useState({
    tagNumber: '',
    name: '',
    breed: '',
    sex: '',
    dateOfBirth: format(new Date(), 'yyyy-MM-dd'),
    source: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    purchasePrice: '',
    initialWeight: '',
    notes: '',
    status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('cattle_inventory')
        .insert([{
          tag_number: cattle.tagNumber,
          name: cattle.name,
          breed: cattle.breed,
          sex: cattle.sex,
          date_of_birth: cattle.dateOfBirth,
          source: cattle.source,
          purchase_date: cattle.purchaseDate,
          purchase_price: cattle.purchasePrice ? parseFloat(cattle.purchasePrice) : null,
          initial_weight: cattle.initialWeight ? parseFloat(cattle.initialWeight) : null,
          notes: cattle.notes,
          status: cattle.status
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cattle registered successfully"
      });

      // Reset form
      setCattle({
        tagNumber: '',
        name: '',
        breed: '',
        sex: '',
        dateOfBirth: format(new Date(), 'yyyy-MM-dd'),
        source: '',
        purchaseDate: format(new Date(), 'yyyy-MM-dd'),
        purchasePrice: '',
        initialWeight: '',
        notes: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error registering cattle:', error);
      toast({
        title: "Error",
        description: "Failed to register cattle: " + error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-slate-600" />
            <CardTitle>Cattle Registration</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tag Number</Label>
                <Input
                  value={cattle.tagNumber}
                  onChange={(e) => setCattle(prev => ({ ...prev, tagNumber: e.target.value }))}
                  placeholder="Enter tag number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Name (Optional)</Label>
                <Input
                  value={cattle.name}
                  onChange={(e) => setCattle(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter name if applicable"
                />
              </div>

              <div className="space-y-2">
                <Label>Breed</Label>
                <Select
                  value={cattle.breed}
                  onValueChange={(value) => setCattle(prev => ({ ...prev, breed: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select breed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="angus">Angus</SelectItem>
                    <SelectItem value="hereford">Hereford</SelectItem>
                    <SelectItem value="brahman">Brahman</SelectItem>
                    <SelectItem value="holstein">Holstein</SelectItem>
                    <SelectItem value="ankole">Ankole</SelectItem>
                    <SelectItem value="boran">Boran</SelectItem>
                    <SelectItem value="sahiwal">Sahiwal</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sex</Label>
                <Select
                  value={cattle.sex}
                  onValueChange={(value) => setCattle(prev => ({ ...prev, sex: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date of Birth (Estimated)</Label>
                <Input
                  type="date"
                  value={cattle.dateOfBirth}
                  onChange={(e) => setCattle(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={cattle.source}
                  onValueChange={(value) => setCattle(prev => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchased">Purchased</SelectItem>
                    <SelectItem value="born">Born on Farm</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                    <SelectItem value="donated">Donated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Purchase Date</Label>
                <Input
                  type="date"
                  value={cattle.purchaseDate}
                  onChange={(e) => setCattle(prev => ({ ...prev, purchaseDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Purchase Price (UGX)</Label>
                <Input
                  type="number"
                  value={cattle.purchasePrice}
                  onChange={(e) => setCattle(prev => ({ ...prev, purchasePrice: e.target.value }))}
                  placeholder="Enter purchase price"
                />
              </div>

              <div className="space-y-2">
                <Label>Initial Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={cattle.initialWeight}
                  onChange={(e) => setCattle(prev => ({ ...prev, initialWeight: e.target.value }))}
                  placeholder="Enter initial weight"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={cattle.status}
                  onValueChange={(value) => setCattle(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="deceased">Deceased</SelectItem>
                    <SelectItem value="quarantine">Quarantine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={cattle.notes}
                  onChange={(e) => setCattle(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-slate-600 hover:bg-slate-700">
                Register Cattle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleRegistration;
