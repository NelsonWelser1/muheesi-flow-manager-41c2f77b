
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Phone, Mail } from 'lucide-react';

const CustomerRelationship = () => {
  const topCustomers = [
    {
      name: "European Coffee Traders GmbH",
      country: "Germany",
      tier: "platinum",
      totalOrders: 45,
      revenue: 1250000,
      satisfaction: 4.8,
      lastOrder: "2024-06-01"
    },
    {
      name: "Asian Premium Imports Ltd",
      country: "China", 
      tier: "gold",
      totalOrders: 32,
      revenue: 850000,
      satisfaction: 4.6,
      lastOrder: "2024-05-28"
    },
    {
      name: "American Specialty Coffee Co.",
      country: "USA",
      tier: "platinum",
      totalOrders: 38,
      revenue: 1100000,
      satisfaction: 4.9,
      lastOrder: "2024-06-03"
    },
    {
      name: "Middle East Coffee Distributors",
      country: "UAE",
      tier: "silver",
      totalOrders: 28,
      revenue: 720000,
      satisfaction: 4.4,
      lastOrder: "2024-05-25"
    }
  ];

  const recentInquiries = [
    {
      customer: "Nordic Coffee Solutions",
      inquiry: "Bulk order for premium arabica - 50 tons",
      priority: "high",
      date: "2024-06-04"
    },
    {
      customer: "Australian Gourmet Imports",
      inquiry: "Organic certification requirements",
      priority: "medium",
      date: "2024-06-03"
    },
    {
      customer: "Canadian Premium Roasters",
      inquiry: "Pricing for specialty blends",
      priority: "high",
      date: "2024-06-02"
    },
    {
      customer: "South African Trade Partners",
      inquiry: "Shipping schedule for Q3",
      priority: "low",
      date: "2024-06-01"
    }
  ];

  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return 'bg-purple-500 text-white';
      case 'gold': return 'bg-yellow-500 text-white';
      case 'silver': return 'bg-gray-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Customer Relationship Management</h3>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add New Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{customer.name}</h4>
                    <p className="text-sm text-muted-foreground">{customer.country}</p>
                  </div>
                  <Badge className={getTierColor(customer.tier)}>
                    {customer.tier}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Revenue</p>
                    <p className="font-semibold text-green-600">
                      ${customer.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Orders</p>
                    <p className="font-medium">{customer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Satisfaction</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{customer.satisfaction}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Order</p>
                    <p className="font-medium">{customer.lastOrder}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Customer Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInquiries.map((inquiry, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{inquiry.customer}</h4>
                  <Badge className={getPriorityColor(inquiry.priority)}>
                    {inquiry.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {inquiry.inquiry}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {inquiry.date}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Customer Database
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Star className="h-6 w-6 mb-2" />
              Feedback System
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Phone className="h-6 w-6 mb-2" />
              Communication Log
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              Email Campaigns
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerRelationship;
