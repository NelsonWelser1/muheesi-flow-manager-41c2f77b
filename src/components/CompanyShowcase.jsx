import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KAJONCoffeeDetails from './KAJONCoffeeDetails';
import OrderForm from './orders/OrderForm';

const fetchCompanyStocks = async () => {
  // This should be replaced with an actual API call
  return {
    'Grand Berna Dairies': { 'Fresh Milk': '1000L', 'Yogurt': '500kg', 'Cheese': '200kg', 'Meat': '300kg' },
    'KAJON Coffee Limited': { 
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
    },
    'Kyalima Farmers Limited': { 
      'Rice': '5000kg', 
      'Maize': '20000MT',
      'Hulled white sesame': '2000MT',
      'Soybean': '50000MT',
      'Cocoa': '500MT',
      'Bulls': '50 heads',
      'Heifers': '40 heads',
      'Mothers': '30 heads',
      'Calves': '20 heads'
    }
  };
};

const companies = [
  {
    name: 'Grand Berna Dairies',
    description: 'Dairy Products',
    features: ['Fresh Milk', 'Yogurt', 'Cheese', 'Meat'],
  },
  {
    name: 'KAJON Coffee Limited',
    description: 'Coffee Products',
    features: [
      { name: 'Coffee Types', options: ['Robusta', 'Arabica'] },
    ],
  },
  {
    name: 'Kyalima Farmers Limited',
    description: 'Agricultural Products',
    features: [
      { name: 'Grains', options: ['Rice', 'Maize', 'Hulled white sesame', 'Soybean', 'Cocoa'] },
      { name: 'Livestock', options: ['Bulls', 'Heifers', 'Mothers', 'Calves'] },
    ],
  },
];

const CompanyShowcase = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { data: stocks, isLoading, error } = useQuery({
    queryKey: ['companyStocks'],
    queryFn: fetchCompanyStocks,
  });

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium italic text-gray-900">
            Gourmet conglomerate
          </h2>
        </div>
        <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {companies.map((company) => (
            <div key={company.name} className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-2xl leading-6 font-semibold text-gray-900">{company.name}</h2>
                <p className="mt-4 text-lg text-gray-500">{company.description}</p>
                <OrderForm company={company.name} />
                <Button className="mt-2 w-full" onClick={() => setSelectedCompany(company.name)}>Learn More</Button>
                <Button variant="outline" className="mt-2 w-full">Contact Us</Button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase mb-4">Key Products</h3>
                <ul className="space-y-4">
                  {company.features.map((feature) => (
                    <li key={typeof feature === 'string' ? feature : feature.name} className="flex items-center">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500 mr-2" aria-hidden="true" />
                      {typeof feature === 'string' ? (
                        <span className="text-base text-gray-500">{feature}</span>
                      ) : (
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={feature.name} />
                          </SelectTrigger>
                          <SelectContent>
                            {feature.options.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase mb-4">Current Stock</h3>
                {isLoading ? (
                  <p>Loading stock information...</p>
                ) : error ? (
                  <p>Error loading stock information</p>
                ) : (
                  <ul className="space-y-2">
                    {Object.entries(stocks[company.name] || {}).map(([product, stock]) => (
                      <li key={product} className="flex justify-between">
                        <span className="text-sm text-gray-500">{product}</span>
                        <span className="text-sm font-medium text-gray-900">{stock}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedCompany === 'KAJON Coffee Limited' && (
        <KAJONCoffeeDetails onClose={() => setSelectedCompany(null)} />
      )}
    </div>
  );
};

export default CompanyShowcase;
