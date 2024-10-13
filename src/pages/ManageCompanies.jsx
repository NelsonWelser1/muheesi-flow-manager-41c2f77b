import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const ManageCompanies = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Companies</h1>
      <Button asChild className="bg-white text-black font-bold">
        <Link to="/manage-accounts">Manage Accounts</Link>
      </Button>
    </div>
  );
};

export default ManageCompanies;