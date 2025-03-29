
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductionForm from './ProductionForm';
import CattleFattening from '../../bukomero/modules/CattleFattening';

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

const LivestockManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Livestock Management</CardTitle>
      </CardHeader>
      <CardContent>
        <CattleFattening />
      </CardContent>
    </Card>
  );
};

export default LivestockManagement;
