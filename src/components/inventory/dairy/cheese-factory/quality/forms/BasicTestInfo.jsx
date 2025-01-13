import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BasicTestInfo = ({ formData, setFormData }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="batchNumber">Batch Number</Label>
        <Input
          id="batchNumber"
          value={formData.batchNumber}
          onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cheeseType">Cheese Type</Label>
        <Select
          value={formData.cheeseType}
          onValueChange={(value) => setFormData({ ...formData, cheeseType: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cheese type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mozzarella">Mozzarella</SelectItem>
            <SelectItem value="cheddar">Cheddar</SelectItem>
            <SelectItem value="gouda">Gouda</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicTestInfo;