
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PartyNameField = ({ paymentType, register, errors }) => {
  return (
    <div className="space-y-2">
      <Label>{paymentType === 'received' ? 'Payer Name' : 'Payee Name'}</Label>
      <Input {...register("partyName", { required: "Name is required" })} />
      {errors.partyName && (
        <p className="text-sm text-red-500">{errors.partyName.message}</p>
      )}
    </div>
  );
};

export default PartyNameField;
