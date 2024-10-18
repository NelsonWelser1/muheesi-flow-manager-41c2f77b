import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Nov 2023', price: 2500 },
  { name: 'Jan 2024', price: 3000 },
  { name: 'Apr 2024', price: 3500 },
  { name: 'Jun 2024', price: 4000 },
  { name: 'Sept 2024', price: 5200 },
  { name: 'Oct 2024', price: 4924 },
];

const KAJONCoffeeDetails = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>KAJON Coffee Limited Market Analysis</CardTitle>
          <Button onClick={onClose} variant="outline" className="absolute top-2 right-2">
            Close
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Current Price: 4,924.00 USD</h3>
            <p className="text-red-500">-34.00 (-0.69%)</p>
          </div>
          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Analysis:</h3>
            <p>1. <strong>Recent Peak (Sept 2024)</strong>: The price showed a strong upward trend throughout the year, with a significant peak around September 2024, possibly due to seasonal factors, supply disruptions, or increased global demand for coffee.</p>
            <p>2. <strong>Current Price (Oct 2024)</strong>: The chart suggests that after hitting a high, the price has declined slightly to 4,924.00 USD by mid-October. This could indicate market corrections, increased supply, or decreased demand affecting prices.</p>
            
            <h3 className="text-xl font-semibold">Price Projections:</h3>
            <p>1. <strong>October 2024</strong>: Given that the price is currently on a slight decline after peaking, it is possible that the market will experience mild corrections for the rest of October, stabilizing around the current level of 4,900-5,000 USD, especially as supply adjusts to meet demand after the earlier peak.</p>
            <p>2. <strong>November 2024</strong>: Heading into November, coffee prices may experience seasonal demand due to the upcoming holiday season in Western markets, which typically drives higher consumption. Prices could potentially rebound to around 5,000-5,100 USD if demand increases, but it will also depend on supply-side factors such as crop yields and export capacities, especially from major coffee-producing regions.</p>
            
            <h3 className="text-xl font-semibold">Factors to Watch:</h3>
            <ul className="list-disc pl-5">
              <li><strong>Global Coffee Demand</strong>: The holiday season could boost demand and push prices higher.</li>
              <li><strong>Supply Chain</strong>: If supply issues such as unfavorable weather, logistical bottlenecks, or political events disrupt coffee production in key regions, prices could rise.</li>
              <li><strong>Market Corrections</strong>: The slight drop observed in mid-October might suggest temporary overvaluation, and the market could stabilize or decline slightly if supply outpaces demand.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KAJONCoffeeDetails;