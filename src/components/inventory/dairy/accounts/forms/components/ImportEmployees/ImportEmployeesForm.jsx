
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FileImportTab from './tabs/FileImportTab';
import SampleDataTab from './tabs/SampleDataTab';
import { useImportEmployees } from './hooks/useImportEmployees';

const ImportEmployeesForm = ({ onImport }) => {
  const [importMethod, setImportMethod] = useState("file");
  const { toast } = useToast();
  
  const { 
    sampleData,
    fileData,
    errors,
    handleFileUpload,
    generateSampleData,
    downloadTemplate,
    handleSubmit
  } = useImportEmployees({ onImport, toast });

  return (
    <div className="space-y-4">
      <Tabs value={importMethod} onValueChange={setImportMethod}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="file">Import from File</TabsTrigger>
          <TabsTrigger value="sample">Use Sample Data</TabsTrigger>
        </TabsList>
        
        <FileImportTab 
          active={importMethod === "file"} 
          fileData={fileData}
          errors={errors}
          handleFileUpload={handleFileUpload}
          downloadTemplate={downloadTemplate}
        />
        
        <SampleDataTab
          active={importMethod === "sample"}
          sampleData={sampleData}
          fileData={fileData}
          generateSampleData={generateSampleData}
        />
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          className="bg-[#0000a0] hover:bg-[#00008b]"
          onClick={handleSubmit}
          disabled={!fileData || fileData.length === 0 || errors.length > 0}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

export default ImportEmployeesForm;
