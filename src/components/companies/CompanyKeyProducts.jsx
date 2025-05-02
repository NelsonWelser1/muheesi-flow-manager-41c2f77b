
import React from 'react';
import { Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CompanyKeyProducts = ({ features }) => {
  return (
    <div className="p-4 sm:p-6" data-select-id="company-key-products">
      <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase mb-4">Key Products</h3>
      <ul className="space-y-2 sm:space-y-4">
        {features.map((feature) => (
          <li key={typeof feature === 'string' ? feature : feature.name} className="flex items-center">
            <Check className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2" aria-hidden="true" />
            {typeof feature === 'string' ? (
              <span className="text-sm sm:text-base text-gray-500">{feature}</span>
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
  );
};

export default CompanyKeyProducts;
