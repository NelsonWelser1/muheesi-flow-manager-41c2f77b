
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const PackagingLabeling = () => {
  const [date, setDate] = React.useState(new Date());
  const [expiryDate, setExpiryDate] = React.useState(new Date());
  const { toast } = useToast();

  const cheeseTypes = [
    "Mozzarella",
    "Cheddar",
    "Gouda",
    "Swiss",
    "Parmesan",
    "Feta"
  ];

  const packagingSizes = [
    "250g",
    "500g",
    "1kg",
    "2kg",
    "5kg",
    "Custom"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    toast({
      title: "Form Submitted",
      description: "Packaging details have been saved successfully.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Packaging & Labeling Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP HH:mm") : "Select date and time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      onChange={(e) => {
                        const newDate = new Date(date);
                        const [hours, minutes] = e.target.value.split(':');
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setDate(newDate);
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input id="batchId" placeholder="Enter batch ID" />
            </div>

            <div className="space-y-2">
              <Label>Cheese Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select cheese type" />
                </SelectTrigger>
                <SelectContent>
                  {cheeseTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Packaging Size/Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select packaging size" />
                </SelectTrigger>
                <SelectContent>
                  {packagingSizes.map((size) => (
                    <SelectItem key={size} value={size.toLowerCase()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorId">Operator Name/ID</Label>
              <Input id="operatorId" placeholder="Enter operator name or ID" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Packaged</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="0"
                placeholder="Enter quantity" 
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : "Select expiry date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
              <Input 
                id="nutritionalInfo" 
                placeholder="Enter nutritional information"
                className="h-20"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Packaging Details
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PackagingLabeling;
