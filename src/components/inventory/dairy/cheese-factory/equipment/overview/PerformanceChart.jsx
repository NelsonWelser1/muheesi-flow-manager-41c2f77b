
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { timestamp: '00:00', value: 85 },
  { timestamp: '04:00', value: 88 },
  { timestamp: '08:00', value: 87 },
  { timestamp: '12:00', value: 84 },
  { timestamp: '16:00', value: 86 },
  { timestamp: '20:00', value: 85 },
  { timestamp: '24:00', value: 87 },
];

const PerformanceChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={[80, 90]} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#9b87f5" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
