
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast } from "@/components/ui/notifications";
import RequisitionRecordsView from './requisitions/RequisitionRecordsView';
import { Eye } from 'lucide-react';

const MakeRequisitions = () => {
  const [requisitionType, setRequisitionType] = useState('tools');
  const [showRecords, setShowRecords] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Requisition submitted');
    showSuccessToast(toast, "Requisition submitted successfully");
  };

  if (showRecords) {
    return <RequisitionRecordsView onBack={() => setShowRecords(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Make Requisitions</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowRecords(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Records
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tools, Machinery, and Repair Requisitions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="requester">Requester Name</Label>
              <Input id="requester" placeholder="Enter your name" required />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Enter your department" required />
            </div>
            <div>
              <Label htmlFor="requisitionType">Requisition Type</Label>
              <Select id="requisitionType" value={requisitionType} onValueChange={setRequisitionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select requisition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tools">Tools and Machinery</SelectItem>
                  <SelectItem value="repairs">Repair Requisition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {requisitionType === 'tools' && (
              <div>
                <Label htmlFor="tools">Tools and Machinery</Label>
                <Textarea id="tools" placeholder="List any tools or machinery needed" />
              </div>
            )}
            {requisitionType === 'repairs' && (
              <div>
                <Label htmlFor="repairs">Repair Requisitions</Label>
                <Textarea id="repairs" placeholder="Describe any repairs needed" />
              </div>
            )}
            <div>
              <Label htmlFor="justification">Justification</Label>
              <Textarea id="justification" placeholder="Provide justification for the requisition" required />
            </div>
            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select id="urgency" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Submit Requisition</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MakeRequisitions;
