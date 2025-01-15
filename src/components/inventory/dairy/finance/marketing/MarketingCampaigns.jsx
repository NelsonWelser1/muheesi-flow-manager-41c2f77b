import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MarketingCampaigns = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Campaign Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input id="campaignName" placeholder="Enter campaign name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignType">Campaign Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Digital Marketing</SelectItem>
                  <SelectItem value="print">Print Media</SelectItem>
                  <SelectItem value="event">Event Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input id="budget" type="number" placeholder="Enter budget amount" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input id="duration" type="number" placeholder="Enter campaign duration" />
            </div>
          </div>
          <Button type="submit">Create Campaign</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MarketingCampaigns;