import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const QualityControlPanel = () => {
  const [testData, setTestData] = useState({
    batchId: '',
    testType: '',
    parameter: '',
    value: '',
    standardValue: '',
    notes: ''
  });
  const { toast } = useToast();

  const { data: qualityChecks, isLoading, error } = useQuery({
    queryKey: ['qualityChecks'],
    queryFn: async () => {
      console.log('Fetching quality control data');
      const { data, error } = await supabase
        .from('quality_control')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quality control data:', error);
        throw error;
      }

      console.log('Quality control data:', data);
      return data;
    },
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error fetching quality data",
        description: error.message || "Please check your connection and try again"
      });
    }
  });

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('quality_control')
        .insert([{
          batch_id: testData.batchId,
          parameter: testData.parameter,
          value: parseFloat(testData.value),
          standard_value: parseFloat(testData.standardValue),
          status: parseFloat(testData.value) >= parseFloat(testData.standardValue) ? 'passed' : 'failed',
          notes: testData.notes
        }]);

      if (error) throw error;

      toast({
        title: "Test recorded successfully",
        description: "Quality control test has been saved"
      });

      setTestData({
        batchId: '',
        testType: '',
        parameter: '',
        value: '',
        standardValue: '',
        notes: ''
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error recording test",
        description: error.message
      });
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load quality control data. Please check your connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="new-test">Record Test</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((qualityChecks?.filter(check => check.status === 'passed').length || 0) / 
                    (qualityChecks?.length || 1) * 100)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Tests Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {qualityChecks?.filter(check => 
                    new Date(check.created_at).toDateString() === new Date().toDateString()
                  ).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {qualityChecks?.filter(check => check.status === 'failed').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Quality Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualityChecks?.slice(0, 5).map((check) => (
                    <TableRow key={check.id}>
                      <TableCell>{check.batch_id}</TableCell>
                      <TableCell>{check.parameter}</TableCell>
                      <TableCell>{check.value}</TableCell>
                      <TableCell>{check.standard_value}</TableCell>
                      <TableCell>
                        <Badge className={check.status === 'passed' ? 'bg-green-500' : 'bg-red-500'}>
                          {check.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(check.created_at).toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-test">
          <Card>
            <CardHeader>
              <CardTitle>Record Quality Test</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchId">Batch ID</Label>
                    <Input
                      id="batchId"
                      value={testData.batchId}
                      onChange={(e) => setTestData({ ...testData, batchId: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testType">Test Type</Label>
                    <Select
                      value={testData.testType}
                      onValueChange={(value) => setTestData({ ...testData, testType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">Physical Test</SelectItem>
                        <SelectItem value="chemical">Chemical Test</SelectItem>
                        <SelectItem value="microbiological">Microbiological Test</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parameter">Parameter</Label>
                    <Input
                      id="parameter"
                      value={testData.parameter}
                      onChange={(e) => setTestData({ ...testData, parameter: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Measured Value</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={testData.value}
                      onChange={(e) => setTestData({ ...testData, value: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="standardValue">Standard Value</Label>
                    <Input
                      id="standardValue"
                      type="number"
                      step="0.01"
                      value={testData.standardValue}
                      onChange={(e) => setTestData({ ...testData, standardValue: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={testData.notes}
                      onChange={(e) => setTestData({ ...testData, notes: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Record Test Result
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Quality Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qualityChecks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="created_at" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      name="Test Value" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Total Tests</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Average Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from(new Set(qualityChecks?.map(check => check.parameter))).map(parameter => {
                    const parameterTests = qualityChecks?.filter(check => check.parameter === parameter) || [];
                    const passRate = (parameterTests.filter(test => test.status === 'passed').length / parameterTests.length) * 100;
                    const avgValue = parameterTests.reduce((acc, curr) => acc + parseFloat(curr.value), 0) / parameterTests.length;

                    return (
                      <TableRow key={parameter}>
                        <TableCell>{parameter}</TableCell>
                        <TableCell>{parameterTests.length}</TableCell>
                        <TableCell>{passRate.toFixed(1)}%</TableCell>
                        <TableCell>{avgValue.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityControlPanel;