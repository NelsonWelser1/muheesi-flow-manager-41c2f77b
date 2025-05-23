
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { useGrowthPredictions } from '@/hooks/useGrowthPredictions';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Bar, Area } from 'recharts';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const GrowthMetricsView = () => {
  const [activeTab, setActiveTab] = useState("weight-gain");
  const [selectedBreed, setSelectedBreed] = useState("all");
  const { toast } = useToast();
  
  const { cattleList, isLoading: cattleLoading } = useCattleInventory();
  const { predictions, isLoading: predictionsLoading, error, regeneratePredictions } = useGrowthPredictions(cattleList);
  
  // Handle error in useGrowthPredictions hook
  useEffect(() => {
    if (error) {
      console.log("Growth predictions error:", error);
      // We'll display an error message in the UI instead of toasting
    }
  }, [error]);
  
  // Filter data by breed
  const filteredCattle = selectedBreed === "all" 
    ? cattleList 
    : cattleList?.filter(cattle => cattle.breed === selectedBreed);
  
  const filteredPredictions = selectedBreed === "all"
    ? predictions
    : predictions?.filter(pred => pred.breed === selectedBreed);
  
  // Prepare data for weight gain chart
  const weightGainData = filteredPredictions?.map(pred => {
    const initialWeight = pred?.projections?.[0]?.weight;
    return {
      tag: pred.tag_number,
      name: pred.name,
      currentWeight: initialWeight,
      month1: pred?.projections?.[1]?.weight,
      month2: pred?.projections?.[2]?.weight,
      month3: pred?.projections?.[3]?.weight,
      month6: pred?.projections?.[6]?.weight,
      gainRate: pred?.projections?.[0]?.daily_gain
    };
  }) || [];
  
  // Prepare data for breed comparison
  const breedGroups = {};
  cattleList?.forEach(cattle => {
    if (!cattle.breed) return;
    if (!breedGroups[cattle.breed]) {
      breedGroups[cattle.breed] = { count: 0, totalWeight: 0, averageDailyGain: 0 };
    }
    breedGroups[cattle.breed].count += 1;
    breedGroups[cattle.breed].totalWeight += (cattle.weight || 0);
  });
  
  predictions?.forEach(pred => {
    if (!breedGroups[pred.breed]) return;
    if (pred.projections && pred.projections[0]) {
      breedGroups[pred.breed].averageDailyGain += pred.projections[0].daily_gain || 0;
    }
  });
  
  // Calculate averages and prepare for chart
  const breedComparisonData = Object.keys(breedGroups).map(breed => ({
    breed,
    count: breedGroups[breed].count,
    avgWeight: breedGroups[breed].count ? Math.round(breedGroups[breed].totalWeight / breedGroups[breed].count) : 0,
    avgDailyGain: breedGroups[breed].count ? +(breedGroups[breed].averageDailyGain / breedGroups[breed].count).toFixed(2) : 0
  }));
  
  // Get unique breeds for filter
  const breeds = [...new Set(cattleList?.map(cattle => cattle.breed).filter(Boolean))];
  
  // Body condition score distribution
  const conditionScores = [1, 2, 3, 4, 5];
  const bodyCounts = conditionScores.map(score => {
    const count = predictions?.filter(pred => 
      pred.projections && 
      pred.projections[0] && 
      pred.projections[0].body_condition_score === score &&
      (selectedBreed === "all" || pred.breed === selectedBreed)
    ).length || 0;
    return { score: `Score ${score}`, count };
  });
  
  const isLoading = cattleLoading || predictionsLoading;

  const handleRefreshPredictions = () => {
    regeneratePredictions();
    toast({
      title: "Refreshing predictions",
      description: "Growth predictions are being recalculated using AI.",
    });
  };

  const renderErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-2">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-red-800">AI Model Error</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>We encountered an issue with growth predictions. The AI model is having trouble accessing historical data.</p>
            <Button 
              onClick={handleRefreshPredictions}
              size="sm"
              variant="outline"
              className="mt-2 text-red-700 border-red-300 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Retry with Sample Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Growth Metrics</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshPredictions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Predictions
          </Button>
          <Select value={selectedBreed} onValueChange={setSelectedBreed}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by breed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Breeds</SelectItem>
              {breeds.map(breed => (
                <SelectItem key={breed} value={breed}>{breed}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {error && renderErrorState()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="weight-gain">Weight Gain</TabsTrigger>
          <TabsTrigger value="breed-comparison">Breed Comparison</TabsTrigger>
          <TabsTrigger value="body-condition">Body Condition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight-gain" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Projected Weight Gain Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <p>Loading growth data...</p>
                </div>
              ) : weightGainData.length === 0 ? (
                <div className="h-80 flex items-center justify-center">
                  <p>No growth data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weightGainData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tag" />
                    <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} kg`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="currentWeight" name="Current Weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="month3" name="3 Month Projection" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="month6" name="6 Month Projection" stroke="#ff7300" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {weightGainData.slice(0, 4).map((data, index) => (
                  <Card key={index} className="p-4 bg-muted/20">
                    <div className="font-medium">{data.tag || 'Unknown'} - {data.name || 'Unnamed'}</div>
                    <div className="text-sm text-muted-foreground">Daily Gain: {data.gainRate || 0} kg/day</div>
                    <div className="text-sm text-muted-foreground">Current: {data.currentWeight || 0} kg</div>
                    <div className="text-sm text-green-600">6 Month: {data.month6 || 0} kg</div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breed-comparison" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Breed Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <p>Loading breed data...</p>
                </div>
              ) : breedComparisonData.length === 0 ? (
                <div className="h-80 flex items-center justify-center">
                  <p>No breed comparison data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={breedComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="breed" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgWeight" name="Avg Weight (kg)" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="avgDailyGain" name="Avg Daily Gain (kg/day)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="body-condition" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Body Condition Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <p>Loading body condition data...</p>
                </div>
              ) : bodyCounts.every(item => item.count === 0) ? (
                <div className="h-80 flex items-center justify-center">
                  <p>No body condition data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={bodyCounts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="score" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Cattle" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="mt-6">
                <h4 className="font-medium mb-2">Body Condition Score Guide</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                  <div className="p-2 border rounded bg-red-50">
                    <div className="font-medium">Score 1</div>
                    <div>Very poor, emaciated</div>
                  </div>
                  <div className="p-2 border rounded bg-orange-50">
                    <div className="font-medium">Score 2</div>
                    <div>Poor, thin</div>
                  </div>
                  <div className="p-2 border rounded bg-yellow-50">
                    <div className="font-medium">Score 3</div>
                    <div>Moderate, ideal</div>
                  </div>
                  <div className="p-2 border rounded bg-green-50">
                    <div className="font-medium">Score 4</div>
                    <div>Good, fat</div>
                  </div>
                  <div className="p-2 border rounded bg-blue-50">
                    <div className="font-medium">Score 5</div>
                    <div>Excellent, obese</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrowthMetricsView;
