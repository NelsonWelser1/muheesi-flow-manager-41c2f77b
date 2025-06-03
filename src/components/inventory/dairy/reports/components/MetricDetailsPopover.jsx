
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown } from "lucide-react";

const MetricDetailsPopover = ({ 
  trigger, 
  title, 
  value, 
  description, 
  details = [], 
  trend = null,
  additionalInfo = null 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top" align="start">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-blue-500" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{value}</span>
              {trend && (
                <Badge variant={trend.type === 'positive' ? 'default' : 'destructive'} className="flex items-center gap-1">
                  {trend.type === 'positive' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trend.value}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            
            {details.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Details:</h4>
                <ul className="space-y-1">
                  {details.map((detail, index) => (
                    <li key={index} className="text-sm flex justify-between">
                      <span className="text-muted-foreground">{detail.label}:</span>
                      <span className="font-medium">{detail.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {additionalInfo && (
              <div className="mt-3 p-2 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-800">{additionalInfo}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default MetricDetailsPopover;
