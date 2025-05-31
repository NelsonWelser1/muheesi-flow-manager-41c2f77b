
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Building2, Coffee, Milk, Wheat, ExternalLink } from 'lucide-react';

const CompanyQuickAccess = ({ expanded = false }) => {
  const navigate = useNavigate();
  
  const companies = [
    {
      name: 'KAJON Coffee Limited',
      type: 'Coffee Export',
      status: 'Active',
      icon: Coffee,
      path: '/manage-inventory/kajon-export',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      metrics: { orders: 24, exports: '2.1M USD' }
    },
    {
      name: 'Grand Berna Dairies',
      type: 'Dairy Products',
      status: 'Active',
      icon: Milk,
      path: '/manage-inventory/bukomero-dairy',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      metrics: { production: '1.2K L', sales: '850K UGX' }
    },
    {
      name: 'Kashari Farm',
      type: 'Agriculture',
      status: 'Active',
      icon: Wheat,
      path: '/manage-inventory/kashari-farm',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      metrics: { livestock: 156, crops: '45 acres' }
    },
    {
      name: 'Kyalima Farmers Limited',
      type: 'Agricultural Products',
      status: 'Active',
      icon: Building2,
      path: '/',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      metrics: { farmers: 280, produce: '5.2 MT' }
    }
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {companies.map((company) => {
          const IconComponent = company.icon;
          return (
            <div
              key={company.name}
              className={`p-4 rounded-lg border ${company.bgColor} hover:shadow-md transition-all cursor-pointer`}
              onClick={() => navigate(company.path)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white ${company.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{company.name}</h4>
                    <p className="text-sm text-gray-600">{company.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {company.status}
                  </Badge>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {expanded && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {Object.entries(company.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-sm font-medium text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500 capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate('/manage-companies')}
        >
          View All Companies
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompanyQuickAccess;
