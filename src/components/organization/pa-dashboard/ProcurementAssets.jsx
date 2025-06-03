
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  Truck, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Building,
  User
} from 'lucide-react';

const ProcurementAssets = ({ selectedEntity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const procurementData = [
    {
      id: 1,
      item: 'Dairy Processing Equipment',
      company: 'Grand Berna Dairies',
      supplier: 'TechDairy Solutions',
      category: 'Equipment',
      status: 'Delivered',
      orderDate: '2024-05-15',
      deliveryDate: '2024-06-01',
      value: 2500000,
      quantity: 1,
      unit: 'Unit'
    },
    {
      id: 2,
      item: 'Coffee Roasting Machines',
      company: 'KAJON Coffee Limited',
      supplier: 'Coffee Tech International',
      category: 'Machinery',
      status: 'In Transit',
      orderDate: '2024-05-20',
      deliveryDate: '2024-06-10',
      value: 1800000,
      quantity: 2,
      unit: 'Units'
    },
    {
      id: 3,
      item: 'Farm Irrigation System',
      company: 'Kyalima Farmers Limited',
      supplier: 'AgroTech Uganda',
      category: 'Infrastructure',
      status: 'Pending',
      orderDate: '2024-05-25',
      deliveryDate: '2024-06-15',
      value: 950000,
      quantity: 1,
      unit: 'System'
    },
    {
      id: 4,
      item: 'Packaging Materials',
      company: 'Grand Berna Dairies',
      supplier: 'PackCorp Ltd',
      category: 'Consumables',
      status: 'Ordered',
      orderDate: '2024-06-01',
      deliveryDate: '2024-06-08',
      value: 320000,
      quantity: 5000,
      unit: 'Units'
    }
  ];

  const assetData = [
    {
      id: 1,
      name: 'Milk Pasteurization Unit #1',
      company: 'Grand Berna Dairies',
      category: 'Processing Equipment',
      location: 'Factory Floor A',
      value: 5000000,
      condition: 'Excellent',
      lastMaintenance: '2024-05-01',
      nextMaintenance: '2024-08-01',
      warranty: 'Active'
    },
    {
      id: 2,
      name: 'Coffee Drying Equipment',
      company: 'KAJON Coffee Limited',
      category: 'Processing Equipment',
      location: 'Processing Center',
      value: 3200000,
      condition: 'Good',
      lastMaintenance: '2024-04-15',
      nextMaintenance: '2024-07-15',
      warranty: 'Active'
    },
    {
      id: 3,
      name: 'Farm Tractors (Set of 3)',
      company: 'Kyalima Farmers Limited',
      category: 'Agricultural Equipment',
      location: 'Farm Compound',
      value: 4500000,
      condition: 'Good',
      lastMaintenance: '2024-05-10',
      nextMaintenance: '2024-08-10',
      warranty: 'Expired'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'In Transit': return 'bg-blue-500';
      case 'Ordered': return 'bg-yellow-500';
      case 'Pending': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredProcurement = procurementData.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase() === filterStatus;
    const matchesEntity = selectedEntity === 'all' || item.company === selectedEntity;
    return matchesSearch && matchesStatus && matchesEntity;
  });

  const filteredAssets = assetData.filter(asset => {
    const matchesEntity = selectedEntity === 'all' || asset.company === selectedEntity;
    return matchesEntity;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Procurement & Asset Management</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="ordered">Ordered</SelectItem>
              <SelectItem value="in transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="procurement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="procurement">Procurement Orders</TabsTrigger>
          <TabsTrigger value="assets">Asset Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="procurement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{filteredProcurement.length}</p>
                <p className="text-xs text-muted-foreground">This period</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatCurrency(filteredProcurement.reduce((sum, item) => sum + item.value, 0))}
                </p>
                <p className="text-xs text-green-600">Current orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredProcurement.filter(item => item.status !== 'Delivered').length}
                </p>
                <p className="text-xs text-muted-foreground">Awaiting delivery</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">On-Time Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-xs text-green-600">Supplier performance</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {filteredProcurement.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{item.item}</h4>
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span>{item.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{item.supplier}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span>{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span>{formatCurrency(item.value)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Ordered: {new Date(item.orderDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          Expected: {new Date(item.deliveryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Track
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{filteredAssets.length}</p>
                <p className="text-xs text-muted-foreground">Tracked assets</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatCurrency(filteredAssets.reduce((sum, asset) => sum + asset.value, 0))}
                </p>
                <p className="text-xs text-blue-600">Asset portfolio</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Maintenance Due</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">2</p>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Warranty Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAssets.filter(asset => asset.warranty === 'Active').length}
                </p>
                <p className="text-xs text-green-600">Active warranties</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {filteredAssets.map((asset) => (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{asset.name}</h4>
                        <Badge variant="outline">{asset.category}</Badge>
                        <Badge className={getConditionColor(asset.condition)}>
                          {asset.condition}
                        </Badge>
                        <Badge variant={asset.warranty === 'Active' ? 'default' : 'secondary'}>
                          {asset.warranty} Warranty
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span>{asset.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span>{asset.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span>{formatCurrency(asset.value)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Next: {new Date(asset.nextMaintenance).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Maintain
                      </Button>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'TechDairy Solutions', rating: 4.8, orders: 12, value: '8.5M UGX' },
              { name: 'Coffee Tech International', rating: 4.6, orders: 8, value: '6.2M UGX' },
              { name: 'AgroTech Uganda', rating: 4.4, orders: 15, value: '4.8M UGX' },
              { name: 'PackCorp Ltd', rating: 4.2, orders: 25, value: '3.1M UGX' }
            ].map((supplier, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{supplier.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Rating: {supplier.rating}/5</span>
                        <span>{supplier.orders} orders</span>
                        <span>{supplier.value} total</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Procurement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Procurement Analytics</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Asset Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Asset Performance</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementAssets;
