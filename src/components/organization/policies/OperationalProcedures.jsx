
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus, Edit, Download, Eye, Clock, CheckCircle } from 'lucide-react';

const OperationalProcedures = ({ searchTerm }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const procedures = [
    {
      id: 1,
      title: "Daily Production Startup Procedures",
      category: "Production",
      status: "Active",
      lastUpdated: "2024-01-15",
      version: "v2.1",
      priority: "High",
      description: "Complete checklist for daily production line startup and safety verification."
    },
    {
      id: 2,
      title: "Quality Control Testing Protocol",
      category: "Quality",
      status: "Active",
      lastUpdated: "2024-01-10",
      version: "v3.0",
      priority: "Critical",
      description: "Standardized testing procedures for all dairy products quality assurance."
    },
    {
      id: 3,
      title: "Equipment Maintenance Schedule",
      category: "Maintenance",
      status: "Under Review",
      lastUpdated: "2024-01-08",
      version: "v1.5",
      priority: "Medium",
      description: "Preventive maintenance procedures for all factory equipment."
    },
    {
      id: 4,
      title: "Emergency Response Protocol",
      category: "Safety",
      status: "Active",
      lastUpdated: "2024-01-20",
      version: "v2.3",
      priority: "Critical",
      description: "Emergency procedures for fire, chemical spills, and equipment failures."
    },
    {
      id: 5,
      title: "Inventory Management Process",
      category: "Inventory",
      status: "Active",
      lastUpdated: "2024-01-12",
      version: "v1.8",
      priority: "High",
      description: "Standard procedures for inventory tracking, ordering, and stock management."
    },
    {
      id: 6,
      title: "Staff Training Procedures",
      category: "HR",
      status: "Draft",
      lastUpdated: "2024-01-18",
      version: "v1.0",
      priority: "Medium",
      description: "Comprehensive training procedures for new and existing staff members."
    }
  ];

  const categories = [
    { id: 'all', label: 'All Procedures', count: procedures.length },
    { id: 'Production', label: 'Production', count: procedures.filter(p => p.category === 'Production').length },
    { id: 'Quality', label: 'Quality', count: procedures.filter(p => p.category === 'Quality').length },
    { id: 'Safety', label: 'Safety', count: procedures.filter(p => p.category === 'Safety').length },
    { id: 'Maintenance', label: 'Maintenance', count: procedures.filter(p => p.category === 'Maintenance').length },
    { id: 'HR', label: 'HR', count: procedures.filter(p => p.category === 'HR').length },
    { id: 'Inventory', label: 'Inventory', count: procedures.filter(p => p.category === 'Inventory').length }
  ];

  const filteredProcedures = procedures.filter(procedure => {
    const matchesSearch = procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         procedure.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || procedure.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Operational Procedures</h3>
        </div>
        <Button className="w-full lg:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Procedure
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="text-xs"
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Procedures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProcedures.map((procedure) => (
          <Card key={procedure.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-sm font-medium line-clamp-2">{procedure.title}</CardTitle>
                <Badge variant="outline" className="text-xs shrink-0">{procedure.version}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={`text-xs ${getStatusColor(procedure.status)}`}>
                  {procedure.status}
                </Badge>
                <Badge className={`text-xs ${getPriorityColor(procedure.priority)}`}>
                  {procedure.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">{procedure.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{procedure.description}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                Last updated: {procedure.lastUpdated}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProcedures.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No procedures found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OperationalProcedures;
