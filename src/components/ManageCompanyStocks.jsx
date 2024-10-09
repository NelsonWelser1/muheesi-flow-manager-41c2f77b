import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const companies = [
  {
    name: 'Grand Berna Dairies',
    products: ['Fresh Milk', 'Yogurt', 'Cheese', 'Meat'],
  },
  {
    name: 'KAJON Coffee Limited',
    products: ['Robusta Coffee: FAQ', 'Arabica Coffee: Bugisu AA'],
  },
  {
    name: 'Kyalima Farmers Limited',
    products: ['Fresh Produce', 'Grains', 'Livestock'],
  },
];

const ManageCompanyStocks = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [product, setProduct] = useState('');
  const [stock, setStock] = useState('');

  const queryClient = useQueryClient();

  const updateStockMutation = useMutation({
    mutationFn: async (newStock) => {
      // This should be replaced with an actual API call
      console.log('Updating stock:', newStock);
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newStock;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['companyStocks']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStockMutation.mutate({ company: selectedCompany, product, stock });
  };

  const selectedCompanyProducts = companies.find(c => c.name === selectedCompany)?.products || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Company Projected Stocks (On the public page)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Select id="company" value={selectedCompany} onValueChange={(value) => {
              setSelectedCompany(value);
              setProduct('');
            }} required>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.name} value={company.name}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="product">Product</Label>
            <Select id="product" value={product} onValueChange={setProduct} required disabled={!selectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {selectedCompanyProducts.map((prod) => (
                  <SelectItem key={prod} value={prod}>{prod}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="stock">Current Stock</Label>
            <Input id="stock" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Enter current stock" required />
          </div>
          <Button type="submit" disabled={updateStockMutation.isLoading}>
            {updateStockMutation.isLoading ? 'Updating...' : 'Update Stock'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManageCompanyStocks;