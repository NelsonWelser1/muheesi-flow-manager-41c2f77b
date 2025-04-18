
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Building, Edit, Trash, Calendar, MessageSquare } from 'lucide-react';

const ContactDetails = ({ contact }) => {
  if (!contact) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[calc(100vh-280px)]">
            <div className="text-center">
              <h3 className="text-lg font-medium">Contact Details</h3>
              <p className="text-muted-foreground mt-2">Select a contact to view details</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={contact.avatarUrl} alt={`${contact.firstName} ${contact.lastName}`} />
              <AvatarFallback className="text-lg">
                {getInitials(`${contact.firstName} ${contact.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{contact.firstName} {contact.lastName}</h2>
              <p className="text-muted-foreground">{contact.type}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button variant="destructive" size="sm" className="flex items-center gap-1">
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{contact.phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{contact.email || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p>{contact.company || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{contact.city ? `${contact.city}, ${contact.country}` : contact.country || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500">Yesterday</span>
                </div>
                <p className="mt-1">Added as a new contact</p>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex items-center text-sm">
                  <MessageSquare className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500">3 days ago</span>
                </div>
                <p className="mt-1">Sent initial outreach email</p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
            </div>
          </div>
        </div>
        
        {contact.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <div className="border rounded-md p-4">
              <p className="text-sm">{contact.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
