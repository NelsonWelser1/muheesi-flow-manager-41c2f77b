
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Tags, Barcode, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PackagingLabeling = () => {
  const navigate = useNavigate();
  
  const tiles = [{
    title: "Packaging",
    description: "Manage product packaging details",
    icon: <Package2 className="h-6 w-6" />,
    path: "packaging-management",
    secondaryIcon: <Barcode className="absolute bottom-2 right-2 h-4 w-4 text-muted-foreground/50" />
  }, {
    title: "Labeling",
    description: "Configure product labels",
    icon: <Tags className="h-6 w-6" />,
    path: "labeling-management",
    secondaryIcon: <QrCode className="absolute bottom-2 right-2 h-4 w-4 text-muted-foreground/50" />
  }];

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Packaging & Labeling Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {tiles.map(tile => (
              <button 
                key={tile.title} 
                onClick={() => navigate(tile.path)} 
                className="group relative p-6 rounded-lg border border-border hover:border-primary transition-all duration-300 bg-card hover:shadow-lg text-orange-800 bg-cyan-50 px-[24px]"
              >
                <div className="flex flex-col items-center justify-center gap-2 h-24">
                  {tile.icon}
                  <span className="font-semibold">{tile.title}</span>
                  <span className="text-xs text-muted-foreground">{tile.description}</span>
                  {tile.secondaryIcon}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackagingLabeling;
