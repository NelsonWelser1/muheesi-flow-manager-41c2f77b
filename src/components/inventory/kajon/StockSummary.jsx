import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StockSummary = ({ stock }) => {
  if (!stock) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Current Stock Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Location: {stock.location}</p>
        <p>Coffee Type: {stock.coffeeType}</p>
        <p>Quantity: {stock.quantity} {stock.unit}</p>
        <p>Last Updated: {new Date(stock.timestamp).toLocaleString()}</p>
      </CardContent>
    </Card>
  );
};

export default StockSummary;