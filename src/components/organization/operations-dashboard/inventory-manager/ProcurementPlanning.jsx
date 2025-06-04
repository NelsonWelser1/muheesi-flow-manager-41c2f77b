
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Calendar, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const ProcurementPlanning = () => {
  const procurementRequests = [
    {
      id: 'PR001',
      item: 'Arabica Coffee Beans',
      quantity: '2,000 kg',
      supplier: 'Uganda Coffee Farmers Co-op',
      requestDate: '2024-06-04',
      deliveryDate: '2024-06-15',
      unitPrice: '$8.50',
      totalValue: '$17,000',
      status: 'Approved',
      priority: 'High',
      department: 'Production'
    },
    {
      id: 'PR002',
      item: 'Packaging Materials',
      quantity: '10,000 units',
      supplier: 'East Africa Packaging Ltd',
      requestDate: '2024-06-03',
      deliveryDate: '2024-06-12',
      unitPrice: '$0.45',
      totalValue: '$4,500',
      status: 'Pending Review',
      priority: 'Medium',
      department: 'Manufacturing'
    },
    {
      id: 'PR003',
      item: 'Dairy Processing Equipment',
      quantity: '1 unit',
      supplier: 'Industrial Equipment Co.',
      requestDate: '2024-06-02',
      deliveryDate: '2024-07-01',
      unitPrice: '$25,000',
      totalValue: '$25,000',
      status: 'Quote Requested',
      priority: 'High',
      department: 'Operations'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Quote Requested': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Procurement Planning</h3>
          <p className="text-sm text-muted-foreground">Manage purchase requests and supplier relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </Button>
          <Button className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$145K</div>
            <p className="text-xs text-muted-foreground">65% utilized</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">18%</div>
            <p className="text-xs text-muted-foreground">YTD improvement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">3.2 days</div>
            <p className="text-xs text-muted-foreground">Request to approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {procurementRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{request.item}</h4>
                  <p className="text-sm text-muted-foreground">
                    Request ID: {request.id} | Department: {request.department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{request.quantity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="font-semibold">{request.totalValue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Request Date</p>
                    <p className="font-semibold">{request.requestDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Expected Delivery</p>
                    <p className="font-semibold">{request.deliveryDate}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Supplier</p>
                <p className="font-semibold">{request.supplier}</p>
                <p className="text-sm text-muted-foreground">Unit Price: {request.unitPrice}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Edit Request
                </Button>
                <Button variant="outline" size="sm">
                  Contact Supplier
                </Button>
                <Button variant="outline" size="sm">
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProcurementPlanning;
