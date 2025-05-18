
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const OrderForm = ({ company }) => {
  const [showForm, setShowForm] = useState(false);
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
    // Submit order logic would go here
    console.log(`Submitting order for ${company}:`, formData);
    // Reset form and close it
    setFormData({ customer: '', details: '' });
    setShowForm(false);
  };

  return (
    <div className="mt-3" data-select-id={`order-form-${company}`}>
      {!showForm ? (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          Place Order
        </Button>
      ) : (
        <div className="border p-3 rounded-md bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Quick Order Form</h4>
          <p className="text-xs text-gray-500 mb-2">
            Contact {company} to place your order
          </p>
          
          <div className="space-y-2 mb-3">
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleInputChange}
              placeholder="Your name"
              className="w-full p-2 text-sm border rounded"
            />
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              placeholder="Order details"
              className="w-full p-2 text-sm border rounded h-20"
            />
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm"
              className="flex-1"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => setShowForm(false)}
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
