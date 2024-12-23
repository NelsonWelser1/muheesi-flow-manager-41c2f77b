import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ManageCompanies = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Companies</h1>
        <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ManageCompanies;