
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const useProposalInitialization = (setValue) => {
  const [proposalId, setProposalId] = useState('');
  const [currency, setCurrency] = useState('UGX');

  // Generate a unique proposal ID on component mount
  useEffect(() => {
    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
    const uniqueId = `PROP-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    setProposalId(uniqueId);
    setValue('proposal_id', uniqueId);
  }, [setValue]);

  return {
    proposalId,
    currency,
    setCurrency
  };
};

export default useProposalInitialization;
