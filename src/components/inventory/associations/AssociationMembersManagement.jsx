import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssociationMembers } from '@/hooks/useAssociationMembers';
import { useToast } from "@/components/ui/use-toast";
import { getDateFromTimeAgo } from '@/utils/dateUtils';
import { Coffee, MapPin, Phone, Users, Camera, X, UserPlus, CheckCircle } from "lucide-react";
import MemberListFilters from './members/MemberListFilters';
import MemberListTable from './members/MemberListTable';
import MemberExportActions from './members/MemberExportActions';
import MemberDetailsDialog from './members/MemberDetailsDialog';
import CommunicationsTab from './members/CommunicationsTab';
const AssociationMembersManagement = ({
  isKazo,
  selectedAssociation
}) => {
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [memberStatus, setMemberStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'join_date',
    direction: 'desc'
  });
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const {
    toast
  } = useToast();
  const {
    formData,
    members,
    loading,
    saving,
    error,
    handleInputChange,
    handleSelectChange,
    handlePhotoChange,
    saveMember,
    fetchMembers,
    setFormData
  } = useAssociationMembers(selectedAssociation?.id);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    location: '',
    phone: '',
    farmSize: '',
    coffeeType: 'arabica',
    experience: '',
    photo: null
  });
  const sortedMembers = [...members].sort((a, b) => {
    const {
      key,
      direction
    } = sortConfig;
    if (!a[key] && !b[key]) return 0;
    if (!a[key]) return direction === 'asc' ? -1 : 1;
    if (!b[key]) return direction === 'asc' ? 1 : -1;
    if (key === 'join_date' || key === 'last_delivery') {
      return direction === 'asc' ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
    }
    if (key === 'farm_size' || key === 'experience') {
      return direction === 'asc' ? Number(a[key]) - Number(b[key]) : Number(b[key]) - Number(a[key]);
    }
    return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
  });
  const filteredMembers = sortedMembers.filter(member => {
    const matchesSearch = member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || member.location && member.location.toLowerCase().includes(searchTerm.toLowerCase()) || member.phone && member.phone.includes(searchTerm);
    const matchesStatus = memberStatus === 'all' || member.status === memberStatus;
    let matchesTimeRange = true;
    if (timeRange !== 'all') {
      const fromDate = getDateFromTimeAgo(timeRange);
      matchesTimeRange = fromDate && new Date(member.join_date) >= fromDate;
    }
    return matchesSearch && matchesStatus && matchesTimeRange;
  });
  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoChange(e.target.files[0]);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const success = await saveMember();
    if (success) {
      setIsAddMemberDialogOpen(false);
    }
  };
  const handleRegistrationInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleRegistrationSelectChange = (name, value) => {
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleRegistrationPhotoChange = e => {
    if (e.target.files && e.target.files[0]) {
      setRegistrationForm(prev => ({
        ...prev,
        photo: e.target.files[0]
      }));
    }
  };
  const handleRegistrationSubmit = async e => {
    e.preventDefault();
    setFormData({
      fullName: registrationForm.fullName,
      location: registrationForm.location,
      phone: registrationForm.phone,
      farmSize: registrationForm.farmSize,
      coffeeType: registrationForm.coffeeType,
      experience: registrationForm.experience,
      photo: registrationForm.photo,
      memberLevel: 'bronze',
      status: 'active'
    });
    const success = await saveMember();
    if (success) {
      setRegistrationForm({
        fullName: '',
        location: '',
        phone: '',
        farmSize: '',
        coffeeType: 'arabica',
        experience: '',
        photo: null
      });
      setIsRegistrationSuccess(true);
      setTimeout(() => setIsRegistrationSuccess(false), 5000);
    }
  };
  const handleViewDetails = member => {
    setSelectedMember(member);
    setIsDetailsDialogOpen(true);
  };
  const handleRefresh = () => {
    fetchMembers();
  };
  return <Card>
      <CardHeader>
        <CardTitle>Farmers Association Members</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="members">Members List</TabsTrigger>
            <TabsTrigger value="registration">Member Registration</TabsTrigger>
            <TabsTrigger value="benefits">Member Benefits</TabsTrigger>
            
          </TabsList>
          
          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Association Members</h3>
              
              <div className="flex gap-2">
                <MemberExportActions members={filteredMembers} />
                
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
                              <Input id="fullName" name="fullName" placeholder="Enter farmer's full name" value={formData.fullName} onChange={handleInputChange} required className="border-gray-300" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="location" className="font-medium">
                                <span className="flex items-center gap-2">
                                  <MapPin size={16} />
                                  Location
                                </span>
                              </Label>
                              <Input id="location" name="location" placeholder="Enter farmer's location" value={formData.location} onChange={handleInputChange} required className="border-gray-300" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="font-medium">
                                <span className="flex items-center gap-2">
                                  <Phone size={16} />
                                  Phone Number
                                </span>
                              </Label>
                              <Input id="phone" name="phone" placeholder="Enter farmer's phone number" value={formData.phone} onChange={handleInputChange} required className="border-gray-300" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="farmSize" className="font-medium">
                                <span className="flex items-center gap-2">
                                  Farm Size (hectares)
                                </span>
                              </Label>
                              <Input id="farmSize" name="farmSize" type="number" step="0.1" placeholder="Enter farm size" value={formData.farmSize} onChange={handleInputChange} required className="border-gray-300" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="coffeeType" className="font-medium">
                              <span className="flex items-center gap-2">
                                <Coffee size={16} />
                                Coffee Type
                              </span>
                            </Label>
                            <Select name="coffeeType" defaultValue={formData.coffeeType} onValueChange={value => handleSelectChange('coffeeType', value)}>
                              <SelectTrigger id="coffeeType" className="border-gray-300">
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
                            <Input id="experience" name="experience" type="number" placeholder="Years growing coffee" value={formData.experience} onChange={handleInputChange} className="border-gray-300" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="photo" className="font-medium">
                              <span className="flex items-center gap-2">
                                <Camera size={16} />
                                Farmer Photo
                              </span>
                            </Label>
                            <div className="mt-1 flex items-center">
                              {!formData.photo ? <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => document.getElementById('photo-upload').click()}>
                                  <Camera size={24} className="text-gray-400" />
                                  <p className="mt-1 text-sm text-gray-500">Click to upload photo</p>
                                  <input id="photo-upload" name="photo" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </div> : <div className="relative">
                                  <img src={URL.createObjectURL(formData.photo)} alt="Farmer preview" className="w-32 h-32 object-cover rounded-lg" />
                                  <button type="button" className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1" onClick={() => setFormData(prev => ({
                                ...prev,
                                photo: null
                              }))}>
                                    <X size={16} />
                                  </button>
                                </div>}
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
                          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                            {saving ? 'Registering...' : 'Register Member'}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <MemberListFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} memberStatus={memberStatus} setMemberStatus={setMemberStatus} timeRange={timeRange} setTimeRange={setTimeRange} sortConfig={sortConfig} setSortConfig={setSortConfig} />
            
            <MemberListTable members={filteredMembers} loading={loading} onViewDetails={handleViewDetails} onRefresh={handleRefresh} sortConfig={sortConfig} onSort={setSortConfig} />
            
            <MemberDetailsDialog member={selectedMember} isOpen={isDetailsDialogOpen} onClose={() => setIsDetailsDialogOpen(false)} />
          </TabsContent>
          
          <TabsContent value="registration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">New Member Registration</h3>
                
                {isRegistrationSuccess && <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Registration Successful</h4>
                      <p className="text-sm text-green-700">The member has been successfully registered.</p>
                    </div>
                  </div>}
                
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmer-name">Farmer Name</Label>
                    <Input id="farmer-name" name="fullName" placeholder="Enter farmer's full name" value={registrationForm.fullName} onChange={handleRegistrationInputChange} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="Enter farmer's location" value={registrationForm.location} onChange={handleRegistrationInputChange} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" placeholder="Enter farmer's phone number" value={registrationForm.phone} onChange={handleRegistrationInputChange} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="farm-size">Farm Size (hectares)</Label>
                    <Input id="farm-size" name="farmSize" type="number" step="0.1" placeholder="Enter farm size" value={registrationForm.farmSize} onChange={handleRegistrationInputChange} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coffee-type">Coffee Type</Label>
                    <Select name="coffeeType" value={registrationForm.coffeeType} onValueChange={value => handleRegistrationSelectChange('coffeeType', value)}>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input id="experience" name="experience" type="number" placeholder="Years growing coffee" value={registrationForm.experience} onChange={handleRegistrationInputChange} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="farmer-photo">Farmer Photo</Label>
                    <div className="mt-1 flex items-center">
                      {!registrationForm.photo ? <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => document.getElementById('registration-photo-upload').click()}>
                          <Camera size={24} className="text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">Click to upload photo</p>
                          <input id="registration-photo-upload" name="photo" type="file" accept="image/*" className="hidden" onChange={handleRegistrationPhotoChange} />
                        </div> : <div className="relative">
                          <img src={URL.createObjectURL(registrationForm.photo)} alt="Farmer preview" className="w-32 h-32 object-cover rounded-lg" />
                          <button type="button" className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1" onClick={() => setRegistrationForm(prev => ({
                        ...prev,
                        photo: null
                      }))}>
                            <X size={16} />
                          </button>
                        </div>}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={saving}>
                    {saving ? 'Registering...' : 'Register New Member'}
                  </Button>
                </form>
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
          
          <TabsContent value="communications" className="space-y-4">
            <CommunicationsTab associationId={selectedAssociation?.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
};
export default AssociationMembersManagement;