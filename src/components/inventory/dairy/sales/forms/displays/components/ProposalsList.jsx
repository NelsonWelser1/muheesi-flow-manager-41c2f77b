
import React from 'react';
import ProposalCard from './ProposalCard';

const ProposalsList = ({ proposals, formatDate, formatCurrency }) => {
  if (proposals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sales proposals found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <ProposalCard 
          key={proposal.proposal_id} 
          proposal={proposal} 
          formatDate={formatDate} 
          formatCurrency={formatCurrency} 
        />
      ))}
    </div>
  );
};

export default ProposalsList;
