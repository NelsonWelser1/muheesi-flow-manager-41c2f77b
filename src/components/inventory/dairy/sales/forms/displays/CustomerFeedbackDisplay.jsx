
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, StarHalf } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";

const CustomerFeedbackDisplay = ({ onBack }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomerFeedback();
  }, []);

  const fetchCustomerFeedback = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_feedback')
        .select('*')
        .order('feedback_date', { ascending: false });

      if (error) throw error;

      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching customer feedback:', error);
      showErrorToast(toast, "Failed to load customer feedback: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredFeedbacks = () => {
    if (activeTab === "all") return feedbacks;
    
    if (activeTab === "high") {
      return feedbacks.filter(feedback => feedback.satisfaction_rating >= 4);
    } else if (activeTab === "medium") {
      return feedbacks.filter(feedback => feedback.satisfaction_rating >= 3 && feedback.satisfaction_rating < 4);
    } else if (activeTab === "low") {
      return feedbacks.filter(feedback => feedback.satisfaction_rating < 3);
    }
    
    return feedbacks;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating) => {
    if (!rating) return "No rating";
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-1 text-sm">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Feedback</TabsTrigger>
              <TabsTrigger value="high">High Satisfaction (4-5)</TabsTrigger>
              <TabsTrigger value="medium">Medium Satisfaction (3-4)</TabsTrigger>
              <TabsTrigger value="low">Low Satisfaction (0-3)</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-8">Loading customer feedback...</div>
              ) : getFilteredFeedbacks().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No customer feedback found.
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredFeedbacks().map((feedback, index) => (
                    <Card key={feedback.id || index} className="overflow-hidden">
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
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedbackDisplay;
