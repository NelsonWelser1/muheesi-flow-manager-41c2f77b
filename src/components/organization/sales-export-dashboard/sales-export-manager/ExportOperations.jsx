
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ship, Globe, Package, FileText } from 'lucide-react';

const ExportOperations = () => {
  const activeShipments = [
    {
      shipmentId: "SH-2024-015",
      destination: "Hamburg, Germany",
      product: "Premium Arabica Coffee",
      quantity: "25 tons",
      value: 185000,
      status: "in-transit",
      etd: "2024-06-10",
      eta: "2024-06-28"
    },
    {
      shipmentId: "SH-2024-016",
      destination: "Shanghai, China",
      product: "Specialty Robusta",
      quantity: "15 tons", 
      value: 95000,
      status: "customs-clearance",
      etd: "2024-06-05",
      eta: "2024-06-22"
    },
    {
      shipmentId: "SH-2024-017",
      destination: "New York, USA",
      product: "Organic Blend",
      quantity: "30 tons",
      value: 220000,
      status: "preparing",
      etd: "2024-06-15",
      eta: "2024-07-02"
    }
  ];

  const exportMarkets = [
    { country: "Germany", revenue: 450000, growth: "+15%", orders: 24 },
    { country: "China", revenue: 380000, growth: "+28%", orders: 18 },
    { country: "USA", revenue: 520000, growth: "+12%", orders: 32 },
    { country: "Belgium", revenue: 280000, growth: "+22%", orders: 16 },
    { country: "Japan", revenue: 165000, growth: "+8%", orders: 9 }
  ];

  const getShipmentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'preparing': return 'bg-yellow-500 text-white';
      case 'in-transit': return 'bg-blue-500 text-white';
      case 'customs-clearance': return 'bg-orange-500 text-white';
      case 'delivered': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Export Operations</h3>
        <Button>
          <Ship className="h-4 w-4 mr-2" />
          New Shipment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Active Shipments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeShipments.map((shipment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{shipment.shipmentId}</h4>
                    <p className="text-sm text-muted-foreground">{shipment.destination}</p>
                  </div>
                  <Badge className={getShipmentStatusColor(shipment.status)}>
                    {shipment.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Product</p>
                    <p className="font-medium">{shipment.product}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{shipment.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ETD</p>
                    <p className="font-medium">{shipment.etd}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ETA</p>
                    <p className="font-medium">{shipment.eta}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-semibold text-green-600">
                    ${shipment.value.toLocaleString()}
                  </span>
                  <Button size="sm" variant="outline">Track</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Export Markets Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {exportMarkets.map((market, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{market.country}</h4>
                  <Badge variant="outline">{market.growth}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-green-600">
                      ${market.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Orders</p>
                    <p className="font-medium">{market.orders}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Operations Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              Shipment Tracker
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Export Documents
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Globe className="h-6 w-6 mb-2" />
              Market Research
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Ship className="h-6 w-6 mb-2" />
              Logistics Planning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportOperations;
