
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CattleHealth = () => {
  const [activeTab, setActiveTab] = useState('vaccinations');
  const { toast } = useToast();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    toast({
      title: "Record added successfully",
      description: "The health record has been added",
    });
    
    e.target.reset();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b border-gray-200 pb-3">
          <CardTitle>Health Records</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
              <TabsTrigger value="treatments">Treatments</TabsTrigger>
              <TabsTrigger value="examinations">Examinations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vaccinations">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tag_number">Cattle Tag Number *</Label>
                    <Select name="tag_number" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KAZ001">KAZ001</SelectItem>
                        <SelectItem value="KAZ002">KAZ002</SelectItem>
                        <SelectItem value="KAZ003">KAZ003</SelectItem>
                        <SelectItem value="KAZ004">KAZ004</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vaccination_date">Vaccination Date *</Label>
                    <Input 
                      id="vaccination_date" 
                      name="vaccination_date" 
                      type="date"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vaccine_name">Vaccine Name *</Label>
                    <Select name="vaccine_name" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vaccine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FMD">Foot and Mouth Disease</SelectItem>
                        <SelectItem value="Blackleg">Blackleg</SelectItem>
                        <SelectItem value="Anthrax">Anthrax</SelectItem>
                        <SelectItem value="BRD">Bovine Respiratory Disease</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="administered_by">Administered By *</Label>
                    <Input 
                      id="administered_by" 
                      name="administered_by" 
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input 
                      id="notes" 
                      name="notes" 
                      placeholder="Additional notes"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Vaccination Record
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="treatments">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tag_number">Cattle Tag Number *</Label>
                    <Select name="tag_number" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KAZ001">KAZ001</SelectItem>
                        <SelectItem value="KAZ002">KAZ002</SelectItem>
                        <SelectItem value="KAZ003">KAZ003</SelectItem>
                        <SelectItem value="KAZ004">KAZ004</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="treatment_date">Treatment Date *</Label>
                    <Input 
                      id="treatment_date" 
                      name="treatment_date" 
                      type="date"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select name="condition" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parasite">Parasite</SelectItem>
                        <SelectItem value="injury">Injury</SelectItem>
                        <SelectItem value="respiratory">Respiratory</SelectItem>
                        <SelectItem value="digestive">Digestive</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="treatment">Treatment *</Label>
                    <Input 
                      id="treatment" 
                      name="treatment" 
                      placeholder="Enter treatment details"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input 
                      id="notes" 
                      name="notes" 
                      placeholder="Additional notes"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Treatment Record
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="examinations">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tag_number">Cattle Tag Number *</Label>
                    <Select name="tag_number" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KAZ001">KAZ001</SelectItem>
                        <SelectItem value="KAZ002">KAZ002</SelectItem>
                        <SelectItem value="KAZ003">KAZ003</SelectItem>
                        <SelectItem value="KAZ004">KAZ004</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exam_date">Examination Date *</Label>
                    <Input 
                      id="exam_date" 
                      name="exam_date" 
                      type="date"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exam_type">Examination Type *</Label>
                    <Select name="exam_type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="pregnancy">Pregnancy</SelectItem>
                        <SelectItem value="pre-sale">Pre-Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="performed_by">Performed By *</Label>
                    <Input 
                      id="performed_by" 
                      name="performed_by" 
                      placeholder="Enter examiner name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="results">Results *</Label>
                    <Select name="results" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select results" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="abnormal">Abnormal</SelectItem>
                        <SelectItem value="needs_followup">Needs Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input 
                      id="notes" 
                      name="notes" 
                      placeholder="Additional notes"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Examination Record
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleHealth;
