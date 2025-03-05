
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import StatusBadge from './StatusBadge';
import ProductsTable from './ProductsTable';

const ProposalCard = ({ proposal, formatDate, formatCurrency }) => {
  return (
    <Card key={proposal.proposal_id} className="overflow-hidden">
      <div className="p-4 bg-muted/20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">Proposal for {proposal.customer_name || 'Unnamed Customer'}</h3>
            <p className="text-sm text-muted-foreground">
              ID: {proposal.proposal_id || 'N/A'} &bull; Created: {formatDate(proposal.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={proposal.status} />
            <Button variant="ghost" size="icon" title="View Proposal">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Download Proposal">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
          <div>
            <p className="text-sm font-medium">Proposal Date</p>
            <p className="text-sm">{formatDate(proposal.proposal_date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Valid For</p>
            <p className="text-sm">{proposal.validity_period || 30} days</p>
          </div>
          <div>
            <p className="text-sm font-medium">Grand Total</p>
            <p className="text-sm font-bold">{formatCurrency(proposal.grand_total)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium">Customer Details</p>
            <p className="text-sm">{proposal.customer_name}</p>
            <p className="text-sm">{proposal.customer_email}</p>
            <p className="text-sm">{proposal.customer_phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Products</p>
            <p className="text-sm">{(proposal.products || []).length} items</p>
          </div>
        </div>
        
        <ProductsTable products={proposal.products || []} />
      </div>
    </Card>
  );
};

export default ProposalCard;
