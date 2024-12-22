import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReceiveMilkForm from './ReceiveMilkForm';
import OffloadMilkForm from './OffloadMilkForm';

const DairyCoolers = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Dairy Coolers Management</CardTitle>
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="receive" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <TabsTrigger 
                value="receive" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Receive Milk
              </TabsTrigger>
              <TabsTrigger 
                value="offload"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Offload Milk
              </TabsTrigger>
            </TabsList>
            
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <TabsContent value="receive" className="mt-0">
                <ReceiveMilkForm />
              </TabsContent>
              <TabsContent value="offload" className="mt-0">
                <OffloadMilkForm />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DairyCoolers;