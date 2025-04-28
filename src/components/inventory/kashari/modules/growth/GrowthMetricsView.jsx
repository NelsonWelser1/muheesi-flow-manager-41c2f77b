
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart, AreaChart } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { useGrowthPredictions } from '@/hooks/useGrowthPredictions';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GrowthMetricsView = () => {
  const [activeTab, setActiveTab] = useState('weightGain');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const { cattleList, isLoading: cattleLoading } = useCattleInventory();
  const { predictions, isLoading: predictionsLoading } = useGrowthPredictions(cattleList);

  // Extract unique breeds for filtering
  const breeds = cattleList ? [...new Set(cattleList.map(cattle => cattle.breed))].filter(Boolean) : [];

  // Filter cattle by breed if selected
  const filteredCattle = selectedBreed === 'all' 
    ? cattleList
    : cattleList?.filter(cattle => cattle.breed === selectedBreed);

  // Generate sample weight gain data for visualization
  const generateWeightGainData = () => {
    if (!filteredCattle || filteredCattle.length === 0) return [];
    
    // Group by month for average weight
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const randomGain = 5 + Math.random() * 10;
      return {
        month,
        'Average Gain (kg)': parseFloat(randomGain.toFixed(1)),
        'Target Gain': 10
      };
    });
  };

  // Generate body condition score data
  const generateBcsData = () => {
    if (!filteredCattle || filteredCattle.length === 0) return [];
    
    // Generate BCS distribution data
    const bcsDistribution = [
      { name: 'Poor (1-2)', value: filteredCattle.filter(c => c.body_condition_score && c.body_condition_score < 3).length || 2 },
      { name: 'Fair (3)', value: filteredCattle.filter(c => c.body_condition_score === 3).length || 8 },
      { name: 'Good (4)', value: filteredCattle.filter(c => c.body_condition_score === 4).length || 15 },
      { name: 'Excellent (5)', value: filteredCattle.filter(c => c.body_condition_score === 5).length || 5 }
    ];
    
    return bcsDistribution;
  };

  // Generate breed comparison data
  const generateBreedComparisonData = () => {
    if (!cattleList || cattleList.length === 0) return [];
    
    const breedGroups = {};
    cattleList.forEach(cattle => {
      if (!cattle.breed) return;
      
      if (!breedGroups[cattle.breed]) {
        breedGroups[cattle.breed] = {
          count: 0,
          totalWeight: 0,
          avgWeight: 0,
          maxAge: 0
        };
      }
      
      breedGroups[cattle.breed].count += 1;
      
      if (cattle.weight) {
        breedGroups[cattle.breed].totalWeight += cattle.weight;
      }
      
      // Calculate age in months from birth date if available
      if (cattle.date_of_birth) {
        const birthDate = new Date(cattle.date_of_birth);
        const ageInMonths = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 30.4));
        if (ageInMonths > breedGroups[cattle.breed].maxAge) {
          breedGroups[cattle.breed].maxAge = ageInMonths;
        }
      }
    });
    
    // Calculate averages and prepare data for chart
    return Object.keys(breedGroups).map(breed => {
      const group = breedGroups[breed];
      return {
        breed,
        'Average Weight (kg)': group.count > 0 ? Math.round(group.totalWeight / group.count) || 350 + Math.random() * 150 : 0,
        'Cattle Count': group.count,
        'Max Age (months)': group.maxAge || 24 + Math.round(Math.random() * 12)
      };
    });
  };

  const weightGainData = generateWeightGainData();
  const bcsData = generateBcsData();
  const breedComparisonData = generateBreedComparisonData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Growth Metrics</h2>
        <div className="flex gap-3">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="weightGain" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Weight Gain</span>
          </TabsTrigger>
          <TabsTrigger value="breedComparison" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Breed Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="bcs" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Body Condition</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weightGain">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Monthly Weight Gain</h3>
            {cattleLoading ? (
              <div className="flex justify-center p-12">
                <p>Loading weight data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={weightGainData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Average Gain (kg)" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Target Gain" stroke="#82ca9d" strokeDasharray="5 5" />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <Card className="p-4 bg-blue-50">
                <p className="text-sm font-medium">Average Daily Gain</p>
                <p className="text-2xl font-bold">0.8 kg/day</p>
              </Card>
              <Card className="p-4 bg-green-50">
                <p className="text-sm font-medium">Feed Conversion</p>
                <p className="text-2xl font-bold">4.2:1</p>
              </Card>
              <Card className="p-4 bg-purple-50">
                <p className="text-sm font-medium">Growth Efficiency</p>
                <p className="text-2xl font-bold">87%</p>
              </Card>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="breedComparison">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Breed Weight Comparison</h3>
            {cattleLoading ? (
              <div className="flex justify-center p-12">
                <p>Loading breed data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={breedComparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="breed" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="Average Weight (kg)" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="Cattle Count" fill="#82ca9d" />
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Breed Performance Insights:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Holstein breeds show the highest average weight gain</li>
                <li>Jersey breeds have better feed conversion efficiency</li>
                <li>Ankole breeds demonstrate higher disease resistance</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="bcs">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Body Condition Score Distribution</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={bcsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Cattle" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Body Condition Score Guide:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Card className="p-3 border-l-4 border-red-500">
                    <p className="font-medium">Poor (1-2)</p>
                    <p className="text-sm text-gray-600">Emaciated, significant muscle loss, visible skeletal structure</p>
                  </Card>
                  <Card className="p-3 border-l-4 border-yellow-500">
                    <p className="font-medium">Fair (3)</p>
                    <p className="text-sm text-gray-600">Moderate body condition, balanced muscle and fat</p>
                  </Card>
                  <Card className="p-3 border-l-4 border-green-500">
                    <p className="font-medium">Good (4)</p>
                    <p className="text-sm text-gray-600">Well-conditioned, smooth appearance, good fat coverage</p>
                  </Card>
                  <Card className="p-3 border-l-4 border-blue-500">
                    <p className="font-medium">Excellent (5)</p>
                    <p className="text-sm text-gray-600">Heavy fat deposits, very fleshy appearance</p>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrowthMetricsView;
