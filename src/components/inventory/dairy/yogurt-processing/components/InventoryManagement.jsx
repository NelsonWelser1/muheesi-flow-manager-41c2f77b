
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  AlertCircle,
  Truck,
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const InventoryManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("finished");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleRefreshInventory = () => {
    toast({
      title: "Inventory Updated",
      description: "Inventory has been refreshed with the latest data"
    });
  };

  const handleAddNewItem = (type) => {
    toast({
      title: "Form Opened",
      description: `New ${type} inventory form would open here`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Management</h2>
        <Button variant="outline" size="sm" onClick={handleRefreshInventory}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh Inventory
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InventorySummaryCard
          title="Finished Products"
          total="1,240 units"
          icon={Package}
          lowStock={2}
          trend="+120 from last week"
          trendUp={true}
        />
        <InventorySummaryCard
          title="Raw Materials"
          total="4,500 kg"
          icon={Truck}
          lowStock={1}
          trend="-250 kg from last week"
          trendUp={false}
        />
        <InventorySummaryCard
          title="Packaging Materials"
          total="8,750 units"
          icon={Calendar}
          lowStock={0}
          trend="+1,200 from last week"
          trendUp={true}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yogurt Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="finished">Finished Products</TabsTrigger>
              <TabsTrigger value="raw">Raw Materials</TabsTrigger>
              <TabsTrigger value="packaging">Packaging</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row mb-4 gap-4 justify-between">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  title="Filter inventory"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleAddNewItem(activeTab === "finished" ? "product" : activeTab === "raw" ? "raw material" : "packaging")}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New
                </Button>
              </div>
            </div>

            <TabsContent value="finished">
              <InventoryTable 
                items={finished_products} 
                type="finished" 
                searchQuery={searchQuery}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={(field) => {
                  if (field === sortField) {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortField(field);
                    setSortDirection("asc");
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="raw">
              <InventoryTable 
                items={raw_materials} 
                type="raw"
                searchQuery={searchQuery}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={(field) => {
                  if (field === sortField) {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortField(field);
                    setSortDirection("asc");
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="packaging">
              <InventoryTable 
                items={packaging_materials} 
                type="packaging"
                searchQuery={searchQuery}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={(field) => {
                  if (field === sortField) {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortField(field);
                    setSortDirection("asc");
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const InventorySummaryCard = ({ title, total, icon: Icon, lowStock, trend, trendUp }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{total}</p>
            {trend && (
              <p className={`text-xs mt-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {trend}
              </p>
            )}
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        {lowStock > 0 && (
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <p className="text-xs text-yellow-700">{lowStock} items below reorder level</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InventoryTable = ({ items, type, searchQuery, sortField, sortDirection, onSortChange }) => {
  const { toast } = useToast();

  // Filter items based on search query
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.batch && item.batch.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort items based on sort field and direction
  const sortedItems = [...filteredItems].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // Handle date comparison
    if (sortField === 'expiry' || sortField === 'production_date') {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in stock':
        return <Badge className="bg-green-500">In Stock</Badge>;
      case 'low stock':
        return <Badge className="bg-yellow-500">Low Stock</Badge>;
      case 'out of stock':
        return <Badge className="bg-red-500">Out of Stock</Badge>;
      case 'expiring soon':
        return <Badge className="bg-orange-500">Expiring Soon</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleMove = (item) => {
    toast({
      title: "Item Moved",
      description: `${item.name} would be moved to a different location`
    });
  };

  const handleAdjust = (item) => {
    toast({
      title: "Quantity Adjusted",
      description: `${item.name} quantity would be updated`
    });
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 font-medium">
              <th className="p-3 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-primary"
                  onClick={() => onSortChange('name')}
                >
                  Product Name
                  {sortField === 'name' && (
                    <ArrowUpDown className={`h-3 w-3 ${sortField === 'name' ? 'text-primary' : ''}`} />
                  )}
                </button>
              </th>
              <th className="p-3 text-left">SKU</th>
              {type === 'finished' && <th className="p-3 text-left">Batch</th>}
              <th className="p-3 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-primary"
                  onClick={() => onSortChange('quantity')}
                >
                  Quantity
                  {sortField === 'quantity' && (
                    <ArrowUpDown className={`h-3 w-3 ${sortField === 'quantity' ? 'text-primary' : ''}`} />
                  )}
                </button>
              </th>
              <th className="p-3 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-primary"
                  onClick={() => onSortChange(type === 'finished' ? 'expiry' : 'production_date')}
                >
                  {type === 'finished' ? 'Expiry Date' : 'Date Added'}
                  {sortField === (type === 'finished' ? 'expiry' : 'production_date') && (
                    <ArrowUpDown className={`h-3 w-3 text-primary`} />
                  )}
                </button>
              </th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted/30">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">{item.sku}</td>
                {type === 'finished' && <td className="p-3">{item.batch}</td>}
                <td className="p-3">{item.quantity} {item.unit}</td>
                <td className="p-3">
                  {type === 'finished' 
                    ? new Date(item.expiry).toLocaleDateString() 
                    : new Date(item.production_date).toLocaleDateString()
                  }
                </td>
                <td className="p-3">{getStatusBadge(item.status)}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleMove(item)}>
                      Move
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleAdjust(item)}>
                      Adjust
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Mock data
const finished_products = [
  { 
    id: 1, 
    name: 'Greek Yogurt - Plain', 
    sku: 'YOG-GRK-001', 
    batch: 'YB001',
    quantity: 230, 
    unit: 'units', 
    expiry: '2024-07-15', 
    status: 'in stock' 
  },
  { 
    id: 2, 
    name: 'Strawberry Yogurt', 
    sku: 'YOG-STR-001', 
    batch: 'YB002',
    quantity: 115, 
    unit: 'units', 
    expiry: '2024-06-20', 
    status: 'in stock' 
  },
  { 
    id: 3, 
    name: 'Low-Fat Natural Yogurt', 
    sku: 'YOG-LFT-001', 
    batch: 'YB003',
    quantity: 45, 
    unit: 'units', 
    expiry: '2024-06-05', 
    status: 'low stock' 
  },
  { 
    id: 4, 
    name: 'Vanilla Yogurt', 
    sku: 'YOG-VAN-001', 
    batch: 'YB004',
    quantity: 180, 
    unit: 'units', 
    expiry: '2024-06-10', 
    status: 'in stock' 
  },
  { 
    id: 5, 
    name: 'Blueberry Yogurt', 
    sku: 'YOG-BLU-001', 
    batch: 'YB005',
    quantity: 20, 
    unit: 'units', 
    expiry: '2024-05-28', 
    status: 'expiring soon' 
  },
];

const raw_materials = [
  { 
    id: 1, 
    name: 'Fresh Whole Milk', 
    sku: 'RM-MLK-001', 
    quantity: 1250, 
    unit: 'liters', 
    production_date: '2024-05-16', 
    status: 'in stock' 
  },
  { 
    id: 2, 
    name: 'Skimmed Milk Powder', 
    sku: 'RM-SMP-001', 
    quantity: 350, 
    unit: 'kg', 
    production_date: '2024-04-20', 
    status: 'in stock' 
  },
  { 
    id: 3, 
    name: 'Yogurt Starter Culture', 
    sku: 'RM-YSC-001', 
    quantity: 15, 
    unit: 'kg', 
    production_date: '2024-05-01', 
    status: 'low stock' 
  },
  { 
    id: 4, 
    name: 'Strawberry Puree', 
    sku: 'RM-STP-001', 
    quantity: 180, 
    unit: 'kg', 
    production_date: '2024-04-15', 
    status: 'in stock' 
  },
  { 
    id: 5, 
    name: 'Natural Sweeteners', 
    sku: 'RM-SWT-001', 
    quantity: 200, 
    unit: 'kg', 
    production_date: '2024-03-28', 
    status: 'in stock' 
  },
];

const packaging_materials = [
  { 
    id: 1, 
    name: 'Plastic Cups - 150g', 
    sku: 'PCK-CUP-001', 
    quantity: 3450, 
    unit: 'units', 
    production_date: '2024-01-16', 
    status: 'in stock' 
  },
  { 
    id: 2, 
    name: 'Plastic Cups - 500g', 
    sku: 'PCK-CUP-002', 
    quantity: 2200, 
    unit: 'units', 
    production_date: '2024-02-20', 
    status: 'in stock' 
  },
  { 
    id: 3, 
    name: 'Foil Lids - Plain', 
    sku: 'PCK-LID-001', 
    quantity: 2500, 
    unit: 'units', 
    production_date: '2024-03-10', 
    status: 'in stock' 
  },
  { 
    id: 4, 
    name: 'Cardboard Boxes', 
    sku: 'PCK-BOX-001', 
    quantity: 600, 
    unit: 'units', 
    production_date: '2024-04-15', 
    status: 'in stock' 
  },
  { 
    id: 5, 
    name: 'Branded Labels - Greek', 
    sku: 'PCK-LBL-001', 
    quantity: 0, 
    unit: 'units', 
    production_date: '2024-01-28', 
    status: 'out of stock' 
  },
];

export default InventoryManagement;
