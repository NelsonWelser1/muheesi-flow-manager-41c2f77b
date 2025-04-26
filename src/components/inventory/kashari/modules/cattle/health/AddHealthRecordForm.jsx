
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon } from "lucide-react";

const AddHealthRecordForm = ({ onSuccess }) => {
  const { addHealthRecord, loading, error, cattleList, fetchCattleList } = useHealthRecords();
  
  const [formData, setFormData] = useState({
    cattle_id: '',
    record_date: new Date(),
    record_type: 'vaccination',
    description: '',
    treatment: '',
    administered_by: '',
    next_due_date: null,
    notes: '',
  });

  useEffect(() => {
    fetchCattleList();
  }, [fetchCattleList]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await addHealthRecord(formData);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cattle_id">Cattle</Label>
          <Select 
            value={formData.cattle_id} 
            onValueChange={(value) => handleChange('cattle_id', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cattle" />
            </SelectTrigger>
            <SelectContent>
              {cattleList.map((cattle) => (
                <SelectItem key={cattle.id} value={cattle.id}>
                  {cattle.tag_number} - {cattle.name || 'Unnamed'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Record Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.record_date ? format(formData.record_date, 'PPP') : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.record_date}
                onSelect={(date) => handleChange('record_date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="record_type">Record Type</Label>
          <Select 
            value={formData.record_type} 
            onValueChange={(value) => handleChange('record_type', value)}
            required
          >
            <SelectTrigger>
              <SelectValue />
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
          <Label htmlFor="administered_by">Administered By</Label>
          <Input
            id="administered_by"
            value={formData.administered_by}
            onChange={(e) => handleChange('administered_by', e.target.value)}
            placeholder="Name of vet or staff"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter description"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">Treatment (if applicable)</Label>
        <Input
          id="treatment"
          value={formData.treatment}
          onChange={(e) => handleChange('treatment', e.target.value)}
          placeholder="Enter treatment details"
        />
      </div>

      <div className="space-y-2">
        <Label>Next Due Date (if applicable)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.next_due_date ? format(formData.next_due_date, 'PPP') : "Select date (optional)"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.next_due_date}
              onSelect={(date) => handleChange('next_due_date', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional notes"
          rows={3}
        />
      </div>

      {error && (
        <div className="text-sm text-red-500">
          Error: {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Record'}
        </Button>
      </div>
    </form>
  );
};

export default AddHealthRecordForm;
