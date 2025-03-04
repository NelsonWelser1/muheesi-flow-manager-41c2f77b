
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

// Mock data for distribution records
const mockDistributionRecords = [
  {
    id: 1,
    customer: 'Kampala Supermarket',
    product: 'milk',
    quantity: 200,
    unit: 'liters',
    price: 2500,
    deliveryDate: '2025-02-15',
    destination: 'Kampala Central',
    status: 'delivered'
  },
  {
    id: 2,
    customer: 'Nakasero Market',
    product: 'yogurt',
    quantity: 150,
    unit: 'pcs',
    price: 1800,
    deliveryDate: '2025-02-20',
    destination: 'Nakasero',
    status: 'pending'
  },
  {
    id: 3,
    customer: 'Entebbe Shop',
    product: 'cheese',
    quantity: 50,
    unit: 'kg',
    price: 12000,
    deliveryDate: '2025-02-22',
    destination: 'Entebbe Road',
    status: 'pending'
  }
];

export const useDistributionRecords = () => {
  const [distributionRecords, setDistributionRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // For mock data
        setDistributionRecords(mockDistributionRecords);
        
        // In a real application, you would fetch from the database:
        /*
        const { data, error } = await supabase
          .from('distribution_records')
          .select('*')
          .order('delivery_date', { ascending: false });
          
        if (error) throw error;
        setDistributionRecords(data);
        */
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching distribution records:', error);
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return {
    distributionRecords,
    isLoading
  };
};
