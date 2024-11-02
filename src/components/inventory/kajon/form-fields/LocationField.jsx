import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const LocationField = ({ showNewLocation, setShowNewLocation, newLocation, setNewLocation, WAREHOUSE_LOCATIONS }) => {
  return (
    <div>
      <Label htmlFor="location">Stock Location</Label>
      {showNewLocation ? (
        <div className="space-y-2">
          <Input 
            id="location" 
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Enter new location"
            required 
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setShowNewLocation(false)}
          >
            Select from existing
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Select id="location" required>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {WAREHOUSE_LOCATIONS.map((location) => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setShowNewLocation(true)}
          >
            Add new location
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationField;