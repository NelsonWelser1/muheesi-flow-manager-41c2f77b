
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  Calendar, 
  User, 
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

const ProceduresList = ({ status, searchTerm, filterCompany, onViewProcedure, onEditProcedure }) => {
  // Mock data for procedures
  const procedures = [
    {
      id: 1,
      title: "Milk Quality Control Protocol",
      description: "Standard operating procedure for ensuring milk quality meets safety standards",
      company: "Grand Berna Dairies",
      department: "Quality Control",
      status: "active",
      version: "2.1",
      lastUpdated: "2024-01-15",
      createdBy: "Dr. Sarah Johnson",
      nextReview: "2024-04-15",
      priority: "high",
      compliance: 98
    },
    {
      id: 2,
      title: "Coffee Bean Grading Standards",
      description: "Comprehensive guide for coffee bean classification and grading",
      company: "KAJON Coffee",
      department: "Production",
      status: "active",
      version: "1.5",
      lastUpdated: "2024-01-10",
      createdBy: "Michael Brown",
      nextReview: "2024-03-10",
      priority: "high",
      compliance: 95
    },
    {
      id: 3,
      title: "Livestock Health Monitoring",
      description: "Daily health check procedures for cattle and other livestock",
      company: "Kyalima Farmers",
      department: "Animal Care",
      status: "active",
      version: "3.0",
      lastUpdated: "2024-01-20",
      createdBy: "Dr. James Wilson",
      nextReview: "2024-05-20",
      priority: "critical",
      compliance: 100
    },
    {
      id: 4,
      title: "Equipment Maintenance Schedule",
      description: "Regular maintenance procedures for dairy processing equipment",
      company: "Grand Berna Dairies",
      department: "Maintenance",
      status: "draft",
      version: "1.0",
      lastUpdated: "2024-01-25",
      createdBy: "Tech Team",
      nextReview: "2024-02-25",
      priority: "medium",
      compliance: 0
    },
    {
      id: 5,
      title: "Warehouse Safety Protocols",
      description: "Safety guidelines for warehouse operations and emergency procedures",
      company: "KAJON Coffee",
      department: "Logistics",
      status: "active",
      version: "2.3",
      lastUpdated: "2024-01-08",
      createdBy: "Safety Team",
      nextReview: "2024-07-08",
      priority: "critical",
      compliance: 97
    },
    {
      id: 6,
      title: "Financial Reporting Guidelines",
      description: "Monthly and quarterly financial reporting procedures",
      company: "Kyalima Farmers",
      department: "Finance",
      status: "archived",
      version: "1.8",
      lastUpdated: "2023-12-01",
      createdBy: "Finance Team",
      nextReview: "2024-06-01",
      priority: "medium",
      compliance: 92
    }
  ];

  // Filter procedures based on status, search term, and company
  const filteredProcedures = procedures.filter(procedure => {
    const matchesStatus = status === 'all' || procedure.status === status;
    const matchesSearch = procedure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         procedure.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = filterCompany === 'all' || 
                          (filterCompany === 'grand-berna' && procedure.company === 'Grand Berna Dairies') ||
                          (filterCompany === 'kajon' && procedure.company === 'KAJON Coffee') ||
                          (filterCompany === 'kyalima' && procedure.company === 'Kyalima Farmers');
    
    return matchesStatus && matchesSearch && matchesCompany;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800"><FileText className="h-3 w-3 mr-1" />Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (filteredProcedures.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No procedures found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredProcedures.map((procedure) => (
        <Card key={procedure.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{procedure.title}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(procedure.status)}
                    {getPriorityBadge(procedure.priority)}
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">{procedure.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{procedure.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{procedure.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>v{procedure.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{procedure.lastUpdated}</span>
                  </div>
                </div>

                {procedure.status === 'active' && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Compliance Rate:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${procedure.compliance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{procedure.compliance}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewProcedure(procedure)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditProcedure(procedure)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProceduresList;
