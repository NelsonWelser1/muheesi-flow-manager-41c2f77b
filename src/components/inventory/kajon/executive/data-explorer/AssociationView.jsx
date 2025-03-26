
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, RefreshCcw, Download, Filter, Award, UserPlus, GraduationCap, BarChart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';

const AssociationView = ({ isLoading, handleRefresh }) => {
  const [associations, setAssociations] = useState([]);
  const [members, setMembers] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('associations');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });

  const fetchAssociationData = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would fetch actual data from Supabase
      // For now, we'll use mock data since the tables may not exist yet
      
      // Mock associations data
      const mockAssociations = [
        {
          id: 1,
          name: 'Kanoni Coffee Growers Association',
          location: 'Kanoni-Mbogo, Kazo',
          registration_number: 'KCG-2023-0145',
          chairperson: 'Martin Kabuye',
          members_count: 78,
          established_date: '2023-05-15T00:00:00Z',
          status: 'active',
          coffee_types: ['Arabica', 'Robusta'],
          created_at: '2023-05-20T10:30:00Z'
        },
        {
          id: 2,
          name: 'Engari Coffee Farmers Cooperative',
          location: 'Engari, Kazo',
          registration_number: 'ECF-2022-0089',
          chairperson: 'Christine Mbabazi',
          members_count: 124,
          established_date: '2022-11-10T00:00:00Z',
          status: 'active',
          coffee_types: ['Robusta'],
          created_at: '2022-11-15T09:45:00Z'
        },
        {
          id: 3,
          name: 'Migina-Kagarama Farmers Association',
          location: 'Migina & Kagarama, Kazo',
          registration_number: 'MKF-2024-0032',
          chairperson: 'Peter Atuhe',
          members_count: 56,
          established_date: '2024-02-05T00:00:00Z',
          status: 'pending-approval',
          coffee_types: ['Arabica'],
          created_at: '2024-02-08T14:20:00Z'
        }
      ];
      
      // Mock members data
      const mockMembers = [
        {
          id: 1,
          association_id: 1,
          association_name: 'Kanoni Coffee Growers Association',
          member_name: 'John Kato',
          member_id: 'KCG-M-001',
          gender: 'Male',
          farm_size: '2.5 hectares',
          coffee_trees: 1200,
          contact: '+256 777 123456',
          join_date: '2023-05-20T00:00:00Z',
          status: 'active',
          created_at: '2023-05-20T11:30:00Z'
        },
        {
          id: 2,
          association_id: 1,
          association_name: 'Kanoni Coffee Growers Association',
          member_name: 'Mary Namuli',
          member_id: 'KCG-M-002',
          gender: 'Female',
          farm_size: '1.8 hectares',
          coffee_trees: 850,
          contact: '+256 700 789012',
          join_date: '2023-05-22T00:00:00Z',
          status: 'active',
          created_at: '2023-05-22T09:15:00Z'
        },
        {
          id: 3,
          association_id: 2,
          association_name: 'Engari Coffee Farmers Cooperative',
          member_name: 'Robert Mugisha',
          member_id: 'ECF-M-045',
          gender: 'Male',
          farm_size: '3.2 hectares',
          coffee_trees: 1500,
          contact: '+256 755 345678',
          join_date: '2022-12-10T00:00:00Z',
          status: 'active',
          created_at: '2022-12-10T10:45:00Z'
        }
      ];
      
      // Mock certifications data
      const mockCertifications = [
        {
          id: 1,
          association_id: 1,
          association_name: 'Kanoni Coffee Growers Association',
          certification_type: 'Fairtrade',
          certification_number: 'FT-2023-UG-0789',
          issue_date: '2023-08-15T00:00:00Z',
          expiry_date: '2026-08-14T00:00:00Z',
          status: 'active',
          certifying_body: 'Fairtrade International',
          created_at: '2023-08-20T14:30:00Z'
        },
        {
          id: 2,
          association_id: 2,
          association_name: 'Engari Coffee Farmers Cooperative',
          certification_type: 'Organic',
          certification_number: 'ORG-2023-UG-1234',
          issue_date: '2023-03-10T00:00:00Z',
          expiry_date: '2025-03-09T00:00:00Z',
          status: 'active',
          certifying_body: 'IFOAM Organic International',
          created_at: '2023-03-15T09:20:00Z'
        },
        {
          id: 3,
          association_id: 2,
          association_name: 'Engari Coffee Farmers Cooperative',
          certification_type: 'Rainforest Alliance',
          certification_number: 'RA-2023-UG-0567',
          issue_date: '2023-05-20T00:00:00Z',
          expiry_date: '2026-05-19T00:00:00Z',
          status: 'active',
          certifying_body: 'Rainforest Alliance',
          created_at: '2023-05-25T11:45:00Z'
        }
      ];
      
      // Mock training data
      const mockTrainings = [
        {
          id: 1,
          association_id: 1,
          association_name: 'Kanoni Coffee Growers Association',
          training_title: 'Sustainable Coffee Farming Practices',
          start_date: '2024-06-10T09:00:00Z',
          end_date: '2024-06-12T16:00:00Z',
          trainer: 'Dr. Joseph Nkurunziza',
          participants_count: 42,
          location: 'Kanoni Community Center',
          status: 'completed',
          created_at: '2024-05-15T08:30:00Z'
        },
        {
          id: 2,
          association_id: 2,
          association_name: 'Engari Coffee Farmers Cooperative',
          training_title: 'Coffee Quality Control & Cupping',
          start_date: '2024-07-05T09:00:00Z',
          end_date: '2024-07-07T17:00:00Z',
          trainer: 'James Opio, UCDA Specialist',
          participants_count: 35,
          location: 'Engari Cooperative Center',
          status: 'scheduled',
          created_at: '2024-06-01T10:15:00Z'
        },
        {
          id: 3,
          association_id: 3,
          association_name: 'Migina-Kagarama Farmers Association',
          training_title: 'Coffee Disease Management',
          start_date: '2024-06-25T10:00:00Z',
          end_date: '2024-06-26T16:00:00Z',
          trainer: 'Sarah Nafuna, Agricultural Extension Officer',
          participants_count: 28,
          location: 'Migina Community Hall',
          status: 'scheduled',
          created_at: '2024-06-05T13:20:00Z'
        }
      ];
      
      // Filter associations by search term
      let filteredAssociations = mockAssociations;
      let filteredMembers = mockMembers;
      let filteredCertifications = mockCertifications;
      let filteredTrainings = mockTrainings;
      
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        
        filteredAssociations = mockAssociations.filter(item => 
          item.name?.toLowerCase().includes(lowercaseSearch) ||
          item.location?.toLowerCase().includes(lowercaseSearch) ||
          item.chairperson?.toLowerCase().includes(lowercaseSearch) ||
          item.registration_number?.toLowerCase().includes(lowercaseSearch)
        );
        
        filteredMembers = mockMembers.filter(item => 
          item.member_name?.toLowerCase().includes(lowercaseSearch) ||
          item.association_name?.toLowerCase().includes(lowercaseSearch) ||
          item.member_id?.toLowerCase().includes(lowercaseSearch) ||
          item.contact?.includes(searchTerm)
        );
        
        filteredCertifications = mockCertifications.filter(item => 
          item.association_name?.toLowerCase().includes(lowercaseSearch) ||
          item.certification_type?.toLowerCase().includes(lowercaseSearch) ||
          item.certification_number?.toLowerCase().includes(lowercaseSearch) ||
          item.certifying_body?.toLowerCase().includes(lowercaseSearch)
        );
        
        filteredTrainings = mockTrainings.filter(item => 
          item.association_name?.toLowerCase().includes(lowercaseSearch) ||
          item.training_title?.toLowerCase().includes(lowercaseSearch) ||
          item.trainer?.toLowerCase().includes(lowercaseSearch) ||
          item.location?.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      // Sort based on sortConfig
      const sortData = (data) => {
        return [...data].sort((a, b) => {
          const aValue = a[sortConfig.field] || '';
          const bValue = b[sortConfig.field] || '';
          
          if (aValue < bValue) {
            return sortConfig.ascending ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.ascending ? 1 : -1;
          }
          return 0;
        });
      };
      
      setAssociations(sortData(filteredAssociations));
      setMembers(sortData(filteredMembers));
      setCertifications(sortData(filteredCertifications));
      setTrainings(sortData(filteredTrainings));
    } catch (error) {
      console.error('Error fetching association data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociationData();
  }, [searchTerm, sortConfig, activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);
  };

  // Function to render status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      case 'pending':
      case 'pending-approval':
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {status.includes('-') ? status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      case 'suspended':
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-800">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status || 'Unknown'}</Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kazo Coffee Project Associations</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAssociationData}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search associations, members, certifications, or trainings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="associations" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="associations" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Associations
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="associations" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
              <p className="ml-2 text-amber-800">Loading associations...</p>
            </div>
          ) : associations.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
              <Users className="h-12 w-12 mx-auto text-amber-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Associations Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'name', ascending: !sortConfig.ascending })} className="flex items-center">
                        Association Name
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'location', ascending: !sortConfig.ascending })} className="flex items-center">
                        Location
                      </Button>
                    </TableHead>
                    <TableHead>Registration No.</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'chairperson', ascending: !sortConfig.ascending })} className="flex items-center">
                        Chairperson
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'members_count', ascending: !sortConfig.ascending })} className="flex items-center">
                        Members
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'established_date', ascending: !sortConfig.ascending })} className="flex items-center">
                        Established
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {associations.map((association) => (
                    <TableRow key={association.id}>
                      <TableCell className="font-medium">{association.name}</TableCell>
                      <TableCell>{association.location}</TableCell>
                      <TableCell>{association.registration_number}</TableCell>
                      <TableCell>{association.chairperson}</TableCell>
                      <TableCell>{association.members_count}</TableCell>
                      <TableCell>{formatDate(association.established_date)}</TableCell>
                      <TableCell>{getStatusBadge(association.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="members" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
              <p className="ml-2 text-amber-800">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
              <UserPlus className="h-12 w-12 mx-auto text-amber-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Members Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'member_name', ascending: !sortConfig.ascending })} className="flex items-center">
                        Member Name
                      </Button>
                    </TableHead>
                    <TableHead>Member ID</TableHead>
                    <TableHead>Association</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Farm Details</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'join_date', ascending: !sortConfig.ascending })} className="flex items-center">
                        Join Date
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.member_name}</TableCell>
                      <TableCell>{member.member_id}</TableCell>
                      <TableCell>{member.association_name}</TableCell>
                      <TableCell>{member.gender}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{member.farm_size}</span>
                          <span className="text-xs text-gray-500">{member.coffee_trees} trees</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.contact}</TableCell>
                      <TableCell>{formatDate(member.join_date)}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="certifications" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
              <p className="ml-2 text-amber-800">Loading certifications...</p>
            </div>
          ) : certifications.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
              <Award className="h-12 w-12 mx-auto text-amber-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Certifications Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Association</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'certification_type', ascending: !sortConfig.ascending })} className="flex items-center">
                        Certification Type
                      </Button>
                    </TableHead>
                    <TableHead>Certification No.</TableHead>
                    <TableHead>Certifying Body</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'issue_date', ascending: !sortConfig.ascending })} className="flex items-center">
                        Issue Date
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'expiry_date', ascending: !sortConfig.ascending })} className="flex items-center">
                        Expiry Date
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certifications.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.association_name}</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {cert.certification_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{cert.certification_number}</TableCell>
                      <TableCell>{cert.certifying_body}</TableCell>
                      <TableCell>{formatDate(cert.issue_date)}</TableCell>
                      <TableCell>{formatDate(cert.expiry_date)}</TableCell>
                      <TableCell>{getStatusBadge(cert.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
              <p className="ml-2 text-amber-800">Loading training information...</p>
            </div>
          ) : trainings.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-amber-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No Training Records Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Association</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'training_title', ascending: !sortConfig.ascending })} className="flex items-center">
                        Training Title
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'start_date', ascending: !sortConfig.ascending })} className="flex items-center">
                        Training Dates
                      </Button>
                    </TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.association_name}</TableCell>
                      <TableCell>{training.training_title}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(training.start_date)}</span>
                          <span className="text-xs text-gray-500">to {formatDate(training.end_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{training.trainer}</TableCell>
                      <TableCell>{training.participants_count}</TableCell>
                      <TableCell>{training.location}</TableCell>
                      <TableCell>{getStatusBadge(training.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Association Growth</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Interactive chart showing association growth over time would appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Membership Distribution</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Pie chart showing membership distribution by location would appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Training Impact</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Bar chart showing training participation metrics would appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Certification Summary</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Visualization of certification types and validity periods would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssociationView;
