
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
import { LineChart, Weight, TrendingUp, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';

const CattleGrowth = () => {
  const { toast } = useToast();
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [growthRecord, setGrowthRecord] = useState({
    measurementDate: new Date(),
    weight: '',
    height: '',
    girth: '',
    bodyConditionScore: '',
    feedIntake: '',
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
          measurement_date: format(growthRecord.measurementDate, 'yyyy-MM-dd'),
          weight: parseFloat(growthRecord.weight),
          height: growthRecord.height ? parseFloat(growthRecord.height) : null,
          girth: growthRecord.girth ? parseFloat(growthRecord.girth) : null,
          body_condition_score: growthRecord.bodyConditionScore ? parseFloat(growthRecord.bodyConditionScore) : null,
          feed_intake: growthRecord.feedIntake ? parseFloat(growthRecord.feedIntake) : null,
          notes: growthRecord.notes
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Growth record added successfully"
      });

      // Reset form
      setGrowthRecord({
        measurementDate: new Date(),
        weight: '',
        height: '',
        girth: '',
        bodyConditionScore: '',
        feedIntake: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding growth record:', error);
      toast({
        title: "Error",
        description: "Failed to add growth record",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b border-blue-100">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>Growth Monitoring</CardTitle>
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
                <Label>Measurement Date</Label>
                <Input
                  type="date"
                  value={format(growthRecord.measurementDate, 'yyyy-MM-dd')}
                  onChange={(e) => setGrowthRecord(prev => ({ ...prev, measurementDate: new Date(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthRecord.weight}
                  onChange={(e) => setGrowthRecord(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter weight in kg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthRecord.height}
                  onChange={(e) => setGrowthRecord(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Enter height in cm"
                />
              </div>

              <div className="space-y-2">
                <Label>Chest Girth (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthRecord.girth}
                  onChange={(e) => setGrowthRecord(prev => ({ ...prev, girth: e.target.value }))}
                  placeholder="Enter chest girth in cm"
                />
              </div>

              <div className="space-y-2">
                <Label>Body Condition Score (1-9)</Label>
                <Select
                  value={growthRecord.bodyConditionScore}
                  onValueChange={(value) => setGrowthRecord(prev => ({ ...prev, bodyConditionScore: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Extremely Thin</SelectItem>
                    <SelectItem value="2">2 - Very Thin</SelectItem>
                    <SelectItem value="3">3 - Thin</SelectItem>
                    <SelectItem value="4">4 - Borderline</SelectItem>
                    <SelectItem value="5">5 - Moderate</SelectItem>
                    <SelectItem value="6">6 - Good</SelectItem>
                    <SelectItem value="7">7 - Fat</SelectItem>
                    <SelectItem value="8">8 - Very Fat</SelectItem>
                    <SelectItem value="9">9 - Extremely Fat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Feed Intake (kg/day)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthRecord.feedIntake}
                  onChange={(e) => setGrowthRecord(prev => ({ ...prev, feedIntake: e.target.value }))}
                  placeholder="Enter daily feed intake"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={growthRecord.notes}
                  onChange={(e) => setGrowthRecord(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
