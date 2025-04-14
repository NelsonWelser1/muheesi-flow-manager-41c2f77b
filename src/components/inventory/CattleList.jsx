
import React from 'react';
import { Card } from "@/components/ui/card";

const CattleList = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Cattle List</h3>
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium">Tag #</th>
              <th className="p-3 text-left font-medium">Type</th>
              <th className="p-3 text-left font-medium">Breed</th>
              <th className="p-3 text-left font-medium">Age</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3" colSpan="6">
                <p className="text-center text-muted-foreground">No cattle records found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CattleList;
