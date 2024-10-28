import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccountStatusBadge from './AccountStatusBadge';
import { Edit, Clock, Shield, UserCog } from 'lucide-react';

const AccountListItem = ({ account, onSelect, isSelected, onEdit }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(account.user_id, e.target.checked)}
            className="h-4 w-4"
          />
          <div>
            <h3 className="font-medium">{account.username}</h3>
            <p className="text-sm text-muted-foreground">{account.email}</p>
            <p className="text-xs text-muted-foreground">Role: {account.role}</p>
            <p className="text-xs text-muted-foreground">Company: {account.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <AccountStatusBadge status={account.status} />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(account)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="View Login History">
              <Clock className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Manage Permissions">
              <Shield className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Account Settings">
              <UserCog className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AccountListItem;