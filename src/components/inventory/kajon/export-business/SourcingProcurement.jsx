import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSourcingRecords } from '@/hooks/useSourcingRecords';
import { Loader2, Save } from 'lucide-react';

const SourcingProcurement = () => {
  const { records, isLoading, createRecord } = useSourcingRecords();
  const [formData, setFormData] = useState({
    location: '',
    coffee_type: '',
    moisture_content: '',
    procurement_cost: '',
    screen_grade: '',
    quality_rating: ''
  });

  const handleSubmit = () => {
    if (!formData.location || !formData.coffee_type) {
      return;
    }
    
    createRecord.mutate({
      location: formData.location,
      coffee_type: formData.coffee_type,
      moisture_content: formData.moisture_content ? parseFloat(formData.moisture_content) : null,
      procurement_cost: formData.procurement_cost ? parseFloat(formData.procurement_cost) : null,
      screen_grade: formData.screen_grade,
      quality_rating: formData.quality_rating
    });

    setFormData({
      location: '',
      coffee_type: '',
      moisture_content: '',
      procurement_cost: '',
      screen_grade: '',
      quality_rating: ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sourcing Locations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={formData.location} onValueChange={(v) => setFormData(prev => ({ ...prev, location: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kazo Coffee Development Project">Kazo Coffee Development Project</SelectItem>
                <SelectItem value="Kyiboga (Kakyinga)">Kyiboga (Kakyinga)</SelectItem>
                <SelectItem value="Associations">Associations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Coffee Type</Label>
            <Select value={formData.coffee_type} onValueChange={(v) => setFormData(prev => ({ ...prev, coffee_type: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arabica">Arabica</SelectItem>
                <SelectItem value="Robusta">Robusta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Moisture Content (%)</Label>
            <Input 
              type="number" 
              step="0.1" 
              value={formData.moisture_content}
              onChange={(e) => setFormData(prev => ({ ...prev, moisture_content: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Procurement Cost (per kg)</Label>
            <Input 
              type="number" 
              step="0.01" 
              value={formData.procurement_cost}
              onChange={(e) => setFormData(prev => ({ ...prev, procurement_cost: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Screen Grade</Label>
              <Select value={formData.screen_grade} onValueChange={(v) => setFormData(prev => ({ ...prev, screen_grade: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Screen 18">Screen 18</SelectItem>
                  <SelectItem value="Screen 15">Screen 15</SelectItem>
                  <SelectItem value="Screen 12">Screen 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quality Rating</Label>
              <Select value={formData.quality_rating} onValueChange={(v) => setFormData(prev => ({ ...prev, quality_rating: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={createRecord.isPending || !formData.location || !formData.coffee_type}
          >
            {createRecord.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Sourcing Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sourcing Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : records.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No sourcing records yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Coffee Type</TableHead>
                  <TableHead>Moisture %</TableHead>
                  <TableHead>Cost/kg</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.slice(0, 10).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{record.coffee_type}</TableCell>
                    <TableCell>{record.moisture_content || '-'}</TableCell>
                    <TableCell>{record.procurement_cost || '-'}</TableCell>
                    <TableCell>{record.screen_grade || '-'}</TableCell>
                    <TableCell>{record.quality_rating || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SourcingProcurement;
