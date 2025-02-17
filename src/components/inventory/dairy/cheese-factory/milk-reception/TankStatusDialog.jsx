
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Power, PowerOff } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export const TankStatusDialog = ({
  showDialog,
  setShowDialog,
  selectedTank,
  outOfServiceDate,
  setOutOfServiceDate,
  outOfServiceTime,
  setOutOfServiceTime,
  onStatusChange
}) => {
  const { toast } = useToast();

  const handleStatusChange = async (status) => {
    if (status === 'out_of_service' && !outOfServiceDate) {
      toast({
        title: "Error",
        description: "Please select an end date for out of service period",
        variant: "destructive"
      });
      return;
    }
    onStatusChange(selectedTank, status);
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Tank Status - {selectedTank}</AlertDialogTitle>
          <AlertDialogDescription>
            Select the new status for the tank
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex flex-col gap-4">
            <Button 
              variant="outline"
              onClick={() => handleStatusChange('active')}
              className="flex items-center gap-2"
            >
              <Power className="h-4 w-4 text-green-500" />
              Activate
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleStatusChange('suspended')}
              className="flex items-center gap-2"
            >
              <PowerOff className="h-4 w-4 text-yellow-500" />
              Suspend
            </Button>
            <div className="space-y-2">
              <Button 
                variant="outline"
                onClick={() => handleStatusChange('out_of_service')}
                className="w-full flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Out of Service
              </Button>
              <div className="pt-2 space-y-4">
                <div>
                  <Label>Service End Date</Label>
                  <DatePicker
                    date={outOfServiceDate}
                    setDate={setOutOfServiceDate}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Service End Time</Label>
                  <Input
                    type="time"
                    value={outOfServiceTime}
                    onChange={(e) => setOutOfServiceTime(e.target.value)}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
