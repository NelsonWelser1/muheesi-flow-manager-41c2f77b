
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft,
  Beef, 
  Clipboard, 
  TrendingUp, 
  Stethoscope, 
  Utensils,
  Calendar,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const CattleProfile = ({ cattleId, onBack }) => {
  const [cattle, setCattle] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch cattle details and related records
  useEffect(() => {
    const fetchCattleData = async () => {
      setIsLoading(true);
      try {
        // Fetch cattle details
        const { data: cattleData, error: cattleError } = await supabase
          .from('cattle_inventory')
          .select('*')
          .eq('id', cattleId)
          .single();

        if (cattleError) throw cattleError;
        setCattle(cattleData);

        // Fetch health records
        const { data: healthData, error: healthError } = await supabase
          .from('cattle_health_records')
          .select('*')
          .eq('cattle_id', cattleId)
          .order('record_date', { ascending: false });

        if (healthError) throw healthError;
        setHealthRecords(healthData || []);

        // Fetch growth records
        const { data: growthData, error: growthError } = await supabase
          .from('cattle_growth_metrics')
          .select('*')
          .eq('cattle_id', cattleId)
          .order('measurement_date', { ascending: false });

        if (growthError) throw growthError;
        setGrowthRecords(growthData || []);

      } catch (error) {
        console.error('Error fetching cattle data:', error);
        toast({
          title: "Error",
          description: "Failed to load cattle information",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (cattleId) {
      fetchCattleData();
    }
  }, [cattleId, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!cattle) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p>Cattle not found or has been removed.</p>
            <Button onClick={onBack} className="mt-4">Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
        
        <Badge className={`${
          cattle.health_status === 'good' ? 'bg-green-100 text-green-800' : 
          cattle.health_status === 'fair' ? 'bg-amber-100 text-amber-800' : 
          'bg-red-100 text-red-800'
        }`}>
          Health: {cattle.health_status}
        </Badge>
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-green-700" />
                <CardTitle className="text-2xl">{cattle.tag_number}</CardTitle>
              </div>
              {cattle.name && <p className="text-lg text-green-700 mt-1">{cattle.name}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm text-green-700">Type: {cattle.cattle_type}</p>
              <p className="text-sm text-green-700">Breed: {cattle.breed}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 border-b rounded-none">
              <TabsTrigger value="overview" className="data-[state=active]:bg-green-50">
                <Clipboard className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-green-50">
                <Stethoscope className="h-4 w-4 mr-2" />
                Health
              </TabsTrigger>
              <TabsTrigger value="growth" className="data-[state=active]:bg-green-50">
                <TrendingUp className="h-4 w-4 mr-2" />
                Growth
              </TabsTrigger>
              <TabsTrigger value="feeding" className="data-[state=active]:bg-green-50">
                <Utensils className="h-4 w-4 mr-2" />
                Feeding Plan
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Tag Number</p>
                      <p>{cattle.tag_number}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Name</p>
                      <p>{cattle.name || "Not assigned"}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Breed</p>
                      <p>{cattle.breed}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Type</p>
                      <p>{cattle.cattle_type}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Date of Birth</p>
                      <p>{cattle.date_of_birth ? format(new Date(cattle.date_of_birth), 'PPP') : "Unknown"}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Status</p>
                      <p>{cattle.status}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Health & Growth Snapshot</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Health Status</p>
                      <p>{cattle.health_status}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Current Weight</p>
                      <p>{cattle.weight ? `${cattle.weight} kg` : "Not recorded"}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Recent Health Check</p>
                      <p>{healthRecords.length > 0 ? format(new Date(healthRecords[0].record_date), 'PPP') : "None"}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-500">Recent Weight Check</p>
                      <p>{growthRecords.length > 0 ? format(new Date(growthRecords[0].measurement_date), 'PPP') : "None"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {cattle.notes && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">{cattle.notes}</div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="health" className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Health Records</h3>
                <Button variant="outline" className="text-sm h-8">Add Health Record</Button>
              </div>
              
              {healthRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Next Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.record_date), 'PP')}</TableCell>
                        <TableCell>
                          <Badge className={`
                            ${record.record_type === 'vaccination' ? 'bg-blue-100 text-blue-800' : 
                              record.record_type === 'treatment' ? 'bg-amber-100 text-amber-800' : 
                              record.record_type === 'examination' ? 'bg-green-100 text-green-800' : 
                              'bg-purple-100 text-purple-800'
                            }
                          `}>
                            {record.record_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.treatment || "N/A"}</TableCell>
                        <TableCell>
                          {record.next_due_date ? format(new Date(record.next_due_date), 'PP') : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <Stethoscope className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No health records found for this animal.</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">Add First Health Record</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="growth" className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Growth Records</h3>
                <Button variant="outline" className="text-sm h-8">Add Growth Record</Button>
              </div>
              
              {growthRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight (kg)</TableHead>
                      <TableHead>Height (cm)</TableHead>
                      <TableHead>Girth (cm)</TableHead>
                      <TableHead>Body Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {growthRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.measurement_date), 'PP')}</TableCell>
                        <TableCell>{record.weight} kg</TableCell>
                        <TableCell>{record.height || "N/A"}</TableCell>
                        <TableCell>{record.girth || "N/A"}</TableCell>
                        <TableCell>{record.body_condition_score || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No growth records found for this animal.</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Add First Growth Record</Button>
                </div>
              )}

              {growthRecords.length > 1 && (
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Growth Analysis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Average Daily Gain</p>
                      <p className="font-medium text-lg">0.75 kg/day</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Total Weight Gain</p>
                      <p className="font-medium text-lg">125 kg</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Days Monitored</p>
                      <p className="font-medium text-lg">165 days</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Feed Efficiency</p>
                      <p className="font-medium text-lg">Good</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="feeding" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Current Feeding Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-green-50 border-green-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Diet Composition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Hay</span>
                            <span>40%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Silage</span>
                            <span>30%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Concentrates</span>
                            <span>20%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Supplements</span>
                            <span>10%</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-50 border-blue-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Feeding Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Morning Feed</span>
                            <span>6:00 AM</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Afternoon Feed</span>
                            <span>1:00 PM</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Evening Feed</span>
                            <span>6:00 PM</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Nutrition Requirements</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nutrient</TableHead>
                        <TableHead>Daily Requirement</TableHead>
                        <TableHead>Current Intake</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Protein</TableCell>
                        <TableCell>1.2 kg</TableCell>
                        <TableCell>1.3 kg</TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-800">Optimal</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Energy (ME)</TableCell>
                        <TableCell>110 MJ</TableCell>
                        <TableCell>105 MJ</TableCell>
                        <TableCell><Badge className="bg-amber-100 text-amber-800">Adequate</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Calcium</TableCell>
                        <TableCell>55 g</TableCell>
                        <TableCell>60 g</TableCell>
                        <TableCell><Badge className="bg-green-100 text-green-800">Optimal</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Phosphorus</TableCell>
                        <TableCell>35 g</TableCell>
                        <TableCell>32 g</TableCell>
                        <TableCell><Badge className="bg-amber-100 text-amber-800">Adequate</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Feeding Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p>Animal is on the standard fattening program regime with adjusted protein levels to support muscle development.</p>
                    <p className="mt-2">Feed transitions should be gradual to prevent digestive upset. This animal has shown good feed conversion efficiency.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleProfile;
