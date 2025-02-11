import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIoTSensorData } from '@/utils/iotIntegration';

const RealTimeMonitoring = () => {
  const [data, setData] = useState([]);
  const [currentValues, setCurrentValues] = useState({
    temperature: 0,
    humidity: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const sensorData = await getIoTSensorData();
      const { temperature, humidity } = sensorData.sensors;
      
      setCurrentValues({ temperature, humidity });
      
      setData(prevData => {
        const newData = [...prevData, {
          time: new Date().toLocaleTimeString(),
          temperature,
          humidity
        }];
        
        // Keep last 20 data points
        return newData.slice(-20);
      });
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTemperatureStatus = (temp) => {
    if (temp < 2) return 'too-cold';
    if (temp > 8) return 'too-hot';
    return 'optimal';
  };

  const getHumidityStatus = (humid) => {
    if (humid < 30) return 'too-dry';
    if (humid > 60) return 'too-humid';
    return 'optimal';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {currentValues.temperature.toFixed(1)}°C
              </span>
              <Badge 
                variant={getTemperatureStatus(currentValues.temperature) === 'optimal' ? 'default' : 'destructive'}
              >
                {getTemperatureStatus(currentValues.temperature)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {currentValues.humidity.toFixed(1)}%
              </span>
              <Badge 
                variant={getHumidityStatus(currentValues.humidity) === 'optimal' ? 'default' : 'destructive'}
              >
                {getHumidityStatus(currentValues.humidity)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environmental Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#8884d8" 
                  name="Temperature (°C)"
                />
                <Line 
                  yAxisId="right"
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
  );
};

export default RealTimeMonitoring;
