
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, Edit, Eye, Calendar, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const QualityStandardsManual = ({ searchTerm }) => {
  const [selectedStandard, setSelectedStandard] = useState('all');

  const qualityStandards = [
    {
      id: 1,
      title: "ISO 9001:2015 Quality Management",
      category: "ISO Standards",
      status: "Active",
      lastUpdated: "2024-01-15",
      version: "v3.2",
      compliance: "100%",
      priority: "Critical",
      description: "International standard for quality management systems and continuous improvement."
    },
    {
      id: 2,
      title: "HACCP Food Safety Protocol",
      category: "Food Safety",
      status: "Active",
      lastUpdated: "2024-01-20",
      version: "v2.8",
      compliance: "98%",
      priority: "Critical",
      description: "Hazard Analysis Critical Control Points system for food safety management."
    },
    {
      id: 3,
      title: "GMP Manufacturing Practices",
      category: "Manufacturing",
      status: "Active",
      lastUpdated: "2024-01-18",
      version: "v4.1",
      compliance: "96%",
      priority: "High",
      description: "Good Manufacturing Practices for dairy production and processing."
    },
    {
      id: 4,
      title: "Environmental Management System",
      category: "Environmental",
      status: "Under Review",
      lastUpdated: "2024-01-12",
      version: "v1.9",
      compliance: "94%",
      priority: "High",
      description: "Environmental standards for sustainable operations and waste management."
    },
    {
      id: 5,
      title: "Occupational Health & Safety",
      category: "Safety",
      status: "Active",
      lastUpdated: "2024-01-22",
      version: "v2.5",
      compliance: "99%",
      priority: "Critical",
      description: "Comprehensive workplace safety standards and injury prevention protocols."
    },
    {
      id: 6,
      title: "Product Quality Control Standards",
      category: "Quality Control",
      status: "Active",
      lastUpdated: "2024-01-10",
      version: "v3.7",
      compliance: "97%",
      priority: "High",
      description: "Quality control procedures for all dairy products and testing protocols."
    },
    {
      id: 7,
      title: "Supplier Quality Requirements",
      category: "Procurement",
      status: "Draft",
      lastUpdated: "2024-01-25",
      version: "v1.0",
      compliance: "85%",
      priority: "Medium",
      description: "Quality standards and requirements for all suppliers and vendors."
    },
    {
      id: 8,
      title: "Traceability and Documentation",
      category: "Documentation",
      status: "Active",
      lastUpdated: "2024-01-14",
      version: "v2.3",
      compliance: "95%",
      priority: "High",
      description: "Product traceability systems and documentation requirements."
    }
  ];

  const categories = [
    { id: 'all', label: 'All Standards', count: qualityStandards.length },
    { id: 'ISO Standards', label: 'ISO Standards', count: qualityStandards.filter(s => s.category === 'ISO Standards').length },
    { id: 'Food Safety', label: 'Food Safety', count: qualityStandards.filter(s => s.category === 'Food Safety').length },
    { id: 'Manufacturing', label: 'Manufacturing', count: qualityStandards.filter(s => s.category === 'Manufacturing').length },
    { id: 'Safety', label: 'Safety', count: qualityStandards.filter(s => s.category === 'Safety').length },
    { id: 'Quality Control', label: 'Quality Control', count: qualityStandards.filter(s => s.category === 'Quality Control').length }
  ];

  const filteredStandards = qualityStandards.filter(standard => {
    const matchesSearch = standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedStandard === 'all' || standard.category === selectedStandard;
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

  const getComplianceColor = (compliance) => {
    const percentage = parseInt(compliance);
    if (percentage >= 98) return 'text-green-600';
    if (percentage >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Quality Standards Manual</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download Manual
          </Button>
          <Button className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Update Standards
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-sm text-gray-600">Active Standards</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">96.8%</div>
            <p className="text-sm text-gray-600">Avg Compliance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <p className="text-sm text-gray-600">Critical Standards</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">1</div>
            <p className="text-sm text-gray-600">Pending Review</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedStandard === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStandard(category.id)}
            className="text-xs"
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Quality Standards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStandards.map((standard) => (
          <Card key={standard.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-sm font-medium line-clamp-2">{standard.title}</CardTitle>
                <Badge variant="outline" className="text-xs shrink-0">{standard.version}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={`text-xs ${getStatusColor(standard.status)}`}>
                  {standard.status}
                </Badge>
                <Badge className={`text-xs ${getPriorityColor(standard.priority)}`}>
                  {standard.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">{standard.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{standard.description}</p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                Last updated: {standard.lastUpdated}
              </div>

              {/* Compliance Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Compliance Score</span>
                  <span className={`text-sm font-bold ${getComplianceColor(standard.compliance)}`}>
                    {standard.compliance}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all" 
                    style={{ width: standard.compliance }}
                  ></div>
                </div>
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

      {filteredStandards.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quality standards found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualityStandardsManual;
