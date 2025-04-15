
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data
const mockProductionData = [
  { month: 'Jan', bananas: 120, coffee: 45, maize: 0, beans: 0 },
  { month: 'Feb', bananas: 130, coffee: 50, maize: 0, beans: 0 },
  { month: 'Mar', bananas: 125, coffee: 55, maize: 20, beans: 0 },
  { month: 'Apr', bananas: 140, coffee: 60, maize: 60, beans: 15 },
  { month: 'May', bananas: 150, coffee: 65, maize: 100, beans: 35 },
  { month: 'Jun', bananas: 155, coffee: 70, maize: 150, beans: 45 },
  { month: 'Jul', bananas: 160, coffee: 75, maize: 120, beans: 50 },
  { month: 'Aug', bananas: 170, coffee: 80, maize: 80, beans: 40 },
  { month: 'Sep', bananas: 175, coffee: 85, maize: 30, beans: 20 },
  { month: 'Oct', bananas: 180, coffee: 90, maize: 0, beans: 5 },
  { month: 'Nov', bananas: 185, coffee: 95, maize: 0, beans: 0 },
  { month: 'Dec', bananas: 190, coffee: 100, maize: 0, beans: 0 },
];

const mockYieldData = [
  { year: '2022', bananas: 1600, coffee: 800, maize: 950, beans: 400 },
  { year: '2023', bananas: 1750, coffee: 850, maize: 1000, beans: 450 },
  { year: '2024', bananas: 1900, coffee: 900, maize: 1050, beans: 470 },
  { year: '2025', bananas: 2050, coffee: 950, maize: 1100, beans: 490, projected: true },
];

const mockRevenueData = [
  { year: '2022', bananas: 12000000, coffee: 15000000, maize: 3500000, beans: 2500000 },
  { year: '2023', bananas: 13000000, coffee: 16000000, maize: 3800000, beans: 2700000 },
  { year: '2024', bananas: 14000000, coffee: 17000000, maize: 4100000, beans: 2900000 },
  { year: '2025', bananas: 15000000, coffee: 18000000, maize: 4400000, beans: 3100000, projected: true },
];

const mockDistributionData = [
  { name: 'Bananas', value: 40 },
  { name: 'Coffee', value: 30 },
  { name: 'Maize', value: 20 },
  { name: 'Beans', value: 10 },
];

const COLORS = ['#00C49F', '#694eda', '#FFC107', '#FF8042'];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const GrowthAnalytics = () => {
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [activeTab, setActiveTab] = useState('production');

  const getFilteredData = (dataArray, year) => {
    if (selectedCrop === 'all') {
      return dataArray;
    }
    
    // When a specific crop is selected, transform the data to only include that crop
    return dataArray.map(item => {
      const filteredItem = { month: item.month, year: item.year };
      filteredItem[selectedCrop] = item[selectedCrop];
      return filteredItem;
    });
  };

  const getFormattedYieldLabel = (value) => {
    return `${value} kg`;
  };

  const getFormattedCurrencyLabel = (value) => {
    return formatCurrency(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Growth Analytics</CardTitle>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select
            value={selectedCrop}
            onValueChange={setSelectedCrop}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="bananas">Bananas</SelectItem>
              <SelectItem value="coffee">Coffee</SelectItem>
              <SelectItem value="maize">Maize</SelectItem>
              <SelectItem value="beans">Beans</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025 (Projected)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="production">Monthly Production</TabsTrigger>
            <TabsTrigger value="yield">Annual Yield</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="production" className="space-y-4">
            <div className="bg-background p-4 rounded-md border">
              <h3 className="text-lg font-medium mb-4">Monthly Production (2024)</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getFilteredData(mockProductionData)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Harvest (tons)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} tons`, '']} />
                    <Legend />
                    {selectedCrop === 'all' || selectedCrop === 'bananas' ? <Bar dataKey="bananas" name="Bananas" fill="#00C49F" /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'coffee' ? <Bar dataKey="coffee" name="Coffee" fill="#694eda" /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'maize' ? <Bar dataKey="maize" name="Maize" fill="#FFC107" /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'beans' ? <Bar dataKey="beans" name="Beans" fill="#FF8042" /> : null}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="yield" className="space-y-4">
            <div className="bg-background p-4 rounded-md border">
              <h3 className="text-lg font-medium mb-4">Annual Yield Comparison</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={mockYieldData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Yield (kg)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={getFormattedYieldLabel} />
                    <Legend />
                    {selectedCrop === 'all' || selectedCrop === 'bananas' ? <Line type="monotone" dataKey="bananas" name="Bananas" stroke="#00C49F" activeDot={{ r: 8 }} /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'coffee' ? <Line type="monotone" dataKey="coffee" name="Coffee" stroke="#694eda" /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'maize' ? <Line type="monotone" dataKey="maize" name="Maize" stroke="#FFC107" /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'beans' ? <Line type="monotone" dataKey="beans" name="Beans" stroke="#FF8042" /> : null}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-md border">
                <h3 className="text-lg font-medium mb-4">Crop Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-background p-4 rounded-md border">
                <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm text-muted-foreground">Total Production (2024)</div>
                      <div className="text-xl font-semibold">4,250 kg</div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm text-muted-foreground">Growth from 2023</div>
                      <div className="text-xl font-semibold text-green-600">+12.5%</div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm text-muted-foreground">Avg. Yield per Acre</div>
                      <div className="text-xl font-semibold">850 kg</div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm text-muted-foreground">Projected 2025 Growth</div>
                      <div className="text-xl font-semibold text-green-600">+8.2%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <div className="bg-background p-4 rounded-md border">
              <h3 className="text-lg font-medium mb-4">Revenue by Crop</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockRevenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={getFormattedCurrencyLabel} />
                    <Legend />
                    {selectedCrop === 'all' || selectedCrop === 'bananas' ? <Bar dataKey="bananas" name="Bananas" fill="#00C49F" /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'coffee' ? <Bar dataKey="coffee" name="Coffee" fill="#694eda" /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'maize' ? <Bar dataKey="maize" name="Maize" fill="#FFC107" /> : null}
                    {selectedCrop === 'all' || selectedCrop === 'beans' ? <Bar dataKey="beans" name="Beans" fill="#FF8042" /> : null}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-md border">
                <h3 className="text-lg font-medium mb-4">Revenue Metrics</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm text-muted-foreground">Total Revenue (2024)</div>
                      <div className="text-xl font-semibold">{formatCurrency(38000000)}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm text-muted-foreground">Revenue Growth (2023-2024)</div>
                      <div className="text-xl font-semibold text-green-600">+8.3%</div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm text-muted-foreground">Projected Revenue (2025)</div>
                      <div className="text-xl font-semibold">{formatCurrency(40500000)}</div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm text-muted-foreground">Profit Margin (2024)</div>
                      <div className="text-xl font-semibold">42%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-background p-4 rounded-md border">
                <h3 className="text-lg font-medium mb-4">Top Performing Crops</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <div className="font-medium">Coffee</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(17000000)}</div>
                    </div>
                    <div className="text-green-600">+6.3%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <div className="font-medium">Bananas</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(14000000)}</div>
                    </div>
                    <div className="text-green-600">+7.7%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <div className="font-medium">Maize</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(4100000)}</div>
                    </div>
                    <div className="text-green-600">+7.9%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <div className="font-medium">Beans</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(2900000)}</div>
                    </div>
                    <div className="text-green-600">+7.4%</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GrowthAnalytics;
