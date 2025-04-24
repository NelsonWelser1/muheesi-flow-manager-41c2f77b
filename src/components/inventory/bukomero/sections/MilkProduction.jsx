
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';

const MilkProduction = () => {
  const { farmMetrics, isLoading, error, refreshMetrics } = useBukomeroDairyData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    cowCount: '',
    totalVolume: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic would go here
    console.log("Milk production data submitted:", formData);
    // Reset form after submission
    setFormData({
      date: new Date().toISOString().split('T')[0],
      cowCount: '',
      totalVolume: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Milk Production Management</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Milk Production Form */}
        <Card>
          <CardHeader>
            <CardTitle>Record Milk Production</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cowCount">Number of Cows Milked</Label>
                <Input
                  id="cowCount"
                  type="number"
                  name="cowCount"
                  placeholder="Enter number of cows"
                  value={formData.cowCount}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalVolume">Total Milk Volume (liters)</Label>
                <Input
                  id="totalVolume"
                  type="number"
                  name="totalVolume"
                  placeholder="Enter total milk volume"
                  value={formData.totalVolume}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Any additional notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
              
              <Button type="submit" className="w-full">Record Production</Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Milk Production Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Milk Production Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading statistics...</p>
            ) : error ? (
              <p className="text-red-500">Error loading data: {error.message}</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Average Production</p>
                    <p className="text-2xl font-bold">{farmMetrics?.milkProduction || "N/A"}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Cattle</p>
                    <p className="text-2xl font-bold">{farmMetrics?.totalCattle || "0"}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" onClick={refreshMetrics}>
                  Refresh Statistics
                </Button>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Last updated: {farmMetrics?.lastUpdated 
                      ? new Date(farmMetrics.lastUpdated).toLocaleString() 
                      : "Never"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MilkProduction;
