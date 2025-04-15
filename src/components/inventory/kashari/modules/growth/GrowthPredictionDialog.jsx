
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useGrowthPredictions } from "@/hooks/useGrowthPredictions";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, RefreshCw } from 'lucide-react';

const GrowthPredictionDialog = ({ open, onOpenChange, cattleData = [] }) => {
  const [selectedCattleId, setSelectedCattleId] = useState('');
  const { toast } = useToast();
  const { predictions, isLoading, error, regeneratePredictions } = useGrowthPredictions(cattleData);

  // Find the selected cattle prediction
  const selectedPrediction = predictions.find(p => p.cattle_id === selectedCattleId) || 
    (predictions.length > 0 ? predictions[0] : null);

  const handleRefresh = () => {
    regeneratePredictions();
    toast({
      title: "Predictions updated",
      description: "Growth predictions have been recalculated."
    });
  };

  if (error) {
    toast({
      title: "Error generating predictions",
      description: error,
      variant: "destructive"
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            <span>AI Growth Predictions</span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </DialogTitle>
          <DialogDescription>
            AI-generated growth projections for the next 6 months based on breed, age, and historical data.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Calculating growth predictions...</span>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Label htmlFor="cattle-selector">Select Cattle</Label>
              <Select
                value={selectedCattleId || (predictions[0]?.cattle_id || '')}
                onValueChange={setSelectedCattleId}
              >
                <SelectTrigger id="cattle-selector">
                  <SelectValue placeholder="Select a cattle to view predictions" />
                </SelectTrigger>
                <SelectContent>
                  {predictions.map(prediction => (
                    <SelectItem key={prediction.cattle_id} value={prediction.cattle_id}>
                      {prediction.tag_number} - {prediction.name} ({prediction.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPrediction ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Current Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedPrediction.tag_number}</div>
                      <p className="text-muted-foreground">{selectedPrediction.breed} {selectedPrediction.type} ({selectedPrediction.age_months} months)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Projected Daily Gain</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedPrediction.projections[0].daily_gain} kg/day</div>
                      <p className="text-muted-foreground">Based on breed standards</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Feed Conversion Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedPrediction.projections[0].feed_conversion_ratio}</div>
                      <p className="text-muted-foreground">kg feed per kg gain</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>6-Month Weight Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={selectedPrediction.projections}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="months" label={{ value: 'Months', position: 'insideBottomRight', offset: -10 }} />
                          <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value, name) => [value, name === "weight" ? "Weight (kg)" : name]} labelFormatter={(label) => `Month ${label}`} />
                          <Legend />
                          <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} name="Weight (kg)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Growth Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="p-3 text-left font-medium">Month</th>
                            <th className="p-3 text-left font-medium">Date</th>
                            <th className="p-3 text-left font-medium">Weight (kg)</th>
                            <th className="p-3 text-left font-medium">Height (cm)</th>
                            <th className="p-3 text-left font-medium">Girth (cm)</th>
                            <th className="p-3 text-left font-medium">Body Condition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPrediction.projections.map((projection, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                              <td className="p-3">{projection.months}</td>
                              <td className="p-3">{projection.date}</td>
                              <td className="p-3">{projection.weight}</td>
                              <td className="p-3">{projection.height}</td>
                              <td className="p-3">{projection.girth}</td>
                              <td className="p-3">{projection.body_condition_score}/5</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No cattle data available for predictions. Please add cattle to the inventory first.</p>
              </div>
            )}
          </>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GrowthPredictionDialog;
