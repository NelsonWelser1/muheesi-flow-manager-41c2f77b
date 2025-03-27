
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Eye, Edit, Save, RotateCcw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CoffeeShipmentTemplate from './templates/CoffeeShipmentTemplate';
import GeneralProduceShipmentTemplate from './templates/GeneralProduceShipmentTemplate';
import FreshProduceShipmentTemplate from './templates/FreshProduceShipmentTemplate';
import { exportContractToPDF } from '../../contracts/utils/contractPdfExport';
import '../../contracts/styles/PrintStyles.css';

const ShipmentTemplates = ({ onBack }) => {
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [selectedTab, setSelectedTab] = useState("coffee");
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState({
    coffee: null,
    general: null,
    fresh: null
  });
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('');
  const templateRef = useRef(null);

  // When printing, add a class to the body element to apply print-specific styles
  useEffect(() => {
    const beforePrint = () => {
      document.body.classList.add('printing');
      // Temporarily disable edit mode during printing
      if (editMode) {
        setEditMode(false);
      }
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
  }, [editMode]);

  // Load default template data when a template is first viewed
  useEffect(() => {
    if (activeTemplate && !editableData[activeTemplate]) {
      // Initialize with default template data structure
      const currentDate = new Date().toISOString().split('T')[0];
      const defaultData = {
        shipmentNumber: activeTemplate === 'coffee' ? 'KCL-SHP-2024-001' : 
                      activeTemplate === 'general' ? 'KCL-GP-SHP-2024-001' : 
                      'KCL-FP-SHP-2024-001',
        currentDate: currentDate,
        vessel: 'MSC Augusta',
        originPort: 'Mombasa, Kenya',
        destinationPort: activeTemplate === 'coffee' ? 'Hamburg, Germany' : 
                         activeTemplate === 'general' ? 'Rotterdam, Netherlands' : 
                         'London, UK',
        departureDate: currentDate,
        estimatedArrival: '2024-05-15',
        buyer: 'Client Company Name',
        buyerAddress: 'Client Address, Country',
        buyerContact: 'Contact Person, +1234567890',
        // Add more default fields based on template type
      };
      
      setEditableData(prev => ({
        ...prev,
        [activeTemplate]: defaultData
      }));
    }
  }, [activeTemplate, editableData]);

  const handleViewTemplate = (templateType) => {
    setActiveTemplate(templateType);
  };

  const handlePrint = () => {
    // Temporarily disable edit mode for printing
    setEditMode(false);
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!templateRef.current) {
      toast({
        title: "Error",
        description: "Cannot find template content to export",
        variant: "destructive"
      });
      return;
    }

    // Disable edit mode for PDF generation
    const wasInEditMode = editMode;
    if (wasInEditMode) {
      setEditMode(false);
    }

    // Small delay to ensure edit mode is fully disabled
    setTimeout(async () => {
      try {
        const templateType = activeTemplate || "shipment";
        const filename = templateTitle ? 
          `${templateTitle.replace(/\s+/g, '_')}` : 
          `${templateType}_shipment_${new Date().toISOString().split('T')[0]}`;
        
        await exportContractToPDF(templateRef.current, filename, toast);
        
        // Restore edit mode if it was active
        if (wasInEditMode) {
          setEditMode(true);
        }
      } catch (error) {
        console.error("PDF generation error:", error);
        toast({
          title: "Error",
          description: `Failed to generate PDF: ${error.message}`,
          variant: "destructive"
        });
        
        // Restore edit mode if it was active
        if (wasInEditMode) {
          setEditMode(true);
        }
      }
    }, 100);
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  const handleDataChange = (field, value) => {
    if (!activeTemplate) return;
    
    setEditableData(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        [field]: value
      }
    }));
  };

  const resetTemplate = () => {
    if (!activeTemplate) return;
    
    // Reset the active template to initial state
    setEditableData(prev => ({
      ...prev,
      [activeTemplate]: null
    }));
    
    // This will trigger the useEffect to reload default data
  };

  const handleSaveTemplate = () => {
    if (!activeTemplate || !templateTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your template",
        variant: "destructive"
      });
      return;
    }
    
    const newTemplate = {
      id: `template-${Date.now()}`,
      title: templateTitle,
      type: activeTemplate,
      data: editableData[activeTemplate],
      dateCreated: new Date().toISOString()
    };
    
    setSavedTemplates(prev => [...prev, newTemplate]);
    setSaveModalOpen(false);
    setTemplateTitle('');
    
    toast({
      title: "Success",
      description: "Template saved successfully"
    });
    
    // Return to template selection
    setActiveTemplate(null);
  };

  // Render the selected template with proper data
  const renderTemplate = () => {
    if (!activeTemplate) return null;
    
    // Pass the editable data to the template components
    const templateProps = {
      editMode,
      data: editableData[activeTemplate] || {},
      onDataChange: handleDataChange
    };
    
    switch(activeTemplate) {
      case "coffee":
        return <CoffeeShipmentTemplate {...templateProps} />;
      case "general":
        return <GeneralProduceShipmentTemplate {...templateProps} />;
      case "fresh":
        return <FreshProduceShipmentTemplate {...templateProps} />;
      default:
        return null;
    }
  };

  // Save Template Modal
  const SaveTemplateModal = () => {
    if (!saveModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Save Shipment Template</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Template Title</label>
            <input 
              type="text"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter a title for this template"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SaveTemplateModal />
      
      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shipments</span>
        </Button>
        <h2 className="text-xl font-semibold">Shipment Tracking Templates</h2>
        <div className="flex gap-2">
          {activeTemplate && (
            <>
              {editMode ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={resetTemplate}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </Button>
                  <Button 
                    onClick={toggleEditMode}
                    className="flex items-center gap-1"
                    variant="default"
                  >
                    <Save className="h-4 w-4" />
                    <span>Done Editing</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={toggleEditMode}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Template</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSaveModalOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save As</span>
                  </Button>
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
            </>
          )}
        </div>
      </div>

      {activeTemplate ? (
        <div className="print-container" ref={templateRef}>
          {renderTemplate()}
          
          <div className="mt-6 flex justify-center print:hidden">
            <Button variant="outline" onClick={() => setActiveTemplate(null)}>
              Back to Templates
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="coffee" value={selectedTab} onValueChange={setSelectedTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="coffee">Coffee Shipments</TabsTrigger>
            <TabsTrigger value="general">General Produce</TabsTrigger>
            <TabsTrigger value="fresh">Fresh Produce</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coffee" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Coffee Shipment Templates</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Card className="border border-blue-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-blue-50 pb-2">
                    <CardTitle className="text-lg">Standard Coffee Shipment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Complete tracking document for international coffee bean shipments, including quality certificates, container details, and estimated transit times.
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
                    <CardTitle className="text-lg">Specialty Coffee Shipment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Tracking document for specialty grade coffees with detailed temperature monitoring, origin information, and handling instructions for premium shipments.
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
                <CardTitle>General Produce Shipment Templates</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Card className="border border-green-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-green-50 pb-2">
                    <CardTitle className="text-lg">Bulk Agricultural Shipment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Comprehensive tracking document for bulk agricultural exports like grains, pulses, and seeds with cargo specifications, quality parameters, and logistics details.
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
                    <CardTitle className="text-lg">Multi-Commodity Shipment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Tracking document for mixed agricultural commodities with compartmentalized storage requirements, customs documentation, and handling procedures.
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
                <CardTitle>Fresh Produce Shipment Templates</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Card className="border border-amber-200 hover:shadow-md transition-all">
                  <CardHeader className="bg-amber-50 pb-2">
                    <CardTitle className="text-lg">Air Freight Perishable Shipment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Specialized tracking document for air-freighted perishable produce with temperature monitoring, accelerated customs clearance, and delivery timelines.
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
                    <CardTitle className="text-lg">Refrigerated Container Shipment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Tracking document for fresh fruits and vegetables in refrigerated containers with continuous temperature logging, shelf-life monitoring, and handling protocols.
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
      
      {/* Saved Templates Section */}
      {savedTemplates.length > 0 && !activeTemplate && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Saved Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {savedTemplates.map(template => (
                <Card key={template.id} className="border hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <p className="text-xs text-gray-500">
                      {new Date(template.dateCreated).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setActiveTemplate(template.type);
                          setEditableData(prev => ({
                            ...prev,
                            [template.type]: template.data
                          }));
                        }}
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentTemplates;
