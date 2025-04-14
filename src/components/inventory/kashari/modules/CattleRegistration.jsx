
import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CattleRegistration = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Register New Cattle</h3>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tagNumber">Tag Number</Label>
            <Input id="tagNumber" placeholder="Enter tag number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Cattle Type</Label>
            <Input id="type" placeholder="Enter cattle type" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Input id="breed" placeholder="Enter breed" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" />
          </div>
        </div>
        <Button type="submit" className="w-full">Register Cattle</Button>
      </form>
    </Card>
  );
};

export default CattleRegistration;
