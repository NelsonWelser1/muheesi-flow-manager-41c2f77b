
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Download, Search, Upload, Filter, CheckCircle, AlertCircle,
  Clock, Files, Plus, Eye, Calendar, BookOpen, Clipboard, FileCheck,
  Edit, Save, RotateCcw, Printer, ArrowLeft
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CoffeeComplianceTemplate from "./templates/CoffeeComplianceTemplate";
import GeneralProduceComplianceTemplate from "./templates/GeneralProduceComplianceTemplate";
import FreshProduceComplianceTemplate from "./templates/FreshProduceComplianceTemplate";
import { exportComplianceToPDF, batchExportComplianceToPDF } from "./utils/compliancePdfExport";
import "../../contracts/styles/PrintStyles.css";

// Sample compliance documents data
const documents = [
  {
    id: 'DOC-001',
    title: 'Certificate of Origin - Germany',
    type: 'certificate',
    country: 'Germany',
    status: 'valid',
    dateIssued: '2023-11-15',
    expiryDate: '2024-11-15',
    issuer: 'Uganda Coffee Development Authority',
    contract: 'CNT-1001',
    lastUpdated: '2023-11-15'
  },
  {
    id: 'DOC-002',
    title: 'Phytosanitary Certificate - USA',
    type: 'phytosanitary',
    country: 'USA',
    status: 'pending',
    dateIssued: '2023-12-05',
    expiryDate: '2024-01-05',
    issuer: 'Ministry of Agriculture',
    contract: 'CNT-1002',
    lastUpdated: '2023-12-05'
  },
  {
    id: 'DOC-003',
    title: 'ICO Certificate of Export',
    type: 'ico',
    country: 'Multiple',
    status: 'valid',
    dateIssued: '2023-10-20',
    expiryDate: '2024-04-20',
    issuer: 'International Coffee Organization',
    contract: 'Multiple',
    lastUpdated: '2023-10-20'
  },
  {
    id: 'DOC-004',
    title: 'Quality Certificate - Japan',
    type: 'quality',
    country: 'Japan',
    status: 'valid',
    dateIssued: '2023-11-25',
    expiryDate: '2024-11-25',
    issuer: 'Uganda Coffee Quality Institute',
    contract: 'CNT-1003',
    lastUpdated: '2023-11-25'
  },
  {
    id: 'DOC-005',
    title: 'Organic Certification',
    type: 'organic',
    country: 'Multiple',
    status: 'expiring',
    dateIssued: '2023-02-10',
    expiryDate: '2024-01-10',
    issuer: 'EcoCert',
    contract: 'Multiple',
    lastUpdated: '2023-10-15'
  },
  {
    id: 'DOC-006',
    title: 'Fair Trade Certification',
    type: 'fairtrade',
    country: 'Multiple',
    status: 'valid',
    dateIssued: '2023-05-18',
    expiryDate: '2025-05-18',
    issuer: 'Fair Trade International',
    contract: 'Multiple',
    lastUpdated: '2023-09-20'
  },
  {
    id: 'DOC-007',
    title: 'Commercial Invoice - UAE',
    type: 'invoice',
    country: 'UAE',
    status: 'valid',
    dateIssued: '2023-12-01',
    expiryDate: 'N/A',
    issuer: 'KAJON Coffee Limited',
    contract: 'CNT-1004',
    lastUpdated: '2023-12-01'
  }
];

// Sample document requirements by country
const countryRequirements = [
  {
    country: 'European Union',
    requirements: [
      'Certificate of Origin',
      'Phytosanitary Certificate',
      'ICO Certificate of Export',
      'Commercial Invoice',
      'Bill of Lading',
      'Packing List',
      'Single Administrative Document (SAD)',
      'EUR.1 Movement Certificate'
    ]
  },
  {
    country: 'United States',
    requirements: [
      'Certificate of Origin',
      'Phytosanitary Certificate',
      'Commercial Invoice',
      'Customs Entry Form 3461',
      'Packing List',
      'Bill of Lading',
      'FDA Prior Notice',
      'Importer Security Filing (10+2)'
    ]
  },
  {
    country: 'Japan',
    requirements: [
      'Certificate of Origin',
      'Phytosanitary Certificate',
      'Quality Certificate',
      'Commercial Invoice',
      'Packing List',
      'Bill of Lading',
      'Customs Declaration',
      'Import Permit'
    ]
  },
  {
    country: 'Middle East',
    requirements: [
      'Certificate of Origin',
      'Phytosanitary Certificate',
      'Commercial Invoice',
      'Packing List',
      'Bill of Lading',
      'Halal Certificate (if required)',
      'Legalized Documents',
      'Quality Certificate'
    ]
  }
];

const statusColors = {
  'valid': "bg-green-100 text-green-800",
  'pending': "bg-amber-100 text-amber-800",
  'expiring': "bg-orange-100 text-orange-800",
  'expired': "bg-red-100 text-red-800",
  'rejected': "bg-red-100 text-red-800"
};

const documentTypeIcons = {
  'certificate': FileText,
  'phytosanitary': FileCheck,
  'ico': BookOpen,
  'quality': CheckCircle,
  'organic': FileText,
  'fairtrade': FileText,
  'invoice': FileText
};

const ComplianceDocuments = ({ onBack }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('documents');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState({
    coffee: null,
    general: null,
    fresh: null
  });
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [templateSaved, setTemplateSaved] = useState(false);
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
        currentDate: currentDate,
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
    setCurrentTemplate(null); // Reset current template
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
        const templateType = activeTemplate || "compliance";
        const filename = templateTitle ? 
          `${templateTitle.replace(/\s+/g, '_')}` : 
          `${templateType}_certificate_${new Date().toISOString().split('T')[0]}`;
        
        await exportComplianceToPDF(templateRef.current, filename, toast);
        
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
    // Reset saved state when entering edit mode
    if (!editMode) {
      setTemplateSaved(false);
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
    setTemplateSaved(false);
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
    setTemplateSaved(true);
    setCurrentTemplate(newTemplate);
    
    toast({
      title: "Success",
      description: "Template saved successfully"
    });
  };

  const handleBatchExport = async () => {
    if (savedTemplates.length === 0) {
      toast({
        title: "No Templates",
        description: "There are no saved templates to export",
        variant: "destructive"
      });
      return;
    }

    // This is a simplified example. In a real application, you would need to 
    // render each template to DOM, create refs, and export them.
    toast({
      title: "Batch Export",
      description: `Starting export of ${savedTemplates.length} templates...`,
    });
    
    // In a real implementation, this would be more complex
    // and would involve rendering each template and capturing it
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
        return <CoffeeComplianceTemplate {...templateProps} />;
      case "general":
        return <GeneralProduceComplianceTemplate {...templateProps} />;
      case "fresh":
        return <FreshProduceComplianceTemplate {...templateProps} />;
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
          <h3 className="text-lg font-semibold mb-4">Save Compliance Document</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Document Title</label>
            <input 
              type="text"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter a title for this document"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              Save Document
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Individual template card component
  const TemplateCard = ({ title, description, type, onClick }) => (
    <Card className={`border ${
      type === 'coffee' ? 'border-blue-200' : 
      type === 'general' ? 'border-green-200' : 
      'border-amber-200'
    } hover:shadow-md transition-all`}>
      <CardHeader className={`${
        type === 'coffee' ? 'bg-blue-50' : 
        type === 'general' ? 'bg-green-50' : 
        'bg-amber-50'
      } pb-2`}>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-600 mb-4">
          {description}
        </p>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={onClick}
          >
            <Eye className="h-4 w-4" />
            <span>View Template</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Document template category section
  const renderTemplateCategory = (title, templates, bgClass) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        {templates.map((template, index) => (
          <TemplateCard
            key={index}
            title={template.title}
            description={template.description}
            type={template.type}
            onClick={() => handleViewTemplate(template.type)}
          />
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <SaveTemplateModal />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 print:hidden">
        <div>
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          )}
        </div>
        <h2 className="text-xl font-semibold">Compliance Document Management</h2>
        <div className="flex items-center gap-2">
          {activeTemplate ? (
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
                    variant="outline" 
                    onClick={() => setSaveModalOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save As</span>
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
                    <span>Edit Document</span>
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
          ) : (
            <>
              {savedTemplates.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleBatchExport}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Batch Export</span>
                </Button>
              )}
              <Button 
                className="flex items-center gap-1"
                onClick={() => handleViewTemplate("coffee")}
              >
                <Plus className="h-4 w-4" />
                <span>New Document</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Document Expiry Alert */}
      {!activeTemplate && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <span className="text-orange-800">
              Organic Certification (DOC-005) expires in 15 days. Please initiate renewal process.
            </span>
            <Button size="sm" variant="outline" className="ml-auto border-orange-300 text-orange-700 hover:bg-orange-100">
              Start Renewal
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Document Status Overview */}
      {!activeTemplate && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-green-700">Valid Documents</p>
                  <p className="text-2xl font-bold text-green-900">12</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-amber-700">Pending Approval</p>
                  <p className="text-2xl font-bold text-amber-900">3</p>
                </div>
                <div className="bg-amber-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-orange-700">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-900">2</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-red-700">Expired</p>
                  <p className="text-2xl font-bold text-red-900">1</p>
                </div>
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
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
        <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          <TabsList>
            <TabsTrigger value="documents">My Documents</TabsTrigger>
            <TabsTrigger value="templates">Document Templates</TabsTrigger>
            <TabsTrigger value="requirements">Country Requirements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Files className="h-5 w-5 text-blue-600" />
                    <span>Export Compliance Documents</span>
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search documents..." className="pl-8" />
                    </div>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Document ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => {
                        const IconComponent = documentTypeIcons[doc.type] || FileText;
                        return (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4 text-gray-600" />
                                <span>{doc.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>{doc.country}</TableCell>
                            <TableCell>{doc.dateIssued}</TableCell>
                            <TableCell>{doc.expiryDate}</TableCell>
                            <TableCell>{doc.issuer}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[doc.status]}>
                                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            {/* Saved Templates */}
            {savedTemplates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>My Saved Templates</span>
                  </CardTitle>
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
                                setCurrentTemplate(template);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              <span>Export</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            {/* Coffee Templates */}
            {renderTemplateCategory("Coffee Export Templates", [
              {
                title: "Certificate of Origin",
                description: "Standard certificate of origin for coffee exports, including product details, origin information, and compliance specifications.",
                type: "coffee"
              },
              {
                title: "Quality Certificate",
                description: "Detailed quality certification for specialty coffee, including cupping scores, sensory attributes, and processing methods.",
                type: "coffee"
              }
            ])}
            
            {/* General Produce Templates */}
            {renderTemplateCategory("General Produce Templates", [
              {
                title: "Agricultural Produce Certificate",
                description: "Comprehensive certificate for grains, pulses, and other dry agricultural products for international export.",
                type: "general"
              },
              {
                title: "Organic Compliance Certificate",
                description: "Documentation certifying compliance with organic standards for agricultural products.",
                type: "general"
              }
            ])}
            
            {/* Fresh Produce Templates */}
            {renderTemplateCategory("Fresh Produce Templates", [
              {
                title: "Fresh Produce Certificate",
                description: "Specialized certificate for fresh fruits and vegetables with handling, storage, and shelf-life specifications.",
                type: "fresh"
              },
              {
                title: "Perishable Goods Certificate",
                description: "Certificate for highly perishable products requiring temperature-controlled transportation and storage.",
                type: "fresh"
              }
            ])}
            
            {/* Form Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Standard Form Templates</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                {[
                  { name: 'Certificate of Origin Form', icon: FileText },
                  { name: 'Commercial Invoice Template', icon: FileText },
                  { name: 'Packing List Template', icon: FileText },
                  { name: 'Quality Certificate Template', icon: CheckCircle },
                  { name: 'Bill of Lading Template', icon: FileText },
                  { name: 'Phytosanitary Application Form', icon: FileCheck }
                ].map((template, i) => {
                  const TemplateIcon = template.icon;
                  return (
                    <Card key={i} className="flex flex-col items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="bg-blue-100 p-4 rounded-full mb-3">
                        <TemplateIcon className="h-6 w-6 text-blue-700" />
                      </div>
                      <h3 className="text-center font-medium">{template.name}</h3>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-blue-600" />
                  <span>Export Documentation Requirements by Country</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {countryRequirements.map((country, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3">{country.country}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {country.requirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ComplianceDocuments;
