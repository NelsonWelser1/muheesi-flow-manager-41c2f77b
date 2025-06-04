
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, DollarSign, Star } from 'lucide-react';

const ProductPortfolio = () => {
  const products = [
    {
      name: "Premium Coffee Blend",
      category: "Coffee",
      lifecycle: "mature",
      revenue: "$450K",
      growth: "+12%",
      margin: "34%",
      rating: 4.8
    },
    {
      name: "Organic Dairy Products",
      category: "Dairy",
      lifecycle: "growth",
      revenue: "$320K",
      growth: "+28%",
      margin: "41%",
      rating: 4.6
    },
    {
      name: "Smart Farm Solutions",
      category: "Technology",
      lifecycle: "introduction",
      revenue: "$85K",
      growth: "+156%",
      margin: "28%",
      rating: 4.2
    },
    {
      name: "Traditional Cheese Line",
      category: "Dairy",
      lifecycle: "decline",
      revenue: "$180K",
      growth: "-8%",
      margin: "22%",
      rating: 4.1
    }
  ];

  const getLifecycleColor = (lifecycle) => {
    switch (lifecycle) {
      case 'introduction': return 'bg-blue-500';
      case 'growth': return 'bg-green-500';
      case 'mature': return 'bg-yellow-500';
      case 'decline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGrowthColor = (growth) => {
    const numeric = parseFloat(growth);
    if (numeric > 0) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Product Portfolio</h3>
      </div>

      <div className="grid gap-4">
        {products.map((product, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <Badge className={getLifecycleColor(product.lifecycle)}>
                  {product.lifecycle}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">{product.revenue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Growth</p>
                  <p className={`text-2xl font-bold ${getGrowthColor(product.growth)}`}>
                    {product.growth}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Margin</p>
                  <p className="text-2xl font-bold">{product.margin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold">{product.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stage</p>
                  <p className="font-medium capitalize">{product.lifecycle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Coffee Products</span>
                <span className="font-medium">44%</span>
              </div>
              <div className="flex justify-between">
                <span>Dairy Products</span>
                <span className="font-medium">48%</span>
              </div>
              <div className="flex justify-between">
                <span>Technology</span>
                <span className="font-medium">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Portfolio Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Growing Products</span>
                <span className="font-medium text-green-600">50%</span>
              </div>
              <div className="flex justify-between">
                <span>Stable Products</span>
                <span className="font-medium text-blue-600">25%</span>
              </div>
              <div className="flex justify-between">
                <span>Declining Products</span>
                <span className="font-medium text-red-600">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-medium">$1.035M</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Growth Rate</span>
                <span className="font-medium text-green-600">+22%</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Margin</span>
                <span className="font-medium">31%</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Satisfaction</span>
                <span className="font-medium">4.4/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductPortfolio;
