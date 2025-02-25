
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TrainingEvaluationForm = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Training Program</Label>
              <Input placeholder="Enter program name" />
            </div>
            <div className="space-y-2">
              <Label>Date Conducted</Label>
              <Input type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Evaluation Notes</Label>
            <Textarea 
              placeholder="Enter evaluation details"
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full">Submit Evaluation</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrainingEvaluationForm;
