
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ArrowLeft, Save, Clock, Thermometer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BatchForm = ({ onBatchCreated, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productType: "",
    batchSize: "",
    milkType: "",
    cultures: "",
    additives: "",
    fermentationTemp: "42",
    fermentationTime: "4",
    targetPH: "4.6",
    notes: "",
    productionDateRange: null,
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.productType || !formData.batchSize || !formData.milkType) {
        throw new Error("Please fill in all required fields");
      }

      // Here would be the code to save to database
      // For now, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock response with batch ID
      const mockBatch = {
        id: `YB${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...formData
      };

      toast({
        title: "Success",
        description: "New yogurt batch created successfully",
      });

      onBatchCreated(mockBatch);
    } catch (error) {
      console.error("Error creating batch:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create batch",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={onCancel}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Create New Yogurt Batch</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="productType">Product Type <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.productType}
                  onValueChange={(value) => handleChange("productType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greek">Greek Yogurt</SelectItem>
                    <SelectItem value="natural">Natural Yogurt</SelectItem>
                    <SelectItem value="lowfat">Low-Fat Yogurt</SelectItem>
                    <SelectItem value="flavored_strawberry">Strawberry Yogurt</SelectItem>
                    <SelectItem value="flavored_vanilla">Vanilla Yogurt</SelectItem>
                    <SelectItem value="flavored_blueberry">Blueberry Yogurt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="batchSize">Batch Size (Liters) <span className="text-red-500">*</span></Label>
                <Input
                  id="batchSize"
                  type="number"
                  min="1"
                  placeholder="Enter batch size"
                  value={formData.batchSize}
                  onChange={(e) => handleChange("batchSize", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="milkType">Milk Type <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.milkType}
                  onValueChange={(value) => handleChange("milkType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select milk type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whole">Whole Milk</SelectItem>
                    <SelectItem value="skimmed">Skimmed Milk</SelectItem>
                    <SelectItem value="semi_skimmed">Semi-Skimmed Milk</SelectItem>
                    <SelectItem value="plant_based">Plant-Based Alternative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cultures">Starter Cultures</Label>
                <Select
                  value={formData.cultures}
                  onValueChange={(value) => handleChange("cultures", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select starter cultures" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Culture Mix</SelectItem>
                    <SelectItem value="probiotic">Probiotic Enhanced</SelectItem>
                    <SelectItem value="greek_special">Greek Yogurt Special</SelectItem>
                    <SelectItem value="custom">Custom Mix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="productionDateRange">Production Date Range</Label>
                <DateRangePicker
                  dateRange={formData.productionDateRange}
                  onDateRangeChange={(range) => handleChange("productionDateRange", range)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fermentationTemp">
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 mr-1" />
                      Fermentation Temp (°C)
                    </div>
                  </Label>
                  <Input
                    id="fermentationTemp"
                    type="number"
                    min="35"
                    max="50"
                    value={formData.fermentationTemp}
                    onChange={(e) => handleChange("fermentationTemp", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="fermentationTime">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Fermentation Time (hrs)
                    </div>
                  </Label>
                  <Input
                    id="fermentationTime"
                    type="number"
                    min="2"
                    max="12"
                    step="0.5"
                    value={formData.fermentationTime}
                    onChange={(e) => handleChange("fermentationTime", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="targetPH">Target pH</Label>
                <Input
                  id="targetPH"
                  type="number"
                  min="3.8"
                  max="5.0"
                  step="0.1"
                  value={formData.targetPH}
                  onChange={(e) => handleChange("targetPH", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="additives">Additives/Flavors</Label>
                <Input
                  id="additives"
                  placeholder="e.g., Strawberry puree, Vanilla extract"
                  value={formData.additives}
                  onChange={(e) => handleChange("additives", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="notes">Production Notes</Label>
            <textarea
              id="notes"
              rows={3}
              className="w-full border rounded-md p-2"
              placeholder="Add any special instructions or notes here..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Create Batch
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default BatchForm;
