
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BukomeroMilkProduction = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250 liters</div>
            <p className="text-sm text-gray-500">Morning + Evening collection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,180 liters/day</div>
            <p className="text-sm text-green-600">↑ 5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quality Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">A Grade</div>
            <p className="text-sm text-gray-500">Passed all quality tests</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Collection Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Morning Collection</h4>
                <p className="text-sm text-gray-500">5:30 AM - 7:30 AM</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Evening Collection</h4>
                <p className="text-sm text-gray-500">4:30 PM - 6:30 PM</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Upcoming</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Quality Testing</h4>
                <p className="text-sm text-gray-500">8:00 AM & 7:00 PM</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Morning Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Processing Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Fresh Milk Bottling</span>
              <span className="font-medium">450 liters</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Yogurt Production</span>
              <span className="font-medium">300 liters</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cheese Making</span>
              <span className="font-medium">200 liters</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Butter Production</span>
              <span className="font-medium">100 liters</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Remaining Stock</span>
              <span className="font-medium">200 liters</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroMilkProduction;
