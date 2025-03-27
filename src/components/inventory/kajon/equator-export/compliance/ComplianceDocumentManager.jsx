
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, Printer, FileDown, RotateCcw } from "lucide-react";
import CoffeeComplianceTemplate from './templates/CoffeeComplianceTemplate';
import GeneralProduceComplianceTemplate from './templates/GeneralProduceComplianceTemplate';
import FreshProduceComplianceTemplate from './templates/FreshProduceComplianceTemplate';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ComplianceDocumentManager = () => {
  const [activeTab, setActiveTab] = useState("coffee");
  const [editMode, setEditMode] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [templateData, setTemplateData] = useState({
    coffee: {},
    general: {},
    fresh: {}
  });
  const { toast } = useToast();
  
  // Handle data change in templates
  const handleDataChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };
  
  // Toggle edit mode
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setTemplateSaved(false); // Reset saved state when entering edit mode
    }
  };
  
  // Reset template data
  const handleReset = () => {
    setTemplateData(prev => ({
      ...prev,
      [activeTab]: {}
    }));
    toast({
      title: "Template Reset",
      description: "All changes have been reset to default values."
    });
  };
  
  // Handle save dialog
  const handleSaveClick = () => {
    setSaveDialogOpen(true);
  };
  
  // Save template with title
  const handleSaveTemplate = () => {
    if (!documentTitle) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your document.",
        variant: "destructive"
      });
      return;
    }
    
    // Save the template data with title
    setTemplateData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        documentTitle
      }
    }));
    
    setTemplateSaved(true);
    setSaveDialogOpen(false);
    
    toast({
      title: "Template Saved",
      description: `Your document "${documentTitle}" has been saved.`
    });
  };
  
  // Print the document
  const handlePrint = () => {
    if (!templateSaved) {
      toast({
        title: "Save Required",
        description: "Please save the document before printing.",
        variant: "destructive"
      });
      return;
    }
    
    // Temporarily disable edit mode for printing
    const currentEditMode = editMode;
    setEditMode(false);
    
    // Add printing class to body
    document.body.classList.add('printing');
    
    setTimeout(() => {
      window.print();
      
      // Remove printing class
      document.body.classList.remove('printing');
      
      // Restore edit mode
      setEditMode(currentEditMode);
    }, 100);
  };
  
  // Export as PDF
  const handleExportPDF = async () => {
    if (!templateSaved) {
      toast({
        title: "Save Required",
        description: "Please save the document before downloading as PDF.",
        variant: "destructive"
      });
      return;
    }
    
    const printContainer = document.querySelector('.print-container');
    if (!printContainer) {
      toast({
        title: "Export Failed",
        description: "Could not find document content.",
        variant: "destructive"
      });
      return;
    }
    
    // Temporarily disable edit mode for PDF generation
    const currentEditMode = editMode;
    setEditMode(false);
    
    // Add PDF generation class
    document.body.classList.add('generating-pdf');
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your PDF..."
    });
    
    try {
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${documentTitle || 'compliance-document'}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Your PDF has been successfully downloaded."
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred while generating the PDF.",
        variant: "destructive"
      });
    } finally {
      // Remove PDF generation class
      document.body.classList.remove('generating-pdf');
      
      // Restore edit mode
      setEditMode(currentEditMode);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compliance Documents</h2>
        <div className="space-x-2">
          {!editMode && !templateSaved && (
            <Button 
              onClick={handleToggleEditMode} 
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" /> Edit Template
            </Button>
          )}
          
          {editMode && (
            <>
              <Button 
                onClick={handleSaveClick} 
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" /> Save As
              </Button>
              
              <Button 
                onClick={handleReset} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              
              <Button 
                onClick={handleToggleEditMode} 
                variant="outline"
                className="flex items-center gap-2"
              >
                Done Editing
              </Button>
            </>
          )}
          
          {templateSaved && (
            <>
              <Button 
                onClick={handlePrint} 
                variant="outline"
                className="flex items-center gap-2 print:hidden"
              >
                <Printer className="h-4 w-4" /> Print
              </Button>
              
              <Button 
                onClick={handleExportPDF} 
                variant="outline"
                className="flex items-center gap-2 print:hidden"
              >
                <FileDown className="h-4 w-4" /> Download PDF
              </Button>
              
              {!editMode && (
                <Button 
                  onClick={handleToggleEditMode} 
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" /> Edit Template
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value);
              setEditMode(false);
              setTemplateSaved(false);
            }}
            className="print:hidden"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="coffee">Coffee</TabsTrigger>
              <TabsTrigger value="general">General Produce</TabsTrigger>
              <TabsTrigger value="fresh">Fresh Produce</TabsTrigger>
            </TabsList>
            
            <TabsContent value="coffee" className="pt-4">
              <div className="print-container">
                <CoffeeComplianceTemplate 
                  editMode={editMode}
                  data={templateData.coffee}
                  onDataChange={handleDataChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="general" className="pt-4">
              <div className="print-container">
                <GeneralProduceComplianceTemplate 
                  editMode={editMode}
                  data={templateData.general}
                  onDataChange={handleDataChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="fresh" className="pt-4">
              <div className="print-container">
                <FreshProduceComplianceTemplate 
                  editMode={editMode}
                  data={templateData.fresh}
                  onDataChange={handleDataChange}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentTitle">Document Title</Label>
              <Input
                id="documentTitle"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter a title for your document"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setSaveDialogOpen(false)} 
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplianceDocumentManager;
