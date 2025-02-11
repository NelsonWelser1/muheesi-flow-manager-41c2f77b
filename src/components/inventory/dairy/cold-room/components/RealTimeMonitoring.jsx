
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getColdRoomSensorData } from '@/utils/iotIntegration';

const RealTimeMonitoring = () => {
  const { data: sensorData } = useQuery({
    queryKey: ['iot-sensor-data'],
    queryFn: () => getColdRoomSensorData('CR001'),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Transform sensor data into the format expected by recharts
  const chartData = sensorData ? [sensorData.sensors] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Temperature Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#8884d8" 
                    name="Temperature (°C)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Humidity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Humidity Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#82ca9d" 
                    name="Humidity (%)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;

