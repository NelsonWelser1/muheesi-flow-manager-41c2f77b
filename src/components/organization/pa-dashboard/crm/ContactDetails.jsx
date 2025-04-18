
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, Building, MapPin, Globe, Calendar, BarChart2, Clock, MessageSquare, FileText, Edit, Trash, UserPlus, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ContactDetails = ({ contact, onEdit, onDelete }) => {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Client': return 'bg-blue-100 text-blue-800';
      case 'Vendor': return 'bg-purple-100 text-purple-800';
      case 'Partner': return 'bg-green-100 text-green-800';
      case 'Lead': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!contact) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <UserPlus className="h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium">No Contact Selected</h3>
            <p className="text-sm text-gray-500">Select a contact from the list to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={contact.avatarUrl} alt={`${contact.firstName} ${contact.lastName}`} />
              <AvatarFallback>{getInitials(`${contact.firstName} ${contact.lastName}`)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{contact.firstName} {contact.lastName}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Building className="h-3.5 w-3.5 mr-1" />
                {contact.company || 'No Company'}
                {contact.title && <span className="ml-1">• {contact.title}</span>}
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(contact)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(contact.id)}>
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={getTypeColor(contact.type)}>
            {contact.type}
          </Badge>
          {contact.priority && (
            <Badge variant="outline" className={getPriorityColor(contact.priority)}>
              {contact.priority} Priority
            </Badge>
          )}
          {contact.tags && contact.tags.split(',').map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100">
              {tag.trim()}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="info">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    <div className="flex">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>{contact.phone || 'No phone number'}</span>
                    </div>
                    <div className="flex">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>{contact.email || 'No email'}</span>
                    </div>
                    {contact.website && (
                      <div className="flex">
                        <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{contact.website}</a>
                      </div>
                    )}
                    <div className="flex">
                      <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>Added on {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Address</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {contact.address ? (
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
                      <span>
                        {contact.address}<br />
                        {contact.city && `${contact.city}, `}
                        {contact.state && `${contact.state} `}
                        {contact.postalCode && contact.postalCode}<br />
                        {contact.country && contact.country}
                      </span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No address provided</div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Preferred Contact Method</h4>
                    <Badge variant="outline">
                      {contact.preferredContact || 'Not specified'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Marketing Opt-in</h4>
                    <Badge variant={contact.optInMarketing ? "default" : "secondary"}>
                      {contact.optInMarketing ? 'Opted In' : 'Opted Out'}
                    </Badge>
                  </div>
                  
                  {contact.leadSource && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Lead Source</h4>
                      <span>{contact.leadSource}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  <div className="flex mt-4">
                    <div className="mr-3 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="w-0.5 grow bg-gray-200 my-1"></div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Email Sent</h4>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Follow-up email regarding the dairy products proposal</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="w-0.5 grow bg-gray-200 my-1"></div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Call Completed</h4>
                        <span className="text-xs text-gray-500">5 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Discussed new coffee supply terms</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">Contact Created</h4>
                        <span className="text-xs text-gray-500">2 weeks ago</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Contact was added to the system</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader className="p-4 pb-2 flex justify-between items-start">
                <CardTitle className="text-sm font-medium">Notes</CardTitle>
                <Button variant="outline" size="sm">
                  Add Note
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {contact.notes ? (
                  <div className="p-3 border rounded-md">
                    <p className="text-sm whitespace-pre-line">{contact.notes}</p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t text-xs text-gray-500">
                      <span>Added by John Doe</span>
                      <span>Today at 10:30 AM</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-gray-500 mt-2">No notes for this contact</p>
                    <Button variant="outline" size="sm" className="mt-4">Add the first note</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader className="p-4 pb-2 flex justify-between items-start">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <Button variant="outline" size="sm">Upload Document</Button>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">No documents attached</p>
                  <Button variant="outline" size="sm" className="mt-4">Upload a document</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last updated: 2 days ago</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="hidden sm:flex">
              <BarChart2 className="h-4 w-4 mr-1" />
              View Stats
            </Button>
            <Button size="sm" className="hidden sm:flex">
              <MessageSquare className="h-4 w-4 mr-1" />
              Send Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
