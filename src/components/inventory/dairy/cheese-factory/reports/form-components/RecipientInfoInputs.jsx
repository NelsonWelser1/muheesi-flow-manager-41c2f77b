
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const RecipientInfoInputs = ({ recipient, setRecipient }) => {
  return (
    <div className="space-y-4">
      <Label>Recipient Information</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Recipient Name"
          value={recipient.name}
          onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
          required
        />
        <Input
          placeholder="Phone Number"
          type="tel"
          value={recipient.phone}
          onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
          required
        />
        <Input
          placeholder="Email Address"
          type="email"
          value={recipient.email}
          onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
          required
          className="md:col-span-2"
        />
      </div>
    </div>
  );
};
