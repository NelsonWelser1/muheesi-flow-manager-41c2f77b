import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OperationLogsTable = ({ logs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operation Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Personnel</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="bg-white border-b">
                  <td className="px-6 py-4">{log.time}</td>
                  <td className="px-6 py-4">{log.type}</td>
                  <td className="px-6 py-4">{log.quantity}</td>
                  <td className="px-6 py-4">{log.personnel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationLogsTable;