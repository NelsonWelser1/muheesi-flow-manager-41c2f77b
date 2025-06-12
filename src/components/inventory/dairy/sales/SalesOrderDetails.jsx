
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const SalesOrderDetails = ({ salesOrder }) => {
  if (!salesOrder) {
    return <div>No sales order data available.</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Order Number</label>
              <p className="text-sm">{salesOrder.order_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Order Date</label>
              <p className="text-sm">{format(new Date(salesOrder.order_date || salesOrder.created_at), 'PPP')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer Name</label>
              <p className="text-sm">{salesOrder.customer_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
              <Badge variant={salesOrder.payment_status === 'paid' ? 'default' : 'secondary'}>
                {salesOrder.payment_status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm">{salesOrder.customer_email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-sm">{salesOrder.customer_phone || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Shipping Address</label>
              <p className="text-sm">{salesOrder.shipping_address || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total Amount</span>
            <span className="text-lg font-bold">UGX {salesOrder.total_amount?.toLocaleString() || '0'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOrderDetails;
