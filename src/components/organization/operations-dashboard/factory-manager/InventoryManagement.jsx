
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, TrendingDown, Plus } from 'lucide-react';

const InventoryManagement = () => {
  const rawMaterials = [
    {
      name: "Fresh Milk",
      current: 8500,
      minimum: 5000,
      maximum: 12000,
      unit: "L",
      supplier: "Local Dairy Farm",
      expiryDate: "Tomorrow",
      cost: "UGX 1,200/L"
    },
    {
      name: "Rennet Enzyme",
      current: 45,
      minimum: 20,
      maximum: 100,
      unit: "kg",
      supplier: "Bio Ingredients Ltd",
      expiryDate: "Next week",
      cost: "UGX 25,000/kg"
    },
    {
      name: "Salt",
      current: 150,
      minimum: 50,
      maximum: 300,
      unit: "kg",
      supplier: "Salt Works Co",
      expiryDate: "6 months",
      cost: "UGX 2,500/kg"
    },
    {
      name: "Packaging Materials",
      current: 2500,
      minimum: 1000,
      maximum: 5000,
      unit: "units",
      supplier: "Pack Solutions",
      expiryDate: "1 year",
      cost: "UGX 500/unit"
    }
  ];

  const finishedProducts = [
    {
      name: "Mozzarella Cheese",
      current: 450,
      target: 500,
      unit: "kg",
      value: "UGX 12,500,000",
      shelfLife: "3 weeks"
    },
    {
      name: "Gouda Cheese",
      current: 280,
      target: 400,
      unit: "kg",
      value: "UGX 8,400,000",
      shelfLife: "2 months"
    },
    {
      name: "Greek Yogurt",
      current: 1200,
      target: 1500,
      unit: "L",
      value: "UGX 3,600,000",
      shelfLife: "2 weeks"
    },
    {
      name: "Pasteurized Milk",
      current: 5500,
      target: 6000,
      unit: "L",
      value: "UGX 8,250,000",
      shelfLife: "1 week"
    }
  ];

  const getStockStatus = (current, minimum, maximum) => {
    if (current < minimum) return { status: 'Low', color: 'destructive', percentage: (current / minimum) * 100 };
    if (current > maximum * 0.9) return { status: 'High', color: 'secondary', percentage: 95 };
    return { status: 'Normal', color: 'default', percentage: ((current - minimum) / (maximum - minimum)) * 100 };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Raw Materials Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rawMaterials.map((material, index) => {
              const stockStatus = getStockStatus(material.current, material.minimum, material.maximum);
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{material.name}</h3>
                      <p className="text-sm text-muted-foreground">{material.supplier}</p>
                    </div>
                    <Badge variant={stockStatus.color} className="flex items-center gap-1">
                      {stockStatus.status === 'Low' && <TrendingDown className="h-3 w-3" />}
                      {stockStatus.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">Current Stock</p>
                      <p className="font-medium">{material.current} {material.unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unit Cost</p>
                      <p className="font-medium">{material.cost}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium">{material.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min/Max</p>
                      <p className="font-medium">{material.minimum}/{material.maximum} {material.unit}</p>
                    </div>
                  </div>
                  
                  <Progress value={Math.max(0, Math.min(100, stockStatus.percentage))} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Finished Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {finishedProducts.map((product, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <Badge variant="default">In Stock</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <p className="font-medium">{product.current} {product.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target Stock</p>
                    <p className="font-medium">{product.target} {product.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-medium">{product.value}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shelf Life</p>
                    <p className="font-medium">{product.shelfLife}</p>
                  </div>
                </div>
                
                <Progress value={(product.current / product.target) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Add New Item
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              Stock Transfer
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Low Stock Alert
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingDown className="h-6 w-6 mb-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
