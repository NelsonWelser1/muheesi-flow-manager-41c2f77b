
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Download } from 'lucide-react';
import { useLocalPurchaseAgreements } from '@/integrations/supabase/hooks/useLocalPurchaseAgreements';
import ContractExportButtons from '../export-buttons/ContractExportButtons';
import { format } from 'date-fns';

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const LocalPurchaseAgreementView = ({ agreementId, onBack, onEdit }) => {
  const { toast } = useToast();
  const { getAgreementById, loading, error } = useLocalPurchaseAgreements();
  const [agreement, setAgreement] = useState(null);
  const contractRef = useRef(null);
  
  useEffect(() => {
    if (agreementId) {
      loadAgreement();
    }
  }, [agreementId]);
  
  const loadAgreement = async () => {
    const result = await getAgreementById(agreementId);
    if (result.success) {
      setAgreement(result.data);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading agreement details...</p>
      </div>
    );
  }
  
  if (error || !agreement) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error?.message || "Failed to load agreement"}</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Back to Agreements
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-xl font-semibold">
            Local Purchase Agreement
          </h2>
          <Badge className={statusColors[agreement.contract_status] || statusColors.draft}>
            {agreement.contract_status.charAt(0).toUpperCase() + agreement.contract_status.slice(1)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => onEdit && onEdit(agreement.id)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <ContractExportButtons
            templateRef={contractRef}
            contractData={agreement}
            filename={`local-purchase-${agreement.contract_number}`}
            showDropdown={false}
          />
        </div>
      </div>
      
      <div ref={contractRef} className="print-container p-6 border rounded-md bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">LOCAL PURCHASE AGREEMENT</h1>
          <div className="text-gray-500">Contract #: {agreement.contract_number}</div>
          <div className="text-gray-500">Date: {formatDate(agreement.agreement_date)}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">BUYER</h2>
            <Card>
              <CardContent className="p-4">
                <p className="font-semibold">{agreement.buyer_name}</p>
                <p>{agreement.buyer_address}</p>
                <p>{agreement.buyer_contact}</p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">SUPPLIER</h2>
            <Card>
              <CardContent className="p-4">
                <p className="font-semibold">{agreement.supplier_name}</p>
                <p>{agreement.supplier_address}</p>
                <p>{agreement.supplier_contact}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mb-6">
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
                {agreement.items && agreement.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{item.description}</td>
                    <td className="px-4 py-2 border">{item.variety}</td>
                    <td className="px-4 py-2 border">{item.quantity}</td>
                    <td className="px-4 py-2 border">{item.unit}</td>
                    <td className="px-4 py-2 border">${parseFloat(item.unit_price).toFixed(2)}</td>
                    <td className="px-4 py-2 border">${(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-right font-bold">
                    TOTAL:
                  </td>
                  <td className="px-4 py-2 border font-bold">
                    ${parseFloat(agreement.total_value).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">PAYMENT TERMS</h2>
            <Card>
              <CardContent className="p-4">
                <p>{agreement.payment_terms}</p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">DELIVERY TERMS</h2>
            <Card>
              <CardContent className="p-4">
                <p>{agreement.delivery_terms}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">QUALITY REQUIREMENTS</h2>
          <Card>
            <CardContent className="p-4">
              <p>{agreement.quality_requirements}</p>
            </CardContent>
          </Card>
        </div>
        
        {agreement.special_terms && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">SPECIAL TERMS AND CONDITIONS</h2>
            <Card>
              <CardContent className="p-4">
                <p>{agreement.special_terms}</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {agreement.notes && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">NOTES</h2>
            <Card>
              <CardContent className="p-4">
                <p>{agreement.notes}</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-6">
          <div className="border-t pt-4">
            <p className="font-semibold">For and on behalf of BUYER:</p>
            <div className="mt-6 h-10 border-b border-dashed">
              {agreement.signature_buyer && (
                <div className="italic text-blue-700">{agreement.signature_buyer}</div>
              )}
            </div>
            <p className="text-sm text-gray-500">Authorized Signature, Date</p>
          </div>
          
          <div className="border-t pt-4">
            <p className="font-semibold">For and on behalf of SUPPLIER:</p>
            <div className="mt-6 h-10 border-b border-dashed">
              {agreement.signature_supplier && (
                <div className="italic text-blue-700">{agreement.signature_supplier}</div>
              )}
            </div>
            <p className="text-sm text-gray-500">Authorized Signature, Date</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalPurchaseAgreementView;
