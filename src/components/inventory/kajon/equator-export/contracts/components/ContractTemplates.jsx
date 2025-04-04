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
import { useSpecialtyCoffeeContract } from '@/integrations/supabase/hooks/contracts/useSpecialtyCoffeeContract';

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
    fresh: null,
    specialty: null
  });
  const [activeContractType, setActiveContractType] = useState(null);
  const templateRef = useRef(null);

  const {
    contracts: coffeeContracts,
    loading: coffeeContractsLoading,
    error: coffeeContractsError,
    saveContract: saveCoffeeContract,
    fetchContracts: fetchCoffeeContracts,
    isSubmitting: isSubmittingCoffeeContract
  } = useCoffeeExportContract();

  const {
    contracts: specialtyContracts,
    loading: specialtyContractsLoading,
    error: specialtyContractsError,
    saveContract: saveSpecialtyContract,
    fetchContracts: fetchSpecialtyContracts,
    isSubmitting: isSubmittingSpecialtyContract
  } = useSpecialtyCoffeeContract();

  useEffect(() => {
    const beforePrint = () => {
      document.body.classList.add('printing');
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

  useEffect(() => {
    const formattedContracts = [];
    
    if (coffeeContracts.length > 0) {
      const formatted = coffeeContracts.map(contract => ({
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
          total_contract_value: parseFloat(contract.total_contract_value || 0)
        },
        dateCreated: contract.created_at
      }));
      
      formattedContracts.push(...formatted);
    }
    
    if (specialtyContracts.length > 0) {
      const formatted = specialtyContracts.map(contract => ({
        id: contract.id,
        type: 'specialty',
        title: `Specialty Coffee Contract - ${contract.contract_number || 'Untitled'} (${new Date(contract.created_at).toLocaleDateString()})`,
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
          coffeeOrigin: contract.coffee_origin,
          coffeeVariety: contract.coffee_variety,
          coffeeProcess: contract.coffee_process,
          coffeeGrade: contract.coffee_grade,
          coffeeCertification: contract.coffee_certification,
          cuppingScore: contract.cupping_score,
          products: Array.isArray(contract.products) ? contract.products : [],
          paymentTermsItems: Array.isArray(contract.payment_terms_items) ? contract.payment_terms_items : [],
          total_contract_value: parseFloat(contract.total_contract_value || 0)
        },
        dateCreated: contract.created_at
      }));
      
      formattedContracts.push(...formatted);
    }
    
    formattedContracts.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    
    setSavedTemplates(formattedContracts);
  }, [coffeeContracts, specialtyContracts]);

  useEffect(() => {
    if (activeTemplate && !editableData[activeTemplate]) {
      const currentDate = new Date().toISOString().split('T')[0];
      
      const defaultData = {
        buyerName: '[Buyer Company Name]',
        buyerAddress: '[Buyer Address]',
        buyerRegistration: '[Buyer Registration #]',
        contractNumber: activeTemplate === 'coffee' ? 'KCL-2024-[XXXX]' : 
                        activeTemplate === 'specialty' ? 'KCL-SC-2024-[XXXX]' :
                        activeTemplate === 'general' ? 'KCL-GP-2024-[XXXX]' : 
                        'KCL-FP-2024-[XXXX]',
        currentDate: currentDate,
      };
      
      setEditableData(prev => ({
        ...prev,
        [activeTemplate]: defaultData
      }));
    }
  }, [activeTemplate, editableData]);

  const handleViewTemplate = (templateType, contractType = null) => {
    setActiveTemplate(templateType);
    setActiveContractType(contractType);
    setTemplateSaved(false);
  };

  const handlePrint = () => {
    setEditMode(false);
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!templateRef.current) {
      showErrorToast(toast, "Cannot find template content to export");
      return;
    }

    const wasInEditMode = editMode;
    if (wasInEditMode) {
      setEditMode(false);
    }

    setTimeout(async () => {
      try {
        const templateType = activeTemplate || "contract";
        const filename = `${templateType}_contract_${new Date().toISOString().split('T')[0]}`;
        
        await exportContractToPDF(templateRef.current, filename, toast);
        
        if (wasInEditMode) {
          setEditMode(true);
        }
      } catch (error) {
        console.error("PDF generation error:", error);
        showErrorToast(toast, `Failed to generate PDF: ${error.message}`);
        
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
    
    const isSubmitting = 
      (activeTemplate === 'coffee' && isSubmittingCoffeeContract) ||
      (activeTemplate === 'specialty' && isSubmittingSpecialtyContract);
    
    if (isSubmitting) {
      showErrorToast(toast, "A save operation is already in progress, please wait");
      return;
    }
    
    const loadingToastId = showLoadingToast(toast, `Saving ${activeTemplate} contract...`);
    
    try {
      if (activeTemplate === 'coffee') {
        const contractData = prepareContractDataForSaving('coffee');
        const { success, data, error } = await saveCoffeeContract(contractData);
        
        if (success) {
          setTemplateSaved(true);
          setEditMode(false);
          dismissToast(loadingToastId);
          showSuccessToast(toast, "Coffee export contract saved successfully");
          setActiveTemplate(null);
        } else {
          dismissToast(loadingToastId);
          showErrorToast(toast, `Failed to save contract: ${error?.message || 'Unknown error'}`);
        }
      } else if (activeTemplate === 'specialty') {
        const contractData = prepareContractDataForSaving('specialty');
        const { success, data, error, clientReferenceId } = await saveSpecialtyContract(contractData);
        
        if (success) {
          setTemplateSaved(true);
          setEditMode(false);
          setEditableData(prev => ({
            ...prev,
            [activeTemplate]: {
              ...prev[activeTemplate],
              clientReferenceId
            }
          }));
          dismissToast(loadingToastId);
          showSuccessToast(toast, "Specialty coffee contract saved successfully");
          setActiveTemplate(null);
        } else {
          dismissToast(loadingToastId);
          showErrorToast(toast, `Failed to save contract: ${error?.message || 'Unknown error'}`);
        }
      } else {
        const savedTemplate = {
          id: Date.now().toString(),
          type: activeTemplate,
          title: `${activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} Contract - ${new Date().toLocaleDateString()}`,
          data: editableData[activeTemplate],
          dateCreated: new Date().toISOString()
        };
        
        setSavedTemplates(prev => [...prev, savedTemplate]);
        setTemplateSaved(true);
        setEditMode(false);
        dismissToast(loadingToastId);
        showSuccessToast(toast, "Contract saved successfully");
      }
    } catch (error) {
      console.error("Error saving contract:", error);
      dismissToast(loadingToastId);
      showErrorToast(toast, `An unexpected error occurred: ${error.message}`);
    }
  };

  const prepareContractDataForSaving = (templateType) => {
    if (templateType === 'coffee') {
      const data = editableData.coffee || {};
      const sellerDetails = data.sellerDetails || {};
      const buyerDetails = data.buyerDetails || {};
      
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
        total_contract_value: parseFloat(data.totalContractValue || 0)
      };
    } else if (templateType === 'specialty') {
      const data = editableData.specialty || {};
      const sellerDetails = data.sellerDetails || {};
      const buyerDetails = data.buyerDetails || {};
      
      const products = Array.isArray(data.products) ? data.products.map(product => ({
        id: product.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: product.description || '',
        quantity: parseFloat(product.quantity) || 0,
        pricePerKg: parseFloat(product.pricePerKg) || 0,
        totalValue: parseFloat(product.totalValue) || 
          (parseFloat(product.quantity || 0) * parseFloat(product.pricePerKg || 0)).toFixed(2)
      })) : [];
      
      const paymentTerms = Array.isArray(data.paymentTermsItems) ? data.paymentTermsItems.map(item => {
        return {
          id: item.id || `term-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          description: item.description || item.text || ''
        };
      }) : [];
      
      return {
        contract_number: data.contractNumber || "KCL-SC-2024-" + new Date().getTime().toString().slice(-4),
        contract_date: data.currentDate || new Date().toISOString().split('T')[0],
        seller_name: sellerDetails.name || "KAJON Coffee Limited",
        seller_address: sellerDetails.address || "Kampala, Uganda",
        seller_registration: sellerDetails.registration || "Registration #: UG2023786541",
        buyer_name: buyerDetails.name || "[Buyer Company Name]",
        buyer_address: buyerDetails.address || "[Buyer Address]",
        buyer_registration: buyerDetails.registration || "[Buyer Registration #]",
        coffee_origin: data.coffeeOrigin || '',
        coffee_variety: data.coffeeVariety || '',
        coffee_process: data.coffeeProcess || '',
        coffee_grade: data.coffeeGrade || '',
        coffee_certification: data.coffeeCertification || '',
        cupping_score: data.cuppingScore ? parseFloat(data.cuppingScore) : null,
        products: products,
        payment_terms_items: paymentTerms,
        client_reference_id: data.clientReferenceId,
        shipping_left_label1: data.shipping_left_label1 || 'Incoterm:',
        shipping_left_value1: data.shipping_left_value1 || 'FOB Mombasa',
        shipping_left_label2: data.shipping_left_label2 || 'Packaging:',
        shipping_left_value2: data.shipping_left_value2 || '60kg jute bags with GrainPro liners',
        shipping_left_label3: data.shipping_left_label3 || 'Loading Port:',
        shipping_left_value3: data.shipping_left_value3 || 'Mombasa, Kenya',
        shipping_right_label1: data.shipping_right_label1 || 'Destination:',
        shipping_right_value1: data.shipping_right_value1 || 'Hamburg, Germany',
        shipping_right_label2: data.shipping_right_label2 || 'Latest Shipment Date:',
        shipping_right_value2: data.shipping_right_value2 || 'October 15, 2024',
        shipping_right_label3: data.shipping_right_label3 || 'Delivery Timeline:',
        shipping_right_value3: data.shipping_right_value3 || '30-45 days from loading',
        additional_shipping_terms_label: data.additional_shipping_terms_label || 'Additional Shipping Terms:',
        additional_shipping_terms: data.additional_shipping_terms || '',
        total_contract_value: parseFloat(data.totalContractValue || 0),
        currency: data.currency || 'USD'
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
    
    setEditableData(prev => ({
      ...prev,
      [activeTemplate]: null
    }));
  };

  const handleCoffeeSave = (contractData) => {
    if (isSubmittingCoffeeContract) {
      showErrorToast(toast, "A save operation is already in progress, please wait");
      return;
    }
    
    const loadingToastId = showLoadingToast(toast, "Saving coffee export contract...");
    
    saveCoffeeContract(contractData)
      .then(({ success, data, error }) => {
        dismissToast(loadingToastId);
        
        if (success) {
          showSuccessToast(toast, "Coffee export contract saved successfully");
          setActiveTemplate(null);
        } else {
          showErrorToast(toast, `Failed to save contract: ${error?.message || 'Unknown error'}`);
        }
      })
      .catch((error) => {
        console.error("Error saving contract:", error);
        dismissToast(loadingToastId);
        showErrorToast(toast, `An unexpected error occurred: ${error.message}`);
      });
  };

  const handleSpecialtyCoffeeSave = (contractData) => {
    if (isSubmittingSpecialtyContract) {
      showErrorToast(toast, "A save operation is already in progress, please wait");
      return;
    }
    
    const loadingToastId = showLoadingToast(toast, "Saving specialty coffee contract...");
    
    saveSpecialtyContract(contractData)
      .then(({ success, data, error }) => {
        dismissToast(loadingToastId);
        
        if (success) {
          showSuccessToast(toast, "Specialty coffee contract saved successfully");
          setActiveTemplate(null);
        } else {
          showErrorToast(toast, `Failed to save contract: ${error?.message || 'Unknown error'}`);
        }
      })
      .catch((error) => {
        console.error("Error saving contract:", error);
        dismissToast(loadingToastId);
        showErrorToast(toast, `An unexpected error occurred: ${error.message}`);
      });
  };

  const renderTemplate = () => {
    if (!activeTemplate) return null;
    
    const templateProps = {
      editMode,
      data: editableData[activeTemplate] || {},
      onDataChange: handleDataChange
    };
    
    switch(activeTemplate) {
      case "coffee":
        return <CoffeeContractTemplate {...templateProps} onSave={handleCoffeeSave} />;
      case "specialty":
        return <CoffeeContractTemplate {...templateProps} onSave={handleSpecialtyCoffeeSave} isSpecialty={true} />;
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
              <TabsTrigger value="coffee">Coffee Contracts</TabsTrigger>
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
                          onClick={() => handleViewTemplate("coffee", "standard")}
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
                          onClick={() => handleViewTemplate("specialty", "specialty")}
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
                              setActiveContractType(template.type);
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
