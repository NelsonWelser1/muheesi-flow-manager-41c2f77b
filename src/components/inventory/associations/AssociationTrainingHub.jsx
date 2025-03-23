
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, Users, FileText, Play, Award, ChevronRight, Filter } from 'lucide-react';

const AssociationTrainingHub = ({ isKazo, selectedAssociation }) => {
  const [date, setDate] = useState(new Date());
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Sample training data - would come from API/database in a real app
  const trainings = [
    {
      id: 1,
      title: 'Coffee Processing Techniques',
      description: 'Learn about wet and dry processing methods for coffee for higher quality beans',
      date: '2025-04-15',
      time: '09:00 - 12:00',
      location: 'Kanoni Training Center',
      trainer: 'David Tumusiime',
      category: 'processing',
      status: 'upcoming',
      enrolledMembers: 45,
      maxMembers: 60
    },
    {
      id: 2,
      title: 'Organic Pest Management',
      description: 'Natural methods to control pests and diseases in coffee farms without chemicals',
      date: '2025-04-22',
      time: '14:00 - 17:00',
      location: 'Engari Community Hall',
      trainer: 'Sarah Kamugisha',
      category: 'farming',
      status: 'upcoming',
      enrolledMembers: 38,
      maxMembers: 50
    },
    {
      id: 3,
      title: 'Coffee Quality Standards',
      description: 'Understanding international coffee quality standards and grading systems',
      date: '2025-05-10',
      time: '09:00 - 16:00',
      location: 'KAZON Coffee Classroom',
      trainer: 'Michael Kiwanuka',
      category: 'quality',
      status: 'upcoming',
      enrolledMembers: 25,
      maxMembers: 40
    },
    {
      id: 4,
      title: 'Record Keeping for Certification',
      description: 'Proper record keeping methods required for organic and fair trade certification',
      date: '2025-03-15',
      time: '10:00 - 13:00',
      location: 'Kyampangara Community Center',
      trainer: 'Elizabeth Nabukenya',
      category: 'certification',
      status: 'completed',
      enrolledMembers: 55,
      maxMembers: 55,
      resources: ['presentation.pdf', 'record_templates.xlsx', 'certification_checklist.pdf']
    },
    {
      id: 5,
      title: 'Sustainable Water Management',
      description: 'Techniques for conserving water and preventing contamination during coffee processing',
      date: '2025-03-05',
      time: '14:00 - 16:30',
      location: 'Kanoni Field Station',
      trainer: 'Robert Mugisha',
      category: 'farming',
      status: 'completed',
      enrolledMembers: 32,
      maxMembers: 40,
      resources: ['water_management_guide.pdf', 'workshop_slides.pdf']
    }
  ];
  
  // Filter trainings based on category
  const filteredTrainings = trainings.filter(training => 
    filterCategory === 'all' || training.category === filterCategory
  );
  
  // Separate upcoming and completed trainings
  const upcomingTrainings = filteredTrainings.filter(training => training.status === 'upcoming');
  const completedTrainings = filteredTrainings.filter(training => training.status === 'completed');
  
  const getCategoryBadge = (category) => {
    switch(category) {
      case 'farming':
        return <Badge className="bg-green-100 text-green-800">Farming</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'quality':
        return <Badge className="bg-purple-100 text-purple-800">Quality</Badge>;
      case 'certification':
        return <Badge className="bg-amber-100 text-amber-800">Certification</Badge>;
      case 'marketing':
        return <Badge className="bg-indigo-100 text-indigo-800">Marketing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Hub</CardTitle>
        <CardDescription>
          Manage training programs, resources and capacity building for association members
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList>
            <TabsTrigger value="calendar">Training Calendar</TabsTrigger>
            <TabsTrigger value="resources">Training Resources</TabsTrigger>
            <TabsTrigger value="requests">Training Requests</TabsTrigger>
            <TabsTrigger value="planning">Training Planning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <Card>
                  <CardContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border shadow-sm p-3"
                    />
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Filter by Category</h3>
                    <Filter size={16} />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="farming">Farming Practices</SelectItem>
                      <SelectItem value="processing">Processing Techniques</SelectItem>
                      <SelectItem value="quality">Quality Control</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="marketing">Marketing & Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Training Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Trainings</span>
                        <span className="font-medium">{trainings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Upcoming</span>
                        <span className="font-medium">{upcomingTrainings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <span className="font-medium">{completedTrainings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Members Trained</span>
                        <span className="font-medium">142</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-full md:w-2/3 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Upcoming Trainings</h3>
                  <Button>Schedule New Training</Button>
                </div>
                
                {upcomingTrainings.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No upcoming trainings in this category
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {upcomingTrainings.map(training => (
                      <Card key={training.id} className="overflow-hidden">
                        <div className="h-1.5 bg-blue-500"></div>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{training.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{training.description}</p>
                            </div>
                            {getCategoryBadge(training.category)}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center">
                              <CalendarIcon size={16} className="mr-2 text-muted-foreground" />
                              <span className="text-sm">{training.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-muted-foreground" />
                              <span className="text-sm">{training.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2 text-muted-foreground" />
                              <span className="text-sm">{training.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div className="flex items-center">
                              <Users size={16} className="mr-2 text-muted-foreground" />
                              <span className="text-sm">{training.enrolledMembers}/{training.maxMembers} Enrolled</span>
                            </div>
                            
                            <div>
                              <Button variant="outline" size="sm" className="mr-2">View Details</Button>
                              <Button size="sm">Register Members</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Completed Trainings</h3>
                  
                  {completedTrainings.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center text-muted-foreground">
                        No completed trainings in this category
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {completedTrainings.map(training => (
                        <Card key={training.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{training.title}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <CalendarIcon size={14} className="mr-1" />
                                  <span className="mr-3">{training.date}</span>
                                  <MapPin size={14} className="mr-1" />
                                  <span>{training.location}</span>
                                </div>
                              </div>
                              {getCategoryBadge(training.category)}
                            </div>
                            
                            {training.resources && (
                              <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-medium mb-2">Training Resources</h4>
                                <div className="flex flex-wrap gap-2">
                                  {training.resources.map((resource, index) => (
                                    <Button key={index} variant="outline" size="sm" className="text-xs">
                                      <FileText size={14} className="mr-1" />
                                      {resource}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Training Resources Library</h3>
              <Button>Upload New Resources</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <Play size={40} className="text-slate-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Coffee Pruning Techniques</h3>
                    <p className="text-sm text-muted-foreground mt-1">Video tutorial on proper coffee tree pruning</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge className="bg-green-100 text-green-800">Farming</Badge>
                      <Button variant="outline" size="sm">Watch</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <FileText size={40} className="text-slate-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Guide to Coffee Quality Grading</h3>
                    <p className="text-sm text-muted-foreground mt-1">Comprehensive guide on coffee quality assessment</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge className="bg-purple-100 text-purple-800">Quality</Badge>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <Play size={40} className="text-slate-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Wet Processing Masterclass</h3>
                    <p className="text-sm text-muted-foreground mt-1">Video series on advanced wet processing methods</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                      <Button variant="outline" size="sm">Watch</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <FileText size={40} className="text-slate-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Organic Certification Workbook</h3>
                    <p className="text-sm text-muted-foreground mt-1">Step-by-step guide to organic certification</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge className="bg-amber-100 text-amber-800">Certification</Badge>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <Play size={40} className="text-slate-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Composting for Coffee Farms</h3>
                    <p className="text-sm text-muted-foreground mt-1">Tutorial on making organic compost</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge className="bg-green-100 text-green-800">Farming</Badge>
                      <Button variant="outline" size="sm">Watch</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <FileText size={40} className="text-slate-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Coffee Cost Analysis Spreadsheet</h3>
                    <p className="text-sm text-muted-foreground mt-1">Excel template for farm cost analysis</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge className="bg-indigo-100 text-indigo-800">Marketing</Badge>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <h3 className="text-lg font-medium mt-6">Certification Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Award size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Professional Coffee Taster Certification</h3>
                      <p className="text-sm text-muted-foreground mt-1">Learn to identify coffee flavors and defects like a professional</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Duration:</span> 4 weeks
                        </div>
                        <Button size="sm" className="gap-1">
                          View Course
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Award size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Certified Organic Coffee Producer</h3>
                      <p className="text-sm text-muted-foreground mt-1">Comprehensive course on organic coffee production standards</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Duration:</span> 6 weeks
                        </div>
                        <Button size="sm" className="gap-1">
                          View Course
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Training Requests from Members</h3>
              <Button>Submit New Request</Button>
            </div>
            
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Topic</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Requested By</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 align-middle font-medium">Soil Conservation Techniques</td>
                    <td className="p-4 align-middle">{getCategoryBadge('farming')}</td>
                    <td className="p-4 align-middle">Rwanyonga Farmers Group</td>
                    <td className="p-4 align-middle">2025-03-10</td>
                    <td className="p-4 align-middle"><Badge className="bg-blue-100 text-blue-800">Under Review</Badge></td>
                    <td className="p-4 align-middle">
                      <Button variant="outline" size="sm">Review</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 align-middle font-medium">Coffee Drying Methods</td>
                    <td className="p-4 align-middle">{getCategoryBadge('processing')}</td>
                    <td className="p-4 align-middle">Engari Women's Group</td>
                    <td className="p-4 align-middle">2025-03-05</td>
                    <td className="p-4 align-middle"><Badge className="bg-green-100 text-green-800">Approved</Badge></td>
                    <td className="p-4 align-middle">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 align-middle font-medium">Financial Record Keeping</td>
                    <td className="p-4 align-middle">{getCategoryBadge('certification')}</td>
                    <td className="p-4 align-middle">Individual: Samuel Mugisha</td>
                    <td className="p-4 align-middle">2025-02-28</td>
                    <td className="p-4 align-middle"><Badge className="bg-amber-100 text-amber-800">Scheduled</Badge></td>
                    <td className="p-4 align-middle">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 align-middle font-medium">Coffee Varieties Selection</td>
                    <td className="p-4 align-middle">{getCategoryBadge('farming')}</td>
                    <td className="p-4 align-middle">Kyampangara Youth Group</td>
                    <td className="p-4 align-middle">2025-02-15</td>
                    <td className="p-4 align-middle"><Badge className="bg-slate-100 text-slate-800">Pending</Badge></td>
                    <td className="p-4 align-middle">
                      <Button variant="outline" size="sm">Review</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submit Training Request</CardTitle>
                <CardDescription>Request a new training topic for your farmer group</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Training Topic</Label>
                    <Input id="topic" placeholder="Enter training topic" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farming">Farming Practices</SelectItem>
                        <SelectItem value="processing">Processing Techniques</SelectItem>
                        <SelectItem value="quality">Quality Control</SelectItem>
                        <SelectItem value="certification">Certification</SelectItem>
                        <SelectItem value="marketing">Marketing & Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Request</Label>
                  <textarea 
                    id="reason" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                    placeholder="Explain why this training is needed and how it will benefit members"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="group">Farmer Group</Label>
                    <Input id="group" placeholder="Enter farmer group name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="members">Estimated Number of Participants</Label>
                    <Input id="members" type="number" placeholder="Enter number of participants" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Submit Training Request</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="planning" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Training Planning & Management</h3>
              <Button>Create Training Plan</Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quarterly Training Plan</CardTitle>
                <CardDescription>April - June 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">April 2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">15</Badge>
                            <span>Coffee Processing Techniques</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">22</Badge>
                            <span>Organic Pest Management</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">30</Badge>
                            <span>Financial Management Basics</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">May 2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">10</Badge>
                            <span>Coffee Quality Standards</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">18</Badge>
                            <span>Sustainable Harvesting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">25</Badge>
                            <span>Climate-Smart Agriculture</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">June 2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">05</Badge>
                            <span>Marketing Strategies</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">15</Badge>
                            <span>Value Addition</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Badge className="mt-0.5 shrink-0">22</Badge>
                            <span>Certification Requirements</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="rounded-md border p-4 bg-muted/30">
                    <h4 className="font-medium mb-2">Training Plan Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      This training plan focuses on key areas identified from member feedback and certification requirements. 
                      The schedule is designed to align with farming activities and minimize disruption to members' work schedules.
                      Most trainings will be conducted at local community centers to maximize accessibility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trainer Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                      <div>
                        <h4 className="font-medium">David Tumusiime</h4>
                        <p className="text-sm text-muted-foreground">Processing Specialist</p>
                      </div>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                      <div>
                        <h4 className="font-medium">Sarah Kamugisha</h4>
                        <p className="text-sm text-muted-foreground">Organic Farming Expert</p>
                      </div>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                      <div>
                        <h4 className="font-medium">Michael Kiwanuka</h4>
                        <p className="text-sm text-muted-foreground">Quality Control Specialist</p>
                      </div>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                      <div>
                        <h4 className="font-medium">Elizabeth Nabukenya</h4>
                        <p className="text-sm text-muted-foreground">Certification Advisor</p>
                      </div>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Training Budget Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Annual Budget</span>
                      <span className="font-medium">15,000,000 UGX</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Budget Utilized</span>
                        <span>5,240,000 UGX (35%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[35%]"></div>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <h4 className="text-sm font-medium">Budget Allocation</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Trainers: 40%</div>
                        <div>Materials: 25%</div>
                        <div>Venues: 15%</div>
                        <div>Refreshments: 10%</div>
                        <div>Transportation: 10%</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">View Detailed Budget</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssociationTrainingHub;
