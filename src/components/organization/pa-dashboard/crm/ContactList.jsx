
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, UserPlus, Phone, Mail, MapPin, Building } from 'lucide-react';

const ContactList = ({ contacts = [], selectedContactId, onSelectContact, onAddContact }) => {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTypeClass = (type) => {
    switch (type) {
      case "Client": return "bg-blue-100 text-blue-800";
      case "Vendor": return "bg-purple-100 text-purple-800";
      case "Partner": return "bg-green-100 text-green-800";
      case "Lead": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search contacts..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" className="flex gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button className="flex gap-2 w-full sm:w-auto" onClick={onAddContact}>
              <UserPlus className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </div>

          {/* Contact Type Tabs */}
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Contact List */}
          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
            {!contacts || contacts.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">No contacts found</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={onAddContact}>
                  Add your first contact
                </Button>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-3 border rounded-md cursor-pointer hover:border-primary transition-colors ${
                    selectedContactId === contact.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => onSelectContact && onSelectContact(contact.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatarUrl} alt={`${contact.firstName || ''} ${contact.lastName || ''}`} />
                      <AvatarFallback>{getInitials(`${contact.firstName || ''} ${contact.lastName || ''}`)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{contact.firstName || ''} {contact.lastName || ''}</h3>
                        <Badge className={`ml-2 ${getTypeClass(contact.type)}`}>
                          {contact.type || 'Unknown'}
                        </Badge>
                      </div>
                      {contact.company && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Building className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span className="truncate">{contact.company}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{contact.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{contact.email || 'N/A'}</span>
                        </div>
                        {contact.address && (
                          <div className="flex items-center text-xs text-muted-foreground sm:col-span-2">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {contact.city || ''}, {contact.country || ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactList;
