
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Award, Download, Edit, Eye, Calendar, CheckCircle, AlertTriangle, Target } from 'lucide-react';

const QualityStandardsManual = ({ searchTerm }) => {
  const [selectedStandard, setSelectedStandard] = useState('all');

  const qualityStandards = [
    {
      id: 1,
      title: "ISO 9001:2015 Quality Management",
      standard: "ISO",
      compliance: 98.5,
      status: "Certified",
      lastAudit: "2024-01-15",
      nextAudit: "2024-07-15",
      criticality: "Critical",
      description: "International standard for quality management systems ensuring consistent quality and customer satisfaction."
    },
    {
      id: 2,
      title: "HACCP Food Safety Standards",
      standard: "Food Safety",
      compliance: 99.2,
      status: "Certified",
      lastAudit: "2024-01-20",
      nextAudit: "2024-06-20",
      criticality: "Critical",
      description: "Hazard Analysis Critical Control Points system for food safety management."
    },
    {
      id: 3,
      title: "Organic Certification Standards",
      standard: "Organic",
      compliance: 96.8,
      status: "Certified",
      lastAudit: "2024-01-10",
      nextAudit: "2024-08-10",
      criticality: "High",
      description: "Standards for organic dairy production and processing certification."
    },
    {
      id: 4,
      title: "Environmental Management ISO 14001",
      standard: "Environmental",
      compliance: 94.3,
      status: "In Progress",
      lastAudit: "2024-01-08",
      nextAudit: "2024-09-08",
      criticality: "Medium",
      description: "Environmental management system standards for sustainable operations."
    },
    {
      id: 5,
      title: "Workplace Safety Standards",
      standard: "Safety",
      compliance: 97.1,
      status: "Certified",
      lastAudit: "2024-01-18",
      nextAudit: "2024-07-18",
      criticality: "Critical",
      description: "Occupational health and safety standards for workplace protection."
    },
    {
      id: 6,
      title: "Fair Trade Certification",
      standard: "Fair Trade",
      compliance: 95.6,
      status: "Certified",
      lastAudit: "2024-01-12",
      nextAudit: "2024-10-12",
      criticality: "High",
      description: "Fair trade standards for ethical sourcing and farmer support."
    },
    {
      id: 7,
      title: "Energy Management ISO 50001",
      standard: "Energy",
      compliance: 92.4,
      status: "Under Review",
      lastAudit: "2024-01-22",
      nextAudit: "2024-08-22",
      criticality: "Medium",
      description: "Energy management system standards for efficiency optimization."
    },
    {
      id: 8,
      title: "Traceability Standards",
      standard: "Traceability",
      compliance: 98.9,
      status: "Certified",
      lastAudit: "2024-01-14",
      nextAudit: "2024-07-14",
      criticality: "High",
      description: "Product traceability standards from farm to consumer."
    }
  ];

  const standards = [
    { id: 'all', label: 'All Standards', count: qualityStandards.length },
    { id: 'ISO', label: 'ISO Standards', count: qualityStandards.filter(s => s.standard === 'ISO').length },
    { id: 'Food Safety', label: 'Food Safety', count: qualityStandards.filter(s => s.standard === 'Food Safety').length },
    { id: 'Organic', label: 'Organic', count: qualityStandards.filter(s => s.standard === 'Organic').length },
    { id: 'Environmental', label: 'Environmental', count: qualityStandards.filter(s => s.standard === 'Environmental').length },
    { id: 'Safety', label: 'Safety', count: qualityStandards.filter(s => s.standard === 'Safety').length }
  ];

  const filteredStandards = qualityStandards.filter(standard => {
    const matchesSearch = standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStandard = selectedStandard === 'all' || standard.standard === selectedStandard;
    return matchesSearch && matchesStandard;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Certified': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (compliance) => {
    if (compliance >= 98) return 'text-green-600';
    if (compliance >= 95) return 'text-yellow-600';
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
            Export Standards
          </Button>
          <Button className="w-full sm:w-auto">
            <Award className="h-4 w-4 mr-2" />
            Audit Schedule
          </Button>
        </div>
      </div>

      {/* Quality Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-sm text-gray-600">Active Standards</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">6</div>
            <p className="text-sm text-gray-600">Certified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">96.8%</div>
            <p className="text-sm text-gray-600">Avg Compliance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <p className="text-sm text-gray-600">Due Audits</p>
          </CardContent>
        </Card>
      </div>

      {/* Standard Filters */}
      <div className="flex flex-wrap gap-2">
        {standards.map((standard) => (
          <Button
            key={standard.id}
            variant={selectedStandard === standard.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStandard(standard.id)}
            className="text-xs"
          >
            {standard.label} ({standard.count})
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
                <div className="flex items-center gap-1 shrink-0">
                  <Target className={`h-4 w-4 ${getComplianceColor(standard.compliance)}`} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={`text-xs ${getStatusColor(standard.status)}`}>
                  {standard.status}
                </Badge>
                <Badge className={`text-xs ${getCriticalityColor(standard.criticality)}`}>
                  {standard.criticality}
                </Badge>
                <Badge variant="outline" className="text-xs">{standard.standard}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{standard.description}</p>
              
              {/* Compliance Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compliance Score</span>
                  <span className={`font-semibold ${getComplianceColor(standard.compliance)}`}>
                    {standard.compliance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      standard.compliance >= 98 ? 'bg-green-600' : 
                      standard.compliance >= 95 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${standard.compliance}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last: {standard.lastAudit}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Next: {standard.nextAudit}
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
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quality standards found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualityStandardsManual;
