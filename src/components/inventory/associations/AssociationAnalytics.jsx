import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AssociationAnalytics = ({ isKazo, selectedAssociation }) => {
  // Dummy data - replace with actual data from your backend
  const data = [
    { month: 'Jan', production: 4000 },
    { month: 'Feb', production: 3000 },
    { month: 'Mar', production: 2000 },
    { month: 'Apr', production: 2780 },
    { month: 'May', production: 1890 },
    { month: 'Jun', production: 2390 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            <BarChart
              width={800}
              height={300}
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="production" fill="#8884d8" />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">150</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Production</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2,500 kg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">16.7 kg/member</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssociationAnalytics;