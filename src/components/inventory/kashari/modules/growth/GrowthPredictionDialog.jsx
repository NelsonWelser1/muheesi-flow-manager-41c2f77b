
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGrowthPredictions } from '@/hooks/useGrowthPredictions';
import { supabase } from '@/integrations/supabase/supabase';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const GrowthPredictionDialog = ({ open, onOpenChange, cattleData = [] }) => {
  const [selectedCattle, setSelectedCattle] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { generatePrediction, loading } = useGrowthPredictions();
  const { toast } = useToast();
  
  // Find the cattle object based on selected ID
  const selectedCattleObject = cattleData.find(cattle => cattle.id === selectedCattle);

  const handleGeneratePrediction = async () => {
    if (!selectedCattle) {
      toast({
        title: "Selection Required",
        description: "Please select a cattle first",
        variant: "destructive",
      });
      return;
    }
    
    const result = await generatePrediction(selectedCattle);
    if (result) {
      setPrediction(result);
    }
  };
  
  const handleSavePrediction = async () => {
    if (!prediction || !selectedCattle) return;
    
    setIsSaving(true);
    
    try {
      // Save prediction to the growth metrics table
      const { data, error } = await supabase
        .from('cattle_growth_metrics')
        .insert([{
          ...prediction,
          cattle_id: selectedCattle,
          notes: prediction.notes + " (AI-predicted)"
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Prediction saved as growth record",
      });
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving prediction:", error);
      toast({
        title: "Error",
        description: "Failed to save prediction",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Generate chart data 
  const generateChartData = () => {
    if (!prediction) return [];
    
    // Create 6-month projection
    const baseWeight = prediction.weight;
    const baseHeight = prediction.height;
    
    return [0, 1, 2, 3, 4, 5].map(month => {
      // Apply growth patterns
      const weightGrowth = baseWeight * (1 + (month * 0.03));
      const heightGrowth = baseHeight * (1 + (month * 0.01));
      
      return {
        month: `Month ${month}`,
        weight: Math.round(weightGrowth * 10) / 10,
        height: Math.round(heightGrowth * 10) / 10,
      };
    });
  };

  const chartData = generateChartData();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>AI Growth Prediction</DialogTitle>
          <DialogDescription>
            Generate AI-powered growth predictions based on historical data
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="cattle-select" className="text-sm font-medium">
              Select Cattle
            </label>
            <select 
              id="cattle-select"
              className="w-full p-2 border rounded-md"
              value={selectedCattle}
              onChange={(e) => setSelectedCattle(e.target.value)}
            >
              <option value="">Select a cattle</option>
              {cattleData.map(cattle => (
                <option key={cattle.id} value={cattle.id}>
                  {cattle.tag_number} - {cattle.name || 'Unnamed'}
                </option>
              ))}
            </select>
          </div>
          
          {!prediction && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleGeneratePrediction} 
                disabled={loading || !selectedCattle}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Generating..." : "Generate Prediction"}
              </Button>
            </div>
          )}
          
          {prediction && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h3 className="font-semibold">Predicted Weight</h3>
                  <p className="text-2xl">{prediction.weight} kg</p>
                </div>
                <div className="p-3 bg-green-50 rounded-md">
                  <h3 className="font-semibold">Predicted Height</h3>
                  <p className="text-2xl">{prediction.height} cm</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-md">
                  <h3 className="font-semibold">Body Condition</h3>
                  <p className="text-2xl">{prediction.body_condition_score}/5</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-md">
                  <h3 className="font-semibold">Estimated Girth</h3>
                  <p className="text-2xl">{prediction.girth} cm</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">6-Month Growth Projection</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" domain={['auto', 'auto']} />
                      <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#1d4ed8" name="Weight (kg)" />
                      <Line yAxisId="right" type="monotone" dataKey="height" stroke="#059669" name="Height (cm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mt-2">
                <h3 className="font-semibold">Analysis Notes</h3>
                <p className="text-sm text-gray-600">{prediction.notes}</p>
                
                {selectedCattleObject && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Cattle: {selectedCattleObject.tag_number} {selectedCattleObject.name ? `(${selectedCattleObject.name})` : ''}</p>
                    <p>Breed: {selectedCattleObject.breed || 'Unknown'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          
          {prediction && (
            <Button 
              onClick={handleSavePrediction} 
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? "Saving..." : "Save Prediction"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GrowthPredictionDialog;
