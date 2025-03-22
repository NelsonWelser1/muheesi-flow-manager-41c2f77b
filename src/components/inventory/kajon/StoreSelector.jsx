
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STORE_LOCATIONS = [
  "Kanoni-Mbogo",
  "Engari-Kaichumu",
  "Engari-Kyengando",
  "Migina",
  "Kyampangara",
  "Nkungu",
  "Buremba",
  "Kazo Town council",
  "Burunga",
  "Rwemikoma"
];

const StoreSelector = ({ onLocationSelect }) => {
  return (
    <div className="space-y-4">
      <Label>Select Store Location</Label>
      <Select onValueChange={onLocationSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          {STORE_LOCATIONS.map(location => (
            <SelectItem key={location} value={location}>{location}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StoreSelector;
