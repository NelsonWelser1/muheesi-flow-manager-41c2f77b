
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderArchive, 
  FileText, 
  Download, 
  Upload,
  Search,
  Filter,
  Eye,
  Lock,
  Calendar,
  Building,
  User,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const DocumentVault = ({ selectedEntity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const documents = [
    {
      id: 1,
      name: 'Q1 2024 Financial Report',
      category: 'Financial',
      company: 'All Companies',
      type: 'PDF',
      size: '2.5 MB',
      uploadDate: '2024-04-15',
      lastModified: '2024-04-15',
      uploadedBy: 'PA. Nelson Namanya',
      status: 'Active',
      confidential: true,
      version: '1.0'
    },
    {
      id: 2,
      name: 'Grand Berna Export Licenses',
      category: 'Legal',
      company: 'Grand Berna Dairies',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-03-20',
      lastModified: '2024-05-10',
      uploadedBy: 'Export Manager',
      status: 'Active',
      confidential: false,
      version: '2.1'
    },
    {
      id: 3,
      name: 'KAJON Coffee Quality Certificates',
      category: 'Compliance',
      company: 'KAJON Coffee Limited',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2024-02-28',
      lastModified: '2024-04-05',
      uploadedBy: 'Quality Manager',
      status: 'Active',
      confidential: false,
      version: '1.5'
    },
    {
      id: 4,
      name: 'Board Meeting Minutes - May 2024',
      category: 'Administrative',
      company: 'All Companies',
      type: 'DOCX',
      size: '450 KB',
      uploadDate: '2024-05-25',
      lastModified: '2024-05-25',
      uploadedBy: 'PA. Nelson Namanya',
      status: 'Active',
      confidential: true,
      version: '1.0'
    },
    {
      id: 5,
      name: 'Kyalima Farm Insurance Policy',
      category: 'Insurance',
      company: 'Kyalima Farmers Limited',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: '2024-01-15',
      lastModified: '2024-01-15',
      uploadedBy: 'Insurance Agent',
      status: 'Expiring Soon',
      confidential: false,
      version: '1.0'
    },
    {
      id: 6,
      name: 'Employee Handbook 2024',
      category: 'HR',
      company: 'All Companies',
      type: 'PDF',
      size: '5.2 MB',
      uploadDate: '2024-01-01',
      lastModified: '2024-03-15',
      uploadedBy: 'HR Manager',
      status: 'Active',
      confidential: false,
      version: '2.0'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-success';
      case 'Expiring Soon': return 'bg-warning';
      case 'Expired': return 'bg-destructive';
      case 'Draft': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="h-5 w-5 text-destructive" />;
      case 'docx': case 'doc': return <FileText className="h-5 w-5 text-primary" />;
      case 'xlsx': case 'xls': return <FileText className="h-5 w-5 text-success" />;
      default: return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesEntity = selectedEntity === 'all' || doc.company === selectedEntity || doc.company === 'All Companies';
    return matchesSearch && matchesCategory && matchesStatus && matchesEntity;
  });

  const documentsByCategory = {
    'Financial': filteredDocuments.filter(doc => doc.category === 'Financial').length,
    'Legal': filteredDocuments.filter(doc => doc.category === 'Legal').length,
    'Compliance': filteredDocuments.filter(doc => doc.category === 'Compliance').length,
    'Administrative': filteredDocuments.filter(doc => doc.category === 'Administrative').length,
    'HR': filteredDocuments.filter(doc => doc.category === 'HR').length,
    'Insurance': filteredDocuments.filter(doc => doc.category === 'Insurance').length
  };

  const expiringDocuments = filteredDocuments.filter(doc => doc.status === 'Expiring Soon').length;
  const confidentialDocs = filteredDocuments.filter(doc => doc.confidential).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Document Vault & Management</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FolderArchive className="h-4 w-4 mr-2" />
            Create Folder
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filteredDocuments.length}</p>
            <p className="text-xs text-muted-foreground">In vault</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Confidential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{confidentialDocs}</p>
            <p className="text-xs text-muted-foreground">Restricted access</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">{expiringDocuments}</p>
            <p className="text-xs text-muted-foreground">Need renewal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{Object.keys(documentsByCategory).length}</p>
            <p className="text-xs text-muted-foreground">Document types</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Financial">Financial</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Compliance">Compliance</SelectItem>
            <SelectItem value="Administrative">Administrative</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Insurance">Insurance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Document Library</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="settings">Vault Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.type)}
                        {doc.confidential && <Lock className="h-4 w-4 text-destructive" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{doc.name}</h4>
                          <Badge variant="outline">{doc.category}</Badge>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                          {doc.confidential && (
                            <Badge variant="destructive" className="text-xs">
                              Confidential
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{doc.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{doc.type} • {doc.size}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{doc.uploadedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>v{doc.version}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          Last modified: {new Date(doc.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(documentsByCategory).map(([category, count]) => (
              <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{category}</span>
                    <Badge variant="outline">{count}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredDocuments
                      .filter(doc => doc.category === category)
                      .slice(0, 3)
                      .map(doc => (
                        <div key={doc.id} className="flex items-center gap-2 text-sm">
                          {getFileIcon(doc.type)}
                          <span className="truncate">{doc.name}</span>
                        </div>
                      ))}
                    {count > 3 && (
                      <p className="text-xs text-muted-foreground">+ {count - 3} more documents</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Document Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Uploaded', document: 'Board Meeting Minutes - May 2024', user: 'PA. Nelson Namanya', time: '2 hours ago' },
                  { action: 'Modified', document: 'Grand Berna Export Licenses', user: 'Export Manager', time: '1 day ago' },
                  { action: 'Downloaded', document: 'Q1 2024 Financial Report', user: 'CEO', time: '2 days ago' },
                  { action: 'Uploaded', document: 'KAJON Coffee Quality Certificates', user: 'Quality Manager', time: '3 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.action === 'Uploaded' ? 'bg-success' : 
                        activity.action === 'Modified' ? 'bg-warning' : 'bg-primary'
                      }`}></div>
                      <div>
                        <p className="font-medium">
                          <span className="text-muted-foreground">{activity.action}:</span> {activity.document}
                        </p>
                        <p className="text-sm text-muted-foreground">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-expire documents</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Version control</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confidential document alerts</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup frequency</span>
                    <Badge variant="outline">Daily</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Storage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Used</span>
                      <span>2.8 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Documents</span>
                      <span>{filteredDocuments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidential Files</span>
                      <span>{confidentialDocs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average File Size</span>
                      <span>1.8 MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentVault;
