
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, BarChart, Coffee, Award, 
  BarChart3, Plus, ArrowRight, FileText
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, 
  CartesianGrid, Legend
} from 'recharts';

// Sample quality data for radar chart
const qualityScores = [
  { attribute: 'Aroma', arabica: 8.5, robusta: 7.2 },
  { attribute: 'Flavor', arabica: 8.7, robusta: 7.0 },
  { attribute: 'Aftertaste', arabica: 8.3, robusta: 6.8 },
  { attribute: 'Acidity', arabica: 8.6, robusta: 6.5 },
  { attribute: 'Body', arabica: 8.2, robusta: 8.1 },
  { attribute: 'Balance', arabica: 8.4, robusta: 7.3 },
  { attribute: 'Uniformity', arabica: 9.2, robusta: 8.5 },
  { attribute: 'Clean Cup', arabica: 9.0, robusta: 8.2 },
  { attribute: 'Sweetness', arabica: 8.8, robusta: 7.0 },
];

// Sample quality trend data
const qualityTrendData = [
  { month: 'Jan', arabica: 84, robusta: 74 },
  { month: 'Feb', arabica: 85, robusta: 75 },
  { month: 'Mar', arabica: 83, robusta: 73 },
  { month: 'Apr', arabica: 86, robusta: 76 },
  { month: 'May', arabica: 85, robusta: 75 },
  { month: 'Jun', arabica: 87, robusta: 77 },
  { month: 'Jul', arabica: 88, robusta: 78 },
  { month: 'Aug', arabica: 87, robusta: 77 },
  { month: 'Sep', arabica: 86, robusta: 76 },
  { month: 'Oct', arabica: 89, robusta: 79 },
  { month: 'Nov', arabica: 88, robusta: 78 },
  { month: 'Dec', arabica: 90, robusta: 80 },
];

// Sample certifications data
const certifications = [
  {
    id: 'CERT-1001',
    name: 'Q-Grader Certification - Arabica',
    score: 86.5,
    status: 'approved',
    date: '2023-12-01',
    expiry: '2024-12-01',
    issuer: 'Coffee Quality Institute',
    batch: 'AR-2023-456'
  },
  {
    id: 'CERT-1002',
    name: 'Q-Grader Certification - Robusta',
    score: 78.2,
    status: 'approved',
    date: '2023-12-01',
    expiry: '2024-12-01',
    issuer: 'Coffee Quality Institute',
    batch: 'RB-2023-789'
  },
  {
    id: 'CERT-1003',
    name: 'Organic Certification',
    score: null,
    status: 'pending',
    date: '2023-12-10',
    expiry: 'N/A',
    issuer: 'USDA Organic',
    batch: 'Multiple'
  },
  {
    id: 'CERT-1004',
    name: 'Specialty Coffee Association Grade',
    score: 85.7,
    status: 'approved',
    date: '2023-11-15',
    expiry: '2024-11-15',
    issuer: 'SCA',
    batch: 'AR-2023-456'
  },
  {
    id: 'CERT-1005',
    name: 'Rainforest Alliance',
    score: null,
    status: 'pending',
    date: '2023-12-15',
    expiry: 'N/A',
    issuer: 'Rainforest Alliance',
    batch: 'Multiple'
  },
];

// Status colors
const statusColors = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  expired: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800"
};

const QualityCertification = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Quality Certification</h2>
          <p className="text-gray-500 text-sm">Manage coffee quality testing and certification</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Certification</span>
          </Button>
        </div>
      </div>
      
      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700">Arabica Score</p>
                <p className="text-2xl font-bold text-amber-900">86.5 / 100</p>
                <p className="text-xs text-amber-700">Specialty Grade</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Coffee className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700">Robusta Score</p>
                <p className="text-2xl font-bold text-green-900">78.2 / 100</p>
                <p className="text-xs text-green-700">Premium Grade</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Coffee className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Certifications</p>
                <p className="text-2xl font-bold text-blue-900">3 Active</p>
                <p className="text-xs text-blue-700">2 Pending</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Award className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quality Profile - Radar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-600" />
            <span>Coffee Quality Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={qualityScores}>
                <PolarGrid />
                <PolarAngleAxis dataKey="attribute" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar
                  name="Arabica"
                  dataKey="arabica"
                  stroke="#805AD5"
                  fill="#805AD5"
                  fillOpacity={0.2}
                />
                <Radar
                  name="Robusta"
                  dataKey="robusta"
                  stroke="#22C55E"
                  fill="#22C55E"
                  fillOpacity={0.2}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Quality Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Quality Score Trends (12 Months)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={qualityTrendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="arabica"
                  name="Arabica"
                  stroke="#805AD5"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="robusta"
                  name="Robusta"
                  stroke="#22C55E"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Certifications Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <span>Certification Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Cert ID</TableHead>
                  <TableHead>Certification</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.id}</TableCell>
                    <TableCell>
                      <div>{cert.name}</div>
                      <div className="text-xs text-gray-500">{cert.issuer}</div>
                    </TableCell>
                    <TableCell>{cert.batch}</TableCell>
                    <TableCell>
                      {cert.score ? (
                        <Badge className="bg-purple-100 text-purple-800">
                          {cert.score} / 100
                        </Badge>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{cert.date}</TableCell>
                    <TableCell>{cert.expiry}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[cert.status]}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <span>View</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityCertification;
