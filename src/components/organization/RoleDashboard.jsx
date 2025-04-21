import React, { useState } from 'react';
import CEOSidebar from './ceo-dashboard/CEOSidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RoleDashboard = ({ role }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (role === 'CEO') {
    return (
      <div className="flex h-full">
        <CEOSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isCollapsed={isCollapsed}
        />
        <div className="flex-1 space-y-6 p-8">
          <Card>
            <CardHeader>
              <CardTitle>Executive Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Key performance indicators and strategic insights.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Revenue, expenses, and profit margins at a glance.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Operational Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Metrics related to production, supply chain, and logistics.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Customer feedback, ratings, and reviews.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (role === 'Production Manager') {
    return (
      <div>
        <h2>Production Manager Dashboard</h2>
        <p>View and manage production processes.</p>
      </div>
    );
  }

  if (role === 'Sales Manager') {
    return (
      <div>
        <h2>Sales Manager Dashboard</h2>
        <p>Track sales performance and manage customer relationships.</p>
      </div>
    );
  }

  if (role === 'Marketing Manager') {
    return (
      <div>
        <h2>Marketing Manager Dashboard</h2>
        <p>Analyze marketing campaigns and customer engagement.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Role Dashboard</h2>
      <p>No specific dashboard available for this role.</p>
    </div>
  );
};

export default RoleDashboard;
