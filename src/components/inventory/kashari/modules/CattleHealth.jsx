
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
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Stethoscope, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';

const CattleHealth = () => {
  const { toast } = useToast();
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [healthRecord, setHealthRecord] = useState({
    recordType: '',
    description: '',
    treatment: '',
    administeredBy: '',
    recordDate: new Date(),
    nextDueDate: null,
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCattle) {
      toast({
        title: "Error",
        description: "Please select a cattle first",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cattle_health_records')
        .insert([{
          cattle_id: selectedCattle.id,
          record_type: healthRecord.recordType,
          description: healthRecord.description,
          treatment: healthRecord.treatment,
          administered_by: healthRecord.administeredBy,
          record_date: format(healthRecord.recordDate, 'yyyy-MM-dd'),
          next_due_date: healthRecord.nextDueDate ? format(healthRecord.nextDueDate, 'yyyy-MM-dd') : null,
          notes: healthRecord.notes
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Health record added successfully"
      });

      // Reset form
      setHealthRecord({
        recordType: '',
        description: '',
        treatment: '',
        administeredBy: '',
        recordDate: new Date(),
        nextDueDate: null,
        notes: ''
      });
    } catch (error) {
      console.error('Error adding health record:', error);
      toast({
        title: "Error",
        description: "Failed to add health record",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-green-600" />
            <CardTitle>Health Records</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cattle ID/Tag Number</Label>
                <Select
                  value={selectedCattle?.tag_number || ""}
                  onValueChange={(value) => setSelectedCattle({ id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cattle" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Make sure each SelectItem has a non-empty value */}
                    <SelectItem value="TAG001">TAG001</SelectItem>
                    <SelectItem value="TAG002">TAG002</SelectItem>
                    <SelectItem value="TAG003">TAG003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Record Type</Label>
                <Select
                  value={healthRecord.recordType}
                  onValueChange={(value) => setHealthRecord(prev => ({ ...prev, recordType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="examination">Examination</SelectItem>
                    <SelectItem value="deworming">Deworming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={healthRecord.description}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>

              <div className="space-y-2">
                <Label>Treatment (if applicable)</Label>
                <Input
                  value={healthRecord.treatment}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, treatment: e.target.value }))}
                  placeholder="Enter treatment details"
                />
              </div>

              <div className="space-y-2">
                <Label>Administered By</Label>
                <Input
                  value={healthRecord.administeredBy}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, administeredBy: e.target.value }))}
                  placeholder="Enter name"
                />
              </div>

              <div className="space-y-2">
                <Label>Record Date</Label>
                <Input
                  type="date"
                  value={format(healthRecord.recordDate, 'yyyy-MM-dd')}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, recordDate: new Date(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Next Due Date (if applicable)</Label>
                <Input
                  type="date"
                  value={healthRecord.nextDueDate ? format(healthRecord.nextDueDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, nextDueDate: e.target.value ? new Date(e.target.value) : null }))}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={healthRecord.notes}
                  onChange={(e) => setHealthRecord(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Health Record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleHealth;
