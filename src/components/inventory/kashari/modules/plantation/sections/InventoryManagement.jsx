
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Search, Package, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const InventoryManagement = () => {
  const [date, setDate] = useState(null);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('add');

  // Transactions
  const [transactionType, setTransactionType] = useState('in');
  const [itemId, setItemId] = useState('');
  const [transactionQuantity, setTransactionQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [transactionDate, setTransactionDate] = useState(null);
  const [transactionNotes, setTransactionNotes] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  
  const categories = [
    { value: 'seeds', label: 'Seeds/Seedlings' },
    { value: 'fertilizer', label: 'Fertilizer' },
    { value: 'pesticide', label: 'Pesticides/Herbicides' },
    { value: 'tools', label: 'Tools' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'packaging', label: 'Packaging Materials' },
    { value: 'produce', label: 'Harvested Produce' },
    { value: 'other', label: 'Other' }
  ];

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'l', label: 'Liters (l)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'pcs', label: 'Pieces' },
    { value: 'bags', label: 'Bags' },
    { value: 'boxes', label: 'Boxes' }
  ];

  const transactionTypes = [
    { value: 'in', label: 'Stock In' },
    { value: 'out', label: 'Stock Out' }
  ];

  const transactionReasons = {
    in: [
      { value: 'purchase', label: 'Purchase' },
      { value: 'return', label: 'Return' },
      { value: 'transfer_in', label: 'Transfer In' },
      { value: 'harvest', label: 'Harvest' },
      { value: 'adjustment', label: 'Inventory Adjustment' }
    ],
    out: [
      { value: 'sale', label: 'Sale' },
      { value: 'use', label: 'Farm Use' },
      { value: 'loss', label: 'Loss/Damage' },
      { value: 'transfer_out', label: 'Transfer Out' },
      { value: 'expired', label: 'Expired' },
      { value: 'adjustment', label: 'Inventory Adjustment' }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      date,
      name: itemName,
      category,
      quantity: Number(quantity),
      unit,
      unitPrice: Number(unitPrice),
      supplier,
      location,
      notes,
      createdAt: new Date()
    };
    setInventory([...inventory, newItem]);
    
    // Reset form
    setDate(null);
    setItemName('');
    setCategory('');
    setQuantity('');
    setUnit('kg');
    setUnitPrice('');
    setSupplier('');
    setLocation('');
    setNotes('');
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    
    // Find the item
    const item = inventory.find(i => i.id.toString() === itemId);
    if (!item) return;
    
    // Create transaction
    const newTransaction = {
      id: Date.now(),
      date: transactionDate,
      type: transactionType,
      itemId,
      itemName: item.name,
      quantity: Number(transactionQuantity),
      unit: item.unit,
      reason,
      notes: transactionNotes,
      createdAt: new Date()
    };
    
    // Update item quantity
    const updatedInventory = inventory.map(i => {
      if (i.id.toString() === itemId) {
        const newQuantity = transactionType === 'in' 
          ? i.quantity + Number(transactionQuantity)
          : i.quantity - Number(transactionQuantity);
        
        return {
          ...i,
          quantity: newQuantity >= 0 ? newQuantity : 0
        };
      }
      return i;
    });
    
    setTransactions([...transactions, newTransaction]);
    setInventory(updatedInventory);
    
    // Reset form
    setItemId('');
    setTransactionQuantity('');
    setReason('');
    setTransactionDate(null);
    setTransactionNotes('');
  };

  const filteredInventory = inventory.filter(item => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(search)) ||
      (item.category && categories.find(c => c.value === item.category)?.label.toLowerCase().includes(search)) ||
      (item.supplier && item.supplier.toLowerCase().includes(search)) ||
      (item.location && item.location.toLowerCase().includes(search)) ||
      (item.notes && item.notes.toLowerCase().includes(search))
    );
  });

  const filteredTransactions = transactions.filter(transaction => {
    if (!transactionSearchTerm) return true;
    
    const search = transactionSearchTerm.toLowerCase();
    return (
      (transaction.itemName && transaction.itemName.toLowerCase().includes(search)) ||
      (transaction.reason && (
        transactionReasons[transaction.type].find(r => r.value === transaction.reason)?.label.toLowerCase().includes(search)
      )) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(search))
    );
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Inventory</TabsTrigger>
          <TabsTrigger value="list">Inventory List</TabsTrigger>
          <TabsTrigger value="transaction">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Inventory Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Added</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="itemName" className="text-sm font-medium">Item Name</label>
                    <Input
                      id="itemName"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="Name of the item"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                    <div className="flex space-x-2">
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        step="0.01"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Amount"
                        className="flex-1"
                      />
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map(u => (
                            <SelectItem key={u.value} value={u.value}>
                              {u.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="unitPrice" className="text-sm font-medium">Unit Price (UGX)</label>
                    <Input
                      id="unitPrice"
                      type="number"
                      min="0"
                      step="100"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      placeholder="Price per unit"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="supplier" className="text-sm font-medium">Supplier</label>
                    <Input
                      id="supplier"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      placeholder="Supplier name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">Storage Location</label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where item is stored"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes about the item"
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Inventory Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Inventory List
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredInventory.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {inventory.length === 0 
                    ? "No inventory items added yet. Use the form to add items."
                    : "No matching items found. Try a different search term."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Supplier</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            {categories.find(c => c.value === item.category)?.label || item.category || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {item.quantity} {item.unit}
                            {item.quantity <= 5 && (
                              <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">Low Stock</Badge>
                            )}
                          </TableCell>
                          <TableCell>{item.unitPrice ? `UGX ${item.unitPrice.toLocaleString()}` : 'N/A'}</TableCell>
                          <TableCell>{item.unitPrice ? `UGX ${(item.quantity * item.unitPrice).toLocaleString()}` : 'N/A'}</TableCell>
                          <TableCell>{item.location || 'N/A'}</TableCell>
                          <TableCell>{item.supplier || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transaction" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransactionSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="transactionType" className="text-sm font-medium">Transaction Type</label>
                      <Select value={transactionType} onValueChange={setTransactionType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {transactionTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center">
                                {type.value === 'in' ? (
                                  <ArrowDown className="mr-2 h-4 w-4 text-green-600" />
                                ) : (
                                  <ArrowUp className="mr-2 h-4 w-4 text-amber-600" />
                                )}
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="itemId" className="text-sm font-medium">Item</label>
                      <Select value={itemId} onValueChange={setItemId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory.map(item => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name} ({item.quantity} {item.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="transactionQuantity" className="text-sm font-medium">Quantity</label>
                      <Input
                        id="transactionQuantity"
                        type="number"
                        min="0"
                        step="0.01"
                        value={transactionQuantity}
                        onChange={(e) => setTransactionQuantity(e.target.value)}
                        placeholder="Transaction quantity"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="reason" className="text-sm font-medium">Reason</label>
                      <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {transactionReasons[transactionType].map(r => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transaction Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {transactionDate ? format(transactionDate, 'PPP') : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={transactionDate}
                            onSelect={setTransactionDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="transactionNotes" className="text-sm font-medium">Notes</label>
                      <Textarea
                        id="transactionNotes"
                        value={transactionNotes}
                        onChange={(e) => setTransactionNotes(e.target.value)}
                        placeholder="Additional notes about the transaction"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!itemId || !transactionQuantity || !reason || !transactionDate}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-col gap-4 justify-between items-start">
                <CardTitle className="flex items-center">
                  {transactionType === 'in' ? (
                    <ArrowDown className="h-5 w-5 mr-2 text-green-600" />
                  ) : (
                    <ArrowUp className="h-5 w-5 mr-2 text-amber-600" />
                  )}
                  Transaction History
                </CardTitle>
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={transactionSearchTerm}
                    onChange={(e) => setTransactionSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {transactions.length === 0 
                      ? "No transactions added yet. Use the form to add a transaction."
                      : "No matching transactions found. Try a different search term."}
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {transaction.date ? format(transaction.date, 'dd/MM/yyyy') : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  transaction.type === 'in'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                }
                              >
                                {transaction.type === 'in' ? 'Stock In' : 'Stock Out'}
                              </Badge>
                            </TableCell>
                            <TableCell>{transaction.itemName}</TableCell>
                            <TableCell>
                              {transaction.quantity} {transaction.unit}
                            </TableCell>
                            <TableCell>
                              {transactionReasons[transaction.type].find(r => r.value === transaction.reason)?.label || transaction.reason || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
