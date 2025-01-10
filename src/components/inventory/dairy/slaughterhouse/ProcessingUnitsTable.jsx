import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProcessingUnitsTable = ({ units }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Units Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Unit</th>
                <th className="px-6 py-3">Activity</th>
                <th className="px-6 py-3">Personnel</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="bg-white border-b">
                  <td className="px-6 py-4">{unit.name}</td>
                  <td className="px-6 py-4">{unit.activity}</td>
                  <td className="px-6 py-4">{unit.personnel}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      unit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {unit.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingUnitsTable;