
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Home } from "lucide-react";

const BukomeroDairyDashboard = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/manage-inventory');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Bukomero Dairy Farm Dashboard</CardTitle>
          </div>
          <Button variant="outline" onClick={handleGoHome} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Welcome to Bukomero Dairy Farm Management</h2>
            <p className="mb-6">Access the dairy farm operations and management features using the links below.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Milk Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Track and manage daily milk production records.</p>
                  <Button className="w-full">Open Dashboard</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Livestock Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Manage cattle inventory and health records.</p>
                  <Button className="w-full">Manage Livestock</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Track farm income, expenses and financial performance.</p>
                  <Button className="w-full">Financial Dashboard</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroDairyDashboard;
