
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CupSoda,
  BarChart3,
  Award,
  FileCheck,
  Coffee,
  CalendarDays,
  Filter,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculateTotalInventoryValue, getCoffeeInventorySummary } from '@/utils/coffee/coffeeAnalytics';

const QualityManagement = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  
  // Mock quality data - in a real implementation, this would come from a hook or API
  const mockGradeData = [
    { grade: 'AA', percentage: 32, cupping: 88, color: 'bg-emerald-500' },
    { grade: 'A', percentage: 45, cupping: 82, color: 'bg-green-500' },
    { grade: 'B', percentage: 18, cupping: 74, color: 'bg-amber-500' },
    { grade: 'C', percentage: 5, cupping: 65, color: 'bg-red-500' }
  ];
  
  const mockCertificationData = [
    { name: 'Organic', status: 'certified', expiryDate: '2025-01-15', coverage: 92 },
    { name: 'Fair Trade', status: 'certified', expiryDate: '2024-12-05', coverage: 87 },
    { name: 'Rainforest Alliance', status: 'pending', expiryDate: '2024-10-22', coverage: 63 },
    { name: 'UTZ', status: 'expired', expiryDate: '2023-11-30', coverage: 0 }
  ];

  const mockQualityTrends = [
    { month: 'Aug', cupping: 78, moisture: 11.2, defects: 12 },
    { month: 'Sep', cupping: 80, moisture: 11.0, defects: 9 },
    { month: 'Oct', cupping: 79, moisture: 11.5, defects: 10 },
    { month: 'Nov', cupping: 82, moisture: 10.8, defects: 7 },
    { month: 'Dec', cupping: 84, moisture: 10.5, defects: 5 },
    { month: 'Jan', cupping: 85, moisture: 10.2, defects: 4 }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <CupSoda className="h-5 w-5 text-amber-600" />
              Coffee Quality Management
            </CardTitle>
            <div className="flex space-x-2">
              <div className="flex space-x-1 items-center">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <select 
                  className="text-sm border-0 bg-transparent focus:ring-0" 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overall Quality</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="grading">Coffee Grading</TabsTrigger>
              <TabsTrigger value="trends">Quality Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Average Cupping Score</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-amber-700">82.6</div>
                        <div className="ml-2 p-1 text-xs bg-green-100 text-green-800 rounded">+2.1</div>
                      </div>
                      <div className="h-2 w-2/3 mx-auto bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{width: '82.6%'}}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Last updated 2 days ago</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Quality Compliance Rate</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-green-600">94%</div>
                        <div className="ml-2 p-1 text-xs bg-green-100 text-green-800 rounded">+3%</div>
                      </div>
                      <div className="h-2 w-2/3 mx-auto bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{width: '94%'}}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Last updated yesterday</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Defect Rate</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-gray-700">3.2%</div>
                        <div className="ml-2 p-1 text-xs bg-green-100 text-green-800 rounded">-1.1%</div>
                      </div>
                      <div className="h-2 w-2/3 mx-auto bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{width: '3.2%'}}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Last updated 3 days ago</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Quality Distribution by Coffee Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Arabica</div>
                          <div className="text-sm text-gray-500">Avg. Score: 86.5</div>
                        </div>
                        <Progress value={86.5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Robusta</div>
                          <div className="text-sm text-gray-500">Avg. Score: 79.8</div>
                        </div>
                        <Progress value={79.8} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Specialty Blends</div>
                          <div className="text-sm text-gray-500">Avg. Score: 88.2</div>
                        </div>
                        <Progress value={88.2} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Latest Quality Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { batch: 'BAT-18943', date: '2024-01-18', score: 84, location: 'Kanoni-Mbogo' },
                        { batch: 'BAT-18925', date: '2024-01-15', score: 79, location: 'Buremba' },
                        { batch: 'BAT-18901', date: '2024-01-12', score: 88, location: 'Engari-Kaichumu' }
                      ].map((assessment, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
                          <div>
                            <div className="font-medium">{assessment.batch}</div>
                            <div className="text-xs text-gray-500">{assessment.location} • {assessment.date}</div>
                          </div>
                          <Badge className={`${assessment.score >= 85 ? 'bg-green-100 text-green-800' : assessment.score >= 80 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                            {assessment.score} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="certifications" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCertificationData.map((cert, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold">{cert.name}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <Badge className={`${
                          cert.status === 'certified' ? 'bg-green-100 text-green-800' : 
                          cert.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Coverage</span>
                          <span className="font-medium">{cert.coverage}%</span>
                        </div>
                        <Progress value={cert.coverage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Certification Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <FileCheck className="h-5 w-5 text-green-600" />
                          <h3 className="font-medium">Document Compliance</h3>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-green-700">96%</span>
                          <span className="text-sm text-green-600 mb-1">Complete</span>
                        </div>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarDays className="h-5 w-5 text-amber-600" />
                          <h3 className="font-medium">Renewal Status</h3>
                        </div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-amber-700">2</span>
                          <span className="text-sm text-amber-600 mb-1">Pending Renewals</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium mb-2 text-blue-800">AI Recommendation</h3>
                      <p className="text-sm text-blue-700">
                        Schedule renewal process for Rainforest Alliance certification which expires in 9 months. 
                        Processing typically takes 3-4 months for complete approval.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="grading" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Coffee Grade Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-2">
                      {mockGradeData.map((grade, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${grade.color} mr-2`}></div>
                              <span className="font-medium">Grade {grade.grade}</span>
                            </div>
                            <div className="text-sm">{grade.percentage}%</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${grade.color}`} style={{width: `${grade.percentage}%`}}></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">Avg. Cupping Score: {grade.cupping}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Quality Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Moisture Content</div>
                          <div className="text-sm">10.8%</div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{width: '45%'}}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Target: 10-12%</span>
                          <span>Status: Optimal</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Defect Count</div>
                          <div className="text-sm">5 per 300g</div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{width: '25%'}}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Target: &lt;15 per 300g</span>
                          <span>Status: Excellent</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Screen Size</div>
                          <div className="text-sm">16+</div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{width: '80%'}}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Target: 15-18</span>
                          <span>Status: Good</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Batch Quality Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-3">Batch ID</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Grade</th>
                          <th className="px-4 py-3">Cupping</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'BAT-19023', location: 'Kazo-Kanoni', type: 'Arabica', grade: 'AA', cupping: 87, status: 'Approved' },
                          { id: 'BAT-19019', location: 'Buremba', type: 'Robusta', grade: 'A', cupping: 80, status: 'Approved' },
                          { id: 'BAT-19015', location: 'Nkungu', type: 'Arabica', grade: 'B', cupping: 75, status: 'Pending' },
                          { id: 'BAT-19010', location: 'Engari', type: 'Robusta', grade: 'A', cupping: 79, status: 'Approved' }
                        ].map((batch, index) => (
                          <tr key={index} className="bg-white border-b">
                            <td className="px-4 py-3 font-medium">{batch.id}</td>
                            <td className="px-4 py-3">{batch.location}</td>
                            <td className="px-4 py-3">{batch.type}</td>
                            <td className="px-4 py-3">{batch.grade}</td>
                            <td className="px-4 py-3">{batch.cupping}</td>
                            <td className="px-4 py-3">
                              <Badge className={batch.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                                {batch.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Cupping Score Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-full h-full flex flex-col justify-end">
                        <div className="flex h-full items-end space-x-2">
                          {mockQualityTrends.map((month, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-amber-500 rounded-t" style={{height: `${month.cupping}%`}}></div>
                              <div className="text-xs mt-1">{month.month}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Defect Rate Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-full h-full flex flex-col justify-end">
                        <div className="flex h-full items-end space-x-2">
                          {mockQualityTrends.map((month, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-red-500 rounded-t" style={{height: `${month.defects * 5}%`}}></div>
                              <div className="text-xs mt-1">{month.month}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Quality Improvement Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-blue-700" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-800 mb-1">AI-Driven Quality Analysis</h3>
                          <p className="text-sm text-blue-700">
                            Our data indicates a strong correlation between processing time after harvest 
                            and resulting cupping scores. Reducing initial processing time by 20% could 
                            improve quality scores by approximately 3-5 points.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h3 className="font-medium text-green-800 mb-1">Short-term Action Items</h3>
                        <ul className="text-sm text-green-700 space-y-1 list-disc pl-4">
                          <li>Increase field inspections at Buremba and Nkungu locations</li>
                          <li>Adjust moisture monitoring protocols for Robusta processing</li>
                          <li>Schedule additional quality control training for sorting staff</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <h3 className="font-medium text-amber-800 mb-1">Long-term Strategies</h3>
                        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                          <li>Implement improved drying techniques for AA grade coffee</li>
                          <li>Develop additional quality metrics for premium market segments</li>
                          <li>Expand certification compliance to 100% of production facilities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityManagement;
