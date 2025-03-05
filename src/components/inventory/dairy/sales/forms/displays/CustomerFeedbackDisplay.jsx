
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerFeedbackHeader from './components/CustomerFeedbackHeader';
import FeedbackTabs from './components/FeedbackTabs';
import FeedbackList from './components/FeedbackList';
import { useFeedbackDisplay } from './hooks/useFeedbackDisplay';

const CustomerFeedbackDisplay = ({ onBack }) => {
  const { 
    isLoading, 
    activeTab, 
    setActiveTab, 
    fetchCustomerFeedback, 
    getFilteredFeedbacks,
    formatDate
  } = useFeedbackDisplay();

  return (
    <div className="space-y-4">
      <CustomerFeedbackHeader 
        onBack={onBack} 
        fetchCustomerFeedback={fetchCustomerFeedback} 
      />

      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          >
            <FeedbackList 
              feedbacks={getFilteredFeedbacks()} 
              isLoading={isLoading} 
              formatDate={formatDate} 
            />
          </FeedbackTabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedbackDisplay;
