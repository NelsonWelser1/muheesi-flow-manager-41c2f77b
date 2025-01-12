import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const updateStockMutation = useMutation({
    mutationFn: async (newStock) => {
      console.log('Updating stock with data:', newStock);
      const { data, error } = await supabase
        .from('company_stocks')
        .upsert({
          company: newStock.company,
          product: newStock.product,
          quantity: parseFloat(newStock.stock),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['companyStocks']);
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
      setStock('');
    },
    onError: (error) => {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form with values:', { selectedCompany, product, stock });
    updateStockMutation.mutate({ company: selectedCompany, product, stock });
  };

  const selectedCompanyProducts = companies.find(c => c.name === selectedCompany)?.products || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Company Projected Stocks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Select 
              id="company" 
              value={selectedCompany} 
              onValueChange={(value) => {
                setSelectedCompany(value);
                setProduct('');
              }} 
              required
            >
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
            <Select 
              id="product" 
              value={product} 
              onValueChange={setProduct} 
              required 
              disabled={!selectedCompany}
            >
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
            <Input 
              id="stock" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)} 
              placeholder="Enter current stock" 
              type="number"
              required 
            />
          </div>
          <Button 
            type="submit" 
            disabled={updateStockMutation.isPending}
            className="w-full"
          >
            {updateStockMutation.isPending ? 'Updating...' : 'Update Stock'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManageCompanyStocks;