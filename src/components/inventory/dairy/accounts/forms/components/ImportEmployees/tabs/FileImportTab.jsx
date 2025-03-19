
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import ValidationErrors from '../components/ValidationErrors';

const FileImportTab = ({ active, fileData, errors, handleFileUpload, downloadTemplate }) => {
  const fileInputRef = useRef(null);

  return (
    <TabsContent value="file" forceMount hidden={!active} className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
            <FileSpreadsheet className="h-10 w-10 text-gray-400 mb-2" />
            <p className="mb-2 text-sm text-gray-500">Upload Excel or CSV file with employee data</p>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadTemplate}
              >
                Download Template
              </Button>
            </div>
          </div>

          {fileData && (
            <div className="mt-4">
              <p className="text-sm text-green-600 font-medium">
                ✓ File imported with {fileData.length} employee records
              </p>
            </div>
          )}
          
          {errors.length > 0 && <ValidationErrors errors={errors} />}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default FileImportTab;
