
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
import { format } from 'date-fns';
import { Scale, TrendingUp, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';

const CattleGrowth = () => {
  const { toast } = useToast();
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [growthMetric, setGrowthMetric] = useState({
    weight: '',
    height: '',
    girth: '',
    bodyConditionScore: '',
    feedIntake: '',
    measurementDate: new Date(),
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
        .from('cattle_growth_metrics')
        .insert([{
          cattle_id: selectedCattle.id,
          measurement_date: format(growthMetric.measurementDate, 'yyyy-MM-dd'),
          weight: parseFloat(growthMetric.weight),
          height: growthMetric.height ? parseFloat(growthMetric.height) : null,
          girth: growthMetric.girth ? parseFloat(growthMetric.girth) : null,
          body_condition_score: growthMetric.bodyConditionScore ? parseFloat(growthMetric.bodyConditionScore) : null,
          feed_intake: growthMetric.feedIntake ? parseFloat(growthMetric.feedIntake) : null,
          notes: growthMetric.notes
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Growth metrics added successfully"
      });

      // Reset form
      setGrowthMetric({
        weight: '',
        height: '',
        girth: '',
        bodyConditionScore: '',
        feedIntake: '',
        measurementDate: new Date(),
        notes: ''
      });
    } catch (error) {
      console.error('Error adding growth metrics:', error);
      toast({
        title: "Error",
        description: "Failed to add growth metrics",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-green-600" />
            <CardTitle>Growth Monitoring</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cattle ID/Tag Number</Label>
                <Select
                  value={selectedCattle?.tag_number}
                  onValueChange={(value) => setSelectedCattle({ id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cattle" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Cattle list will be populated here */}
                    <SelectItem value="TAG001">TAG001</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Measurement Date</Label>
                <Input
                  type="date"
                  value={format(growthMetric.measurementDate, 'yyyy-MM-dd')}
                  onChange={(e) => setGrowthMetric(prev => ({ ...prev, measurementDate: new Date(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Weight (kg) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthMetric.weight}
                  onChange={(e) => setGrowthMetric(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter weight"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthMetric.height}
                  onChange={(e) => setGrowthMetric(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Enter height"
                />
              </div>

              <div className="space-y-2">
                <Label>Girth (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthMetric.girth}
                  onChange={(e) => setGrowthMetric(prev => ({ ...prev, girth: e.target.value }))}
                  placeholder="Enter girth measurement"
                />
              </div>

              <div className="space-y-2">
                <Label>Body Condition Score (1-9)</Label>
                <Select
                  value={growthMetric.bodyConditionScore}
                  onValueChange={(value) => setGrowthMetric(prev => ({ ...prev, bodyConditionScore: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(score => (
                      <SelectItem key={score} value={score.toString()}>{score}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Feed Intake (kg/day)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthMetric.feedIntake}
                  onChange={(e) => setGrowthMetric(prev => ({ ...prev, feedIntake: e.target.value }))}
                  placeholder="Enter daily feed intake"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={growthMetric.notes}
                  onChange={(e) => setGrowthMetric(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Growth Record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleGrowth;
