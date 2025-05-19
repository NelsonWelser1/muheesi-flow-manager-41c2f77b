
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const OrderForm = ({ company }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customer: '',
    details: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.customer.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.details.trim()) {
      toast({
        title: "Error",
        description: "Please enter order details",
        variant: "destructive",
      });
      return;
    }

    // Show submitting state
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log(`Submitting order for ${company}:`, formData);
      
      // Show success message
      toast({
        title: "Order Placed",
        description: `Your order with ${company} has been submitted successfully.`,
        className: "bg-green-50 border-green-300 text-green-800",
      });
      
      // Reset form and close it
      setFormData({ customer: '', details: '' });
      setShowForm(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="mt-3" data-select-id={`order-form-${company}`}>
      {!showForm ? (
        <Button 
          variant="outline" 
          className="w-full bg-white hover:bg-gray-100"
          onClick={() => setShowForm(true)}
        >
          Place Order
        </Button>
      ) : (
        <div className="border p-4 rounded-md bg-white shadow-sm">
          <h4 className="text-sm font-medium mb-2">Quick Order Form</h4>
          <p className="text-xs text-gray-500 mb-3">
            Contact {company} to place your order
          </p>
          
          <div className="space-y-3 mb-3">
            <div>
              <label htmlFor="customer" className="text-xs text-gray-600 mb-1 block">Your Name *</label>
              <input
                id="customer"
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="details" className="text-xs text-gray-600 mb-1 block">Order Details *</label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="What would you like to order?"
                className="w-full p-2 text-sm border rounded h-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => {
                setFormData({ customer: '', details: '' });
                setShowForm(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
