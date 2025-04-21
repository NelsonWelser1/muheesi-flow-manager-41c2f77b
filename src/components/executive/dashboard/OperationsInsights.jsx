
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const OperationsInsights = ({ operations, inventory, personnel, loading }) => {
  // Sample operational status data
  const operationalStatus = [
    {
      company: "Grand Berna Dairies",
      status: "optimal",
      productionRate: 92,
      downtime: 2.1,
      inventoryLevel: 85,
      staffing: 95,
      alerts: []
    },
    {
      company: "KAJON Coffee Limited",
      status: "warning",
      productionRate: 73,
      downtime: 8.5,
      inventoryLevel: 45,
      staffing: 88,
      alerts: ["Low inventory levels for Arabica beans", "Machinery maintenance due"]
    },
    {
      company: "Kyalima Farmers Limited",
      status: "optimal",
      productionRate: 88,
      downtime: 3.2,
      inventoryLevel: 76,
      staffing: 92,
      alerts: []
    }
  ];
  
  // Sample personnel metrics
  const personnelMetrics = [
    { title: "Total Staff", value: 156, change: "+3.2%", trend: "up" },
    { title: "Attendance Rate", value: "94.8%", change: "+1.5%", trend: "up" },
    { title: "Productivity", value: "87.2%", change: "-0.8%", trend: "down" },
    { title: "Training Compliance", value: "92.5%", change: "+4.3%", trend: "up" }
  ];
  
  // Sample inventory status
  const inventoryStatus = [
    { product: "Dairy Products", stock: 85, status: "optimal", daysSupply: 14 },
    { product: "Coffee Beans", stock: 45, status: "warning", daysSupply: 7 },
    { product: "Farm Produce", stock: 76, status: "optimal", daysSupply: 12 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading operations data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Operations Insights</h2>
      
      {/* Operations Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {operationalStatus.map((company, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">{company.company}</h3>
                  <Badge className={getStatusColor(company.status)}>
                    {company.status === 'optimal' ? 'Optimal' : company.status === 'warning' ? 'Warning' : 'Critical'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-sm text-[#8E9196]">Production Rate</p>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-1 text-[#6E59A5]" />
                      <span className="font-medium">{company.productionRate}%</span>
                    </div>
                    <Progress value={company.productionRate} className="h-1 mt-1" />
                  </div>
                  
                  <div>
                    <p className="text-sm text-[#8E9196]">Downtime</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-[#6E59A5]" />
                      <span className="font-medium">{company.downtime}%</span>
                    </div>
                    <Progress value={100 - company.downtime} className="h-1 mt-1" />
                  </div>
                  
                  <div>
                    <p className="text-sm text-[#8E9196]">Inventory Level</p>
                    <div className="flex items-center">
                      <span className="font-medium">{company.inventoryLevel}%</span>
                    </div>
                    <Progress 
                      value={company.inventoryLevel} 
                      className={`h-1 mt-1 ${
                        company.inventoryLevel < 40 ? 'bg-red-200' :
                        company.inventoryLevel < 70 ? 'bg-amber-200' : 'bg-green-200'
                      }`} 
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm text-[#8E9196]">Staffing</p>
                    <div className="flex items-center">
                      <span className="font-medium">{company.staffing}%</span>
                    </div>
                    <Progress value={company.staffing} className="h-1 mt-1" />
                  </div>
                </div>
                
                {company.alerts.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-sm font-medium">Alerts</span>
                    </div>
                    <ul className="space-y-1">
                      {company.alerts.map((alert, idx) => (
                        <li key={idx} className="text-sm text-[#1A1F2C] bg-[#FEF7CD] p-2 rounded">
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personnel Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Personnel Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {personnelMetrics.map((metric, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm text-[#8E9196]">{metric.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                  <div className="flex items-center mt-1">
                    <Badge className={`${
                      metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {metric.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryStatus.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h4 className="font-medium">{item.product}</h4>
                    <div className="flex items-center mt-1">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      <span className="text-xs text-[#8E9196] ml-2">
                        {item.daysSupply} days supply
                      </span>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">{item.stock}%</span>
                    </div>
                    <Progress 
                      value={item.stock} 
                      className={`h-2 ${
                        item.stock < 40 ? 'bg-red-200' :
                        item.stock < 70 ? 'bg-amber-200' : 'bg-green-200'
                      }`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OperationsInsights;
