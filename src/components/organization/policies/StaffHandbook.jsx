
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Download, Edit, Eye, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const StaffHandbook = ({ searchTerm }) => {
  const [selectedSection, setSelectedSection] = useState('all');

  const handbookSections = [
    {
      id: 1,
      title: "Employee Code of Conduct",
      section: "Conduct",
      pages: 12,
      status: "Current",
      lastUpdated: "2024-01-15",
      mandatory: true,
      description: "Professional behavior standards, ethical guidelines, and workplace conduct expectations."
    },
    {
      id: 2,
      title: "Health and Safety Guidelines",
      section: "Safety",
      pages: 18,
      status: "Current",
      lastUpdated: "2024-01-20",
      mandatory: true,
      description: "Comprehensive safety protocols, emergency procedures, and health requirements."
    },
    {
      id: 3,
      title: "Leave and Attendance Policy",
      section: "Policies",
      pages: 8,
      status: "Current",
      lastUpdated: "2024-01-10",
      mandatory: true,
      description: "Leave application procedures, attendance requirements, and time-off policies."
    },
    {
      id: 4,
      title: "Performance Management System",
      section: "Performance",
      pages: 15,
      status: "Under Review",
      lastUpdated: "2024-01-08",
      mandatory: false,
      description: "Performance evaluation criteria, review processes, and development plans."
    },
    {
      id: 5,
      title: "IT and Communication Policies",
      section: "IT",
      pages: 10,
      status: "Current",
      lastUpdated: "2024-01-18",
      mandatory: true,
      description: "Technology usage guidelines, cybersecurity protocols, and communication standards."
    },
    {
      id: 6,
      title: "Employee Benefits Guide",
      section: "Benefits",
      pages: 14,
      status: "Current",
      lastUpdated: "2024-01-12",
      mandatory: false,
      description: "Comprehensive guide to employee benefits, insurance, and welfare programs."
    },
    {
      id: 7,
      title: "Training and Development",
      section: "Training",
      pages: 11,
      status: "Draft",
      lastUpdated: "2024-01-22",
      mandatory: false,
      description: "Training programs, skill development opportunities, and career advancement paths."
    },
    {
      id: 8,
      title: "Grievance and Disciplinary Procedures",
      section: "Procedures",
      pages: 9,
      status: "Current",
      lastUpdated: "2024-01-14",
      mandatory: true,
      description: "Formal procedures for handling complaints, disputes, and disciplinary actions."
    }
  ];

  const sections = [
    { id: 'all', label: 'All Sections', count: handbookSections.length },
    { id: 'Conduct', label: 'Conduct', count: handbookSections.filter(s => s.section === 'Conduct').length },
    { id: 'Safety', label: 'Safety', count: handbookSections.filter(s => s.section === 'Safety').length },
    { id: 'Policies', label: 'Policies', count: handbookSections.filter(s => s.section === 'Policies').length },
    { id: 'Benefits', label: 'Benefits', count: handbookSections.filter(s => s.section === 'Benefits').length },
    { id: 'Training', label: 'Training', count: handbookSections.filter(s => s.section === 'Training').length }
  ];

  const filteredSections = handbookSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || section.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Current': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Staff Handbook</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download Full Handbook
          </Button>
          <Button className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Handbook
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-sm text-gray-600">Total Sections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">97</div>
            <p className="text-sm text-gray-600">Total Pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <p className="text-sm text-gray-600">Mandatory Sections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">94%</div>
            <p className="text-sm text-gray-600">Staff Completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Section Filters */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={selectedSection === section.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSection(section.id)}
            className="text-xs"
          >
            {section.label} ({section.count})
          </Button>
        ))}
      </div>

      {/* Handbook Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSections.map((section) => (
          <Card key={section.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-sm font-medium line-clamp-2">{section.title}</CardTitle>
                <div className="flex items-center gap-1 shrink-0">
                  {section.mandatory && (
                    <Badge variant="destructive" className="text-xs">
                      Mandatory
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={`text-xs ${getStatusColor(section.status)}`}>
                  {section.status}
                </Badge>
                <Badge variant="outline" className="text-xs">{section.section}</Badge>
                <Badge variant="secondary" className="text-xs">{section.pages} pages</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{section.description}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                Last updated: {section.lastUpdated}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Read
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Download className="h-3 w-3" />
                </Button>
              </div>

              {/* Reading Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Staff Reading Progress</span>
                  <span>94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSections.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No handbook sections found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffHandbook;
