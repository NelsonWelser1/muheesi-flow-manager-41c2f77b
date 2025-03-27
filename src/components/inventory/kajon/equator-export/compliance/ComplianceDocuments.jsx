import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Download, Search, Upload, Filter, CheckCircle, AlertCircle,
  Clock, Files, Plus, Eye, Calendar, BookOpen, Clipboard, FileCheck,
  ArrowLeft, Printer, Edit, Save, RotateCcw
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CoffeeComplianceTemplate from './templates/CoffeeComplianceTemplate';
import GeneralProduceComplianceTemplate from './templates/GeneralProduceComplianceTemplate';
import FreshProduceComplianceTemplate from './templates/FreshProduceComplianceTemplate';
import { exportContractToPDF } from '../../contracts/utils/contractPdfExport';
import '../../contracts/styles/PrintStyles.css';

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

const ComplianceDocuments = () => {
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
    if (activeTemplate && !editableData[activeTemplate]) {
      const currentDate = new Date().toISOString().split('T')[0];
      const defaultData = {
        documentNumber: activeTemplate === 'coffee' ? 'KCL-CC-2024-001' : 
                      activeTemplate === 'general' ? 'KCL-GPC-2024-001' : 
                      'KCL-FPC-2024-001',
        currentDate: currentDate,
        issueDate: currentDate,
        expiryDate: '2024-12-31',
        destination: activeTemplate === 'coffee' ? 'European Union' : 
                    activeTemplate === 'general' ? 'United States' : 
                    'Japan',
        buyer: 'Client Company Name',
        buyerAddress: 'Client Address, Country',
        shipmentRef: 'SHP-2024-001',
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
    setTemplateSaved(false);
    setCurrentTemplate(null);
    setActiveTab('templates');
  };

  const handlePrint = () => {
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

    const wasInEditMode = editMode;
    if (wasInEditMode) {
      setEditMode(false);
    }

    setTimeout(async () => {
      try {
        const templateType = activeTemplate || "compliance";
        const filename = templateTitle ? 
          `${templateTitle.replace(/\s+/g, '_')}` : 
          `${templateType}_document_${new Date().toISOString().split('T')[0]}`;
        
        await exportContractToPDF(templateRef.current, filename, toast);
        
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
        
        if (wasInEditMode) {
          setEditMode(true);
        }
      }
    }, 100);
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
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
    
    setEditableData(prev => ({
      ...prev,
      [activeTemplate]: null
    }));
    
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

  const renderTemplate = () => {
    if (!activeTemplate) return null;
    
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

  const SaveTemplateModal = () => {
    if (!saveModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Save Compliance Document Template</h3>
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

  const handleBack = () => {
    setActiveTemplate(null);
    setActiveTab('documents');
  };

  return (
    <div className="space-y-6">
      <SaveTemplateModal />
      
      <div className="flex justify-between items-center print:hidden">
        {activeTemplate ? (
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Compliance Documents</span>
          </Button>
        ) : (
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Compliance Document Management</h2>
            <p className="text-gray-500 text-sm">Manage export certificates and compliance documents</p>
          </div>
        )}
        
        <div className="flex gap-2">
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
                  {!templateSaved ? (
                    <Button 
                      variant="outline" 
                      onClick={toggleEditMode}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Template</span>
                    </Button>
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
              <Button variant="outline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Expiring Soon</span>
              </Button>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>New Document</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {activeTemplate ? (
        <div className="print-container" ref={templateRef}>
          {renderTemplate()}
          
          <div className="mt-6 flex justify-center print:hidden">
            <Button variant="outline" onClick={handleBack}>
              Back to Compliance Documents
            </Button>
          </div>
        </div>
      ) : (
        <>
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">My Documents</TabsTrigger>
              <TabsTrigger value="requirements">Country Requirements</TabsTrigger>
              <TabsTrigger value="templates">Document Templates</TabsTrigger>
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
            
            <TabsContent value="templates" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span>Compliance Document Templates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border border-purple-200 hover:shadow-md transition-all">
                      <CardHeader className="bg-purple-50 pb-2">
                        <CardTitle className="text-lg">Coffee Compliance Certificate</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Comprehensive coffee certificate template including origin, quality grades, processing methods, and all required compliance parameters for coffee exports.
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
                    
                    <Card className="border border-green-200 hover:shadow-md transition-all">
                      <CardHeader className="bg-green-50 pb-2">
                        <CardTitle className="text-lg">General Produce Certificate</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Certification document for grains, pulses, and other agricultural commodities with complete phytosanitary details and international compliance standards.
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
                    
                    <Card className="border border-amber-200 hover:shadow-md transition-all">
                      <CardHeader className="bg-amber-50 pb-2">
                        <CardTitle className="text-lg">Fresh Produce Certificate</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Specialized certification for perishable exports with detailed quality parameters, storage specifications, and international food safety compliance.
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
                  </div>
                </CardContent>
              </Card>
              
              {savedTemplates.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Saved Compliance Templates</CardTitle>
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
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ComplianceDocuments;
