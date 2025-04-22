
import React from 'react';

const OverviewTab = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Bukomero Dairy Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium mb-4">Farm Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Cattle:</span>
              <span className="font-semibold">{data?.totalCattle || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lactating Cows:</span>
              <span className="font-semibold">{data?.lactatingCows || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Farm Size:</span>
              <span className="font-semibold">{data?.farmSize || '15 acres'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Staff Members:</span>
              <span className="font-semibold">{data?.staffCount || 12}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium mb-4">Production Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Daily Milk Average:</span>
              <span className="font-semibold">{data?.dailyMilkAverage || '560 liters'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weekly Production:</span>
              <span className="font-semibold">{data?.weeklyProduction || '3,920 liters'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Target:</span>
              <span className="font-semibold">{data?.monthlyTarget || '16,800 liters'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Collection Efficiency:</span>
              <span className="font-semibold text-green-600">{data?.collectionEfficiency || '94%'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium mb-4">Financial Overview</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Revenue:</span>
              <span className="font-semibold">UGX {data?.monthlyRevenue || '29,699,000'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Operating Costs:</span>
              <span className="font-semibold text-red-600">UGX {data?.operatingCosts || '12,450,000'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profit Margin:</span>
              <span className="font-semibold text-green-600">{data?.profitMargin || '58%'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Next Payment Date:</span>
              <span className="font-semibold">{data?.nextPaymentDate || 'April 30, 2025'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-medium mb-4">Recent Activities</h4>
        <div className="divide-y">
          {(data?.recentActivities || [
            { date: '2025-04-21', description: 'Veterinary visit - Vaccination of calves' },
            { date: '2025-04-20', description: 'Milk collection - 580 liters' },
            { date: '2025-04-19', description: 'Feed delivery - 2 tons of cattle feed' },
            { date: '2025-04-18', description: 'Equipment maintenance - Milking machines' },
            { date: '2025-04-17', description: 'Staff training - Hygiene protocols' }
          ]).map((activity, index) => (
            <div key={index} className="py-3 flex justify-between">
              <span className="text-gray-600">{new Date(activity.date).toLocaleDateString()}</span>
              <span>{activity.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
