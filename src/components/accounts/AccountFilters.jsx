import React from 'react';
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';

const AccountFilters = ({ searchTerm, onSearchChange, selectedCompany, onCompanyChange }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search accounts by title, email, or role..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger 
          value="all" 
          onClick={() => onCompanyChange('all')}
          className={selectedCompany === 'all' ? 'bg-primary text-primary-foreground' : ''}
        >
          All Companies
        </TabsTrigger>
        <TabsTrigger 
          value="grand-berna"
          onClick={() => onCompanyChange('Grand Berna')}
          className={selectedCompany === 'Grand Berna' ? 'bg-primary text-primary-foreground' : ''}
        >
          Grand Berna
        </TabsTrigger>
        <TabsTrigger 
          value="kajon"
          onClick={() => onCompanyChange('KAJON Coffee')}
          className={selectedCompany === 'KAJON Coffee' ? 'bg-primary text-primary-foreground' : ''}
        >
          KAJON Coffee
        </TabsTrigger>
        <TabsTrigger 
          value="kyalima"
          onClick={() => onCompanyChange('Kyalima Farmers')}
          className={selectedCompany === 'Kyalima Farmers' ? 'bg-primary text-primary-foreground' : ''}
        >
          Kyalima Farmers
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AccountFilters;