
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Building, Users, Package, DollarSign } from 'lucide-react';

const CompanyOverview = ({ companies, loading }) => {
  // Sample data for company performance comparison
  const companyPerformance = [
    { name: 'Grand Berna Dairies', value: 35, color: '#8B5CF6' },
    { name: 'KAJON Coffee Limited', value: 25, color: '#0EA5E9' },
    { name: 'Kyalima Farmers Ltd', value: 20, color: '#10B981' },
    { name: 'Fresheco Farming', value: 20, color: '#F97316' }
  ];
  
  // Sample data for revenue distribution
  const revenueDistribution = [
    { name: 'Domestic', value: 65, color: '#8B5CF6' },
    { name: 'Export', value: 35, color: '#0EA5E9' }
  ];

  // Sample data for key metrics across companies
  const companyComparison = [
    {
      name: "Grand Berna Dairies",
      revenue: 450000000,
      employees: 48,
      inventory: 105,
      profitMargin: 18.5
    },
    {
      name: "KAJON Coffee Limited",
      revenue: 320000000,
      employees: 35,
      inventory: 82,
      profitMargin: 22.3
    },
    {
      name: "Kyalima Farmers Limited",
      revenue: 280000000,
      employees: 42,
      inventory: 120,
      profitMargin: 14.8
    },
    {
      name: "Fresheco Farming",
      revenue: 275000000,
      employees: 31,
      inventory: 95,
      profitMargin: 16.2
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading company data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Company Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Company Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {companyPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Revenue Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Company Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Company Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5DEFF]">
                  <th className="text-left p-3">Company</th>
                  <th className="text-left p-3">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-[#6E59A5]" />
                      Revenue (UGX)
                    </div>
                  </th>
                  <th className="text-left p-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-[#6E59A5]" />
                      Employees
                    </div>
                  </th>
                  <th className="text-left p-3">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-[#6E59A5]" />
                      Inventory Items
                    </div>
                  </th>
                  <th className="text-left p-3">Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                {companyComparison.map((company, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-3">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-[#8B5CF6]" />
                        <span className="font-medium">{company.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{company.revenue.toLocaleString()}</td>
                    <td className="p-3">{company.employees}</td>
                    <td className="p-3">{company.inventory}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.profitMargin > 20 
                          ? 'bg-green-100 text-green-800' 
                          : company.profitMargin > 15 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {company.profitMargin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyOverview;
