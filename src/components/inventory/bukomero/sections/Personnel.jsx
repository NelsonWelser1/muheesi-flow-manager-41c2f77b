
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";

const BukomeroPersonnel = () => {
  const { isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading personnel data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading personnel data: {error.message}</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Farm Personnel</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Full-time employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Manager Boaz</p>
                <p className="text-sm text-muted-foreground">Farm Manager</p>
              </div>
              <div className="text-blue-600 font-medium">+256 772 674060</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">John Mukasa</p>
                <p className="text-sm text-muted-foreground">Head Herdsman</p>
              </div>
              <div className="text-blue-600 font-medium">+256 704 123456</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Sarah Namukasa</p>
                <p className="text-sm text-muted-foreground">Milk Production Supervisor</p>
              </div>
              <div className="text-blue-600 font-medium">+256 772 987654</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Daniel Kabuye</p>
                <p className="text-sm text-muted-foreground">Veterinary Officer</p>
              </div>
              <div className="text-blue-600 font-medium">+256 782 456789</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroPersonnel;
