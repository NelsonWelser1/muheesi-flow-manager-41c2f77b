import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ManageCompanyStocks from '../components/ManageCompanyStocks';

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
      'Robusta Coffee: Screen 18, 15, and 12',
      'Robusta Coffee: Organic Robusta',
      'Arabica Coffee: Bugisu AA, A, PB, and B',
      'Arabica Coffee: DRUGAR (Dried Uganda Arabica)',
      'Arabica Coffee: Parchment Arabica',
    ],
  },
  {
    name: 'Kyalima Farmers Limited',
    description: 'Agricultural Products',
    features: ['Fresh Produce', 'Grains', 'Livestock', 'Farm Equipment'],
  },
];

const ManageCompanies = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Companies</h1>
      <p className="mb-8">Welcome, company managers and directors. Here you can manage and view details of the companies in the Muheesi GKK Int.System.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {companies.map((company) => (
          <div key={company.name} className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-2xl leading-6 font-semibold text-gray-900">{company.name}</h2>
              <p className="mt-4 text-lg text-gray-500">{company.description}</p>
              <Button className="mt-8 w-full">Manage {company.name}</Button>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">Key Products</h3>
              <ul className="mt-6 space-y-4">
                {company.features.map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="text-base text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">General Manager Dashboard</h2>
        <ManageCompanyStocks />
      </div>
    </div>
  );
};

export default ManageCompanies;