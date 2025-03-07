
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Muheesi GKK Integrated System</h1>
        <p className="text-xl mb-8">
          A comprehensive management system for supply chain, factory operations, and warehouse management.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="h-16 text-lg bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate('/manage-inventory')}
            className="h-16 text-lg bg-green-600 hover:bg-green-700"
          >
            Manage Inventory
          </Button>
          
          <Button 
            onClick={() => navigate('/manage-companies')}
            className="h-16 text-lg bg-purple-600 hover:bg-purple-700"
          >
            Manage Companies
          </Button>
          
          <Button 
            onClick={() => navigate('/feedback')}
            className="h-16 text-lg bg-amber-600 hover:bg-amber-700"
          >
            Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
