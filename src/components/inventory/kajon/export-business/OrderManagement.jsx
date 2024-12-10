import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";

const OrderManagement = () => {
  const [view, setView] = useState('list');
  
  // Mock data for demonstration
  const orders = [
    { id: '#002', date: '11 Feb, 2024', customer: 'Wade Warren', status: 'pending', total: '$20.00', delivery: 'N/A', items: '2 items', fulfillment: 'Unfulfilled' },
    { id: '#004', date: '13 Feb, 2024', customer: 'Esther Howard', status: 'success', total: '$22.00', delivery: 'N/A', items: '3 items', fulfillment: 'Fulfilled' },
    { id: '#007', date: '15 Feb, 2024', customer: 'Jenny Wilson', status: 'pending', total: '$25.00', delivery: 'N/A', items: '1 items', fulfillment: 'Unfulfilled' },
  ];

  const OrdersList = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-2xl font-bold">21</div>
            <div className="text-xs text-green-600">↑ 25.2% last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Order Items over time</div>
            <div className="text-2xl font-bold">15</div>
            <div className="text-xs text-green-600">↑ 18.2% last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Returns Orders</div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-red-600">↓ -1.2% last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Fulfilled orders over time</div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-green-600">↑ 12.2% last week</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Unfulfilled</Button>
          <Button variant="outline" size="sm">Unpaid</Button>
          <Button variant="outline" size="sm">Open</Button>
          <Button variant="outline" size="sm">Closed</Button>
          <Button variant="outline" size="sm"><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Jan 1 - Jan 30, 2024
          </Button>
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="outline" size="sm">More actions</Button>
          <Button size="sm" onClick={() => setView('form')}>Create order</Button>
        </div>
      </div>

      {/* Search and View Options */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-8" />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm"><Search className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><SlidersHorizontal className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Orders Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input type="checkbox" className="rounded border-gray-300" />
            </TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Fulfillment</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <input type="checkbox" className="rounded border-gray-300" />
              </TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge variant={order.status === 'pending' ? 'warning' : 'success'}>
                  {order.status === 'pending' ? 'Pending' : 'Success'}
                </Badge>
              </TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.delivery}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell>
                <Badge variant={order.fulfillment === 'Unfulfilled' ? 'destructive' : 'success'}>
                  {order.fulfillment}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const OrderForm = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold italic">Purchase Order</h1>
          <div className="text-sm">
            <p>KAJON Coffee Limited</p>
            <p>8339 Entebbe Town</p>
            <p>(+774) 449035</p>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex gap-2">
            <span className="font-semibold">PURCHASE ORDER #:</span>
            <Input className="w-32" placeholder="123456/22" />
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">DATE:</span>
            <Input type="date" className="w-40" />
          </div>
        </div>
      </div>

      {/* Client Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">CLIENT INFORMATION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Client name" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="Client address" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="client@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="Phone number" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">ORDER INFORMATION</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PRODUCT NAME</TableHead>
              <TableHead>ITEM #</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>SIZE</TableHead>
              <TableHead>GRADE</TableHead>
              <TableHead>TOTAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Input placeholder="Product name" />
              </TableCell>
              <TableCell>
                <Input placeholder="Item #" />
              </TableCell>
              <TableCell>
                <Input type="number" placeholder="0.00" />
              </TableCell>
              <TableCell>
                <Input type="number" placeholder="0" />
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>$0.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Shipping and Payment Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">SHIPPING INFO</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Method</Label>
              <Input placeholder="Shipping method" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input placeholder="Shipping company" />
            </div>
            <div className="space-y-2">
              <Label>Track #</Label>
              <Input placeholder="Tracking number" />
            </div>
            <div className="space-y-2">
              <Label>Arrival Date</Label>
              <Input type="date" />
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">PAYMENT INFO</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Subtotal:</Label>
              <Input className="w-32" readOnly value="$0.00" />
            </div>
            <div className="flex justify-between items-center">
              <Label>Taxes (%):</Label>
              <Input type="number" className="w-32" placeholder="0" />
            </div>
            <div className="flex justify-between items-center">
              <Label>Shipping:</Label>
              <Input type="number" className="w-32" placeholder="0.00" />
            </div>
            <div className="flex justify-between items-center">
              <Label>Discount (%):</Label>
              <Input type="number" className="w-32" placeholder="0" />
            </div>
            <div className="flex justify-between items-center font-bold">
              <Label>TOTAL:</Label>
              <Input className="w-32" readOnly value="$0.00" />
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">NOTES</h2>
        <textarea 
          className="w-full min-h-[100px] p-4 border rounded-md" 
          placeholder="Add any additional notes or terms here..."
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setView('list')}>Back to List</Button>
        <Button>Create Purchase Order</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      {view === 'list' ? <OrdersList /> : <OrderForm />}
    </div>
  );
};

export default OrderManagement;