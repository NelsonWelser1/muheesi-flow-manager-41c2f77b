import React from 'react';
import UserDashboard from '../components/dashboard/UserDashboard';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6">
        <UserDashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
