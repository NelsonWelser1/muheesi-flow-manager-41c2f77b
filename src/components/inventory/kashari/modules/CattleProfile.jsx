
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Printer, Edit, Trash, History } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const CattleProfile = ({ cattleId, onBack }) => {
  const [cattle, setCattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Mock cattle data (would be fetched from Supabase in production)
  useEffect(() => {
    setLoading(true);
    
    // In a real app, this would be a fetch from Supabase
    setTimeout(() => {
      setCattle({
        id: cattleId || '1',
        tag_number: 'KAZ001',
        name: 'Bella',
        cattle_type: 'beef',
        breed: 'Ankole Longhorn',
        date_of_birth: '2022-05-15',
        age: '2 years',
        weight: 450,
        gender: 'female',
        health_status: 'good',
        status: 'active',
        source: 'purchased',
        purchase_date: '2022-07-10',
        purchase_price: 1200000,
        notes: 'Purchased from Mbarara cattle market. Good temperament and healthy appearance.',
        image_url: null
      });
      
      setLoading(false);
    }, 800);
  }, [cattleId]);

  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!cattle) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Cattle not found</h3>
        <p className="mt-2 text-gray-500">The cattle you're looking for doesn't exist or has been removed.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print Profile
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={`${
                  cattle.status === 'active' ? 'bg-green-100 text-green-800' : 
                  cattle.status === 'fattening' ? 'bg-blue-100 text-blue-800' :
                  cattle.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {cattle.status}
                </Badge>
                <Badge className={`${
                  cattle.health_status === 'good' ? 'bg-green-100 text-green-800' : 
                  cattle.health_status === 'fair' ? 'bg-amber-100 text-amber-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {cattle.health_status}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{cattle.name || 'Unnamed'}</CardTitle>
              <p className="text-gray-500">
                <span className="font-medium">ID:</span> {cattle.tag_number} | <span className="font-medium">Type:</span> {cattle.cattle_type} | <span className="font-medium">Breed:</span> {cattle.breed}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="feeding">Feeding Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Tag Number</td>
                        <td className="py-2">{cattle.tag_number}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Name</td>
                        <td className="py-2">{cattle.name || '-'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Cattle Type</td>
                        <td className="py-2">{cattle.cattle_type}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Breed</td>
                        <td className="py-2">{cattle.breed}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Gender</td>
                        <td className="py-2">{cattle.gender}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Date of Birth</td>
                        <td className="py-2">{cattle.date_of_birth || 'Unknown'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Age</td>
                        <td className="py-2">{cattle.age}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Current Weight</td>
                        <td className="py-2">{cattle.weight ? `${cattle.weight} kg` : 'Not recorded'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Acquisition Details</h3>
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Source</td>
                        <td className="py-2">{cattle.source}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Purchase Date</td>
                        <td className="py-2">{cattle.purchase_date || '-'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Purchase Price</td>
                        <td className="py-2">{cattle.purchase_price ? `UGX ${cattle.purchase_price.toLocaleString()}` : '-'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600 font-medium">Status</td>
                        <td className="py-2">{cattle.status}</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <h3 className="text-lg font-medium mb-4 mt-6">Notes</h3>
                  <p className="text-gray-700">{cattle.notes || 'No notes available'}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="health">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Health Records</h3>
                  <Button className="bg-green-600 hover:bg-green-700">Add Health Record</Button>
                </div>
                
                <div className="border rounded-lg p-6 text-center bg-gray-50">
                  <History className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No Health Records</h3>
                  <p className="mt-2 text-gray-500">There are no health records available for this cattle.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="growth">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Growth Records</h3>
                  <Button className="bg-green-600 hover:bg-green-700">Add Growth Record</Button>
                </div>
                
                <div className="border rounded-lg p-6 text-center bg-gray-50">
                  <History className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No Growth Records</h3>
                  <p className="mt-2 text-gray-500">There are no growth records available for this cattle.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="feeding">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Feeding Plan</h3>
                  <Button className="bg-green-600 hover:bg-green-700">Update Feeding Plan</Button>
                </div>
                
                <div className="border rounded-lg">
                  <div className="p-4 bg-amber-50 border-b border-amber-200">
                    <h4 className="font-medium text-amber-800">Recommended Daily Nutrition</h4>
                    <p className="text-sm text-amber-600">Based on cattle weight, age and purpose</p>
                  </div>
                  
                  <div className="p-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2 font-medium">Type</th>
                          <th className="text-right pb-2 font-medium">Amount</th>
                          <th className="text-right pb-2 font-medium">Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">Forage/Hay</td>
                          <td className="text-right py-3">9-10 kg</td>
                          <td className="text-right py-3">Daily</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Concentrate Feed</td>
                          <td className="text-right py-3">2-3 kg</td>
                          <td className="text-right py-3">Twice Daily</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Mineral Supplement</td>
                          <td className="text-right py-3">100 g</td>
                          <td className="text-right py-3">Daily</td>
                        </tr>
                        <tr>
                          <td className="py-3">Fresh Water</td>
                          <td className="text-right py-3">30-40 L</td>
                          <td className="text-right py-3">Ad libitum</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Notes on Current Feeding Plan:</h4>
                      <p className="text-gray-600">This feeding plan is designed to support optimal growth for beef fattening. Adjust amounts based on body condition score assessments performed weekly.</p>
                    </div>
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
