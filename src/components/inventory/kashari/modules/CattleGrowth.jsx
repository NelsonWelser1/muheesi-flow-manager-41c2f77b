
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const CattleGrowth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Growth record added",
        description: "The growth data has been recorded successfully",
      });
      
      e.target.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Record Growth Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tag_number">Cattle Tag Number *</Label>
                <Select name="tag_number" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cattle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KAZ001">KAZ001</SelectItem>
                    <SelectItem value="KAZ002">KAZ002</SelectItem>
                    <SelectItem value="KAZ003">KAZ003</SelectItem>
                    <SelectItem value="KAZ004">KAZ004</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="measurement_date">Measurement Date *</Label>
                <Input 
                  id="measurement_date" 
                  name="measurement_date" 
                  type="date"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current_weight">Current Weight (kg) *</Label>
                <Input 
                  id="current_weight" 
                  name="current_weight" 
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter current weight"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  name="height" 
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter height measurement"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body_condition">Body Condition Score *</Label>
                <Select name="body_condition" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Poor</SelectItem>
                    <SelectItem value="2">2 - Poor</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recorded_by">Recorded By *</Label>
                <Input 
                  id="recorded_by" 
                  name="recorded_by" 
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes" 
                  name="notes" 
                  placeholder="Additional notes about growth performance"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Recording..." : "Record Growth Data"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Growth Metrics Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium">Body Condition Scoring</h3>
              <p className="text-gray-600">The body condition score is a numerical score from 1-5 that represents the amount of fat cover on the animal:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                <li><span className="font-medium">1 - Very Poor:</span> Extremely thin, no fat, prominent skeletal structures</li>
                <li><span className="font-medium">2 - Poor:</span> Thin with minimal fat coverage</li>
                <li><span className="font-medium">3 - Moderate:</span> Ideal condition with balanced fat coverage</li>
                <li><span className="font-medium">4 - Good:</span> Well-covered with fat, rounded appearance</li>
                <li><span className="font-medium">5 - Excellent:</span> Very fat, heavily covered</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Average Daily Gain (ADG)</h3>
              <p className="text-gray-600">ADG is calculated by dividing the weight gain by the number of days in the feeding period. A good ADG for beef cattle in a fattening program is typically between 1.2-2.0 kg/day depending on breed and feeding regime.</p>
            </div>
            
            <div>
              <h3 className="font-medium">Feed Conversion Ratio</h3>
              <p className="text-gray-600">Feed conversion ratio measures how efficiently the animal converts feed into weight gain. It's calculated as kilograms of feed consumed divided by kilograms of weight gained. Lower values indicate better efficiency.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleGrowth;
