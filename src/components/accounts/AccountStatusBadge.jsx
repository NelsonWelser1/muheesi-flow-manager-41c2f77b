import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const statusConfig = {
  Active: { color: "bg-green-500", icon: CheckCircle },
  Pending: { color: "bg-yellow-500", icon: AlertCircle },
  Deactivated: { color: "bg-red-500", icon: XCircle }
};

const AccountStatusBadge = ({ status }) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <StatusIcon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

export default AccountStatusBadge;