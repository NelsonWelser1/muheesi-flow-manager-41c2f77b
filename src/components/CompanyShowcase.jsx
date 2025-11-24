import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyStocks } from '@/hooks/useCompanyStocks';
import KAJONCoffeeDetails from './KAJONCoffeeDetails';
import KyalimaFarmersDetails from './KyalimaFarmersDetails';
import CompanyCard from './companies/CompanyCard';
import GrandBernaDetails from './companies/GrandBernaDetails';

const CompanyShowcase = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // Fetch companies from database
  const { data: dbCompanies, isLoading: companiesLoading } = useQuery({
    queryKey: ['showcase-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('company_name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create companies array from database with contact info
  // Show first 3 companies or all if less than 3
  const companies = dbCompanies?.map(company => ({
    name: company.company_name,
    description: company.description?.split('.')[0] || company.company_type || 'Leading business enterprise',
    features: getCompanyFeatures(company.company_name),
    email: getCompanyEmail(company.company_name),
    phones: getCompanyPhones(company.company_name, company.contact_phone)
  })).slice(0, 3) || [];

  // Helper functions to get additional company details
  function getCompanyFeatures(companyName) {
    const features = {
      'Grand Berna Dairies': ['Fresh Milk', 'Processed Milk', 'Cheese', 'Yogurt', 'Meat (Beef, Goat, Pork, Poultry)', 'Eggs'],
      'KAJON Coffee Limited': [{name: 'Coffee Types', options: ['Robusta', 'Arabica']}],
      'Kyalima Farmers Limited': [
        {name: 'Grains', options: ['Rice', 'Maize', 'Hulled white sesame', 'Soybean', 'Cocoa']},
        {name: 'Livestock', options: ['Bulls', 'Heifers', 'Mothers', 'Calves']}
      ]
    };
    return features[companyName] || [];
  }

  function getCompanyEmail(companyName) {
    const emails = {
      'Grand Berna Dairies': 'grandbernadairies.sales@gmail.com',
      'KAJON Coffee Limited': 'kajoncoffeelimited@gmail.com',
      'Kyalima Farmers Limited': 'kyalimafarmersdirectors@gmail.com'
    };
    return emails[companyName] || '';
  }

  function getCompanyPhones(companyName, dbPhone) {
    if (dbPhone) return [dbPhone];
    const phones = {
      'Grand Berna Dairies': ['+256 776 670680', '+256 757 757517', '+256 787 121022'],
      'KAJON Coffee Limited': ['+256 776 670680', '+256 757 757517'],
      'Kyalima Farmers Limited': ['+256 776 670680', '+256 757 757517']
    };
    return phones[companyName] || [];
  }
  
  // Individual queries for each company
  const {
    data: grandBernaStocks = [],
    isLoading: isLoadingGrandBerna
  } = useCompanyStocks('Grand Berna Dairies');
  
  const {
    data: kajonStocks = [],
    isLoading: isLoadingKajon
  } = useCompanyStocks('KAJON Coffee Limited');
  
  const {
    data: kyalimaStocks = [],
    isLoading: isLoadingKyalima
  } = useCompanyStocks('Kyalima Farmers Limited');

  // Organize the stocks data by company
  const stocksByCompany = {
    'Grand Berna Dairies': grandBernaStocks || [],
    'KAJON Coffee Limited': kajonStocks || [],
    'Kyalima Farmers Limited': kyalimaStocks || []
  };

  // Function to get stocks for a specific company
  const getStocksForCompany = companyName => {
    const stocks = stocksByCompany[companyName] || [];
    const result = {};
    
    stocks.forEach(item => {
      if (item && item.product_name) {
        result[item.product_name] = `${item.quantity}${item.unit}`;
      }
    });

    // Return default data if no stocks found in the database
    if (Object.keys(result).length === 0) {
      switch (companyName) {
        case 'Grand Berna Dairies':
          return {
            'Fresh Milk': '1000L',
            'Yogurt': '500kg',
            'Cheese': '200kg',
            'Meat': '300kg'
          };
        case 'KAJON Coffee Limited':
          return {
            'Robusta Coffee: FAQ': '2000kg',
            'Robusta Coffee: Screen 18': '1500kg',
            'Arabica Coffee: Bugisu AA': '1500kg'
          };
        case 'Kyalima Farmers Limited':
          return {
            'Rice': '5000kg',
            'Maize': '20000MT',
            'Bulls': '50 heads',
            'Heifers': '40 heads'
          };
        case 'Kashari Mixed Farm':
          return {
            'Daily Milk Production': '500L',
            'Bananas': '1000kg',
            'Livestock': '100 heads'
          };
        case 'Bukomero Dairy Farm':
          return {
            'Weekly Milk Production': '3500L',
            'Dairy Cattle': '50 heads'
          };
        default:
          return {};
      }
    }
    return result;
  };

  // Determine if any data is still loading
  const isLoading = isLoadingGrandBerna || isLoadingKajon || isLoadingKyalima;
  
  return (
    <div data-select-id="company-showcase-container" className="py-4 sm:py-8 bg-green-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {companiesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : companies.length > 0 ? (
          <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-select-id="companies-grid">
            {companies.map(company => 
              <CompanyCard 
                key={company.name} 
                company={company} 
                stockData={getStocksForCompany(company.name)} 
                isLoading={isLoading} 
                onViewDetailsClick={setSelectedCompany} 
              />
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Companies Available</h3>
            <p className="text-gray-500">Check back soon for our business portfolio.</p>
          </div>
        )}
      </div>
      
      {selectedCompany === 'KAJON Coffee Limited' && <KAJONCoffeeDetails onClose={() => setSelectedCompany(null)} />}
      {selectedCompany === 'Grand Berna Dairies' && <GrandBernaDetails onClose={() => setSelectedCompany(null)} />}
      {selectedCompany === 'Kyalima Farmers Limited' && <KyalimaFarmersDetails onClose={() => setSelectedCompany(null)} />}
    </div>
  );
};

export default CompanyShowcase;
