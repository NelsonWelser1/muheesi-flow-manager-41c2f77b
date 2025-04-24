
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, FileText, BarChart3 } from "lucide-react";

const Finance = () => {
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);

  // Example financial data
  const salesData = [
    { id: 1, date: "2024-04-20", item: "Fresh Milk", quantity: "450 liters", amount: "UGX 1,350,000", customer: "Grand Berna Dairies" },
    { id: 2, date: "2024-04-15", item: "Bull", quantity: "1", amount: "UGX 2,500,000", customer: "Local Butcher" },
    { id: 3, date: "2024-04-10", item: "Fresh Milk", quantity: "520 liters", amount: "UGX 1,560,000", customer: "Grand Berna Dairies" },
  ];

  const expensesData = [
    { id: 1, date: "2024-04-22", category: "Feed", description: "Dairy Meal", amount: "UGX 800,000" },
    { id: 2, date: "2024-04-18", category: "Veterinary", description: "Vaccines", amount: "UGX 350,000" },
    { id: 3, date: "2024-04-05", category: "Salaries", description: "Staff Salaries", amount: "UGX 1,200,000" },
  ];

  // Form state for new sale
  const [newSale, setNewSale] = useState({
    date: new Date().toISOString().split('T')[0],
    item: "",
    quantity: "",
    unitPrice: "",
    customer: ""
  });

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setNewSale(prev => ({ ...prev, [name]: value }));
  };

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    console.log("New sale submitted:", newSale);
    setIsAddSaleOpen(false);
    // Reset form
    setNewSale({
      date: new Date().toISOString().split('T')[0],
      item: "",
      quantity: "",
      unitPrice: "",
      customer: ""
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Management</h2>
      
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 5,410,000</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 2,350,000</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">UGX 3,060,000</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Finance Tabs */}
      <Tabs defaultValue="sales">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="sales" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Sales & Revenue
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Financial Reports
            </TabsTrigger>
          </TabsList>
          
          <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Sale
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Sale</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    name="date"
                    value={newSale.date}
                    onChange={handleSaleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item">Item</Label>
                  <Select name="item" required onValueChange={(value) => handleSaleChange({ target: { name: 'item', value }})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fresh Milk">Fresh Milk</SelectItem>
                      <SelectItem value="Bull">Bull</SelectItem>
                      <SelectItem value="Cow">Cow</SelectItem>
                      <SelectItem value="Calf">Calf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder="Enter quantity"
                    value={newSale.quantity}
                    onChange={handleSaleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price (UGX)</Label>
                  <Input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    placeholder="Enter unit price"
                    value={newSale.unitPrice}
                    onChange={handleSaleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    name="customer"
                    placeholder="Enter customer name"
                    value={newSale.customer}
                    onChange={handleSaleChange}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddSaleOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Sale</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <TabsContent value="sales" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Customer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.item}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>{sale.amount}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Expenses Records</CardTitle>
                <Button>Add Expense</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesData.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Available Reports</h3>
                  <Button variant="outline" className="w-full justify-start">Income Statement</Button>
                  <Button variant="outline" className="w-full justify-start">Balance Sheet</Button>
                  <Button variant="outline" className="w-full justify-start">Cash Flow Statement</Button>
                  <Button variant="outline" className="w-full justify-start">Profit & Loss Report</Button>
                </div>
                
                <div className="border rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">Select a report to view</p>
                    <p className="text-xs text-muted-foreground mt-2">Reports can be exported as PDF or Excel</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
