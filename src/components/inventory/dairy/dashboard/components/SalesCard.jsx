
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SalesCard = ({ title, children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={title === "Sales Records" ? "h-[300px] overflow-auto" : ""}>
        {children}
      </CardContent>
    </Card>
  );
};

export default SalesCard;
