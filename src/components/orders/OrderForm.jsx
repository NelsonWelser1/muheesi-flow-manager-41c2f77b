
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const OrderForm = ({ company }) => {
  const [showForm, setShowForm] = useState(false);

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
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm"
              className="flex-1"
              onClick={() => setShowForm(false)}
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
