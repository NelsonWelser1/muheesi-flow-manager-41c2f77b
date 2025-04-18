
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const TaskSearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="w-full mb-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TaskSearchBar;
