
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Coffee, Package, Mail, Phone, MapPin, Globe, Star, Truck, Shield, Award } from 'lucide-react';

const KAJONCoffeeDetails = ({ onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const coffeeProducts = [
    {
      category: 'Robusta Coffee',
      products: [
        { name: 'FAQ (Fair Average Quality)', grade: 'Premium', stock: '2000kg', price: '$2.20/kg' },
        { name: 'Screen 18', grade: 'High', stock: '1500kg', price: '$2.30/kg' },
        { name: 'Screen 15', grade: 'Standard', stock: '1200kg', price: '$2.10/kg' },
        { name: 'Screen 12', grade: 'Standard', stock: '1000kg', price: '$2.00/kg' },
        { name: 'Organic Robusta', grade: 'Certified', stock: '800kg', price: '$2.80/kg' }
      ]
    },
    {
      category: 'Arabica Coffee',
      products: [
        { name: 'Bugisu AA', grade: 'Premium', stock: '1500kg', price: '$4.50/kg' },
        { name: 'Bugisu A', grade: 'High', stock: '1300kg', price: '$4.20/kg' },
        { name: 'Bugisu PB (Peaberry)', grade: 'Specialty', stock: '1100kg', price: '$5.00/kg' },
        { name: 'Bugisu B', grade: 'Standard', stock: '900kg', price: '$3.80/kg' },
        { name: 'DRUGAR', grade: 'Specialty', stock: '700kg', price: '$4.80/kg' },
        { name: 'Parchment Arabica', grade: 'Processing', stock: '600kg', price: '$3.50/kg' }
      ]
    }
  ];

  const certifications = [
    { name: 'Fair Trade Certified', icon: <Award className="h-5 w-5" /> },
    { name: 'Organic Certification', icon: <Shield className="h-5 w-5" /> },
    { name: 'UTZ Certified', icon: <Star className="h-5 w-5" /> },
    { name: 'Rainforest Alliance', icon: <Globe className="h-5 w-5" /> }
  ];

  const handleInquiry = (product) => {
    toast({
      title: "Inquiry Sent",
      description: `Your inquiry for ${product} has been forwarded to our sales team.`,
    });
  };

  const handleBulkOrder = () => {
    toast({
      title: "Bulk Order Request",
      description: "Our team will contact you within 24 hours for bulk pricing.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8 text-amber-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">KAJON Coffee Limited</h2>
              <p className="text-gray-600">Premium Coffee Exporter</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'products', label: 'Products' },
              { id: 'certifications', label: 'Certifications' },
              { id: 'contact', label: 'Contact' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Package className="h-5 w-5 mr-2 text-amber-600" />
                      Total Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">11</div>
                    <p className="text-gray-600 text-sm">Coffee varieties available</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-green-600" />
                      Export Markets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">25+</div>
                    <p className="text-gray-600 text-sm">Countries worldwide</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-600" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">4</div>
                    <p className="text-gray-600 text-sm">International standards</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    KAJON Coffee Limited is a premier coffee exporter specializing in high-quality Robusta and Arabica coffee beans. 
                    With operations centered in Uganda's coffee-rich regions, we pride ourselves on delivering exceptional coffee that meets 
                    international standards. Our commitment to quality, sustainability, and fair trade practices has established us as a 
                    trusted partner for coffee importers worldwide.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">Premium Quality</Badge>
                    <Badge variant="secondary">Direct Trade</Badge>
                    <Badge variant="secondary">Sustainable Sourcing</Badge>
                    <Badge variant="secondary">Global Shipping</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {coffeeProducts.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.products.map((product, idx) => (
                        <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <Badge variant={product.grade === 'Premium' ? 'default' : 'secondary'}>
                              {product.grade}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Stock: <span className="font-medium">{product.stock}</span></p>
                            <p>Price: <span className="font-medium text-green-600">{product.price}</span></p>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full mt-3"
                            onClick={() => handleInquiry(product.name)}
                          >
                            Request Quote
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="text-center">
                <Button size="lg" onClick={handleBulkOrder}>
                  Request Bulk Pricing
                </Button>
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Our Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                        <div className="text-green-600">
                          {cert.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-sm text-gray-600">Verified and active</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Assurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">
                      Our coffee undergoes rigorous quality control processes to ensure consistency and excellence. 
                      We maintain strict standards for:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-3">
                      <li>Bean grading and sorting</li>
                      <li>Moisture content control</li>
                      <li>Defect analysis</li>
                      <li>Cupping scores evaluation</li>
                      <li>Packaging and storage standards</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">kajoncoffeelimited@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Phone Numbers</p>
                        <div className="text-gray-600">
                          <p>+256 776 670680</p>
                          <p>+256 757 757517</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-600">Uganda, East Africa</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium">9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        Emergency orders and urgent inquiries can be handled outside business hours.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Ready to place an order or have questions about our coffee? Contact us today for personalized service and competitive pricing.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => window.location.href = 'mailto:kajoncoffeelimited@gmail.com'}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = 'tel:+256776670680'}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KAJONCoffeeDetails;
