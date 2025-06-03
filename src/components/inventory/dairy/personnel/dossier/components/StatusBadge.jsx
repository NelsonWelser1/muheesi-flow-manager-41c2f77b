
import React from 'react';
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }) => {
  const getVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Onboarding':
        return 'info';
      case 'On Leave':
        return 'warning';
      case 'Terminated':
        return 'destructive';
      case 'Retired':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!status) return <Badge variant="outline">Unknown</Badge>;
  
  return <Badge variant={getVariant(status)}>{status}</Badge>;
};

export default StatusBadge;
