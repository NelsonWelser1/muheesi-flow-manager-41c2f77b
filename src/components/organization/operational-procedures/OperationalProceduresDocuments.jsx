
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, Plus, Eye } from "lucide-react";
import MilkProductionProcedures from './documents/MilkProductionProcedures';
import CheeseProductionProcedures from './documents/CheeseProductionProcedures';
import CoffeeProductionProcedures from './documents/CoffeeProductionProcedures';
import ProductionDosAndDonts from './documents/ProductionDosAndDonts';
import DocumentUploadTemplate from './documents/DocumentUploadTemplate';
import { useToast } from "@/components/ui/use-toast";

const OperationalProceduresDocuments = () => {
  const [activeTab, setActiveTab] = useState("milk");
  const { toast } = useToast();

  const documentCategories = [
    {
      id: "milk",
      title: "Milk Production",
      icon: <FileText className="h-5 w-5" />,
      description: "Standard operating procedures for milk production facilities",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "cheese",
      title: "Cheese Production",
      icon: <FileText className="h-5 w-5" />,
      description: "Guidelines and procedures for cheese manufacturing processes",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      id: "coffee",
      title: "Coffee Production",
      icon: <FileText className="h-5 w-5" />,
      description: "Operational procedures for coffee processing and production",
      color: "bg-brown-100 text-brown-800"
    },
    {
      id: "safety",
      title: "Safety Guidelines",
      icon: <FileText className="h-5 w-5" />,
      description: "Do's and Don'ts for all production areas",
      color: "bg-red-100 text-red-800"
    },
    {
      id: "upload",
      title: "Upload Documents",
      icon: <Upload className="h-5 w-5" />,
      description: "Template for uploading additional operational documents",
      color: "bg-green-100 text-green-800"
    }
  ];

  const handleDownloadDocument = (documentType) => {
    toast({
      title: "Document Downloaded",
      description: `${documentType} procedures document has been downloaded.`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Operational Procedures Documentation
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive operational procedures and safety guidelines for all production areas. 
          Access standardized documents and upload additional procedures as needed.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {documentCategories.map((category) => (
          <Card 
            key={category.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setActiveTab(category.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
                <Badge className={category.color}>
                  {category.id === 'upload' ? 'Template' : 'SOP'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{category.description}</p>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(category.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument(category.title);
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="milk">Milk Production</TabsTrigger>
          <TabsTrigger value="cheese">Cheese Production</TabsTrigger>
          <TabsTrigger value="coffee">Coffee Production</TabsTrigger>
          <TabsTrigger value="safety">Safety Guidelines</TabsTrigger>
          <TabsTrigger value="upload">Upload Template</TabsTrigger>
        </TabsList>

        <TabsContent value="milk" className="mt-6">
          <MilkProductionProcedures />
        </TabsContent>

        <TabsContent value="cheese" className="mt-6">
          <CheeseProductionProcedures />
        </TabsContent>

        <TabsContent value="coffee" className="mt-6">
          <CoffeeProductionProcedures />
        </TabsContent>

        <TabsContent value="safety" className="mt-6">
          <ProductionDosAndDonts />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <DocumentUploadTemplate />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperationalProceduresDocuments;
