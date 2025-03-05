
import React from 'react';
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    case 'expired':
      return <Badge variant="outline">Expired</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default StatusBadge;
