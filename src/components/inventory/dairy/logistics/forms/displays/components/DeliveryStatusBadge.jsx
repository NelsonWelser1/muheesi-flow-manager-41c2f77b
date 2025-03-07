
import React from 'react';
import { Badge } from "@/components/ui/badge";

const DeliveryStatusBadge = ({ status }) => {
  switch (status) {
    case 'Pending':
      return <Badge variant="outline">Pending</Badge>;
    case 'In Transit':
      return <Badge variant="warning">In Transit</Badge>;
    case 'Delivered':
      return <Badge variant="success">Delivered</Badge>;
    case 'Delayed':
      return <Badge variant="destructive">Delayed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default DeliveryStatusBadge;
