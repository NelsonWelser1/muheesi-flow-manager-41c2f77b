
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const DossierSearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full md:w-auto flex-grow max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input 
        className="pl-9" 
        placeholder="Search employee records..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default DossierSearchBar;
