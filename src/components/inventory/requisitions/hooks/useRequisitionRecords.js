
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { subHours, subDays, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

export const useRequisitionRecords = ({ 
  status = 'all',
  timeRange = 'week',
  searchTerm = '',
  sortConfig = { key: 'created_at', direction: 'desc' }
}) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Mock data for development purposes
  // In a real application, this would be replaced with a Supabase query
  const mockRequisitions = [
    {
      id: '1',
      requester_name: 'John Doe',
      department: 'Production',
      requisition_type: 'tools',
      urgency: 'high',
      status: 'pending',
      justification: 'Need tools for urgent maintenance',
      created_at: new Date(2023, 3, 15).toISOString(),
      updated_at: new Date(2023, 3, 15).toISOString()
    },
    {
      id: '2',
      requester_name: 'Jane Smith',
      department: 'Packaging',
      requisition_type: 'repairs',
      urgency: 'medium',
      status: 'approved',
      justification: 'Packaging machine needs repair',
      created_at: new Date(2023, 3, 10).toISOString(),
      updated_at: new Date(2023, 3, 11).toISOString()
    },
    {
      id: '3',
      requester_name: 'Robert Johnson',
      department: 'Warehouse',
      requisition_type: 'tools',
      urgency: 'low',
      status: 'completed',
      justification: 'Replacement tools for inventory',
      created_at: new Date(2023, 3, 5).toISOString(),
      updated_at: new Date(2023, 3, 12).toISOString()
    },
    {
      id: '4',
      requester_name: 'Sarah Williams',
      department: 'Quality Control',
      requisition_type: 'repairs',
      urgency: 'high',
      status: 'rejected',
      justification: 'Testing equipment repair',
      created_at: new Date(2023, 3, 8).toISOString(),
      updated_at: new Date(2023, 3, 9).toISOString()
    },
    {
      id: '5',
      requester_name: 'Michael Brown',
      department: 'Production',
      requisition_type: 'tools',
      urgency: 'medium',
      status: 'pending',
      justification: 'New tools for production line',
      created_at: new Date(2023, 3, 12).toISOString(),
      updated_at: new Date(2023, 3, 12).toISOString()
    }
  ];

  const getTimeRangeDate = () => {
    const now = new Date();
    switch (timeRange) {
      case 'hour': return subHours(now, 1);
      case 'today': return startOfDay(now);
      case 'week': return startOfWeek(now);
      case 'month': return startOfMonth(now);
      case 'year': return startOfYear(now);
      default: return null; // all time
    }
  };

  const fetchRequisitions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real application, this would be a Supabase query
      // For now, we'll simulate the API call with mock data and filtering
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = [...mockRequisitions];
      
      // Apply status filter
      if (status !== 'all') {
        filteredData = filteredData.filter(record => record.status === status);
      }
      
      // Apply time range filter
      if (timeRange !== 'all') {
        const timeRangeDate = getTimeRangeDate();
        if (timeRangeDate) {
          filteredData = filteredData.filter(record => 
            new Date(record.created_at) >= timeRangeDate
          );
        }
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(record => 
          record.requester_name?.toLowerCase().includes(searchLower) ||
          record.department?.toLowerCase().includes(searchLower) ||
          record.requisition_type?.toLowerCase().includes(searchLower) ||
          record.justification?.toLowerCase().includes(searchLower)
        );
      }
      
      setRecords(filteredData);
    } catch (err) {
      console.error('Error fetching requisition records:', err);
      setError(err.message || 'Failed to fetch requisition records');
      toast({
        title: "Error",
        description: "Failed to fetch requisition records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch on filter changes
  useEffect(() => {
    fetchRequisitions();
  }, [status, timeRange, searchTerm]);

  // Sort records based on sort configuration
  const sortedRecords = useMemo(() => {
    if (!records.length) return [];
    
    return [...records].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle date comparisons
      if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Handle numeric comparisons
      return sortConfig.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
  }, [records, sortConfig.key, sortConfig.direction]);

  return {
    records: sortedRecords,
    isLoading,
    error,
    refreshRecords: fetchRequisitions
  };
};
