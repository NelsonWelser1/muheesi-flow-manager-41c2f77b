
import React from 'react';
import { Button } from "@/components/ui/button";
import OrderForm from '../orders/OrderForm';
import ContactLinks from '../ContactLinks';
import CompanyKeyProducts from './CompanyKeyProducts';
import CompanyStockInfo from './CompanyStockInfo';

const CompanyCard = ({ 
  company, 
  stockData, 
  isLoading, 
  onViewDetailsClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg divide-y divide-gray-200">
      <div className="p-4 sm:p-6" data-select-id={`company-header-${company.name}`}>
        <h2 className="text-xl sm:text-2xl leading-6 font-semibold text-gray-900">{company.name}</h2>
        <p className="mt-4 text-base sm:text-lg text-gray-500">{company.description}</p>
        <OrderForm company={company.name} />
        <Button 
          className="mt-2 w-full text-sm sm:text-base" 
          onClick={() => onViewDetailsClick(company.name)}
        >
          About Us
        </Button>
        <ContactLinks email={company.email} phones={company.phones} />
      </div>
      
      <CompanyKeyProducts features={company.features} />
      
      <CompanyStockInfo 
        companyName={company.name} 
        stockData={stockData} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default CompanyCard;
