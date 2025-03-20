
import React, { useState } from 'react';
import { ArrowLeft, User, FileText, Upload, Calendar, Save, Link, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEmployeeDossiers } from './hooks/useEmployeeDossiers';
import { supabase } from "@/integrations/supabase/supabase";

const DEPARTMENTS = ["Production", "Quality Control", "Administration", "Logistics", "Sales", "Maintenance"];
const STATUS_OPTIONS = ["Active", "Onboarding", "On Leave", "Terminated", "Retired"];
const JOB_TITLES = [
  "Production Manager",
  "Quality Control Specialist",
  "Shift Supervisor",
  "Machine Operator",
  "Maintenance Technician",
  "Warehouse Staff"
];

const DossierDetails = ({ dossier, onBack }) => {
  const [selectedTab, setSelectedTab] = useState("details");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNewDossier = !dossier;
  const { saveDossier, isSaving } = useEmployeeDossiers();

  // Initialize form data
  const [formData, setFormData] = useState({
    employee_id: dossier?.employee_id || '',
    job_title: dossier?.job_title || '',
    department: dossier?.department || DEPARTMENTS[0],
    status: dossier?.status || STATUS_OPTIONS[0],
    shift_start: dossier?.shift_start ? new Date(dossier.shift_start).toISOString().split('T')[0] : '',
    shift_end: dossier?.shift_end ? new Date(dossier.shift_end).toISOString().split('T')[0] : '',
    performance_rating: dossier?.performance_rating || 3,
    review_date_time: dossier?.review_date_time ? new Date(dossier.review_date_time).toISOString().split('T')[0] : '',
    comments: dossier?.comments || '',
  });

  // Fetch recruitment records to link
  const { data: recruitmentRecords = [] } = useQuery({
    queryKey: ['recruitmentRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel_recruitment_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch document records
  const { data: documents = [] } = useQuery({
    queryKey: ['dossierDocuments', dossier?.id],
    queryFn: async () => {
      if (!dossier?.id) return [];
      
      const { data, error } = await supabase
        .from('personnel_documents')
        .select('*')
        .eq('employee_id', dossier.employee_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!dossier
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Debug logging before submission
    console.log("Submitting form data:", formData);
    
    // Use the hook's saveDossier function
    saveDossier(formData, dossier?.id);
    
    // If new dossier, go back to the list after saving
    if (isNewDossier) {
      setTimeout(() => onBack(), 500);
    }
  };

  const handleLinkRecruitment = (recruitmentRecord) => {
    setFormData(prev => ({
      ...prev,
      employee_id: recruitmentRecord.candidate_name,
      job_title: recruitmentRecord.job_title,
    }));
    
    toast({
      title: "Recruitment Record Linked",
      description: "Successfully linked recruitment data to this dossier."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h2 className="text-2xl font-bold">{isNewDossier ? 'Create New Dossier' : 'Edit Dossier'}</h2>
        <Button 
          onClick={handleSubmit} 
          disabled={isSaving}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Personal Details
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center gap-2">
            <Link className="h-4 w-4" /> Link Records
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="p-1">
          <Card>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Employee Name/ID</Label>
                    <Input 
                      value={formData.employee_id} 
                      onChange={(e) => handleInputChange('employee_id', e.target.value)}
                      placeholder="Enter employee name or ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Select 
                      value={formData.job_title}
                      onValueChange={(value) => handleInputChange('job_title', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job title" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TITLES.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                      value={formData.department}
                      onValueChange={(value) => handleInputChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Shift Start</Label>
                    <Input 
                      type="date" 
                      value={formData.shift_start}
                      onChange={(e) => handleInputChange('shift_start', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Shift End</Label>
                    <Input 
                      type="date" 
                      value={formData.shift_end}
                      onChange={(e) => handleInputChange('shift_end', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Performance Rating (1-5)</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="5" 
                      value={formData.performance_rating}
                      onChange={(e) => handleInputChange('performance_rating', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Next Review Date</Label>
                    <Input 
                      type="date" 
                      value={formData.review_date_time}
                      onChange={(e) => handleInputChange('review_date_time', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes & Comments</Label>
                  <Textarea 
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    placeholder="Enter any additional notes or comments"
                    className="min-h-[100px]"
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="p-1">
          <Card>
            <CardHeader>
              <CardTitle>Attached Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {!isNewDossier ? (
                documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{doc.filename}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(doc.created_at).toLocaleDateString()} · {doc.file_type} · {doc.file_size}KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="icon">
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>No documents attached to this dossier.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Save the dossier first to attach documents.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button 
                disabled={isNewDossier} 
                className="w-full flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" /> Upload New Document
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="link" className="p-1">
          <Card>
            <CardHeader>
              <CardTitle>Link Recruitment Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recruitmentRecords.length > 0 ? (
                  recruitmentRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{record.candidate_name}</p>
                        <p className="text-sm text-gray-500">
                          {record.job_title} · Interview: {new Date(record.interview_date_time).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleLinkRecruitment(record)}
                        className="flex items-center gap-1"
                      >
                        <Link className="h-3 w-3" /> Link
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recruitment records found to link.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DossierDetails;
