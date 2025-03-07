
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchToolbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        placeholder="Search deliveries..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default SearchToolbar;
