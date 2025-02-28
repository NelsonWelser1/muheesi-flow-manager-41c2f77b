
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProductCataloguesForm = ({ onBack }) => {
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Catalogues/Brochures</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This form will allow you to create and manage product catalogues and brochures.
            It will include fields for product details, images, descriptions, pricing, and more.
          </p>
          <p className="mt-4 text-muted-foreground">
            Coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCataloguesForm;
