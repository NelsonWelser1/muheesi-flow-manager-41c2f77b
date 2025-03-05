
import React from 'react';
import { Card } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

const FeedbackCard = ({ feedback, formatDate }) => {
  const renderStars = (rating) => {
    if (!rating && rating !== 0) return "No rating";
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-1 text-sm">({rating})</span>
      </div>
    );
  };

  return (
    <Card key={feedback.id} className="overflow-hidden">
      <div className="p-4 bg-muted/20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{feedback.customer_name || 'Anonymous Customer'}</h3>
            <p className="text-sm text-muted-foreground">
              Feedback Date: {formatDate(feedback.feedback_date)}
            </p>
          </div>
          <div>
            {renderStars(feedback.satisfaction_rating)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium">Contact Info</p>
            <p className="text-sm">{feedback.customer_email || 'No email provided'}</p>
            <p className="text-sm">{feedback.customer_phone || 'No phone provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Product/Service</p>
            <p className="text-sm">{feedback.product_service || 'General feedback'}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium">Feedback</p>
          <p className="text-sm whitespace-pre-wrap">{feedback.feedback_text || 'No comments provided'}</p>
        </div>
        
        {feedback.improvement_suggestions && (
          <div className="mb-4">
            <p className="text-sm font-medium">Improvement Suggestions</p>
            <p className="text-sm whitespace-pre-wrap">{feedback.improvement_suggestions}</p>
          </div>
        )}
        
        {feedback.follow_up_required && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm font-medium text-yellow-700">Follow-up Required</p>
            <p className="text-sm text-yellow-600">Status: {feedback.follow_up_status || 'Pending'}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeedbackCard;
