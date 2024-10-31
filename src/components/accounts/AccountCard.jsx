import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Power, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const statusColors = {
  Active: "bg-green-500",
  Pending: "bg-yellow-500",
  Deactivated: "bg-red-500"
};

const AccountCard = ({ account, onToggleExpand, isExpanded }) => {
  return (
    <Card className="p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{account.title}</h3>
            <Badge className={`${statusColors[account.status]}`}>
              {account.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{account.email}</p>
          <p className="text-sm text-muted-foreground">Company: {account.company}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Power className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleExpand}>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2">Key Responsibilities:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {account.responsibilities.map((resp, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {resp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default AccountCard;