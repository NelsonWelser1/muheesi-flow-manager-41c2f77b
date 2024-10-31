import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const TechnicalSupportForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we would typically send the data to the backend
    toast({
      title: "Support Request Submitted",
      description: "A system administrator will review your request shortly.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" required />
      </div>
      <div>
        <Label htmlFor="account">Account</Label>
        <Input id="account" placeholder="Your account type" required />
      </div>
      <div>
        <Label htmlFor="issue">Issue Description</Label>
        <Textarea 
          id="issue" 
          placeholder="Describe your technical issue or permission request"
          className="min-h-[100px]"
          required 
        />
      </div>
      <Button type="submit">Submit Support Request</Button>
    </form>
  );
};

export default TechnicalSupportForm;