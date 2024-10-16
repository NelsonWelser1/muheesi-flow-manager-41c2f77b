import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddAccountForm = ({ onAddAccount }) => {
  const [title, setTitle] = useState('');
  const [responsibilities, setResponsibilities] = useState(['']);

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, '']);
  };

  const handleResponsibilityChange = (index, value) => {
    const updatedResponsibilities = [...responsibilities];
    updatedResponsibilities[index] = value;
    setResponsibilities(updatedResponsibilities);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAccount({
      title,
      responsibilities: responsibilities.filter(r => r.trim() !== '')
    });
    setTitle('');
    setResponsibilities(['']);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Add New Account</h2>
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
      <Button type="button" onClick={handleAddResponsibility}>Add Another Responsibility</Button>
      <Button type="submit">Add Account</Button>
    </form>
  );
};

export default AddAccountForm;