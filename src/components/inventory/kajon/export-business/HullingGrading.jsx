import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { useHullingOperations } from '@/hooks/useHullingOperations';
import { useGradingRecords } from '@/hooks/useGradingRecords';

const HullingGrading = ({ viewOnly = false }) => {
  const { operations, isLoading: hullingLoading, createOperation } = useHullingOperations();
  const { records: gradingRecords, isLoading: gradingLoading, createRecord: createGradingRecord } = useGradingRecords();

  const [hullingForm, setHullingForm] = useState({
    batch_id: '',
    input_weight: '',
    output_weight: '',
    operator: ''
  });

  const [gradingForm, setGradingForm] = useState({
    batch_id: '',
    screen_18: '',
    screen_15: '',
    screen_12: '',
    defects: '',
    grade: ''
  });

  const handleHullingSubmit = () => {
    if (!hullingForm.batch_id || !hullingForm.input_weight) return;
    
    const inputWeight = parseFloat(hullingForm.input_weight);
    const outputWeight = parseFloat(hullingForm.output_weight) || 0;
    const yieldPercentage = inputWeight > 0 ? (outputWeight / inputWeight) * 100 : 0;

    createOperation.mutate({
      batch_id: hullingForm.batch_id,
      input_weight: inputWeight,
      output_weight: outputWeight,
      yield_percentage: yieldPercentage,
      operator: hullingForm.operator
    });

    setHullingForm({ batch_id: '', input_weight: '', output_weight: '', operator: '' });
  };

  const handleGradingSubmit = () => {
    if (!gradingForm.batch_id) return;

    createGradingRecord.mutate({
      batch_id: gradingForm.batch_id,
      screen_18_percentage: parseFloat(gradingForm.screen_18) || 0,
      screen_15_percentage: parseFloat(gradingForm.screen_15) || 0,
      screen_12_percentage: parseFloat(gradingForm.screen_12) || 0,
      defect_count: parseInt(gradingForm.defects) || 0,
      final_grade: gradingForm.grade
    });

    setGradingForm({ batch_id: '', screen_18: '', screen_15: '', screen_12: '', defects: '', grade: '' });
  };

  return (
    <div className="space-y-6">
      {viewOnly && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You are viewing the Hulling & Grading dashboard in read-only mode.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="hulling">
        <TabsList>
          <TabsTrigger value="hulling">Hulling Operations</TabsTrigger>
          <TabsTrigger value="grading">Grading & Classification</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Status</TabsTrigger>
          <TabsTrigger value="reports">Processing Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hulling" className="space-y-4">
          {!viewOnly && (
            <Card>
              <CardHeader>
                <CardTitle>Record Hulling Operation</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input 
                    value={hullingForm.batch_id}
                    onChange={(e) => setHullingForm(prev => ({ ...prev, batch_id: e.target.value }))}
                    placeholder="Enter batch ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Input Weight (kg)</Label>
                  <Input 
                    type="number"
                    value={hullingForm.input_weight}
                    onChange={(e) => setHullingForm(prev => ({ ...prev, input_weight: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Output Weight (kg)</Label>
                  <Input 
                    type="number"
                    value={hullingForm.output_weight}
                    onChange={(e) => setHullingForm(prev => ({ ...prev, output_weight: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Operator</Label>
                  <Input 
                    value={hullingForm.operator}
                    onChange={(e) => setHullingForm(prev => ({ ...prev, operator: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button onClick={handleHullingSubmit} disabled={createOperation.isPending} className="w-full">
                    {createOperation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Hulling Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Hulling Operations History</CardTitle>
            </CardHeader>
            <CardContent>
              {hullingLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : operations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hulling operations recorded</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Input (kg)</TableHead>
                      <TableHead>Output (kg)</TableHead>
                      <TableHead>Yield %</TableHead>
                      <TableHead>Operator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operations.slice(0, 10).map((op) => (
                      <TableRow key={op.id}>
                        <TableCell>{op.batch_id}</TableCell>
                        <TableCell>{op.input_weight}</TableCell>
                        <TableCell>{op.output_weight}</TableCell>
                        <TableCell>{op.yield_percentage?.toFixed(1)}%</TableCell>
                        <TableCell>{op.operator || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grading" className="space-y-4">
          {!viewOnly && (
            <Card>
              <CardHeader>
                <CardTitle>Record Grading Data</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input 
                    value={gradingForm.batch_id}
                    onChange={(e) => setGradingForm(prev => ({ ...prev, batch_id: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Screen 18 (%)</Label>
                  <Input 
                    type="number"
                    value={gradingForm.screen_18}
                    onChange={(e) => setGradingForm(prev => ({ ...prev, screen_18: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Screen 15 (%)</Label>
                  <Input 
                    type="number"
                    value={gradingForm.screen_15}
                    onChange={(e) => setGradingForm(prev => ({ ...prev, screen_15: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Screen 12 (%)</Label>
                  <Input 
                    type="number"
                    value={gradingForm.screen_12}
                    onChange={(e) => setGradingForm(prev => ({ ...prev, screen_12: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Defect Count</Label>
                  <Input 
                    type="number"
                    value={gradingForm.defects}
                    onChange={(e) => setGradingForm(prev => ({ ...prev, defects: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Final Grade</Label>
                  <Input 
                    value={gradingForm.grade}
                    onChange={(e) => setGradingForm(prev => ({ ...prev, grade: e.target.value }))}
                    placeholder="e.g., AA, AB, PB"
                  />
                </div>
                <div className="md:col-span-3">
                  <Button onClick={handleGradingSubmit} disabled={createGradingRecord.isPending} className="w-full">
                    {createGradingRecord.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Grading Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Grading Records</CardTitle>
            </CardHeader>
            <CardContent>
              {gradingLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : gradingRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No grading records</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Screen 18</TableHead>
                      <TableHead>Screen 15</TableHead>
                      <TableHead>Screen 12</TableHead>
                      <TableHead>Defects</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradingRecords.slice(0, 10).map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.batch_id}</TableCell>
                        <TableCell>{record.screen_18_percentage}%</TableCell>
                        <TableCell>{record.screen_15_percentage}%</TableCell>
                        <TableCell>{record.screen_12_percentage}%</TableCell>
                        <TableCell>{record.defect_count}</TableCell>
                        <TableCell>{record.final_grade || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quality">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Quality Control</h3>
              <p className="text-muted-foreground">
                Quality monitoring integrates with grading data. View grading records for quality metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Equipment Status</h3>
              <p className="text-muted-foreground">
                Equipment monitoring coming soon. Track hulling machine performance and maintenance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Processing Reports</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold">{operations.length}</p>
                  <p className="text-sm text-muted-foreground">Total Batches</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    {operations.reduce((sum, op) => sum + (op.input_weight || 0), 0).toFixed(0)} kg
                  </p>
                  <p className="text-sm text-muted-foreground">Total Input</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    {operations.reduce((sum, op) => sum + (op.output_weight || 0), 0).toFixed(0)} kg
                  </p>
                  <p className="text-sm text-muted-foreground">Total Output</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold">
                    {operations.length > 0 
                      ? (operations.reduce((sum, op) => sum + (op.yield_percentage || 0), 0) / operations.length).toFixed(1)
                      : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Yield</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HullingGrading;
