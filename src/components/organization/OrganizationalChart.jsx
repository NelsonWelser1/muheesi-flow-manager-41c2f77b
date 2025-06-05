import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  Shield,
  User,
  BookOpen
} from 'lucide-react';
import StaffHandbook from './staff-handbook/StaffHandbook';

const companies = [
  {
    id: 'grand-berna',
    name: 'Grand Berna Dairies',
    type: 'Dairy Processing & Manufacturing',
    location: 'Mbarara, Uganda',
    employees: 120,
    departments: [
      { name: 'Production', employees: 45 },
      { name: 'Quality Control', employees: 15 },
      { name: 'Sales & Marketing', employees: 25 },
      { name: 'Administration', employees: 10 },
      { name: 'Logistics', employees: 20 },
      { name: 'Research & Development', employees: 5 }
    ],
    contact: {
      phone: '+256 700 123 456',
      email: 'info@grandberna.com',
      address: 'Mbarara Industrial Area, Plot 45-48'
    }
  },
  {
    id: 'kajon-coffee',
    name: 'Kajon Coffee Exports',
    type: 'Coffee Export & Trading',
    location: 'Kampala, Uganda',
    employees: 85,
    departments: [
      { name: 'Sourcing & Processing', employees: 30 },
      { name: 'Quality Assessment', employees: 12 },
      { name: 'Export Operations', employees: 18 },
      { name: 'Administration', employees: 8 },
      { name: 'Sales & Marketing', employees: 15 },
      { name: 'Finance', employees: 2 }
    ],
    contact: {
      phone: '+256 700 789 012',
      email: 'info@kajoncoffee.com',
      address: 'Kampala Business District, Coffee House Building'
    }
  },
  {
    id: 'fresheco-exports',
    name: 'Fresheco Exports',
    type: 'Fresh Produce Export',
    location: 'Entebbe, Uganda',
    employees: 65,
    departments: [
      { name: 'Produce Sourcing', employees: 20 },
      { name: 'Quality Control', employees: 10 },
      { name: 'Packaging & Processing', employees: 15 },
      { name: 'Export Operations', employees: 12 },
      { name: 'Administration', employees: 5 },
      { name: 'Sales', employees: 3 }
    ],
    contact: {
      phone: '+256 700 345 678',
      email: 'info@fresheco.com',
      address: 'Entebbe Export Zone, Block C'
    }
  }
];

const OrganizationalChart = () => {
  const [showStaffHandbook, setShowStaffHandbook] = useState(false);

  if (showStaffHandbook) {
    return <StaffHandbook onBack={() => setShowStaffHandbook(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organizational Structure</h2>
          <p className="text-gray-600">Company overview and team structure</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowStaffHandbook(true)}
          >
            <BookOpen className="h-4 w-4" />
            Staff Handbook
          </Button>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {company.name}
                  </CardTitle>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {company.type}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Location and Employees */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{company.location}</span>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{company.employees} Employees</span>
                  </Badge>
                </div>

                {/* Departments */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Departments</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {company.departments.map((dept) => (
                      <div key={dept.name} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <span className="text-xs font-medium text-gray-700">{dept.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {dept.employees}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{company.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{company.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{company.contact.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organization-wide Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organization-wide Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Fiscal Year</h3>
                <p className="text-sm text-gray-600">January - December</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Reporting Structure</h3>
                <p className="text-sm text-gray-600">Centralized management</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Compliance</h3>
                <p className="text-sm text-gray-600">ISO 9001, HACCP Certified</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "John Mukasa", role: "Chief Executive Officer", company: "Group" },
              { name: "Sarah Nambi", role: "Chief Operations Officer", company: "Group" },
              { name: "David Okello", role: "Managing Director", company: "Grand Berna Dairies" },
              { name: "Patricia Zawedde", role: "Managing Director", company: "Kajon Coffee Exports" },
              { name: "Michael Ochen", role: "Managing Director", company: "Fresheco Exports" },
              { name: "Elizabeth Nantume", role: "Chief Financial Officer", company: "Group" }
            ].map((person, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{person.name}</h4>
                  <p className="text-xs text-gray-600">{person.role}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{person.company}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationalChart;
