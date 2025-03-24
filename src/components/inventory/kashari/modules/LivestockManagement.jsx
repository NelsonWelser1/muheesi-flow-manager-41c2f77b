
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductionForm from './ProductionForm';

const ProductionManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Management</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductionForm />
      </CardContent>
    </Card>
  );
};

export default ProductionManagement;
