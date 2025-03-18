
import React from 'react';
import { Button } from "@/components/ui/button";

const PaymentFormActions = ({ paymentType, isSubmitting }) => {
  return (
    <div className="flex justify-end mt-6">
      <Button 
        type="submit" 
        className="bg-[#0000a0] hover:bg-[#00008b]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : `Record ${paymentType === 'received' ? 'Receipt' : 'Payment'}`}
      </Button>
    </div>
  );
};

export default PaymentFormActions;
