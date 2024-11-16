import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FarmAnalytics = ({ isKazo, selectedFarm }) => {
  // Sample data - replace with actual data from your backend
  const productionData = [
    { month: 'Jan', production: 400 },
    { month: 'Feb', production: 300 },
    { month: 'Mar', production: 600 },
    { month: 'Apr', production: 800 },
    { month: 'May', production: 700 },
    { month: 'Jun', production: 900 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Production Analytics</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="production" 
                    stroke="#8884d8" 
                    name="Monthly Production (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <h4 className="text-sm font-medium">Predicted Annual Yield</h4>
                  <p className="text-2xl font-bold">8,500 kg</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <h4 className="text-sm font-medium">Current Health Score</h4>
                  <p className="text-2xl font-bold">85%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <h4 className="text-sm font-medium">Optimization Score</h4>
                  <p className="text-2xl font-bold">92%</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmAnalytics;