
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductMetricsCards from './product-dev-manager/ProductMetricsCards';
import InnovationPipeline from './product-dev-manager/InnovationPipeline';
import ProductPortfolio from './product-dev-manager/ProductPortfolio';
import MarketAnalysis from './product-dev-manager/MarketAnalysis';
import QualityAssurance from './product-dev-manager/QualityAssurance';
import ResourcePlanning from './product-dev-manager/ResourcePlanning';
import { Lightbulb, Package, TrendingUp, Shield, Users, Calendar } from 'lucide-react';

const ProductDevelopmentManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('pipeline');

  const productTabs = [
    {
      id: 'pipeline',
      label: 'Innovation Pipeline',
      icon: Lightbulb,
      component: <InnovationPipeline />
    },
    {
      id: 'portfolio',
      label: 'Product Portfolio',
      icon: Package,
      component: <ProductPortfolio />
    },
    {
      id: 'market',
      label: 'Market Analysis',
      icon: TrendingUp,
      component: <MarketAnalysis />
    },
    {
      id: 'quality',
      label: 'Quality Assurance',
      icon: Shield,
      component: <QualityAssurance />
    },
    {
      id: 'resources',
      label: 'Resource Planning',
      icon: Users,
      component: <ResourcePlanning />
    },
    {
      id: 'roadmap',
      label: 'Product Roadmap',
      icon: Calendar,
      component: <div>Product Roadmap component would be implemented here</div>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Development Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Drive innovation, manage product lifecycle, and deliver market-leading solutions
          </p>
        </div>
        <Lightbulb className="h-8 w-8 text-yellow-600" />
      </div>

      <ProductMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {productTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {productTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProductDevelopmentManagerDashboard;
