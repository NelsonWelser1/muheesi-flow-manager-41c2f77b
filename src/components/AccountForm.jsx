import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AccountForm = ({ onAddAccount }) => {
  const [title, setTitle] = useState('');
  const [responsibilities, setResponsibilities] = useState(['']);

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, '']);
  };

  const handleResponsibilityChange = (index, value) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAccount({ title, responsibilities: responsibilities.filter(r => r !== '') });
    setTitle('');
    setResponsibilities(['']);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="accountTitle">Account Title</Label>
        <Input
          id="accountTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      {responsibilities.map((resp, index) => (
        <div key={index}>
          <Label htmlFor={`responsibility-${index}`}>Responsibility {index + 1}</Label>
          <Input
            id={`responsibility-${index}`}
            value={resp}
            onChange={(e) => handleResponsibilityChange(index, e.target.value)}
          />
        </div>
      ))}
      <Button type="button" onClick={handleAddResponsibility}>Add Responsibility</Button>
      <Button type="submit">Add Account</Button>
    </form>
  );
};

export default AccountForm;