
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { Search } from "lucide-react";

const ComplianceForm = ({ onBack }) => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit records",
          variant: "destructive",
        });
        return;
      }

      const formattedData = {
        audit_date: data.auditDate,
        compliance_details: {
          checkDetails: data.complianceCheckDetails
        },
        inspector_id: data.inspectorId,
        findings: data.findings,
        remediation_steps: data.remediationSteps,
        operator_id: user.id
      };

      const { error } = await supabase
        .from('slaughterhouse_compliance')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Compliance record has been saved",
      });
      reset();
    } catch (error) {
      console.error('Error saving compliance record:', error);
      toast({
        title: "Error",
        description: "Failed to save compliance record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Regulatory & Safety Compliance Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auditDate">Audit Date</Label>
                <Input
                  id="auditDate"
                  type="date"
                  {...register('auditDate', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspectorId">Inspector Name/ID</Label>
                <Input
                  id="inspectorId"
                  type="text"
                  {...register('inspectorId', { required: true })}
                  placeholder="Enter inspector name or ID"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="complianceCheckDetails">Compliance Check Details</Label>
                <Textarea
                  id="complianceCheckDetails"
                  {...register('complianceCheckDetails', { required: true })}
                  placeholder="Enter compliance check details"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="findings">Findings</Label>
                <Textarea
                  id="findings"
                  {...register('findings', { required: true })}
                  placeholder="Enter audit findings"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remediationSteps">Remediation Steps</Label>
                <Textarea
                  id="remediationSteps"
                  {...register('remediationSteps', { required: true })}
                  placeholder="Enter remediation steps"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">Submit Record</Button>
          </form>
        </CardContent>
      </Card>

      {/* Records Display */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Records</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              className="pl-8"
              onChange={(e) => {
                // Implement search functionality
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Implement records display table */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceForm;
