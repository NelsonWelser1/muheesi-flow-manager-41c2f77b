import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Users, FileText, UserPlus, Download, X, Camera, Coffee, MapPin, Phone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const AssociationMembersManagement = ({ isKazo, selectedAssociation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [memberStatus, setMemberStatus] = useState('all');
  const { toast } = useToast();
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    phone: '',
    farmSize: '',
    coffeeType: 'arabica',
    experience: '',
    certifications: [],
    photo: null
  });
  
  // Sample members data - would come from API/database in a real app
  const members = [
    { id: 1, name: 'John Mwesigwa', farmerId: 'KF-001', location: 'Kanoni', status: 'active', joinDate: '2023-05-10', membershipLevel: 'gold', farmSize: 5.2, coffeeType: 'Arabica', lastDelivery: '2025-02-15' },
    { id: 2, name: 'Sarah Mirembe', farmerId: 'KF-002', location: 'Engari', status: 'active', joinDate: '2023-06-22', membershipLevel: 'silver', farmSize: 3.8, coffeeType: 'Robusta', lastDelivery: '2025-03-01' },
    { id: 3, name: 'Moses Tumusiime', farmerId: 'KF-003', location: 'Kyampangara', status: 'pending', joinDate: '2025-01-30', membershipLevel: 'bronze', farmSize: 2.5, coffeeType: 'Arabica', lastDelivery: 'N/A' },
    { id: 4, name: 'Peace Akankwasa', farmerId: 'KF-004', location: 'Kanoni', status: 'inactive', joinDate: '2023-04-15', membershipLevel: 'silver', farmSize: 4.1, coffeeType: 'Mixed', lastDelivery: '2024-11-10' },
  ];

  const filteredMembers = members.filter(member => {
    // Filter by search term
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = memberStatus === 'all' || member.status === memberStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getMembershipBadgeColor = (level) => {
    switch(level.toLowerCase()) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'silver': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'bronze': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'inactive': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'pending': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the data to your API
    console.log("Member form submitted:", formData);
    
    // Show success message
    toast({
      title: "Member added successfully!",
      description: `${formData.fullName} has been added to the association.`,
    });
    
    // Reset form and close dialog
    setFormData({
      fullName: '',
      location: '',
      phone: '',
      farmSize: '',
      coffeeType: 'arabica',
      experience: '',
      certifications: [],
      photo: null
    });
    setIsAddMemberDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmers Association Members</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="members" className="w-full">
          <TabsList>
            <TabsTrigger value="members">Members List</TabsTrigger>
            <TabsTrigger value="registration">Member Registration</TabsTrigger>
            <TabsTrigger value="benefits">Member Benefits</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select defaultValue="all" onValueChange={setMemberStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="gap-2">
                  <Download size={16} />
                  Export
                </Button>
                
                <AlertDialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700">
                      <UserPlus size={16} />
                      Add Member
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl">Add New Association Member</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the details of the new member to add them to the association.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-5 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex flex-col gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="fullName" className="font-medium">
                                <span className="flex items-center gap-2">
                                  <Users size={16} />
                                  Full Name
                                </span>
                              </Label>
                              <Input 
                                id="fullName" 
                                name="fullName"
                                placeholder="Enter farmer's full name" 
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="location" className="font-medium">
                                <span className="flex items-center gap-2">
                                  <MapPin size={16} />
                                  Location
                                </span>
                              </Label>
                              <Input 
                                id="location" 
                                name="location"
                                placeholder="Enter farmer's location" 
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="font-medium">
                                <span className="flex items-center gap-2">
                                  <Phone size={16} />
                                  Phone Number
                                </span>
                              </Label>
                              <Input 
                                id="phone" 
                                name="phone"
                                placeholder="Enter farmer's phone number" 
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="farm-size" className="font-medium">
                                <span className="flex items-center gap-2">
                                  Farm Size (hectares)
                                </span>
                              </Label>
                              <Input 
                                id="farm-size" 
                                name="farmSize"
                                type="number" 
                                step="0.1" 
                                placeholder="Enter farm size" 
                                value={formData.farmSize}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="coffee-type" className="font-medium">
                              <span className="flex items-center gap-2">
                                <Coffee size={16} />
                                Coffee Type
                              </span>
                            </Label>
                            <Select 
                              name="coffeeType" 
                              defaultValue={formData.coffeeType}
                              onValueChange={(value) => setFormData(prev => ({...prev, coffeeType: value}))}
                            >
                              <SelectTrigger id="coffee-type" className="border-gray-300">
                                <SelectValue placeholder="Select coffee type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="arabica">Arabica</SelectItem>
                                <SelectItem value="robusta">Robusta</SelectItem>
                                <SelectItem value="mixed">Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="experience" className="font-medium">
                              Years of Experience
                            </Label>
                            <Input 
                              id="experience" 
                              name="experience"
                              type="number" 
                              placeholder="Years growing coffee" 
                              value={formData.experience}
                              onChange={handleInputChange}
                              className="border-gray-300"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="photo" className="font-medium">
                              <span className="flex items-center gap-2">
                                <Camera size={16} />
                                Farmer Photo
                              </span>
                            </Label>
                            <div className="mt-1 flex items-center">
                              {!formData.photo ? (
                                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => document.getElementById('photo-upload').click()}>
                                  <Camera size={24} className="text-gray-400" />
                                  <p className="mt-1 text-sm text-gray-500">Click to upload photo</p>
                                  <input
                                    id="photo-upload"
                                    name="photo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                  />
                                </div>
                              ) : (
                                <div className="relative">
                                  <img
                                    src={URL.createObjectURL(formData.photo)}
                                    alt="Farmer preview"
                                    className="w-32 h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                          <h4 className="font-medium text-blue-800 mb-2">Membership Information</h4>
                          <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                            <li>New members will be given a Bronze level membership by default</li>
                            <li>Annual membership fee will be collected upon registration</li>
                            <li>Members must agree to follow association guidelines and policies</li>
                          </ul>
                        </div>
                      </div>
                      
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            Register Member
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member ID</TableHead>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Farm Size (ha)</TableHead>
                    <TableHead>Coffee Type</TableHead>
                    <TableHead>Last Delivery</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                        No members found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map(member => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.farmerId}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.location}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(member.status)}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMembershipBadgeColor(member.membershipLevel)}>
                            {member.membershipLevel.charAt(0).toUpperCase() + member.membershipLevel.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.farmSize}</TableCell>
                        <TableCell>{member.coffeeType}</TableCell>
                        <TableCell>{member.lastDelivery}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText size={14} />
                            </Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="registration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">New Member Registration</h3>
                <div className="space-y-2">
                  <Label htmlFor="farmer-name">Farmer Name</Label>
                  <Input id="farmer-name" placeholder="Enter farmer's full name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter farmer's location" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter farmer's phone number" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="farm-size">Farm Size (hectares)</Label>
                  <Input id="farm-size" type="number" step="0.1" placeholder="Enter farm size" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coffee-type">Coffee Type</Label>
                  <Select defaultValue="arabica">
                    <SelectTrigger id="coffee-type">
                      <SelectValue placeholder="Select coffee type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arabica">Arabica</SelectItem>
                      <SelectItem value="robusta">Robusta</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">Register New Member</Button>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Membership Benefits</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Access to training and capacity building</li>
                  <li>Premium prices for quality coffee</li>
                  <li>Group certification opportunities</li>
                  <li>Market access and linkages</li>
                  <li>Input supply at subsidized prices</li>
                  <li>Financial services and microloans</li>
                  <li>Technical support for production</li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                  <h4 className="font-medium text-blue-800">Membership Requirements</h4>
                  <p className="text-sm text-blue-600 mt-2">
                    Farmers must be actively growing coffee with at least 0.5 hectares 
                    of land under coffee cultivation. Annual membership fees apply.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="benefits">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Premium Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Premium market prices</li>
                    <li>Direct buyer connections</li>
                    <li>Quality bonuses</li>
                    <li>Certification premiums</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Training & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Agricultural best practices</li>
                    <li>Quality improvement training</li>
                    <li>Climate-smart coffee production</li>
                    <li>Post-harvest handling</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Pre-harvest financing</li>
                    <li>Equipment loans</li>
                    <li>Savings programs</li>
                    <li>Insurance options</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="communications">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Communication Tools</h3>
                <Button>Send New Message</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Mass Communication</h4>
                  <div className="space-y-2">
                    <Label htmlFor="message-type">Message Type</Label>
                    <Select defaultValue="sms">
                      <SelectTrigger id="message-type">
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="recipients">
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="active">Active Members</SelectItem>
                        <SelectItem value="inactive">Inactive Members</SelectItem>
                        <SelectItem value="arabica">Arabica Farmers</SelectItem>
                        <SelectItem value="robusta">Robusta Farmers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message Content</Label>
                    <textarea 
                      id="message" 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                      placeholder="Enter your message content here..."
                    />
                  </div>
                  
                  <Button>Send Message</Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Communication Templates</h4>
                  <Card className="cursor-pointer hover:border-primary">
                    <CardContent className="p-4">
                      <h5 className="font-medium">Meeting Announcement</h5>
                      <p className="text-sm text-muted-foreground mt-1">Template for announcing association meetings</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-primary">
                    <CardContent className="p-4">
                      <h5 className="font-medium">Price Update</h5>
                      <p className="text-sm text-muted-foreground mt-1">Template for coffee price updates</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-primary">
                    <CardContent className="p-4">
                      <h5 className="font-medium">Training Notification</h5>
                      <p className="text-sm text-muted-foreground mt-1">Template for upcoming training sessions</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssociationMembersManagement;
