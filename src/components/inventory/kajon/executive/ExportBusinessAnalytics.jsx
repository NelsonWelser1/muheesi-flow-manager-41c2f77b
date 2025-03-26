
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  BarChart3,
  Plane,
  Ship,
  DollarSign,
  Calendar,
  BadgeCheck,
  Droplet,
  Users,
  Map,
  Flag,
  TrendingUp,
  Filter,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ExportBusinessAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  
  // Mock export business data - in a real implementation, this would come from a hook or API
  const mockExportData = [
    { country: 'Germany', volume: 18500, value: 126000, growth: 8.2 },
    { country: 'United States', volume: 12400, value: 89600, growth: 3.5 },
    { country: 'Japan', volume: 9800, value: 72500, growth: 5.1 },
    { country: 'UK', volume: 7200, value: 48600, growth: -2.3 },
    { country: 'Netherlands', volume: 6500, value: 42800, growth: 12.4 }
  ];
  
  const mockCertificationData = [
    { name: 'Fair Trade', markets: ['EU', 'US', 'Japan'], premium: '+ 15%', coverage: 85 },
    { name: 'Organic', markets: ['EU', 'US', 'Canada'], premium: '+ 22%', coverage: 65 },
    { name: 'Rainforest Alliance', markets: ['EU', 'UK', 'Australia'], premium: '+ 12%', coverage: 70 }
  ];
  
  const mockBuyerRelations = [
    { name: 'Coffee Importers GmbH', country: 'Germany', status: 'active', years: 5, volume: 8200 },
    { name: 'Bean Traders Inc', country: 'USA', status: 'active', years: 3, volume: 6400 },
    { name: 'Nippon Coffee Co', country: 'Japan', status: 'pending', years: 1, volume: 3800 },
    { name: 'UK Premium Roasters', country: 'UK', status: 'active', years: 4, volume: 4100 }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-600" />
              Export Business Analysis
            </CardTitle>
            <div className="flex space-x-2">
              <div className="flex space-x-1 items-center">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select 
                  className="text-sm border-0 bg-transparent focus:ring-0" 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="quarter">This Quarter</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="ytd">Year to Date</option>
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
              <TabsTrigger value="overview">Export Overview</TabsTrigger>
              <TabsTrigger value="markets">Global Markets</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="buyers">Buyer Relations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Total Export Volume</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-emerald-600">54,400</div>
                        <div className="ml-2 p-1 text-xs bg-emerald-100 text-emerald-800 rounded">kg</div>
                      </div>
                      <div className="flex justify-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                          <span className="text-gray-600">+5.8% YoY</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Export Revenue</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-emerald-600">$379,500</div>
                        <div className="ml-2 p-1 text-xs bg-emerald-100 text-emerald-800 rounded">USD</div>
                      </div>
                      <div className="flex justify-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                          <span className="text-gray-600">+12.3% YoY</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Active Export Markets</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-emerald-600">12</div>
                        <div className="ml-2 p-1 text-xs bg-emerald-100 text-emerald-800 rounded">Countries</div>
                      </div>
                      <div className="flex justify-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <Flag className="h-3 w-3 text-emerald-500 mr-1" />
                          <span className="text-gray-600">2 New in {new Date().getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Export Volume by Country</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockExportData.map((country, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">{country.country}</div>
                            <div className="text-sm text-gray-500">{country.volume.toLocaleString()} kg</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${country.growth > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                              style={{width: `${(country.volume / 20000) * 100}%`}}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 flex justify-between">
                            <span>Value: ${country.value.toLocaleString()}</span>
                            <span className={country.growth > 0 ? 'text-emerald-600' : 'text-amber-600'}>
                              {country.growth > 0 ? '+' : ''}{country.growth}% YoY
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Export Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Coffee Type</div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm">
                                <span>Arabica</span>
                                <span>68%</span>
                              </div>
                              <Progress value={68} className="h-1.5" />
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm">
                                <span>Robusta</span>
                                <span>32%</span>
                              </div>
                              <Progress value={32} className="h-1.5" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Quality Grade</div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm">
                                <span>Premium</span>
                                <span>42%</span>
                              </div>
                              <Progress value={42} className="h-1.5" />
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm">
                                <span>Standard</span>
                                <span>58%</span>
                              </div>
                              <Progress value={58} className="h-1.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Transport Method</div>
                        <div className="flex items-center">
                          <Ship className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>Sea Freight</span>
                              <span>86%</span>
                            </div>
                            <Progress value={86} className="h-1.5" />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Plane className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>Air Freight</span>
                              <span>14%</span>
                            </div>
                            <Progress value={14} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Market Intelligence</CardTitle>
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
                          <h3 className="font-medium text-blue-800 mb-1">AI-Driven Market Analysis</h3>
                          <p className="text-sm text-blue-700">
                            Market analysis indicates growing demand for specialty grade Arabica in 
                            Northern European markets. There's a 22% premium available for organic 
                            certified beans with traceable origin. Consider expanding organic certification 
                            to capture this premium segment.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h3 className="font-medium text-green-800 mb-1">Growth Opportunities</h3>
                        <ul className="text-sm text-green-700 space-y-1 list-disc pl-4">
                          <li>Specialty coffee demand in Asian markets growing at 15% annually</li>
                          <li>Direct-to-roaster relationships yielding 8-12% higher margins</li>
                          <li>New opportunities in Canadian market with FTA benefits</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <h3 className="font-medium text-amber-800 mb-1">Market Challenges</h3>
                        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                          <li>European import regulations tightening for pesticide residues</li>
                          <li>Increasing competition from Colombian suppliers in US market</li>
                          <li>Shipping costs increased 14% due to global logistics challenges</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="markets" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Europe', 'North America', 'Asia'].map((region, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold">{region}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-gray-50 rounded border text-center">
                          <div className="text-xs text-gray-500">Volume</div>
                          <div className="font-medium">
                            {index === 0 ? '32,200' : index === 1 ? '12,400' : '9,800'} kg
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border text-center">
                          <div className="text-xs text-gray-500">Growth</div>
                          <div className={`font-medium ${index === 0 ? 'text-emerald-600' : index === 1 ? 'text-emerald-600' : 'text-emerald-600'}`}>
                            {index === 0 ? '+7.2%' : index === 1 ? '+3.5%' : '+9.1%'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="text-xs font-medium mb-1">Top Markets</div>
                        <div className="flex flex-wrap gap-1">
                          {(index === 0 ? ['Germany', 'Netherlands', 'UK', 'Italy'] : 
                            index === 1 ? ['USA', 'Canada'] : 
                            ['Japan', 'S. Korea', 'China']).map((country, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-50">
                              {country}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Global Market Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-md h-80 flex items-center justify-center border">
                    <div className="text-center p-6">
                      <Map className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">Interactive Market Map</h3>
                      <p className="text-gray-500 max-w-md">
                        Visual representation of KAJON coffee exports across global markets with 
                        volume indicators and year-over-year trends.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Market Pricing Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-emerald-600" />
                          <span className="font-medium">Average Export Price</span>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">$6.97/kg</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm">Arabica Premium</div>
                            <div className="text-sm text-gray-500">$8.12/kg</div>
                          </div>
                          <Progress value={81.2} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm">Arabica Standard</div>
                            <div className="text-sm text-gray-500">$7.25/kg</div>
                          </div>
                          <Progress value={72.5} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm">Robusta Premium</div>
                            <div className="text-sm text-gray-500">$6.35/kg</div>
                          </div>
                          <Progress value={63.5} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <div className="text-sm">Robusta Standard</div>
                            <div className="text-sm text-gray-500">$5.80/kg</div>
                          </div>
                          <Progress value={58.0} className="h-1.5" />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Price Trend Analysis</span>
                        </div>
                        <p className="text-xs text-blue-700">
                          Overall export prices have increased by 5.8% compared to last year, with premium 
                          Arabica showing the highest growth at 9.2%. The price premium for certified organic 
                          beans has widened to 22% above conventional prices.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Market Entry Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                              <Globe className="h-4 w-4 text-blue-700" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Target Growth Markets</h3>
                            <p className="text-sm text-blue-700">
                              Market analysis suggests focusing expansion efforts on South Korea, Canada, 
                              and Germany's specialty coffee segment. These markets show strong growth in 
                              premium coffee consumption and favorable pricing conditions.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { market: 'South Korea', status: 'Prospecting', potential: 'High', approach: 'Trade show participation in Seoul, Q3 2024' },
                          { market: 'Canada', status: 'Market Entry', potential: 'Medium', approach: 'Direct outreach to selected specialty roasters' },
                          { market: 'Germany', status: 'Growth', potential: 'High', approach: 'Expand existing buyer relationships, focus on organic' }
                        ].map((item, index) => (
                          <div key={index} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-medium">{item.market}</div>
                              <Badge className={`${
                                item.potential === 'High' ? 'bg-emerald-100 text-emerald-800' : 
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {item.potential} Potential
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">Status: {item.status}</div>
                            <div className="text-xs text-gray-600">{item.approach}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="certifications" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockCertificationData.map((cert, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <BadgeCheck className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold">{cert.name}</h3>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Coverage</span>
                          <span className="font-medium">{cert.coverage}%</span>
                        </div>
                        <Progress value={cert.coverage} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-gray-50 rounded border text-center">
                          <div className="text-xs text-gray-500">Premium</div>
                          <div className="font-medium text-emerald-600">{cert.premium}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border text-center">
                          <div className="text-xs text-gray-500">Key Markets</div>
                          <div className="text-xs font-medium mt-1">
                            {cert.markets.join(', ')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Certification Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplet className="h-4 w-4 text-blue-600" />
                          <h3 className="font-medium">Organic Certification</h3>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Requires 3-year transition period with documentation of no prohibited substances, 
                          implementation of soil management practices, and annual on-site inspections.
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-1.5 bg-gray-50 rounded text-center">
                            <div className="text-gray-500">Cost</div>
                            <div className="font-medium">$5,800/year</div>
                          </div>
                          <div className="p-1.5 bg-gray-50 rounded text-center">
                            <div className="text-gray-500">Renewal</div>
                            <div className="font-medium">Annual</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-amber-600" />
                          <h3 className="font-medium">Fair Trade Certification</h3>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Focuses on fair prices, direct trade, community development, and environmental 
                          sustainability. Requires transparent record-keeping and pricing structures.
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-1.5 bg-gray-50 rounded text-center">
                            <div className="text-gray-500">Cost</div>
                            <div className="font-medium">$4,200/year</div>
                          </div>
                          <div className="p-1.5 bg-gray-50 rounded text-center">
                            <div className="text-gray-500">Renewal</div>
                            <div className="font-medium">Annual</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Certification Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                              <BadgeCheck className="h-4 w-4 text-blue-700" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Strategic Recommendation</h3>
                            <p className="text-sm text-blue-700">
                              Our analysis shows organic certification offers the highest ROI with a 22% 
                              premium in target markets. Prioritize expanding organic certification to 
                              Buremba and Kanoni-Rwakahaya regions which already have low chemical usage 
                              and could achieve certification within 12-18 months.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="font-medium mb-1">Return on Investment Analysis</div>
                        <div className="text-sm text-gray-600 mb-3">
                          Average certification cost per kg: $0.42/kg<br />
                          Average price premium: $1.52/kg<br />
                          Net benefit: $1.10/kg (262% ROI)
                        </div>
                        <div className="text-xs text-gray-500">
                          Implementation timeline: 12-18 months for new regions
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="font-medium mb-1">Certification Expansion Plan</div>
                        <div className="text-sm text-gray-600">
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span>Q1 2024: Buremba region assessment</span>
                              <Badge variant="outline">Planned</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Q2 2024: Kanoni-Rwakahaya documentation</span>
                              <Badge variant="outline">Planned</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Q3 2024: Initial inspection scheduling</span>
                              <Badge variant="outline">Pending</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="buyers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockBuyerRelations.slice(0, 2).map((buyer, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-emerald-600" />
                            <h3 className="font-semibold">{buyer.name}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{buyer.country} • {buyer.years} years relationship</p>
                        </div>
                        <Badge className={`${
                          buyer.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-gray-50 rounded border text-center">
                          <div className="text-xs text-gray-500">Annual Volume</div>
                          <div className="font-medium">{buyer.volume.toLocaleString()} kg</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border text-center">
                          <div className="text-xs text-gray-500">Preferred Product</div>
                          <div className="font-medium">{index === 0 ? 'Arabica Premium' : 'Arabica Organic'}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm">
                        <div className="font-medium mb-1">Recent Activity</div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Last Order: {index === 0 ? 'Jan 12, 2024' : 'Dec 28, 2023'}</span>
                            <span>{index === 0 ? '2,400 kg' : '1,850 kg'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Next Order (Est.): {index === 0 ? 'Mar 15, 2024' : 'Feb 22, 2024'}</span>
                            <span>{index === 0 ? '~2,500 kg' : '~2,000 kg'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Buyer Relationships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-3">Buyer</th>
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3">Relationship</th>
                          <th className="px-4 py-3">Annual Volume</th>
                          <th className="px-4 py-3">Preferred Products</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBuyerRelations.map((buyer, index) => (
                          <tr key={index} className="bg-white border-b">
                            <td className="px-4 py-3 font-medium">{buyer.name}</td>
                            <td className="px-4 py-3">{buyer.country}</td>
                            <td className="px-4 py-3">{buyer.years} years</td>
                            <td className="px-4 py-3">{buyer.volume.toLocaleString()} kg</td>
                            <td className="px-4 py-3">
                              {index === 0 ? 'Arabica Premium' : 
                               index === 1 ? 'Arabica Organic' :
                               index === 2 ? 'Robusta Premium' : 'Mixed Grades'}
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={`${buyer.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Export Contract Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-green-50 rounded-md border border-green-100">
                          <div className="text-sm text-green-700 font-medium">Completed</div>
                          <div className="text-xl font-bold text-green-800">12</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-md border border-blue-100">
                          <div className="text-sm text-blue-700 font-medium">Active</div>
                          <div className="text-xl font-bold text-blue-800">8</div>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-md border border-amber-100">
                          <div className="text-sm text-amber-700 font-medium">Pending</div>
                          <div className="text-xl font-bold text-amber-800">4</div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="font-medium mb-1">Delivery Performance</div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>On-time Delivery</span>
                              <span>94%</span>
                            </div>
                            <Progress value={94} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Quality Compliance</span>
                              <span>98%</span>
                            </div>
                            <Progress value={98} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Documentation Accuracy</span>
                              <span>96%</span>
                            </div>
                            <Progress value={96} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="font-medium mb-1">Upcoming Contract Deadlines</div>
                        <div className="space-y-2 text-sm">
                          {[
                            { buyer: 'Coffee Importers GmbH', deadline: 'Feb 28, 2024', volume: '3,000 kg', status: 'Processing' },
                            { buyer: 'Bean Traders Inc', deadline: 'Mar 15, 2024', volume: '2,500 kg', status: 'Confirmed' }
                          ].map((contract, index) => (
                            <div key={index} className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
                              <div className="text-xs">
                                <div className="font-medium">{contract.buyer}</div>
                                <div className="text-gray-500">{contract.deadline} • {contract.volume}</div>
                              </div>
                              <Badge className={`${contract.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {contract.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Buyer Acquisition Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-700" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-800 mb-1">Relationship Development</h3>
                            <p className="text-sm text-blue-700">
                              Direct relationship building with specialty roasters is showing 18% higher 
                              profit margins compared to traditional export channels. Focus on building 
                              relationships with 3-5 new specialty roasters per year in premium markets.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="font-medium mb-1">Trade Show Calendar</div>
                        <div className="space-y-2 text-sm">
                          {[
                            { event: 'Specialty Coffee Expo', location: 'Chicago, USA', date: 'Apr 12-15, 2024', status: 'Confirmed' },
                            { event: 'World of Coffee', location: 'Copenhagen, Denmark', date: 'Jun 27-29, 2024', status: 'Planning' },
                            { event: 'Seoul Coffee Show', location: 'Seoul, S. Korea', date: 'Nov 7-10, 2024', status: 'Considering' }
                          ].map((event, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="text-xs">
                                <div className="font-medium">{event.event}</div>
                                <div className="text-gray-500">{event.location} • {event.date}</div>
                              </div>
                              <Badge variant="outline" className={`${
                                event.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                event.status === 'Planning' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'
                              }`}>
                                {event.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="font-medium mb-1">Prospect Pipeline</div>
                        <div className="space-y-2 text-sm">
                          {[
                            { name: 'Nordic Roasters Group', country: 'Sweden', stage: 'Initial Contact', potential: 'High' },
                            { name: 'Pacific Northwest Coffee', country: 'USA', stage: 'Sample Requested', potential: 'Medium' },
                            { name: 'Artisan Coffee House', country: 'Australia', stage: 'Negotiation', potential: 'High' }
                          ].map((prospect, index) => (
                            <div key={index} className="flex justify-between items-center p-1.5 bg-gray-50 rounded">
                              <div className="text-xs">
                                <div className="font-medium">{prospect.name}</div>
                                <div className="text-gray-500">{prospect.country} • {prospect.stage}</div>
                              </div>
                              <Badge className={`${prospect.potential === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {prospect.potential}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportBusinessAnalytics;
