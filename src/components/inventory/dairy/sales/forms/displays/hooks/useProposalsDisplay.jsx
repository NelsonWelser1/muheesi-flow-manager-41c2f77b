
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";

export const useProposalsDisplay = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const fetchSalesProposals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching sales proposals:', error);
      showErrorToast(toast, "Failed to load sales proposals: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesProposals();
  }, []);

  const getFilteredProposals = () => {
    if (activeTab === "all") return proposals;
    return proposals.filter(proposal => proposal.status === activeTab);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return {
    proposals,
    isLoading,
    activeTab,
    setActiveTab,
    getFilteredProposals,
    formatDate,
    formatCurrency
  };
};

export default useProposalsDisplay;
