import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const BukomeroDairyDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/manage-inventory')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        <h1 className="text-3xl font-bold">Bukomero Dairy Farm</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Farm Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dairy" className="space-y-4">
            <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TabsTrigger value="dairy">Dairy Products</TabsTrigger>
              <TabsTrigger value="livestock">Livestock</TabsTrigger>
              <TabsTrigger value="silage">Silage & Feed</TabsTrigger>
              <TabsTrigger value="finance">Finance & Loans</TabsTrigger>
            </TabsList>

            <TabsContent value="dairy">
              <Card>
                <CardHeader>
                  <CardTitle>Dairy Products Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Daily Production</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">Coming Soon</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quality Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">Coming Soon</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Sales Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">UGX 3,140,000</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="livestock">
              <Card>
                <CardHeader>
                  <CardTitle>Livestock Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Total Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">UGX 67,900,000</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">December Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">UGX 4,000,000</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Previous Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">UGX 63,900,000</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="silage">
              <Card>
                <CardHeader>
                  <CardTitle>Silage & Feed Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">Module under development</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance">
              <Card>
                <CardHeader>
                  <CardTitle>Finance & Loan Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Land Paperwork Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">UGX 2,000,000</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Microfinance Support Center</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg">Loan details coming soon</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroDairyDashboard;