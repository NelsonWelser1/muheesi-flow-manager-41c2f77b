import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AssociationDetails = ({ isKazo, selectedAssociation }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Association Name</Label>
              <Input placeholder="Enter association name" />
            </div>

            <div>
              <Label>Registration Number</Label>
              <Input placeholder="Enter registration number" />
            </div>

            <div>
              <Label>Association Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmers">Farmers Association</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                  <SelectItem value="union">Farmers Union</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Member Count</Label>
              <Input type="number" placeholder="Enter number of members" />
            </div>

            <div>
              <Label>Total Farm Area (Acres)</Label>
              <Input type="number" placeholder="Enter total farm area" />
            </div>

            <div>
              <Label>Coffee Types</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select coffee types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabica">Arabica</SelectItem>
                  <SelectItem value="robusta">Robusta</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">Save Association Details</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssociationDetails;