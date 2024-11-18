import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const LogisticsShipping = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Destination</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mersin">Turkey (Mersin)</SelectItem>
                <SelectItem value="tianjin">China (Tianjin)</SelectItem>
                <SelectItem value="ningbo">China (Ningbo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Shipping Partner</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maersk">Maersk Line</SelectItem>
                <SelectItem value="msc">MSC</SelectItem>
                <SelectItem value="cma">CMA CGM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Incoterms</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select incoterm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fob">FOB</SelectItem>
                <SelectItem value="cif">CIF</SelectItem>
                <SelectItem value="cfr">CFR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Container Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select container" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20ft">20ft Standard</SelectItem>
                <SelectItem value="40ft">40ft Standard</SelectItem>
                <SelectItem value="40hc">40ft High Cube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cargo Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Booking Number</Label>
              <Input placeholder="Enter booking number" />
            </div>
            <div className="space-y-2">
              <Label>Container Number</Label>
              <Input placeholder="Enter container number" />
            </div>
          </div>
          <Button className="w-full">Create Shipping Order</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsShipping;