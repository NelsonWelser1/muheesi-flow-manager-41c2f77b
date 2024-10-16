import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AccountItem = ({ account, onRemove, isSystemAdmin }) => {
  const [newResponsibility, setNewResponsibility] = useState('');

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      account.responsibilities.push(newResponsibility.trim());
      setNewResponsibility('');
    }
  };

  const handleRemoveResponsibility = (index) => {
    account.responsibilities = account.responsibilities.filter((_, i) => i !== index);
  };

  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value={account.title}>
        <AccordionTrigger>{account.title}</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-5 mb-4">
            {account.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                {responsibility}
                <Button onClick={() => handleRemoveResponsibility(index)} variant="destructive" size="sm">Remove</Button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New responsibility"
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
            />
            <Button onClick={handleAddResponsibility}>Add Responsibility</Button>
          </div>
          {!isSystemAdmin && (
            <Button onClick={onRemove} variant="destructive">Remove Account</Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccountItem;