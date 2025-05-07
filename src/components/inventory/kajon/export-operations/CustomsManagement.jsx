
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, CheckSquare, FileCheck, AlertTriangle, FileText, Eye, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample customs documents data
const customsDocuments = [
  {
    id: "DOC-2023-001",
    type: "Customs Declaration",
    related: "SHP-2023-001",
    client: "Equata Coffee Limited",
    submitted: "2023-11-10",
    status: "Approved",
    notes: "All required documents submitted"
  },
  {
    id: "DOC-2023-002",
    type: "Certificate of Origin",
    related: "SHP-2023-001",
    client: "Equata Coffee Limited",
    submitted: "2023-11-08",
    status: "Approved",
    notes: "Uganda Coffee Development Authority verified"
  },
  {
    id: "DOC-2023-003",
    type: "Phytosanitary Certificate",
    related: "SHP-2023-001",
    client: "Equata Coffee Limited",
    submitted: "2023-11-09",
    status: "Pending",
    notes: "Awaiting final signature"
  },
  {
    id: "DOC-2023-004",
    type: "Commercial Invoice",
    related: "SHP-2023-002",
    client: "Nordic Roasters Group",
    submitted: "2023-11-12",
    status: "Approved",
    notes: "Value declaration confirmed"
  },
  {
    id: "DOC-2023-005",
    type: "Bill of Lading",
    related: "SHP-2023-002",
    client: "Nordic Roasters Group",
    submitted: "2023-11-14",
    status: "Approved",
    notes: "Clean Bill of Lading issued"
  }
];

// Compliance requirements sample data
const complianceRequirements = [
  {
    country: "European Union",
    requirements: [
      "Certificate of Origin",
      "Phytosanitary Certificate",
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading",
      "EUR1 Movement Certificate"
    ],
    notes: "Must comply with EU food safety regulations and maximum residue levels"
  },
  {
    country: "United States",
    requirements: [
      "Certificate of Origin",
      "Phytosanitary Certificate",
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading",
      "FDA Prior Notice"
    ],
    notes: "Subject to FDA inspection upon arrival"
  },
  {
    country: "Japan",
    requirements: [
      "Certificate of Origin",
      "Phytosanitary Certificate",
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading",
      "Import Declaration"
    ],
    notes: "Strict pesticide residue limits"
  }
];

const CustomsManagement = () => {
  const [activeTab, setActiveTab] = React.useState("documents");
  
  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Pending": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Rejected": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Package className="mr-2 h-6 w-6" />
            Customs & Compliance Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage export documentation and regulatory compliance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View Requirements
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CheckSquare className="mr-2 h-4 w-4 text-green-700" />
                <span>Approved Documents</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">18</div>
            <p className="text-xs text-muted-foreground">Ready for shipment</p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <FileCheck className="mr-2 h-4 w-4 text-amber-700" />
                <span>Pending Documents</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">5</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-700" />
                <span>Compliance Alerts</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">2</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customs Documentation</CardTitle>
          <CardDescription>
            Track and manage export compliance documents
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="regulations">Regulations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customsDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.id}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.related}</TableCell>
                        <TableCell>{doc.client}</TableCell>
                        <TableCell>{doc.submitted}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={doc.notes}>
                          {doc.notes}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="mt-0">
              <div className="space-y-6">
                {complianceRequirements.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{item.country} Export Requirements</CardTitle>
                      <CardDescription>{item.notes}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {item.requirements.map((req, i) => (
                          <li key={i} className="flex items-center">
                            <CheckSquare className="mr-2 h-4 w-4 text-green-700" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="regulations" className="mt-0">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Uganda Export Regulations</CardTitle>
                    <CardDescription>
                      Current regulatory requirements for coffee exports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckSquare className="mr-2 h-4 w-4 text-green-700 mt-1" />
                        <div>
                          <p className="font-medium">Uganda Coffee Development Authority (UCDA) License</p>
                          <p className="text-sm text-muted-foreground">Required for all coffee exporters</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckSquare className="mr-2 h-4 w-4 text-green-700 mt-1" />
                        <div>
                          <p className="font-medium">Quality Certification</p>
                          <p className="text-sm text-muted-foreground">UCDA quality certification required for all coffee exports</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckSquare className="mr-2 h-4 w-4 text-green-700 mt-1" />
                        <div>
                          <p className="font-medium">Export Levy</p>
                          <p className="text-sm text-muted-foreground">1% of FOB value to be paid to Uganda Coffee Development Authority</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckSquare className="mr-2 h-4 w-4 text-green-700 mt-1" />
                        <div>
                          <p className="font-medium">Foreign Exchange Declaration</p>
                          <p className="text-sm text-muted-foreground">Required for all exports exceeding USD 10,000</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>International Standards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckSquare className="mr-2 h-4 w-4 text-green-700" />
                          <span>ISO 9001 Quality Management</span>
                        </li>
                        <li className="flex items-center">
                          <CheckSquare className="mr-2 h-4 w-4 text-green-700" />
                          <span>HACCP Food Safety</span>
                        </li>
                        <li className="flex items-center">
                          <CheckSquare className="mr-2 h-4 w-4 text-green-700" />
                          <span>Rainforest Alliance</span>
                        </li>
                        <li className="flex items-center">
                          <CheckSquare className="mr-2 h-4 w-4 text-green-700" />
                          <span>Fair Trade Certification</span>
                        </li>
                        <li className="flex items-center">
                          <CheckSquare className="mr-2 h-4 w-4 text-green-700" />
                          <span>Organic Certification</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Important Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center border-b pb-2">
                          <span>Uganda Coffee Development Authority</span>
                          <Button variant="link" className="p-0 h-auto">Contact</Button>
                        </li>
                        <li className="flex justify-between items-center border-b pb-2">
                          <span>Customs Department</span>
                          <Button variant="link" className="p-0 h-auto">Contact</Button>
                        </li>
                        <li className="flex justify-between items-center border-b pb-2">
                          <span>Ministry of Trade</span>
                          <Button variant="link" className="p-0 h-auto">Contact</Button>
                        </li>
                        <li className="flex justify-between items-center border-b pb-2">
                          <span>Clearing Agent</span>
                          <Button variant="link" className="p-0 h-auto">Contact</Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Shipping Line Representative</span>
                          <Button variant="link" className="p-0 h-auto">Contact</Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomsManagement;
