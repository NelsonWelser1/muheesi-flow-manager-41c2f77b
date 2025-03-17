
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const PaymentFormActions = ({ paymentType }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">
        Record {paymentType === 'received' ? 'Receipt' : 'Payment'}
      </Button>
    </div>
  );
};

export default PaymentFormActions;
