
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";

const BukomeroOverview = () => {
  const { farmMetrics, isLoading, error, refreshMetrics } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading farm overview data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading farm overview data: {error.message}</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bukomero Dairy Farm Overview</h2>
        <p className="text-sm text-muted-foreground">
          Last Updated: {farmMetrics?.lastUpdated 
            ? new Date(farmMetrics.lastUpdated).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Not available'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.totalCattle || 0}</div>
            <p className="text-xs text-muted-foreground">Current herd size</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Milk Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmMetrics?.milkProduction || '0 liters'}</div>
            <p className="text-xs text-muted-foreground">Average daily</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Farm Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 Acres</div>
            <p className="text-xs text-muted-foreground">Total land</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Farm Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Excellent</div>
            <p className="text-xs text-muted-foreground">Overall status</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Milk Production</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Daily milk collection is proceeding as scheduled with all milking equipment
                  operating at normal capacity. Quality testing shows Grade A milk quality
                  with good protein and fat content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Cattle Management</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Regular health checks being conducted across the herd with
                  no significant health issues detected. Vaccination program is up to date.
                  Fattening program has {farmMetrics?.activeFattening || 0} cattle currently enrolled.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Feed Management</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Current feed stocks are adequate with silage production proceeding as scheduled.
                  Feed quality analysis shows optimal nutrition levels for milk production.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Veterinary Visit</p>
                  <p className="text-sm text-muted-foreground">25 Apr, 2025</p>
                </div>
                <div className="text-blue-600 font-medium">Scheduled</div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Milk Quality Testing</p>
                  <p className="text-sm text-muted-foreground">27 Apr, 2025</p>
                </div>
                <div className="text-blue-600 font-medium">Scheduled</div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Feed Delivery</p>
                  <p className="text-sm text-muted-foreground">28 Apr, 2025</p>
                </div>
                <div className="text-blue-600 font-medium">Confirmed</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Equipment Maintenance</p>
                  <p className="text-sm text-muted-foreground">30 Apr, 2025</p>
                </div>
                <div className="text-blue-600 font-medium">Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Farm Manager's Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>23 Apr, 2025:</strong> All operations are running smoothly. The recent rainfall has been beneficial for our pasture growth. We're seeing good milk production numbers this week, and the new feed supplement introduced last month seems to be yielding positive results in terms of milk quality.
            </p>
            <p className="text-sm">
              <strong>22 Apr, 2025:</strong> Completed monthly inventory check. Need to reorder cleaning supplies within the next 10 days. Electricity backup generator was tested today and is functioning properly.
            </p>
            <p className="text-sm">
              <strong>20 Apr, 2025:</strong> Five new cattle have been integrated into the herd successfully after their quarantine period. All health checks passed with no concerns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroOverview;
