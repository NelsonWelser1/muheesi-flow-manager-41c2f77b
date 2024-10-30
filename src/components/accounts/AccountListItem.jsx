import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Settings, UserCog, Shield } from 'lucide-react';

const AccountListItem = ({ account, isExpanded, onToggle }) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{account.title}</h3>
            <Badge variant="outline" className="bg-green-100">
              {account.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{account.email}</p>
          <p className="text-sm text-muted-foreground">Company: {account.company}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" title="Account Settings">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Manage Permissions">
            <Shield className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="User Management">
            <UserCog className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle}>
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

export default AccountListItem;