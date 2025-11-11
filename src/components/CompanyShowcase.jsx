
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useCompanyStocks } from '@/hooks/useCompanyStocks';
import KAJONCoffeeDetails from './KAJONCoffeeDetails';
import KyalimaFarmersDetails from './KyalimaFarmersDetails';
import CompanyCard from './companies/CompanyCard';
import GrandBernaDetails from './companies/GrandBernaDetails';

const companies = [{
  name: 'Grand Berna Dairies',
  description: 'Dairy Products',
  features: ['Fresh Milk', 'Processed Milk', 'Cheese', 'Yogurt', 'Meat (Beef, Goat, Pork, Poultry)', 'Eggs'],
  email: 'grandbernadairies.sales@gmail.com',
  phones: ['+256 776 670680', '+256 757 757517', '+256 787 121022']
}, {
  name: 'KAJON Coffee Limited',
  description: 'Coffee Products',
  features: [{
    name: 'Coffee Types',
    options: ['Robusta', 'Arabica']
  }],
  email: 'kajoncoffeelimited@gmail.com',
  phones: ['+256 776 670680', '+256 757 757517']
}, {
  name: 'Kyalima Farmers Limited',
  description: 'Agricultural Products',
  features: [{
    name: 'Grains',
    options: ['Rice', 'Maize', 'Hulled white sesame', 'Soybean', 'Cocoa']
  }, {
    name: 'Livestock',
    options: ['Bulls', 'Heifers', 'Mothers', 'Calves']
  }],
  email: 'kyalimafarmersdirectors@gmail.com',
  phones: ['+256 776 670680', '+256 757 757517']
}];

const CompanyShowcase = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  
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
      result[item.product_name] = `${item.quantity}${item.unit}`;
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
            'Robusta Coffee: Screen 15': '1200kg',
            'Robusta Coffee: Screen 12': '1000kg',
            'Robusta Coffee: Organic Robusta': '800kg',
            'Arabica Coffee: Bugisu AA': '1500kg',
            'Arabica Coffee: Bugisu A': '1300kg',
            'Arabica Coffee: Bugisu PB': '1100kg',
            'Arabica Coffee: Bugisu B': '900kg',
            'Arabica Coffee: DRUGAR': '700kg',
            'Arabica Coffee: Parchment Arabica': '600kg'
          };
        case 'Kyalima Farmers Limited':
          return {
            'Rice': '5000kg',
            'Maize': '20000MT',
            'Hulled white sesame': '2000MT',
            'Soybean': '50000MT',
            'Cocoa': '500MT',
            'Bulls': '50 heads',
            'Heifers': '40 heads',
            'Mothers': '30 heads',
            'Calves': '20 heads'
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
      </div>
      
      {selectedCompany === 'KAJON Coffee Limited' && <KAJONCoffeeDetails onClose={() => setSelectedCompany(null)} />}
      {selectedCompany === 'Grand Berna Dairies' && <GrandBernaDetails onClose={() => setSelectedCompany(null)} />}
      {selectedCompany === 'Kyalima Farmers Limited' && <KyalimaFarmersDetails onClose={() => setSelectedCompany(null)} />}
    </div>
  );
};

export default CompanyShowcase;
