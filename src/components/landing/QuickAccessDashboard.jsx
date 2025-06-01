
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell,
  Archive,
  Package,
  FileText
} from 'lucide-react';

const QuickAccessDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Employee Quick Access</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access your most used tools and get quick insights into system operations
        </p>
      </div>
      
      {/* Recent Activities */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Recent System Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <Archive className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">New milk batch received at Grand Berna</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <Package className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Coffee shipment prepared for export</p>
                <p className="text-sm text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <FileText className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Weekly production report generated</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAccessDashboard;
