import React from 'react';
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';

const AccountFilters = ({ searchTerm, onSearchChange, selectedCompany }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or role..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All Companies</TabsTrigger>
        <TabsTrigger value="grand-berna">Grand Berna</TabsTrigger>
        <TabsTrigger value="kajon">KAJON Coffee</TabsTrigger>
        <TabsTrigger value="kyalima">Kyalima Farmers</TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AccountFilters;