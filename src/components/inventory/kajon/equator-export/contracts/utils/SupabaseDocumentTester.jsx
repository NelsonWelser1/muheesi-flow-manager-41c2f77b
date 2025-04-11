
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { Loader2, Check, AlertCircle } from "lucide-react";

/**
 * A minimal test component to verify Supabase document uploads and DB inserts
 * This isolates the document upload functionality for debugging
 */
const SupabaseDocumentTester = () => {
  const [file, setFile] = useState(null);
  const [contractId, setContractId] = useState('TEST-001');
  const [client, setClient] = useState('Test Client');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [dbInsertResults, setDbInsertResults] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('File selected:', selectedFile.name);
    }
  };
  
  const runTest = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadResults(null);
    setDbInsertResults(null);
    
    try {
      console.log('=== SUPABASE DOCUMENT TEST STARTED ===');
      
      // 1. Test Supabase session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Current session:', sessionData?.session ? 'Active' : 'No active session');
      
      // 2. Check if bucket exists
      console.log('Checking for documents bucket...');
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.warn('Unable to list buckets:', bucketsError);
        } else {
          console.log('Available buckets:', buckets?.map(b => b.name).join(', ') || 'None');
        }
      } catch (bucketError) {
        console.error('Bucket check error:', bucketError);
      }
      
      // 3. Attempt file upload
      console.log('Uploading file to storage...');
      const timestamp = Date.now();
      const filePath = `test-documents/${timestamp}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      setUploadResults({
        success: !uploadError,
        data: uploadData,
        error: uploadError
      });
      
      if (uploadError) {
        console.error('File upload failed:', uploadError);
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive"
        });
        
        // Try creating the bucket if it doesn't exist
        if (uploadError.message.includes('not found')) {
          console.log('Attempting to create documents bucket...');
          const { data: bucketData, error: bucketError } = await supabase.storage
            .createBucket('documents', {
              public: true
            });
            
          console.log('Bucket creation result:', bucketError ? `Error: ${bucketError.message}` : 'Success');
          
          if (!bucketError) {
            // Retry upload
            console.log('Retrying upload after bucket creation...');
            const { data: retryData, error: retryError } = await supabase.storage
              .from('documents')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
              });
              
            setUploadResults({
              success: !retryError,
              data: retryData,
              error: retryError
            });
            
            if (retryError) {
              console.error('Retry upload failed:', retryError);
              return;
            } else {
              console.log('Retry upload succeeded');
            }
          }
        } else {
          return;
        }
      } else {
        console.log('File upload succeeded');
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      console.log('Public URL:', publicUrlData?.publicUrl);
      
      // 4. Attempt database insert
      console.log('Inserting record into contract_documents table...');
      const documentRecord = {
        filename: file.name,
        file_path: filePath,
        file_url: publicUrlData?.publicUrl || '',
        contract_id: contractId,
        file_type: file.type,
        file_size: file.size,
        client: client,
        notes: 'Test upload via debugging component',
        keywords: ['test', 'debug'],
        signed_by: ['tester'],
        status: 'pending_verification'
      };
      
      console.log('Document record to insert:', documentRecord);
      
      const { data: insertData, error: insertError } = await supabase
        .from('contract_documents')
        .insert([documentRecord])
        .select();
        
      setDbInsertResults({
        success: !insertError,
        data: insertData,
        error: insertError
      });
      
      if (insertError) {
        console.error('Database insert failed:', insertError);
        toast({
          title: "Database insert failed",
          description: insertError.message,
          variant: "destructive"
        });
      } else {
        console.log('Database insert succeeded:', insertData);
        toast({
          title: "Test completed successfully",
          description: "File uploaded and database record created",
        });
      }
      
      console.log('=== SUPABASE DOCUMENT TEST COMPLETED ===');
      
    } catch (error) {
      console.error('Test failed with exception:', error);
      toast({
        title: "Test failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Document Upload Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload Test File</label>
          <Input 
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.jpg,.jpeg,.png"
            disabled={isUploading}
          />
          {file && (
            <p className="mt-1 text-sm">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Contract ID</label>
          <Input
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            disabled={isUploading}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Client</label>
          <Input
            value={client}
            onChange={(e) => setClient(e.target.value)}
            disabled={isUploading}
          />
        </div>
        
        {uploadResults && (
          <div className={`p-3 rounded-md ${uploadResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className="font-medium flex items-center gap-2">
              {uploadResults.success ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              Storage Upload Result:
            </h3>
            <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-24">
              {uploadResults.success 
                ? 'Success: File uploaded to storage' 
                : `Error: ${uploadResults.error?.message || 'Unknown error'}`}
            </pre>
          </div>
        )}
        
        {dbInsertResults && (
          <div className={`p-3 rounded-md ${dbInsertResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className="font-medium flex items-center gap-2">
              {dbInsertResults.success ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              Database Insert Result:
            </h3>
            <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-24">
              {dbInsertResults.success 
                ? `Success: Record ID ${dbInsertResults.data?.[0]?.id || 'Unknown'} created` 
                : `Error: ${dbInsertResults.error?.message || 'Unknown error'}`}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runTest} 
          disabled={isUploading || !file}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : 'Run Supabase Document Test'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseDocumentTester;
