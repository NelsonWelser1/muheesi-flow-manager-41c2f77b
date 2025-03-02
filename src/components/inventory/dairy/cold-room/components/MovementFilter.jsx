
import React from 'react';
import { Badge } from "@/components/ui/badge";

const MovementFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex space-x-2">
      <Badge 
        className={`cursor-pointer ${filter === 'all' ? 'bg-primary' : 'bg-secondary'}`}
        onClick={() => setFilter('all')}
      >
        All
      </Badge>
      <Badge 
        className={`cursor-pointer ${filter === 'in' ? 'bg-green-600' : 'bg-secondary'}`}
        onClick={() => setFilter('in')}
      >
        Goods Receipt
      </Badge>
      <Badge 
        className={`cursor-pointer ${filter === 'out' ? 'bg-amber-600' : 'bg-secondary'}`}
        onClick={() => setFilter('out')}
      >
        Goods Issue
      </Badge>
    </div>
  );
};

export default MovementFilter;
