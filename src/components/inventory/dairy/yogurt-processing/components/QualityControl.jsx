
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Thermometer, 
  AlertCircle, 
  FileText, 
  Clock, 
  Search, 
  Filter, 
  Plus 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const QualityControl = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("checks");
  const [showNewCheckForm, setShowNewCheckForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewCheck = () => {
    setShowNewCheckForm(true);
  };

  const handleCheckSubmitted = () => {
    setShowNewCheckForm(false);
    toast({
      title: "Quality Check Recorded",
      description: "The quality check has been successfully recorded",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quality Control</CardTitle>
            {activeTab === "checks" && !showNewCheckForm && (
              <Button onClick={handleNewCheck}>
                <Plus className="mr-2 h-4 w-4" /> New Quality Check
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="checks">Quality Checks</TabsTrigger>
              <TabsTrigger value="standards">Quality Standards</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="checks">
              {showNewCheckForm ? (
                <QualityCheckForm 
                  onSubmit={handleCheckSubmitted} 
                  onCancel={() => setShowNewCheckForm(false)} 
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-grow max-w-md">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by batch ID, product..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="passed">Passed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <QualityChecksTable onSelectBatch={setSelectedBatch} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="standards">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Yogurt Quality Standards</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StandardCard 
                      title="pH Level" 
                      range="4.0 - 4.6" 
                      icon={Thermometer} 
                      description="The ideal pH for yogurt products to ensure proper acidity and flavor." 
                    />
                    
                    <StandardCard 
                      title="Microbial Standards" 
                      range="< 10 CFU/g" 
                      icon={AlertCircle} 
                      description="Maximum allowable count for harmful bacteria in final product." 
                    />
                    
                    <StandardCard 
                      title="Texture Analysis" 
                      range="Scoring ≥ 8/10" 
                      icon={CheckCircle2} 
                      description="Minimum texture quality score based on firmness and consistency." 
                    />
                    
                    <StandardCard 
                      title="Shelf Life Testing" 
                      range="21+ days" 
                      icon={Clock} 
                      description="Minimum shelf life under proper refrigeration conditions." 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Detailed Standards Documentation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        ISO 22000 Compliance Document
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        HACCP Plans for Yogurt Production
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Sensory Evaluation Standards
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Quality Assurance Manual
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Quality Reports</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Generate Report
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <ReportCard 
                    title="Weekly Quality Summary" 
                    date="May 15, 2024"
                    metrics={[
                      { name: "Average pH", value: "4.3" },
                      { name: "Quality Issues", value: "2" },
                      { name: "Pass Rate", value: "97%" }
                    ]}
                  />
                  
                  <ReportCard 
                    title="Monthly Quality Trend Analysis" 
                    date="April 2024"
                    metrics={[
                      { name: "Trend", value: "Improving" },
                      { name: "Best Product", value: "Greek Yogurt" },
                      { name: "Most Issues", value: "Strawberry" }
                    ]}
                  />
                  
                  <ReportCard 
                    title="Quarterly External Audit" 
                    date="Q1 2024"
                    metrics={[
                      { name: "Compliance", value: "98%" },
                      { name: "Audit Score", value: "A+" },
                      { name: "Action Items", value: "3" }
                    ]}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const QualityChecksTable = ({ onSelectBatch }) => {
  const checks = [
    { 
      id: 'QC001', 
      batchId: 'YB001', 
      product: 'Greek Yogurt', 
      checkDate: '2024-05-18', 
      technician: 'John Smith',
      pH: 4.3,
      appearance: 'Excellent',
      texture: 'Good',
      flavor: 'Excellent',
      status: 'passed' 
    },
    { 
      id: 'QC002', 
      batchId: 'YB002', 
      product: 'Strawberry Yogurt', 
      checkDate: '2024-05-18', 
      technician: 'Maria Garcia',
      pH: 4.7,
      appearance: 'Good',
      texture: 'Fair',
      flavor: 'Good',
      status: 'failed' 
    },
    { 
      id: 'QC003', 
      batchId: 'YB003', 
      product: 'Natural Yogurt', 
      checkDate: '2024-05-17', 
      technician: 'David Lee',
      pH: 4.5,
      appearance: 'Excellent',
      texture: 'Excellent',
      flavor: 'Good',
      status: 'passed' 
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-500">Passed</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 font-medium">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Batch</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">pH</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((check) => (
              <tr key={check.id} className="border-b hover:bg-muted/30">
                <td className="p-3 font-medium">{check.id}</td>
                <td className="p-3">{check.batchId}</td>
                <td className="p-3">{check.product}</td>
                <td className="p-3">{check.checkDate}</td>
                <td className="p-3">{check.pH}</td>
                <td className="p-3">{getStatusBadge(check.status)}</td>
                <td className="p-3">
                  <Button variant="ghost" size="sm" onClick={() => onSelectBatch(check)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const QualityCheckForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    batchId: "",
    pH: "",
    appearance: "",
    texture: "",
    flavor: "",
    microbiological: "",
    notes: ""
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={onCancel}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <h3 className="text-lg font-medium">New Quality Control Check</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="batchId">Batch ID <span className="text-red-500">*</span></Label>
            <Select
              value={formData.batchId}
              onValueChange={(value) => handleChange("batchId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select batch ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YB001">YB001 - Greek Yogurt</SelectItem>
                <SelectItem value="YB002">YB002 - Strawberry Yogurt</SelectItem>
                <SelectItem value="YB003">YB003 - Natural Yogurt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pH">pH Level <span className="text-red-500">*</span></Label>
            <Input
              id="pH"
              type="number"
              step="0.1"
              min="3.5"
              max="5.0"
              placeholder="e.g., 4.5"
              value={formData.pH}
              onChange={(e) => handleChange("pH", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="appearance">Appearance</Label>
            <Select
              value={formData.appearance}
              onValueChange={(value) => handleChange("appearance", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rate appearance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="texture">Texture</Label>
            <Select
              value={formData.texture}
              onValueChange={(value) => handleChange("texture", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rate texture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="flavor">Flavor Profile</Label>
            <Select
              value={formData.flavor}
              onValueChange={(value) => handleChange("flavor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rate flavor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="microbiological">Microbiological Test Result</Label>
            <Select
              value={formData.microbiological}
              onValueChange={(value) => handleChange("microbiological", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes & Observations</Label>
            <textarea
              id="notes"
              rows={4}
              className="w-full border rounded-md p-2"
              placeholder="Add any notes or observations..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Submit Quality Check
        </Button>
      </div>
    </form>
  );
};

const StandardCard = ({ title, range, icon: Icon, description }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <Badge variant="secondary" className="mt-2">
              Standard Range: {range}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReportCard = ({ title, date, metrics }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary/10 p-3">
          <h4 className="font-medium">{title}</h4>
          <p className="text-xs text-muted-foreground">Generated: {date}</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-muted-foreground">{metric.name}</p>
                <p className="font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityControl;
