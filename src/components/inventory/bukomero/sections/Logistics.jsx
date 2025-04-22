
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BukomeroLogistics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicles Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5/6</div>
            <p className="text-sm text-gray-500">Operational vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today's Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-gray-500">3 completed, 5 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Milk Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-gray-500">Collection routes today</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delivery Schedule</CardTitle>
          <Button size="sm">Schedule New</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Kampala Central Distribution</h4>
                <p className="text-sm text-gray-500">Fresh milk delivery - 450 liters</p>
              </div>
              <div className="text-right">
                <p className="font-medium">10:30 AM</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Entebbe Resort Supply</h4>
                <p className="text-sm text-gray-500">Yogurt and cheese - 120 kg</p>
              </div>
              <div className="text-right">
                <p className="font-medium">1:45 PM</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Nakasero Market Vendors</h4>
                <p className="text-sm text-gray-500">Fresh milk - 300 liters</p>
              </div>
              <div className="text-right">
                <p className="font-medium">3:30 PM</p>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">In Progress</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Northern Supermarkets Chain</h4>
                <p className="text-sm text-gray-500">Mixed dairy products</p>
              </div>
              <div className="text-right">
                <p className="font-medium">4:15 PM</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Scheduled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Collection Routes Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Northern Collection Route</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Eastern Villages Route</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Central Farms Route</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">In Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Western Collection Route</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Scheduled (PM)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroLogistics;
