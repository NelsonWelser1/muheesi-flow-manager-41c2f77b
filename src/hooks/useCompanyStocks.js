import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCompanyStocks = (company) => {
  return useQuery({
    queryKey: ['companyStocks', company],
    queryFn: async () => {
      if (!company) return [];
      
      console.log('Fetching stocks for company:', company);
      
      try {
        let specificData = [];
        
        if (company === 'Grand Berna Dairies') {
          // Fetch from yogurt_inventory
          const { data: yogurtData, error: yogurtError } = await supabase
            .from('yogurt_inventory')
            .select('*');
          
          if (yogurtError) {
            console.error('Error fetching yogurt inventory:', yogurtError);
          } else if (yogurtData) {
            specificData = yogurtData.map(item => ({
              company: 'Grand Berna Dairies',
              product_name: item.product_name,
              quantity: item.quantity,
              unit: item.package_size || 'units',
              location: item.storage_location || ''
            }));
          }

          // Also fetch from cold_room_inventory
          const { data: coldRoomData, error: coldRoomError } = await supabase
            .from('cold_room_inventory')
            .select('*');
          
          if (!coldRoomError && coldRoomData) {
            const coldRoomProducts = coldRoomData.map(item => ({
              company: 'Grand Berna Dairies',
              product_name: item.product_type,
              quantity: item.unit_quantity,
              unit: `units (${item.unit_weight}kg each)`,
              location: item.cold_room_id || ''
            }));
            specificData = [...specificData, ...coldRoomProducts];
          }
        } 
        else if (company === 'KAJON Coffee Limited') {
          const { data: coffeeData, error: coffeeError } = await supabase
            .from('coffee_stock')
            .select('*');
          
          if (coffeeError) {
            console.error('Error fetching coffee stock:', coffeeError);
          } else if (coffeeData) {
            specificData = coffeeData.map(item => ({
              company: 'KAJON Coffee Limited',
              product_name: `${item.coffee_type}: ${item.quality_grade}`,
              quantity: item.quantity,
              unit: item.unit || 'kg',
              location: item.location || ''
            }));
          }
        }
        else if (company === 'Kyalima Farmers Limited') {
          // Fetch from cattle_inventory
          const { data: cattleData, error: cattleError } = await supabase
            .from('cattle_inventory')
            .select('*');
          
          if (cattleError) {
            console.error('Error fetching cattle inventory:', cattleError);
          } else if (cattleData) {
            // Group cattle by type
            const cattleByType = {};
            cattleData.forEach(item => {
              const type = item.type || 'Unknown';
              cattleByType[type] = (cattleByType[type] || 0) + 1;
            });
            
            specificData = Object.entries(cattleByType).map(([type, count]) => ({
              company: 'Kyalima Farmers Limited',
              product_name: type,
              quantity: count,
              unit: 'heads',
              location: item.farm_id || ''
            }));
          }

          // Also check inventory_items for grains
          const { data: grainData, error: grainError } = await supabase
            .from('inventory_items')
            .select('*')
            .eq('section', 'Kyalima Farmers Limited');
          
          if (!grainError && grainData) {
            const grainProducts = grainData.map(item => ({
              company: 'Kyalima Farmers Limited',
              product_name: item.item_name,
              quantity: item.quantity,
              unit: 'kg',
              location: ''
            }));
            specificData = [...specificData, ...grainProducts];
          }
        }
        else if (company === 'Kashari Mixed Farm') {
          // Fetch kashari milk production
          const { data: milkData, error: milkError } = await supabase
            .from('kashari_milk_production')
            .select('*')
            .order('date', { ascending: false })
            .limit(1);
          
          if (!milkError && milkData && milkData.length > 0) {
            specificData.push({
              company: 'Kashari Mixed Farm',
              product_name: 'Daily Milk Production',
              quantity: milkData[0].volume,
              unit: 'L',
              location: milkData[0].location || 'Kashari'
            });
          }
        }
        else if (company === 'Bukomero Dairy Farm') {
          // Fetch from dairy_production
          const { data: dairyData, error: dairyError } = await supabase
            .from('dairy_production')
            .select('*')
            .order('production_date', { ascending: false })
            .limit(7);
          
          if (!dairyError && dairyData) {
            const totalProduction = dairyData.reduce((sum, item) => sum + (item.quantity || 0), 0);
            specificData.push({
              company: 'Bukomero Dairy Farm',
              product_name: 'Weekly Milk Production',
              quantity: totalProduction,
              unit: 'L',
              location: 'Bukomero'
            });
          }
        }
        
        console.log('Fetched specific data for', company, ':', specificData);
        return specificData;
      } catch (error) {
        console.error('Error in useCompanyStocks:', error);
        return [];
      }
    },
    enabled: !!company,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
};
