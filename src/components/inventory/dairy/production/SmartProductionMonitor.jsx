
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { predictProduction } from '@/utils/productionAI';
import { getIoTSensorData, monitorEquipmentStatus } from '@/utils/iotIntegration';
import { Thermometer, Droplets, Gauge, AlertTriangle } from 'lucide-react';

const SmartProductionMonitor = () => {
  const [predictions, setPredictions] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [equipmentStatus, setEquipmentStatus] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching production data and predictions');
        const [predictionData, iotData, equipStatus] = await Promise.all([
          predictProduction(),
          getIoTSensorData(),
          monitorEquipmentStatus()
        ]);

        setPredictions(predictionData);
        setSensorData(iotData);
        setEquipmentStatus(equipStatus);

        if (!equipStatus.isOperational) {
          toast({
            title: "Equipment Alert",
            description: "Some equipment requires attention",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching smart production data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch production data",
          variant: "destructive",
        });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* IoT Sensor Readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData?.sensors.temperature.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData?.sensors.humidity.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pressure</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData?.sensors.pressure.toFixed(1)} hPa
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Equipment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Overall Status:</span>
            <Badge variant={equipmentStatus?.isOperational ? "success" : "destructive"}>
              {equipmentStatus?.isOperational ? "Operational" : "Attention Required"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Last checked: {equipmentStatus?.lastChecked}
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Production Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Predicted Output:</span>
              <span className="font-bold">
                {predictions?.predictedOutput.toFixed(2)} units
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Confidence:</span>
              <span className="font-bold">
                {(predictions?.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Seasonal Trend:</span>
              <Badge variant={predictions?.seasonalTrend === 'increasing' ? "success" : "secondary"}>
                {predictions?.seasonalTrend}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartProductionMonitor;
