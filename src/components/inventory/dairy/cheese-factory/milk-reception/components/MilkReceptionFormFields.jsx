import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const MilkReceptionFormFields = ({ 
  formData, 
  handleInputChange, 
  handleQualityChange, 
  handleTankSelection 
}) => {
  return (
    <>
      {/* Storage Tank and Quality Score at the top */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tank_number">Storage Tank</Label>
          <Select 
            value={formData.tank_number} 
            onValueChange={handleTankSelection}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tank A">Tank A</SelectItem>
              <SelectItem value="Tank B">Tank B</SelectItem>
              <SelectItem value="Direct-Processing">Direct Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality_score">Quality Score</Label>
          <Select 
            value={formData.quality_score} 
            onValueChange={handleQualityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quality score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Grade A">Grade A</SelectItem>
              <SelectItem value="Grade B">Grade B</SelectItem>
              <SelectItem value="Grade C">Grade C</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rest of the form fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="supplier_name">Supplier Name</Label>
          <Input
            id="supplier_name"
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="milk_volume">Milk Volume (L)</Label>
          <Input
            id="milk_volume"
            name="milk_volume"
            type="number"
            step="0.01"
            value={formData.milk_volume}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fat_percentage">Fat Percentage (%)</Label>
          <Input
            id="fat_percentage"
            name="fat_percentage"
            type="number"
            step="0.1"
            value={formData.fat_percentage}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="protein_percentage">Protein Percentage (%)</Label>
          <Input
            id="protein_percentage"
            name="protein_percentage"
            type="number"
            step="0.1"
            value={formData.protein_percentage}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_plate_count">Total Plate Count</Label>
          <Input
            id="total_plate_count"
            name="total_plate_count"
            type="number"
            value={formData.total_plate_count}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="acidity">Acidity (pH)</Label>
          <Input
            id="acidity"
            name="acidity"
            type="number"
            step="0.1"
            value={formData.acidity}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default MilkReceptionFormFields;
