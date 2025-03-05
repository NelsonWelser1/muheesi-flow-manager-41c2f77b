
import React from 'react';
import FeedbackCard from './FeedbackCard';

const FeedbackList = ({ feedbacks, isLoading, formatDate }) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading customer feedback...</div>;
  }
  
  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No customer feedback found.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {feedbacks.map((feedback, index) => (
        <FeedbackCard 
          key={feedback.id || index} 
          feedback={feedback} 
          formatDate={formatDate} 
        />
      ))}
    </div>
  );
};

export default FeedbackList;
