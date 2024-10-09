import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';

const fetchCompanyStocks = async () => {
  // This should be replaced with an actual API call
  return {
    'Grand Berna Dairies': { 'Fresh Milk': '1000L', 'Yogurt': '500kg', 'Cheese': '200kg', 'Meat': '300kg' },
    'KAJON Coffee Limited': { 'Robusta Coffee: FAQ': '2000kg', 'Arabica Coffee: Bugisu AA': '1500kg' },
    'Kyalima Farmers Limited': { 'Fresh Produce': '5000kg', 'Grains': '10000kg', 'Livestock': '50 heads' }
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
      'Robusta Coffee: FAQ (Fair Average Quality)',
      'Arabica Coffee: Bugisu AA',
    ],
  },
  {
    name: 'Kyalima Farmers Limited',
    description: 'Agricultural Products',
    features: ['Fresh Produce', 'Grains', 'Livestock'],
  },
];

const CompanyShowcase = () => {
  const { data: stocks, isLoading, error } = useQuery({
    queryKey: ['companyStocks'],
    queryFn: fetchCompanyStocks,
  });

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Partner Companies
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Integrated supply chain and warehouse management for these leading companies
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {companies.map((company) => (
            <div key={company.name} className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-2xl leading-6 font-semibold text-gray-900">{company.name}</h2>
                <p className="mt-4 text-lg text-gray-500">{company.description}</p>
                <Button className="mt-8 w-full">Learn More</Button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">Key Products & Current Stock</h3>
                {isLoading ? (
                  <p>Loading stock information...</p>
                ) : error ? (
                  <p>Error loading stock information</p>
                ) : (
                  <ul className="mt-6 space-y-4">
                    {company.features.map((feature) => (
                      <li key={feature} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Check className="flex-shrink-0 h-5 w-5 text-green-500 mr-2" aria-hidden="true" />
                          <span className="text-base text-gray-500">{feature}</span>
                        </div>
                        <span className="text-base font-medium text-gray-900">
                          {stocks[company.name]?.[feature] || 'N/A'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyShowcase;