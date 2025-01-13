import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const QualityTestForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    batchNumber: '',
    cheeseType: '',
    pH: '',
    moisture: '',
    saltContent: '',
    textureScore: '',
    flavorScore: '',
    notes: ''
  });

  const addQualityTest = useMutation({
    mutationFn: async (data) => {
      console.log('Adding quality test:', data);
      const { data: result, error } = await supabase
        .from('cheese_quality_tests')
        .insert([{
          batch_number: data.batchNumber,
          cheese_type: data.cheeseType,
          ph_level: parseFloat(data.pH),
          moisture_content: parseFloat(data.moisture),
          salt_content: parseFloat(data.saltContent),
          texture_score: parseInt(data.textureScore),
          flavor_score: parseInt(data.flavorScore),
          notes: data.notes,
          test_date: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['qualityTests']);
      toast({
        title: "Success",
        description: "Quality test recorded successfully",
      });
      setFormData({
        batchNumber: '',
        cheeseType: '',
        pH: '',
        moisture: '',
        saltContent: '',
        textureScore: '',
        flavorScore: '',
        notes: ''
      });
    },
    onError: (error) => {
      console.error('Error recording quality test:', error);
      toast({
        title: "Error",
        description: "Failed to record quality test",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addQualityTest.mutate(formData);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cheeseType">Cheese Type</Label>
              <Select
                value={formData.cheeseType}
                onValueChange={(value) => setFormData({ ...formData, cheeseType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cheese type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mozzarella">Mozzarella</SelectItem>
                  <SelectItem value="cheddar">Cheddar</SelectItem>
                  <SelectItem value="gouda">Gouda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pH">pH Level</Label>
              <Input
                id="pH"
                type="number"
                step="0.1"
                value={formData.pH}
                onChange={(e) => setFormData({ ...formData, pH: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moisture">Moisture Content (%)</Label>
              <Input
                id="moisture"
                type="number"
                step="0.1"
                value={formData.moisture}
                onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="saltContent">Salt Content (%)</Label>
              <Input
                id="saltContent"
                type="number"
                step="0.1"
                value={formData.saltContent}
                onChange={(e) => setFormData({ ...formData, saltContent: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="textureScore">Texture Score (1-10)</Label>
              <Input
                id="textureScore"
                type="number"
                min="1"
                max="10"
                value={formData.textureScore}
                onChange={(e) => setFormData({ ...formData, textureScore: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flavorScore">Flavor Score (1-10)</Label>
              <Input
                id="flavorScore"
                type="number"
                min="1"
                max="10"
                value={formData.flavorScore}
                onChange={(e) => setFormData({ ...formData, flavorScore: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={addQualityTest.isPending}
          >
            {addQualityTest.isPending ? "Recording..." : "Record Quality Test"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QualityTestForm;