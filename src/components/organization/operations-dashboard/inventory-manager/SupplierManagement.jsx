
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, MapPin, Phone, Mail, TrendingUp } from 'lucide-react';

const SupplierManagement = () => {
  const suppliers = [
    {
      id: 'SUP001',
      name: 'Uganda Coffee Farmers Cooperative',
      category: 'Raw Materials',
      location: 'Mount Elgon Region',
      contact: '+256 782 345 678',
      email: 'info@ugandacoffee.coop',
      rating: 4.8,
      status: 'Active',
      contractValue: '$125,000',
      lastOrder: '2024-06-01',
      onTimeDelivery: '96%',
      qualityScore: '98%',
      products: ['Arabica Coffee', 'Robusta Coffee']
    },
    {
      id: 'SUP002',
      name: 'East Africa Packaging Solutions',
      category: 'Packaging',
      location: 'Kampala Industrial Area',
      contact: '+256 771 234 567',
      email: 'sales@eapackaging.com',
      rating: 4.5,
      status: 'Active',
      contractValue: '$45,000',
      lastOrder: '2024-05-28',
      onTimeDelivery: '89%',
      qualityScore: '92%',
      products: ['Boxes', 'Labels', 'Bags']
    },
    {
      id: 'SUP003',
      name: 'Kyalima Dairy Farms Ltd',
      category: 'Dairy Products',
      location: 'Kazo District',
      contact: '+256 785 123 456',
      email: 'procurement@kyalimafarms.com',
      rating: 4.9,
      status: 'Preferred',
      contractValue: '$89,000',
      lastOrder: '2024-06-03',
      onTimeDelivery: '98%',
      qualityScore: '99%',
      products: ['Fresh Milk', 'Cream', 'Butter']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Preferred': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Supplier Management</h3>
          <p className="text-sm text-muted-foreground">Manage supplier relationships and performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Report
          </Button>
          <Button className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4.6</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Contract Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$1.2M</div>
            <p className="text-xs text-muted-foreground">Annual agreements</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">94.3%</div>
            <p className="text-xs text-muted-foreground">Network average</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{supplier.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {supplier.category} | Supplier ID: {supplier.id}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {getRatingStars(supplier.rating)}
                    </div>
                    <span className="text-sm font-medium">{supplier.rating}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(supplier.status)}>
                    {supplier.status}
                  </Badge>
                  <span className="text-lg font-bold text-green-600">
                    {supplier.contractValue}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">{supplier.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="font-semibold">{supplier.contact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">On-Time Delivery</p>
                    <p className="font-semibold">{supplier.onTimeDelivery}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Quality Score</p>
                    <p className="font-semibold">{supplier.qualityScore}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Products & Services</p>
                <div className="flex gap-2 mb-3">
                  {supplier.products.map((product, index) => (
                    <Badge key={index} variant="outline">
                      {product}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    <Mail className="h-4 w-4 inline mr-1 text-blue-600" />
                    {supplier.email}
                  </span>
                  <span className="text-muted-foreground">
                    Last Order: {supplier.lastOrder}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
                <Button variant="outline" size="sm">
                  Performance History
                </Button>
                <Button variant="outline" size="sm">
                  Contact
                </Button>
                <Button variant="outline" size="sm">
                  New Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Kyalima Dairy Farms</span>
              <span className="text-sm font-semibold text-green-600">4.9★</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Uganda Coffee Cooperative</span>
              <span className="text-sm font-semibold text-green-600">4.8★</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">East Africa Packaging</span>
              <span className="text-sm font-semibold text-blue-600">4.5★</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contract Renewals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-semibold">15 days:</span> Transport Solutions Ltd
            </div>
            <div className="text-sm">
              <span className="font-semibold">30 days:</span> Quality Testing Services
            </div>
            <div className="text-sm">
              <span className="font-semibold">45 days:</span> Packaging Materials Inc
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Supplier Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Northern Coffee Producers</span>
              <Badge variant="outline">Pending Review</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">EcoPackage Solutions</span>
              <Badge variant="outline">Due Diligence</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Mountain Dairy Association</span>
              <Badge variant="outline">In Negotiation</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierManagement;
