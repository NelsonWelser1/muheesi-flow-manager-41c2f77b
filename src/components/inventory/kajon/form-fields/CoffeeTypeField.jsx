import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COFFEE_GRADES = {
  robusta: [
    "FAQ", "Screen 18", "Screen 15", "Screen 12", "Organic Robusta"
  ],
  arabica: [
    "Bugisu AA", "Bugisu A", "Bugisu PB", "Bugisu B", "DRUGAR", "Parchment Arabica"
  ]
};

const CoffeeTypeField = ({ selectedCoffeeType, setSelectedCoffeeType }) => {
  return (
    <>
      <div>
        <Label htmlFor="coffeeType">Coffee Type</Label>
        <Select 
          id="coffeeType" 
          required
          onValueChange={setSelectedCoffeeType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select coffee type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="robusta">Robusta Coffee</SelectItem>
            <SelectItem value="arabica">Arabica Coffee</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="beanSizeGrade">Bean Grade</Label>
        <Select id="beanSizeGrade" required>
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {selectedCoffeeType && COFFEE_GRADES[selectedCoffeeType].map((grade) => (
              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default CoffeeTypeField;