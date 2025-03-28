
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet, FileText, Coffee, Leaf, ChevronLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CoffeeComplianceTemplate from "./templates/CoffeeComplianceTemplate";
import GeneralProduceComplianceTemplate from "./templates/GeneralProduceComplianceTemplate";
import FreshProduceComplianceTemplate from "./templates/FreshProduceComplianceTemplate";
import "../compliance/styles/PrintStyles.css";

const documents = [
  {
    id: 'certificate-of-origin',
    name: 'Certificate of Origin',
    type: 'coffee',
    icon: FileText,
  },
  {
    id: 'quality-certificate',
    name: 'Quality Certificate',
    type: 'coffee',
    icon: FileSpreadsheet,
  },
  {
    id: 'packing-list',
    name: 'Packing List Template',
    type: 'general',
    icon: FileText,
  },
  {
    id: 'commercial-invoice',
    name: 'Commercial Invoice Template',
    type: 'general',
    icon: FileText,
  },
  {
    id: 'bill-of-lading',
    name: 'Bill of Lading Template',
    type: 'general',
    icon: FileSpreadsheet,
  },
  {
    id: 'phytosanitary-application',
    name: 'Phytosanitary Application Form',
    type: 'fresh',
    icon: FileText,
  },
];

const ComplianceDocuments = ({ onBack }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('coffee');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
    setIsEditing(false);
    setIsSaved(false);
    setDocumentTitle('');
  };

  const handleBack = () => {
    if (selectedDocument) {
      setSelectedDocument(null);
    } else if (onBack) {
      onBack();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleDoneEditing = () => {
    setIsEditing(false);
  };

  const handleSaveAs = () => {
    if (!documentTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your document",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Document Saved",
      description: `'${documentTitle}' has been saved successfully.`,
    });
    
    setIsSaved(true);
    setIsEditing(false);
  };

  const handleReset = () => {
    toast({
      title: "Document Reset",
      description: "All changes have been discarded.",
    });
  };

  const exportToPDF = async () => {
    const element = document.getElementById('document-to-print');
    if (!element) return;

    try {
      document.body.classList.add('generating-pdf');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${documentTitle || selectedDocument.name}.pdf`);
      
      toast({
        title: "PDF Exported",
        description: "Your document has been exported as PDF successfully.",
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      document.body.classList.remove('generating-pdf');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderDocumentTemplate = () => {
    const templateProps = {
      isEditing,
      documentData: {
        title: documentTitle || selectedDocument.name,
      },
      setDocumentData: () => {},
    };

    if (selectedDocument.type === 'coffee') {
      return <CoffeeComplianceTemplate {...templateProps} />;
    } else if (selectedDocument.type === 'general') {
      return <GeneralProduceComplianceTemplate {...templateProps} />;
    } else if (selectedDocument.type === 'fresh') {
      return <FreshProduceComplianceTemplate {...templateProps} />;
    }
    
    return <div>Template not found</div>;
  };

  const filteredDocuments = documents.filter(doc => doc.type === activeTab);

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        {selectedDocument ? "Back to Documents" : "Back"}
      </Button>

      {!selectedDocument ? (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="coffee" className="flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                <span>Coffee Templates</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>General Produce</span>
              </TabsTrigger>
              <TabsTrigger value="fresh" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span>Fresh Produce</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="coffee" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <Card 
                    key={doc.id} 
                    className="cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => handleDocumentSelect(doc)}
                  >
                    <CardContent className="p-6 flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <doc.icon className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-500">Coffee Export Template</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border-dashed cursor-pointer hover:bg-gray-50 transition">
                  <CardContent className="p-6 flex items-center justify-center">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      <span>Create Custom Template</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="general" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <Card 
                    key={doc.id} 
                    className="cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => handleDocumentSelect(doc)}
                  >
                    <CardContent className="p-6 flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <doc.icon className="h-6 w-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-500">General Export Template</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border-dashed cursor-pointer hover:bg-gray-50 transition">
                  <CardContent className="p-6 flex items-center justify-center">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      <span>Create Custom Template</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fresh" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => (
                  <Card 
                    key={doc.id} 
                    className="cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => handleDocumentSelect(doc)}
                  >
                    <CardContent className="p-6 flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <doc.icon className="h-6 w-6 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-500">Fresh Produce Template</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border-dashed cursor-pointer hover:bg-gray-50 transition">
                  <CardContent className="p-6 flex items-center justify-center">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      <span>Create Custom Template</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{selectedDocument.name}</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleReset}>Reset</Button>
                  <Button variant="outline" onClick={handleDoneEditing}>Done Editing</Button>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter document title..."
                      className="px-3 py-2 border rounded-md mr-2"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                    />
                    <Button onClick={handleSaveAs}>Save As</Button>
                  </div>
                </>
              ) : (
                <>
                  <Button onClick={handleEdit} variant="outline">Edit Template</Button>
                  {isSaved && (
                    <>
                      <Button onClick={handlePrint} variant="outline">Print</Button>
                      <Button onClick={exportToPDF}>Download PDF</Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div id="document-to-print" className="print-container bg-white border rounded-lg p-6">
            {renderDocumentTemplate()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceDocuments;
