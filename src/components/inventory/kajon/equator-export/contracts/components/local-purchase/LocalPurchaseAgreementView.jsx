
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, Clock } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { exportContractToPDF, exportContractToJPG, exportContractToExcel } from '../../utils/contractExportUtils';

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const LocalPurchaseAgreementView = ({ agreement, onBack, onEdit }) => {
  const { toast } = useToast();
  const agreementRef = useRef(null);
  
  if (!agreement) {
    return (
      <div className="p-8 text-center">
        <p>Agreement not found. Please go back and try again.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Back to Agreements
        </Button>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (e) {
      return dateString || 'N/A';
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value || 0);
  };
  
  const handleExportPDF = async () => {
    await exportContractToPDF(agreementRef.current, `local-purchase-${agreement.contract_number}`, toast);
  };

  const handleExportJPG = async () => {
    await exportContractToJPG(agreementRef.current, `local-purchase-${agreement.contract_number}`, toast);
  };

  const handleExportExcel = async () => {
    await exportContractToExcel(agreementRef.current, agreement, `local-purchase-${agreement.contract_number}`, toast);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Agreements
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={onEdit}
          >
            <FileText className="h-4 w-4" />
            Edit Agreement
          </Button>
          
          {/* Export Dropdown */}
          <div className="relative group">
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 hidden group-hover:block">
              <div className="py-1">
                <button
                  onClick={handleExportPDF}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button
                  onClick={handleExportJPG}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as JPG
                </button>
                <button
                  onClick={handleExportExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Local Purchase Agreement #{agreement.contract_number}
          </h1>
          <p className="text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="h-4 w-4" />
            Last updated: {formatDate(agreement.updated_at || agreement.created_at)}
          </p>
        </div>
        <Badge className={statusColors[agreement.contract_status] || statusColors.draft}>
          {agreement.contract_status.charAt(0).toUpperCase() + agreement.contract_status.slice(1)}
        </Badge>
      </div>
      
      <div ref={agreementRef} className="print-container p-6 border rounded-md bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">LOCAL PURCHASE AGREEMENT</h1>
          <div className="text-gray-500">Contract #: {agreement.contract_number}</div>
          <div className="text-gray-500">Date: {formatDate(agreement.agreement_date)}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 text-blue-700">BUYER</h2>
              <div className="space-y-1">
                <p><strong>Company:</strong> {agreement.buyer_name}</p>
                <p><strong>Address:</strong> {agreement.buyer_address || 'N/A'}</p>
                <p><strong>Contact:</strong> {agreement.buyer_contact || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 text-blue-700">SUPPLIER</h2>
              <div className="space-y-1">
                <p><strong>Company/Farm/Producer:</strong> {agreement.supplier_name}</p>
                <p><strong>Address:</strong> {agreement.supplier_address || 'N/A'}</p>
                <p><strong>Contact:</strong> {agreement.supplier_contact || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">PRODUCTS</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left border">Description</th>
                    <th className="px-4 py-2 text-left border">Variety/Type</th>
                    <th className="px-4 py-2 text-left border">Quantity</th>
                    <th className="px-4 py-2 text-left border">Unit</th>
                    <th className="px-4 py-2 text-left border">Price per Unit</th>
                    <th className="px-4 py-2 text-left border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(agreement.items || []).map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{item.description || 'N/A'}</td>
                      <td className="px-4 py-2 border">{item.variety || 'N/A'}</td>
                      <td className="px-4 py-2 border">{item.quantity || 0}</td>
                      <td className="px-4 py-2 border">{item.unit || 'Kg'}</td>
                      <td className="px-4 py-2 border">{formatCurrency(item.unit_price || 0)}</td>
                      <td className="px-4 py-2 border">
                        {formatCurrency((item.quantity || 0) * (item.unit_price || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-right font-bold border">
                      TOTAL:
                    </td>
                    <td className="px-4 py-2 border font-bold">
                      {formatCurrency(agreement.total_value || 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 text-blue-700">PAYMENT TERMS</h2>
              <p>{agreement.payment_terms || 'N/A'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2 text-blue-700">DELIVERY TERMS</h2>
              <p>{agreement.delivery_terms || 'N/A'}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">QUALITY REQUIREMENTS</h2>
            <p>{agreement.quality_requirements || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">SPECIAL TERMS AND CONDITIONS</h2>
            <p>{agreement.special_terms || 'None specified'}</p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">NOTES</h2>
            <p>{agreement.notes || 'None'}</p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-6">
          <div className="border-t pt-4">
            <p className="font-semibold">For and on behalf of BUYER:</p>
            <div className="mt-6 h-10 border-b border-dashed"></div>
            <p className="text-sm text-gray-500">Authorized Signature, Date</p>
          </div>
          
          <div className="border-t pt-4">
            <p className="font-semibold">For and on behalf of SUPPLIER:</p>
            <div className="mt-6 h-10 border-b border-dashed"></div>
            <p className="text-sm text-gray-500">Authorized Signature, Date</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalPurchaseAgreementView;
