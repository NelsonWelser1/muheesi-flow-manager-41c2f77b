import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, AlertCircle, CheckCircle2, Timer, ChevronRight } from 'lucide-react';

const cheeseProducts = [
  { id: 'mozzarella', name: 'Mozzarella', description: 'Stretchy texture, ideal for pizzas and salads' },
  { id: 'gouda', name: 'Gouda', description: 'Mild, yellow cheese from Netherlands' },
  { id: 'cheddar', name: 'Cheddar', description: 'Firm, sharp-tasting cheese' },
  { id: 'parmesan', name: 'Parmesan', description: 'Hard, granular cheese for grating' },
  { id: 'edam', name: 'Edam', description: 'Semi-hard cheese with mild flavor' },
  { id: 'feta', name: 'Feta', description: 'Brined white cheese with tangy taste' },
  { id: 'colby', name: 'Colby', description: 'Semi-hard cheese similar to cheddar' },
  { id: 'jack', name: 'Jack Cheese', description: 'Mild flavored semi-hard cheese' }
];

const ProductionLineManagement = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeBatches, setActiveBatches] = useState([]);
  const { toast } = useToast();

  const mockProductionData = [
    { name: 'Batch 1', output: 100, efficiency: 95 },
    { name: 'Batch 2', output: 120, efficiency: 92 },
    { name: 'Batch 3', output: 95, efficiency: 88 },
  ];

  const handleScheduleProduction = () => {
    if (!selectedProduct || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select both product and date to schedule production.",
        variant: "destructive",
      });
      return;
    }

    const newBatch = {
      id: `BATCH-${Date.now()}`,
      product: selectedProduct,
      scheduledDate: selectedDate,
      status: 'pending',
      progress: 0,
    };

    setActiveBatches(prev => [...prev, newBatch]);
    toast({
      title: "Production Scheduled",
      description: `New batch ${newBatch.id} scheduled for ${selectedProduct}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Line Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList>
              <TabsTrigger value="schedule">Schedule Production</TabsTrigger>
              <TabsTrigger value="active">Active Batches</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Select Product</h3>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a cheese product" />
                    </SelectTrigger>
                    <SelectContent>
                      {cheeseProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedProduct && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {cheeseProducts.find(p => p.id === selectedProduct)?.description}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <Button onClick={handleScheduleProduction} className="w-full">
                Schedule Production
              </Button>
            </TabsContent>

            <TabsContent value="active">
              <div className="space-y-4">
                {activeBatches.map(batch => (
                  <Card key={batch.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{batch.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cheeseProducts.find(p => p.id === batch.product)?.name}
                          </p>
                        </div>
                        <Badge variant={
                          batch.status === 'completed' ? 'default' :
                          batch.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {batch.status}
                        </Badge>
                      </div>
                      <Progress value={batch.progress} className="mb-2" />
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Scheduled: {batch.scheduledDate.toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {activeBatches.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No active batches. Schedule production to get started.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockProductionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="output" fill="#8884d8" name="Output (kg)" />
                      <Bar dataKey="efficiency" fill="#82ca9d" name="Efficiency (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Production</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">315 kg</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
                      <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">91.7%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{activeBatches.length}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionLineManagement;