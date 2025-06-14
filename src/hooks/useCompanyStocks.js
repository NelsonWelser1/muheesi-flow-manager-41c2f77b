
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useCompanyStocks = (company) => {
  // Add debugging
  const queryClient = useQueryClient();
  console.log('useCompanyStocks called for company:', company, 'QueryClient:', queryClient);
  
  return useQuery({
    queryKey: ['companyStocks', company],
    queryFn: async () => {
      console.log('Fetching stocks for company:', company);
      
      try {
        // Try to fetch from database
        const { data, error } = await supabase
          .from('company_stocks')
          .select('*')
          .eq('company', company);

        if (error) {
          console.error('Error fetching company stocks:', error);
          throw error;
        }

        console.log('Fetched stocks for', company, ':', data);
        
        // If data is available, return it
        if (data && data.length > 0) {
          return data;
        }
        
        // If no data in company_stocks, try company-specific tables
        let specificData = [];
        
        if (company === 'Grand Berna Dairies') {
          const { data: dairyData } = await supabase
            .from('dairy_inventory')
            .select('*');
          
          if (dairyData) {
            specificData = dairyData.map(item => ({
              company: 'Grand Berna Dairies',
              product_name: item.product_name || item.product_type,
              quantity: item.quantity,
              unit: item.unit || '',
              location: item.location || ''
            }));
          }
        } 
        else if (company === 'KAJON Coffee Limited') {
          const { data: coffeeData } = await supabase
            .from('coffee_inventory')
            .select('*');
          
          if (coffeeData) {
            specificData = coffeeData.map(item => ({
              company: 'KAJON Coffee Limited',
              product_name: item.coffee_type ? `${item.coffee_type} ${item.grade || ''}`.trim() : item.product_name,
              quantity: item.quantity,
              unit: item.unit || 'kg',
              location: item.location || ''
            }));
          }
        }
        else if (company === 'Kyalima Farmers Limited') {
          const { data: farmData } = await supabase
            .from('farm_inventory')
            .select('*');
          
          if (farmData) {
            specificData = farmData.map(item => ({
              company: 'Kyalima Farmers Limited',
              product_name: item.product_name || item.crop_type || item.livestock_type,
              quantity: item.quantity,
              unit: item.unit || '',
              location: item.location || ''
            }));
          }
        }
        
        console.log('Fetched specific data for', company, ':', specificData);
        return specificData;
      } catch (error) {
        console.error('Error in useCompanyStocks:', error);
        // Return empty array instead of throwing to prevent UI errors
        return [];
      }
    },
    enabled: !!company && !!queryClient,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false
  });
};
