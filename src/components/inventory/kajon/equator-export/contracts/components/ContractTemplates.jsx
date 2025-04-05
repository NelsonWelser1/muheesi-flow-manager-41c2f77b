import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Eye, Edit, Save, RotateCcw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "@/components/ui/notifications";
import CoffeeContractTemplate from './templates/CoffeeContractTemplate';
import GeneralProduceTemplate from './templates/GeneralProduceTemplate';
import FreshProduceTemplate from './templates/FreshProduceTemplate';
import { exportContractToPDF } from '../utils/contractPdfExport';
import '../styles/PrintStyles.css';
import { useCoffeeExportContract } from '@/integrations/supabase/hooks/contracts/useCoffeeExportContract';

const ContractTemplates = ({ onBack }) => {
  const { toast } = useToast();
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

  // Load the Supabase hook for coffee export contracts
  const {
    contracts: coffeeContracts,
    loading: coffeeContractsLoading,
    error: coffeeContractsError,
    saveContract: saveCoffeeContract,
    fetchContracts: fetchCoffeeContracts,
    isSubmitting
  } = useCoffeeExportContract();

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

  // Load saved contracts from Supabase when component mounts
  useEffect(() => {
    if (coffeeContracts.length > 0) {
      const formattedContracts = coffeeContracts.map(contract => ({
        id: contract.id,
        type: 'coffee',
        title: `Coffee Contract - ${contract.contract_number || 'Untitled'} (${new Date(contract.created_at).toLocaleDateString()})`,
        data: {
          contractNumber: contract.contract_number,
          currentDate: contract.contract_date,
          sellerDetails: {
            name: contract.seller_name,
            address: contract.seller_address,
            registration: contract.seller_registration
          },
          buyerDetails: {
            name: contract.buyer_name,
            address: contract.buyer_address,
            registration: contract.buyer_registration
          },
          products: Array.isArray(contract.products) ? contract.products : [],
          paymentTermsItems: Array.isArray(contract.payment_terms_items) ? contract.payment_terms_items : [],
          // Add other fields as needed
        },
        dateCreated: contract.created_at
      }));
      
      setSavedTemplates(prevTemplates => {
        // Filter out coffee templates and add the new ones
        const nonCoffeeTemplates = prevTemplates.filter(template => template.type !== 'coffee');
        return [...nonCoffeeTemplates, ...formattedContracts];
      });
    }
  }, [coffeeContracts]);

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
      showErrorToast(toast, "Cannot find template content to export");
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
        showErrorToast(toast, `Failed to generate PDF: ${error.message}`);
        
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
    
    // If submission is already in progress, don't allow another save
    if (isSubmitting) {
      showErrorToast(toast, "A save operation is already in progress, please wait");
      return;
    }
    
    // Show loading toast
    const loadingToastId = showLoadingToast(toast, "Saving contract...");
    
    try {
      if (activeTemplate === 'coffee') {
        // Save coffee contract to Supabase
        const contractData = prepareContractDataForSaving();
        const { success, data, error } = await saveCoffeeContract(contractData);
        
        if (success) {
          // Update saved state
          setTemplateSaved(true);
          // Exit edit mode
          setEditMode(false);
          
          // Dismiss loading toast and show success toast
          dismissToast(loadingToastId);
          showSuccessToast(toast, "Coffee export contract saved successfully");
          
          // Return to templates screen
          setActiveTemplate(null);
        } else {
          // Dismiss loading toast and show error toast
          dismissToast(loadingToastId);
          showErrorToast(toast, `Failed to save contract: ${error?.message || 'Unknown error'}`);
        }
      } else {
        // Handle non-coffee templates (local storage for now)
        const savedTemplate = {
          id: Date.now().toString(),
          type: activeTemplate,
          title: `${activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} Contract - ${new Date().toLocaleDateString()}`,
          data: editableData[activeTemplate],
          dateCreated: new Date().toISOString()
        };
        
        // Add to saved templates
        setSavedTemplates(prev => [...prev, savedTemplate]);
        
        // Update saved state
        setTemplateSaved(true);
        
        // Exit edit mode
        setEditMode(false);
        
        // Dismiss loading toast and show success toast
        dismissToast(loadingToastId);
        showSuccessToast(toast, "Contract saved successfully");
      }
    } catch (error) {
      console.error("Error saving contract:", error);
      dismissToast(loadingToastId);
      showErrorToast(toast, `An unexpected error occurred: ${error.message}`);
    }
  };

  // Prepare contract data for saving to Supabase
  const prepareContractDataForSaving = () => {
    if (activeTemplate === 'coffee') {
      const data = editableData.coffee || {};
      const sellerDetails = data.sellerDetails || {};
      const buyerDetails = data.buyerDetails || {};
      
      // Ensure products have valid structure
      const products = Array.isArray(data.products) ? data.products.map(product => ({
        description: product.description || '',
        quantity: parseFloat(product.quantity) || 0,
        pricePerKg: parseFloat(product.pricePerKg) || 0,
        totalValue: parseFloat(product.totalValue) || 
          (parseFloat(product.quantity || 0) * parseFloat(product.pricePerKg || 0)).toFixed(2)
      })) : [];
      
      return {
        contract_number: data.contractNumber || "KCL-2024-" + new Date().getTime().toString().slice(-4),
        contract_date: data.currentDate || new Date().toISOString().split('T')[0],
        seller_name: sellerDetails.name || "KAJON Coffee Limited",
        seller_address: sellerDetails.address || "Kampala, Uganda",
        seller_registration: sellerDetails.registration || "Registration #: UG2023786541",
        buyer_name: buyerDetails.name || "[Buyer Company Name]",
        buyer_address: buyerDetails.address || "[Buyer Address]",
        buyer_registration: buyerDetails.registration || "[Buyer Registration #]",
        products: products,
        payment_terms_items: Array.isArray(data.paymentTermsItems) ? data.paymentTermsItems : [],
        // ... Include other fields from the template
        total_contract_value: parseFloat(data.totalContractValue || 0)
      };
    }
    return null;
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

  // Handle save for the Coffee template
  const handleCoffeeSave = (contractData) => {
    // If submission is already in progress, don't allow another save
    if (isSubmitting) {
      showErrorToast(toast, "A save operation is already in progress, please wait");
      return;
    }
    
    // Show loading toast
    const loadingToastId = showLoadingToast(toast, "Saving coffee export contract...");
    
    // Prepare the contract data for saving
    saveCoffeeContract(contractData)
      .then(({ success, data, error }) => {
        // Dismiss loading toast
        dismissToast(loadingToastId);
        
        if (success) {
          showSuccessToast(toast, "Coffee export contract saved successfully");
          // Return to templates view
          setActiveTemplate(null);
        } else {
          showErrorToast(toast, `Failed to save contract: ${error?.message || 'Unknown error'}`);
        }
      })
      .catch((error) => {
        // Dismiss loading toast
        dismissToast(loadingToastId);
        
        console.error("Error saving contract:", error);
        showErrorToast(toast, `An unexpected error occurred: ${error.message}`);
      });
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
        return <CoffeeContractTemplate {...templateProps} onSave={handleCoffeeSave} />;
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
          {coffeeContractsLoading ? (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Saved Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <p>Loading saved contracts...</p>
                </div>
              </CardContent>
            </Card>
          ) : savedTemplates.length > 0 ? (
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
          ) : (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Saved Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-gray-500 mb-4">No saved contracts found.</p>
                  <p className="text-sm text-gray-400">
                    Create a contract by clicking "View Template" on any of the contract templates above.
                  </p>
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
