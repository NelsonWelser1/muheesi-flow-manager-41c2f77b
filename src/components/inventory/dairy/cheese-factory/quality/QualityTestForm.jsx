import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from '@tanstack/react-query';
import BasicTestInfo from './forms/BasicTestInfo';
import TestMeasurements from './forms/TestMeasurements';
import QualityScores from './forms/QualityScores';
import ReportSubmission from './forms/ReportSubmission';
import { submitQualityReport } from '@/services/qualityReportService';

const QualityTestForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    batchNumber: '',
    cheeseType: '',
    pH: '',
    moisture: '',
    saltContent: '',
    textureScore: '',
    flavorScore: '',
    reportType: '',
    recipientLevel: '',
    notes: ''
  });

  const submitMutation = useMutation({
    mutationFn: submitQualityReport,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Quality test report submitted successfully",
      });
      setFormData({
        batchNumber: '',
        cheeseType: '',
        pH: '',
        moisture: '',
        saltContent: '',
        textureScore: '',
        flavorScore: '',
        reportType: '',
        recipientLevel: '',
        notes: ''
      });
    },
    onError: (error) => {
      console.error('Error submitting quality test:', error);
      toast({
        title: "Error",
        description: "Failed to submit quality test report",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    submitMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Quality Test Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <BasicTestInfo formData={formData} setFormData={setFormData} />
            <TestMeasurements formData={formData} setFormData={setFormData} />
            <QualityScores formData={formData} setFormData={setFormData} />
            <ReportSubmission formData={formData} setFormData={setFormData} />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Quality Test Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QualityTestForm;