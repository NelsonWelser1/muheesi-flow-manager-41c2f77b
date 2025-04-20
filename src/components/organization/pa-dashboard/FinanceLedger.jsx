
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, PieChart, CreditCard, DollarSign, Receipt, ArrowDownUp, FileText, Plus, ArrowUpRight, ArrowDownRight, Download, Filter, Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const FinanceLedger = ({ selectedEntity }) => {
  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      date: '2025-04-01', 
      payee: 'Nakumatt Supermarket', 
      purpose: 'Banana Sales (Ripe)', 
      amount: 325000, 
      type: 'income',
      reference: 'INV-2025-001'
    },
    { 
      id: 2, 
      date: '2025-04-03', 
      payee: 'Carrefour Uganda', 
      purpose: 'Banana Sales (Green)', 
      amount: 375000, 
      type: 'income',
      reference: 'INV-2025-002'
    },
    { 
      id: 3, 
      date: '2025-04-05', 
      payee: 'Eng. Collins', 
      purpose: 'Plantation Irrigation Repair', 
      amount: 250000, 
      type: 'expense',
      reference: 'EXP-2025-001'
    },
    { 
      id: 4, 
      date: '2025-04-07', 
      payee: 'Fresh Foods Market', 
      purpose: 'Banana Sales (Ripe)', 
      amount: 260000, 
      type: 'income',
      reference: 'INV-2025-003'
    },
    { 
      id: 5, 
      date: '2025-04-08', 
      payee: 'Agro Supplies Ltd', 
      purpose: 'Fertilizer Purchase', 
      amount: 180000, 
      type: 'expense',
      reference: 'EXP-2025-002'
    },
  ]);
  
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      entity: 'KAJON Coffee',
      product: 'Arabica Green Beans (Grade A)',
      quantity: 750,
      unit: 'kg',
      costPerUnit: 12000,
      sellingPrice: 18000,
      status: 'available'
    },
    {
      id: 2,
      entity: 'KAJON Coffee',
      product: 'Robusta Green Beans (Grade A)',
      quantity: 1200,
      unit: 'kg',
      costPerUnit: 8500,
      sellingPrice: 13500,
      status: 'available'
    },
    {
      id: 3,
      entity: 'Grand Berna Dairies',
      product: 'Cheese (Gouda)',
      quantity: 85,
      unit: 'kg',
      costPerUnit: 28000,
      sellingPrice: 45000,
      status: 'available'
    },
    {
      id: 4,
      entity: 'Grand Berna Dairies',
      product: 'Yogurt (Vanilla)',
      quantity: 120,
      unit: 'liters',
      costPerUnit: 8000,
      sellingPrice: 15000,
      status: 'available'
    },
    {
      id: 5,
      entity: 'Fresheco Farming',
      product: 'Bananas (Ripe)',
      quantity: 0,
      unit: 'bunches',
      costPerUnit: 5000,
      sellingPrice: 13000,
      status: 'sold',
      soldQuantity: 250,
      soldDate: '2025-04-01',
      soldFor: 3250000
    },
    {
      id: 6,
      entity: 'Fresheco Farming',
      product: 'Bananas (Green)',
      quantity: 85,
      unit: 'bunches',
      costPerUnit: 4500,
      sellingPrice: 12500,
      status: 'partial',
      soldQuantity: 30,
      soldDate: '2025-04-03',
      soldFor: 375000
    }
  ]);
  
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    payee: '',
    purpose: '',
    amount: '',
    type: 'income',
    reference: '',
    notes: ''
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showBalanceCalculation, setShowBalanceCalculation] = useState(true);
  const [activeInventoryTab, setActiveInventoryTab] = useState('all');
  
  const { toast } = useToast();
  
  // Calculate totals and balance
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const closingBalance = totalIncome - totalExpenses;
  const previousBalance = 29699000; // Example starting balance
  const currentBalance = previousBalance + closingBalance;
  
  // Filter transactions based on type and date
  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => {
      if (!dateRange.from && !dateRange.to) return true;
      const transactionDate = new Date(t.date);
      const from = dateRange.from ? new Date(dateRange.from) : new Date(0);
      const to = dateRange.to ? new Date(dateRange.to) : new Date(9999, 11, 31);
      return transactionDate >= from && transactionDate <= to;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)
  
  // Filter inventory items
  const filteredInventory = inventoryItems.filter(item => {
    if (activeInventoryTab === 'all') return true;
    if (activeInventoryTab === 'available') return item.status === 'available' || item.status === 'partial';
    if (activeInventoryTab === 'sold') return item.status === 'sold' || item.status === 'partial';
    return true;
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };
  
  const handleSelectChange = (name, value) => {
    setNewTransaction({ ...newTransaction, [name]: value });
  };
  
  const handleAddTransaction = () => {
    if (!newTransaction.payee || !newTransaction.purpose || !newTransaction.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    // Generate reference number
    const prefix = newTransaction.type === 'income' ? 'INV' : 'EXP';
    const refNumber = `${prefix}-${new Date().getFullYear()}-${(transactions.length + 1).toString().padStart(3, '0')}`;
    
    const newEntry = {
      id: transactions.length + 1,
      date: newTransaction.date,
      payee: newTransaction.payee,
      purpose: newTransaction.purpose,
      amount: amount,
      type: newTransaction.type,
      reference: newTransaction.reference || refNumber
    };
    
    setTransactions([...transactions, newEntry]);
    
    // Reset form and close dialog
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      payee: '',
      purpose: '',
      amount: '',
      type: 'income',
      reference: '',
      notes: ''
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Transaction Added",
      description: "The transaction has been recorded successfully",
    });
  };
  
  // Calculate inventory value
  const calculateInventoryValue = (items) => {
    return items.reduce((total, item) => {
      if (item.status === 'available') {
        return total + (item.quantity * item.costPerUnit);
      } else if (item.status === 'partial') {
        return total + ((item.quantity) * item.costPerUnit);
      }
      return total;
    }, 0);
  };
  
  const calculatePotentialSalesValue = (items) => {
    return items.reduce((total, item) => {
      if (item.status === 'available') {
        return total + (item.quantity * item.sellingPrice);
      } else if (item.status === 'partial') {
        return total + ((item.quantity) * item.sellingPrice);
      }
      return total;
    }, 0);
  };
  
  const calculateSoldValue = (items) => {
    return items.reduce((total, item) => {
      if (item.status === 'sold') {
        return total + item.soldFor;
      } else if (item.status === 'partial') {
        return total + item.soldFor;
      }
      return total;
    }, 0);
  };
  
  const calculateProfit = (items) => {
    return items.reduce((total, item) => {
      if (item.status === 'sold') {
        return total + (item.soldFor - (item.soldQuantity * item.costPerUnit));
      } else if (item.status === 'partial') {
        return total + (item.soldFor - (item.soldQuantity * item.costPerUnit));
      }
      return total;
    }, 0);
  };
  
  // Generate running balance for ledger display
  const transactionsWithBalance = filteredTransactions.map((transaction, index, array) => {
    // Calculate running balance in reverse (since we're sorting newest first)
    const previousTransactions = array.slice(0, index);
    const previousBalance = previousTransactions.reduce((balance, t) => {
      return balance + (t.type === 'income' ? t.amount : -t.amount);
    }, currentBalance - (transaction.type === 'income' ? transaction.amount : -transaction.amount));
    
    return {
      ...transaction,
      runningBalance: previousBalance
    };
  });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Previous Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-xl font-bold">UGX {previousBalance.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowUpRight className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-xl font-bold text-green-600">UGX {totalIncome.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowDownRight className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-xl font-bold text-red-600">UGX {totalExpenses.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-xl font-bold">UGX {currentBalance.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showBalanceCalculation && (
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle>Ledger Update — Post 8th April</CardTitle>
            <CardDescription>Summary of financial position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <p><strong>Previous Closing Balance:</strong> UGX {previousBalance.toLocaleString()}</p>
              <p><strong>Transaction Entries:</strong></p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                {transactions.map(t => (
                  <li key={t.id}>
                    {t.date} - {t.payee} - {t.purpose} - {t.type === 'income' ? '+' : '-'} UGX {t.amount.toLocaleString()} - {t.type === 'income' ? 'Income' : 'Expense'}
                  </li>
                ))}
              </ul>
              <p className="pt-2"><strong>Balance Calculation:</strong></p>
              <ul className="list-none pl-4 space-y-1">
                <li>Starting Balance: UGX {previousBalance.toLocaleString()}</li>
                {transactions.map((t, i) => {
                  // Calculate running balance for each transaction
                  const prevTransactions = transactions.slice(0, i);
                  const prevBalance = prevTransactions.reduce((bal, pt) => 
                    bal + (pt.type === 'income' ? pt.amount : -pt.amount), 
                    previousBalance
                  );
                  const newBalance = prevBalance + (t.type === 'income' ? t.amount : -t.amount);
                  return (
                    <li key={t.id} className="pl-8">
                      {t.type === 'income' ? 'Plus' : 'Less'} {t.purpose}: {t.type === 'income' ? '+' : '-'} UGX {t.amount.toLocaleString()} → UGX {newBalance.toLocaleString()}
                    </li>
                  );
                })}
              </ul>
              <p className="pt-2"><strong>New Closing Balance:</strong> UGX {currentBalance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="ledger" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ledger" className="space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl font-semibold">Transaction Ledger</h2>
            
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <div className="flex items-center gap-2">
                <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income Only</SelectItem>
                    <SelectItem value="expense">Expenses Only</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Input
                    type="date"
                    placeholder="From"
                    className="w-[130px]"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  />
                  <span>-</span>
                  <Input
                    type="date"
                    placeholder="To"
                    className="w-[130px]"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add New Transaction</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={newTransaction.date}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="type">Transaction Type</Label>
                          <Select 
                            value={newTransaction.type}
                            onValueChange={(value) => handleSelectChange('type', value)}
                          >
                            <SelectTrigger id="type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="payee">Payee / Source</Label>
                        <Input
                          id="payee"
                          name="payee"
                          value={newTransaction.payee}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Input
                          id="purpose"
                          name="purpose"
                          value={newTransaction.purpose}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Amount (UGX)</Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={newTransaction.amount}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="reference">Reference (Optional)</Label>
                          <Input
                            id="reference"
                            name="reference"
                            value={newTransaction.reference}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={newTransaction.notes}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddTransaction}>Add Transaction</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Payee / Source</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Amount (UGX)</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Running Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsWithBalance.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell>{transaction.payee}</TableCell>
                      <TableCell>{transaction.purpose}</TableCell>
                      <TableCell className={transaction.type === 'income' ? "text-green-600" : "text-red-600"}>
                        {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </TableCell>
                      <TableCell>UGX {transaction.runningBalance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX {calculateInventoryValue(inventoryItems).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">At cost price</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Potential Sales Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX {calculatePotentialSalesValue(inventoryItems).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">At selling price</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sold Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX {calculateSoldValue(inventoryItems).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total sales amount</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">UGX {calculateProfit(inventoryItems).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From sold inventory</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory Items</h2>
            <div className="flex items-center gap-2">
              <Tabs value={activeInventoryTab} onValueChange={setActiveInventoryTab}>
                <TabsList>
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="sold">Sold</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead>Sale Price/Unit</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Profit/Loss</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.entity}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>
                        {item.status === 'available' ? (
                          `${item.quantity} ${item.unit}`
                        ) : item.status === 'partial' ? (
                          <div>
                            <div>{item.quantity} {item.unit} (available)</div>
                            <div className="text-xs text-muted-foreground">{item.soldQuantity} {item.unit} (sold)</div>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">{item.soldQuantity} {item.unit} (sold out)</div>
                        )}
                      </TableCell>
                      <TableCell>UGX {item.costPerUnit.toLocaleString()}</TableCell>
                      <TableCell>UGX {item.sellingPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        {item.status === 'available' ? (
                          `UGX ${(item.quantity * item.costPerUnit).toLocaleString()}`
                        ) : item.status === 'partial' ? (
                          <div>
                            <div>UGX {(item.quantity * item.costPerUnit).toLocaleString()} (available)</div>
                            <div className="text-xs text-green-600">UGX {item.soldFor.toLocaleString()} (sold)</div>
                          </div>
                        ) : (
                          <div className="text-green-600">UGX {item.soldFor.toLocaleString()} (sold)</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'available' 
                            ? 'bg-blue-100 text-blue-800' 
                            : item.status === 'partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.status === 'available' ? 'Available' : 
                           item.status === 'partial' ? 'Partially Sold' : 'Sold'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.status === 'available' ? (
                          <span className="text-gray-500">N/A</span>
                        ) : (
                          <span className="text-green-600">
                            UGX {(item.status === 'sold' 
                              ? (item.soldFor - (item.soldQuantity * item.costPerUnit))
                              : (item.soldFor - (item.soldQuantity * item.costPerUnit))
                            ).toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Financial Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Revenue vs Expenses Chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Revenue by Entity</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Expenses by Category</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceLedger;
