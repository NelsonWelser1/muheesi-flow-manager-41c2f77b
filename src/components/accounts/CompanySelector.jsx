import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Coffee, Wheat } from 'lucide-react';

const CompanySelector = ({ onCompanySelect }) => {
  const companies = [
    {
      id: 'grand-berna',
      name: 'Grand Berna Dairies',
      icon: Building2,
      description: 'Dairy Products and Processing'
    },
    {
      id: 'kajon',
      name: 'KAJON Coffee Limited',
      icon: Coffee,
      description: 'Coffee Production and Export'
    },
    {
      id: 'kyalima',
      name: 'Kyalima Farmers Limited',
      icon: Wheat,
      description: 'Agricultural Products and Farming'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {companies.map((company) => {
        const Icon = company.icon;
        return (
          <Card 
            key={company.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onCompanySelect(company.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-6 w-6" />
                {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{company.description}</p>
              <Button className="mt-4 w-full">
                Manage Accounts
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CompanySelector;