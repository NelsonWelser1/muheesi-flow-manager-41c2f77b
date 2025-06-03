
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Upload, 
  Download, 
  Search,
  FolderOpen,
  Calendar,
  User,
  Shield,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';

const DocumentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const certifications = [
    { id: 1, name: 'HACCP Certificate', type: 'certification', status: 'active', expiryDate: '2024-12-15', version: '1.0', size: '2.4 MB' },
    { id: 2, name: 'ISO 22000 Certificate', type: 'certification', status: 'active', expiryDate: '2025-03-20', version: '2.1', size: '1.8 MB' },
    { id: 3, name: 'USDA Export License', type: 'license', status: 'expiring', expiryDate: '2024-07-10', version: '1.5', size: '3.2 MB' },
    { id: 4, name: 'EU Organic Certificate', type: 'certification', status: 'active', expiryDate: '2025-01-30', version: '1.0', size: '2.1 MB' }
  ];

  const sops = [
    { id: 1, title: 'Quality Control Procedures', version: '3.2', lastModified: '2024-05-15', author: 'Jane Doe', status: 'approved', size: '856 KB' },
    { id: 2, title: 'HACCP Implementation Guide', version: '2.1', lastModified: '2024-05-10', author: 'John Smith', status: 'draft', size: '1.2 MB' },
    { id: 3, title: 'Cold Chain Management SOP', version: '4.0', lastModified: '2024-05-08', author: 'Mike Wilson', status: 'approved', size: '732 KB' },
    { id: 4, title: 'Audit Preparation Checklist', version: '1.5', lastModified: '2024-05-05', author: 'Sarah Johnson', status: 'review', size: '445 KB' }
  ];

  const recentUploads = [
    { id: 1, name: 'Monthly Quality Report - May 2024.pdf', uploadedBy: 'Jane Doe', uploadDate: '2024-06-01', size: '2.8 MB' },
    { id: 2, name: 'Supplier Audit Results.xlsx', uploadedBy: 'John Smith', uploadDate: '2024-05-30', size: '1.5 MB' },
    { id: 3, name: 'Temperature Log - Week 22.csv', uploadedBy: 'Mike Wilson', uploadDate: '2024-05-28', size: '234 KB' },
    { id: 4, name: 'Updated HACCP Plan v3.1.pdf', uploadedBy: 'Sarah Johnson', uploadDate: '2024-05-25', size: '4.2 MB' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'expiring': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      case 'approved': return 'bg-green-500';
      case 'draft': return 'bg-gray-500';
      case 'review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expiring':
      case 'review':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredCertifications = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSOPs = sops.filter(sop =>
    sop.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Upload Header */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FolderOpen className="h-4 w-4 mr-2" />
            Browse
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="sops">SOPs</TabsTrigger>
          <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Certifications & Licenses</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredCertifications.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(cert.status)}
                      <div>
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">Version {cert.version} • {cert.size}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Expires: {cert.expiryDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        {cert.type}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sops" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Standard Operating Procedures</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create SOP
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredSOPs.map((sop) => (
              <Card key={sop.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(sop.status)}
                      <div>
                        <h4 className="font-medium">{sop.title}</h4>
                        <p className="text-sm text-muted-foreground">Version {sop.version} • {sop.size}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(sop.status)}>
                      {sop.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {sop.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {sop.lastModified}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Uploads</h3>
          
          <div className="grid gap-4">
            {recentUploads.map((upload) => (
              <Card key={upload.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{upload.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Uploaded by {upload.uploadedBy} on {upload.uploadDate} • {upload.size}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Document Templates</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Audit Report Template',
              'CAPA Form Template',
              'Quality Inspection Form',
              'Risk Assessment Template',
              'Training Record Template',
              'Incident Report Template'
            ].map((template, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                    <h4 className="font-medium">{template}</h4>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;
