
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FileText, ClipboardList, Truck, Receipt, Package, 
  FileCheck, ArrowUp, ArrowDown, DollarSign 
} from 'lucide-react';

// Sample data for the dashboard
const orderStats = [
  {
    title: "Quotations",
    icon: <FileText className="h-5 w-5 text-blue-600" />,
    count: 24,
    trend: "up",
    percentage: 12,
    bgColor: "bg-blue-50"
  },
  {
    title: "Orders",
    icon: <ClipboardList className="h-5 w-5 text-purple-600" />,
    count: 18,
    trend: "up",
    percentage: 8,
    bgColor: "bg-purple-50"
  },
  {
    title: "Deliveries",
    icon: <Truck className="h-5 w-5 text-green-600" />,
    count: 16,
    trend: "up",
    percentage: 5,
    bgColor: "bg-green-50"
  },
  {
    title: "Invoices",
    icon: <Receipt className="h-5 w-5 text-amber-600" />,
    count: 14,
    trend: "down",
    percentage: 3,
    bgColor: "bg-amber-50"
  }
];

// Monthly data for charts
const monthlyData = [
  { month: 'Jan', quotations: 12, orders: 10, deliveries: 8, invoices: 7 },
  { month: 'Feb', quotations: 19, orders: 15, deliveries: 12, invoices: 11 },
  { month: 'Mar', quotations: 15, orders: 13, deliveries: 10, invoices: 9 },
  { month: 'Apr', quotations: 18, orders: 14, deliveries: 12, invoices: 10 },
  { month: 'May', quotations: 21, orders: 17, deliveries: 14, invoices: 12 },
  { month: 'Jun', quotations: 25, orders: 20, deliveries: 18, invoices: 16 },
  { month: 'Jul', quotations: 22, orders: 18, deliveries: 15, invoices: 14 },
  { month: 'Aug', quotations: 28, orders: 23, deliveries: 19, invoices: 17 },
  { month: 'Sep', quotations: 30, orders: 25, deliveries: 22, invoices: 20 },
  { month: 'Oct', quotations: 26, orders: 22, deliveries: 20, invoices: 18 },
  { month: 'Nov', quotations: 32, orders: 27, deliveries: 24, invoices: 22 },
  { month: 'Dec', quotations: 35, orders: 30, deliveries: 26, invoices: 24 },
];

// Performance comparison data
const yearlyComparison = [
  { name: 'Q1', current: 46, previous: 38 },
  { name: 'Q2', current: 64, previous: 52 },
  { name: 'Q3', current: 80, previous: 65 },
  { name: 'Q4', current: 97, previous: 82 },
];

const OrderDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Key Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStats.map((stat, index) => (
          <Card key={index} className={stat.bgColor}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <div className="flex items-center mt-1 text-sm">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {stat.percentage}% {stat.trend === 'up' ? 'increase' : 'decrease'}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-white">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="quotations" 
                  name="Quotations" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  name="Orders" 
                  stroke="#8b5cf6" 
                />
                <Line 
                  type="monotone" 
                  dataKey="deliveries" 
                  name="Deliveries" 
                  stroke="#22c55e" 
                />
                <Line 
                  type="monotone" 
                  dataKey="invoices" 
                  name="Invoices" 
                  stroke="#f59e0b" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Yearly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Year-to-Year Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" name="Current Year" fill="#3b82f6" />
                <Bar dataKey="previous" name="Previous Year" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "Quotation #QT-2024-042 created", time: "Today, 10:30 AM", type: "quotation" },
              { title: "Order #ORD-2024-037 confirmed", time: "Yesterday, 3:45 PM", type: "order" },
              { title: "Delivery Note #DN-2024-021 issued", time: "May 15, 2024, 9:15 AM", type: "delivery" },
              { title: "Invoice #INV-2024-053 paid", time: "May 14, 2024, 2:20 PM", type: "invoice" },
              { title: "Certificate #COO-2024-016 generated", time: "May 12, 2024, 11:05 AM", type: "certificate" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50">
                <div className={`p-2 rounded-full ${
                  activity.type === 'quotation' ? 'bg-blue-100' :
                  activity.type === 'order' ? 'bg-purple-100' :
                  activity.type === 'delivery' ? 'bg-green-100' :
                  activity.type === 'invoice' ? 'bg-amber-100' :
                  'bg-red-100'
                }`}>
                  {activity.type === 'quotation' ? <FileText className="h-4 w-4 text-blue-600" /> :
                   activity.type === 'order' ? <ClipboardList className="h-4 w-4 text-purple-600" /> :
                   activity.type === 'delivery' ? <Truck className="h-4 w-4 text-green-600" /> :
                   activity.type === 'invoice' ? <Receipt className="h-4 w-4 text-amber-600" /> :
                   <FileCheck className="h-4 w-4 text-red-600" />}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDashboard;
