
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDairyData } from '@/hooks/useDairyData';
import OverviewTab from './tabs/OverviewTab';
import FinanceTab from './tabs/FinanceTab';
import CattleTab from './tabs/CattleTab';
import MilkTab from './tabs/MilkTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import PersonnelTab from './tabs/PersonnelTab';
import LogisticsTab from './tabs/LogisticsTab';
import QualityTab from './tabs/QualityTab';
import ReportsTab from './tabs/ReportsTab';

const BukomeroDairyDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading, error } = useDairyData();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">Error loading data: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bukomero Dairy</h2>
          <p className="text-muted-foreground">Milk Production & Processing Hub</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Daily Milk Collection</p>
              <h3 className="text-2xl font-bold">{data?.todayCollection || 0} Liters</h3>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-xs ${data?.collectionTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data?.collectionTrend >= 0 ? '↑' : '↓'} {Math.abs(data?.collectionTrend || 0)}% from yesterday
            </span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Active Producers</p>
              <h3 className="text-2xl font-bold">{data?.activeProducers || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-green-600">
              {data?.newProducers || 0} new this week
            </span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Processing Output</p>
              <h3 className="text-2xl font-bold">{data?.processingOutput || 0} kg</h3>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-xs ${data?.outputTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data?.outputTrend >= 0 ? '↑' : '↓'} {Math.abs(data?.outputTrend || 0)}% from last week
            </span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 gap-1 bg-green-50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="cattle">Cattle</TabsTrigger>
          <TabsTrigger value="milk">Milk Production</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <OverviewTab data={data} />
        </TabsContent>
        
        <TabsContent value="finance" className="mt-6">
          <FinanceTab />
        </TabsContent>
        
        <TabsContent value="cattle" className="mt-6">
          <CattleTab />
        </TabsContent>
        
        <TabsContent value="milk" className="mt-6">
          <MilkTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="personnel" className="mt-6">
          <PersonnelTab />
        </TabsContent>
        
        <TabsContent value="logistics" className="mt-6">
          <LogisticsTab />
        </TabsContent>
        
        <TabsContent value="quality" className="mt-6">
          <QualityTab />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BukomeroDairyDashboard;
