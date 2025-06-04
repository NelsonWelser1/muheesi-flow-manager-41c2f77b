
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Mail, Phone } from 'lucide-react';

const MemberManagement = () => {
  const members = [
    { 
      id: 1, 
      name: 'John Mukasa', 
      email: 'john.mukasa@email.com', 
      phone: '+256 700 123456', 
      status: 'Active',
      farmSize: '2.5 acres',
      joinDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Sarah Namuli', 
      email: 'sarah.namuli@email.com', 
      phone: '+256 700 234567', 
      status: 'Active',
      farmSize: '1.8 acres',
      joinDate: '2023-03-22'
    },
    { 
      id: 3, 
      name: 'David Okello', 
      email: 'david.okello@email.com', 
      phone: '+256 700 345678', 
      status: 'Pending',
      farmSize: '3.2 acres',
      joinDate: '2024-01-10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Member Management</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Member
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-10" />
        </div>
        <Button variant="outline">
          Export List
        </Button>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{member.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {member.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span>Farm Size: {member.farmSize}</span>
                      <span>Joined: {member.joinDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.status === 'Active' ? 'bg-green-100 text-green-800' :
                    member.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button size="sm">
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemberManagement;
