
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Eye } from 'lucide-react';
import CoffeeContractTemplate from './templates/CoffeeContractTemplate';
import GeneralProduceTemplate from './templates/GeneralProduceTemplate';
import FreshProduceTemplate from './templates/FreshProduceTemplate';
import '../styles/PrintStyles.css';

const ContractTemplates = ({ onBack }) => {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [selectedTab, setSelectedTab] = useState("coffee");

  // When printing, add a class to the body element to apply print-specific styles
  useEffect(() => {
    const beforePrint = () => {
      document.body.classList.add('printing');
    };
    
    const afterPrint = () => {
      document.body.classList.remove('printing');
    };
    
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    
    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  const handleViewTemplate = (templateType) => {
    setActiveTemplate(templateType);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // This would be implemented with a PDF library like jsPDF
    console.log("Download PDF functionality would be implemented here");
    // Placeholder for actual PDF generation
    alert("PDF download feature will be implemented with backend integration");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Contracts</span>
        </Button>
        <h2 className="text-xl font-semibold">Export Contract Templates</h2>
        <div className="flex gap-2">
          {activeTemplate && (
            <>
              <Button 
                variant="outline" 
                onClick={handlePrint}
                className="flex items-center gap-1"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {activeTemplate ? (
        <div className="print-container">
          {activeTemplate === "coffee" && <CoffeeContractTemplate />}
          {activeTemplate === "general" && <GeneralProduceTemplate />}
          {activeTemplate === "fresh" && <FreshProduceTemplate />}
          
          <div className="mt-6 flex justify-center print:hidden">
            <Button variant="outline" onClick={() => setActiveTemplate(null)}>
              Back to Templates
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="coffee" value={selectedTab} onValueChange={setSelectedTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="coffee">Coffee Beans</TabsTrigger>
            <TabsTrigger value="general">General Produce</TabsTrigger>
            <TabsTrigger value="fresh">Fresh Produce</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coffee" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Coffee Export Contract Templates</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Card className="border border-blue-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-blue-50 pb-2">
                    <CardTitle className="text-lg">Standard Coffee Export Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Standard template for coffee bean export agreements with full clauses for quality, delivery, and payment terms.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewTemplate("coffee")}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Template</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-blue-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-blue-50 pb-2">
                    <CardTitle className="text-lg">Specialty Coffee Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Contract template for specialty grade coffees, including detailed cupping scores, origin specifications, and premium payment terms.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewTemplate("coffee")}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Template</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Produce Export Contract Templates</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Card className="border border-green-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-green-50 pb-2">
                    <CardTitle className="text-lg">Standard Agricultural Export Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      General purpose template for agricultural exports with customizable clauses for various commodities.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewTemplate("general")}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Template</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-green-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-green-50 pb-2">
                    <CardTitle className="text-lg">Bulk Commodity Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Contract template for bulk agricultural commodities with volume-based pricing and delivery schedules.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewTemplate("general")}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Template</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fresh" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fresh Produce Export Contract Templates</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Card className="border border-amber-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-amber-50 pb-2">
                    <CardTitle className="text-lg">Perishable Goods Export Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Specialized contract for perishable agricultural products with cold chain and shelf-life requirements.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewTemplate("fresh")}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Template</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-amber-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-amber-50 pb-2">
                    <CardTitle className="text-lg">Fresh Fruits & Vegetables Contract</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Contract template for fresh fruits and vegetables with quality standards, packaging requirements, and rapid delivery terms.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewTemplate("fresh")}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Template</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ContractTemplates;
