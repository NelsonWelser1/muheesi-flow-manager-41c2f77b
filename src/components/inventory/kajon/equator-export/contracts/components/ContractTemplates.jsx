
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Eye, Edit, Save, RotateCcw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CoffeeContractTemplate from './templates/CoffeeContractTemplate';
import GeneralProduceTemplate from './templates/GeneralProduceTemplate';
import FreshProduceTemplate from './templates/FreshProduceTemplate';
import { exportContractToPDF } from '../utils/contractPdfExport';
import '../styles/PrintStyles.css';
import { useContractTemplates } from '@/integrations/supabase/hooks/useContractTemplates';

const ContractTemplates = ({ onBack }) => {
  const { toast } = useToast();
  const { saveContract, fetchContracts, fetchContractById, isLoading } = useContractTemplates();
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [selectedTab, setSelectedTab] = useState("coffee");
  const [editMode, setEditMode] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [editableData, setEditableData] = useState({
    coffee: null,
    general: null,
    fresh: null
  });
  const templateRef = useRef(null);

  // Load saved contracts on component mount
  useEffect(() => {
    const loadSavedContracts = async () => {
      const contracts = await fetchContracts();
      setSavedTemplates(contracts.map(contract => ({
        id: contract.id,
        type: contract.contract_type,
        title: contract.contract_name,
        data: contract.contract_data,
        dateCreated: contract.created_at
      })));
    };
    
    loadSavedContracts();
  }, [fetchContracts]);

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
      // Get current date in YYYY-MM-DD format for default
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Initialize with default template data structure
      const defaultData = {
        buyerName: '[Buyer Company Name]',
        buyerAddress: '[Buyer Address]',
        buyerRegistration: '[Buyer Registration #]',
        contractNumber: activeTemplate === 'coffee' ? 'KCL-2024-[XXXX]' : 
                        activeTemplate === 'general' ? 'KCL-GP-2024-[XXXX]' : 
                        'KCL-FP-2024-[XXXX]',
        currentDate: currentDate,
        // Add more fields as needed for each template
      };
      
      setEditableData(prev => ({
        ...prev,
        [activeTemplate]: defaultData
      }));
    }
  }, [activeTemplate, editableData]);

  const handleViewTemplate = (templateType) => {
    setActiveTemplate(templateType);
    setTemplateSaved(false); // Reset saved state when viewing a new template
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
        const templateType = activeTemplate || "contract";
        const filename = `${templateType}_contract_${new Date().toISOString().split('T')[0]}`;
        
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

  const handleSaveContract = async () => {
    if (!activeTemplate) return;
    
    // Prepare contract data for saving
    const contractData = {
      type: activeTemplate,
      title: `${activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} Contract - ${new Date().toLocaleDateString()}`,
      ...editableData[activeTemplate],
      dateCreated: new Date().toISOString()
    };
    
    // Save contract to Supabase
    const result = await saveContract(contractData);
    
    if (result.success) {
      // Update saved templates list
      const savedContract = {
        id: result.id,
        type: activeTemplate,
        title: contractData.title,
        data: editableData[activeTemplate],
        dateCreated: new Date().toISOString()
      };
      
      setSavedTemplates(prev => {
        // Replace if exists, otherwise add
        const exists = prev.some(t => t.id === result.id);
        return exists 
          ? prev.map(t => t.id === result.id ? savedContract : t)
          : [...prev, savedContract];
      });
      
      // Update saved state
      setTemplateSaved(true);
      
      // Exit edit mode
      setEditMode(false);
    }
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
        return <CoffeeContractTemplate {...templateProps} />;
      case "general":
        return <GeneralProduceTemplate {...templateProps} />;
      case "fresh":
        return <FreshProduceTemplate {...templateProps} />;
      default:
        return null;
    }
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
                    onClick={handleSaveContract}
                    className="flex items-center gap-1"
                    variant="default"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Contract</span>
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
                  {templateSaved && (
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
        <>
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
          
          {/* Saved Contracts Section */}
          {savedTemplates.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Saved Contracts</CardTitle>
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
                              setTemplateSaved(true);
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
        </>
      )}
    </div>
  );
};

export default ContractTemplates;
