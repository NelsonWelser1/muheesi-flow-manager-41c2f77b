
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from "@/hooks/useTheme";

// Sample data
const sampleQualityMetrics = [
  { date: '2025-01-01', avgQuality: 91.2, volume: 210, ph: 6.8, temperature: 4.1, fat: 3.8, protein: 3.2 },
  { date: '2025-01-02', avgQuality: 90.8, volume: 205, ph: 6.7, temperature: 4.2, fat: 3.7, protein: 3.3 },
  { date: '2025-01-03', avgQuality: 92.1, volume: 215, ph: 6.9, temperature: 4.0, fat: 3.9, protein: 3.4 },
  { date: '2025-01-04', avgQuality: 89.5, volume: 200, ph: 6.6, temperature: 4.3, fat: 3.6, protein: 3.1 },
  { date: '2025-01-05', avgQuality: 93.2, volume: 220, ph: 6.8, temperature: 4.1, fat: 4.0, protein: 3.3 },
  { date: '2025-01-06', avgQuality: 92.8, volume: 218, ph: 6.7, temperature: 4.2, fat: 3.9, protein: 3.2 },
  { date: '2025-01-07', avgQuality: 91.5, volume: 212, ph: 6.8, temperature: 4.0, fat: 3.8, protein: 3.3 }
];

const QualityMetricsCard = ({ qualityMetrics = sampleQualityMetrics }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Format dates in the metrics
  const formattedMetrics = qualityMetrics.map(metric => ({
    ...metric,
    dateFormatted: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const recentQuality = formattedMetrics.length > 0 ? formattedMetrics[formattedMetrics.length - 1].avgQuality : 0;

  // Function to determine quality status
  const getQualityStatus = (score) => {
    if (score >= 90) return { status: 'Excellent', color: 'text-green-500' };
    if (score >= 80) return { status: 'Good', color: 'text-blue-500' };
    if (score >= 70) return { status: 'Average', color: 'text-yellow-500' };
    return { status: 'Needs Improvement', color: 'text-red-500' };
  };

  const qualityStatus = getQualityStatus(recentQuality);

  // Quality metrics
  const phValue = formattedMetrics.length > 0 ? formattedMetrics[formattedMetrics.length - 1].ph : 0;
  const tempValue = formattedMetrics.length > 0 ? formattedMetrics[formattedMetrics.length - 1].temperature : 0;
  const fatValue = formattedMetrics.length > 0 ? formattedMetrics[formattedMetrics.length - 1].fat : 0;
  const proteinValue = formattedMetrics.length > 0 ? formattedMetrics[formattedMetrics.length - 1].protein : 0;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(entry.name === 'Quality Score' ? 1 : 1)}
              {entry.name === 'Quality Score' ? '%' : entry.name === 'Volume (L)' ? 'L' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quality Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={formattedMetrics}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dateFormatted" 
                    tick={{ fill: isDark ? "#9CA3AF" : "#4B5563" }}
                    stroke={isDark ? "#4B5563" : "#9CA3AF"}
                  />
                  <YAxis 
                    yAxisId="left" 
                    tick={{ fill: isDark ? "#9CA3AF" : "#4B5563" }} 
                    stroke={isDark ? "#4B5563" : "#9CA3AF"}
                    domain={[0, 100]}
                    label={{ value: 'Quality %', angle: -90, position: 'insideLeft', style: { fill: isDark ? "#9CA3AF" : "#4B5563" } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="avgQuality" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorQuality)" 
                    yAxisId="left"
                    name="Quality Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'pH Level', value: phValue, target: 6.8, min: 6.4, max: 7.0 },
                    { name: 'Temp (°C)', value: tempValue, target: 4.0, min: 2.0, max: 6.0 },
                    { name: 'Fat (%)', value: fatValue, target: 3.8, min: 3.5, max: 4.5 },
                    { name: 'Protein (%)', value: proteinValue, target: 3.3, min: 3.0, max: 3.6 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 'dataMax + 2']} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Actual" fill="#8884d8" />
                  <Bar dataKey="target" name="Target" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Quality Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h3 className={`text-2xl font-bold ${qualityStatus.color}`}>
                {recentQuality.toFixed(1)}%
              </h3>
              <p className={`${qualityStatus.color} font-medium`}>
                {qualityStatus.status}
              </p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-muted-foreground">
                {formattedMetrics.length > 0 
                  ? new Date(formattedMetrics[formattedMetrics.length - 1].date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) 
                  : 'No data'
                }
              </p>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            {formattedMetrics.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">pH Level</p>
                    <p className="font-medium">{phValue.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="font-medium">{tempValue.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fat Content</p>
                    <p className="font-medium">{fatValue.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Protein Content</p>
                    <p className="font-medium">{proteinValue.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quality Trend</p>
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formattedMetrics}>
                        <Line 
                          type="monotone" 
                          dataKey="avgQuality" 
                          stroke="#8884d8" 
                          dot={false}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">No quality data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityMetricsCard;
