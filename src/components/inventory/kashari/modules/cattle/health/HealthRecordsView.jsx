
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import HealthRecordMetrics from './HealthRecordMetrics';
import HealthRecordsList from './HealthRecordsList';
import HealthRecordDialog from './HealthRecordDialog';

const HealthRecordsView = ({ cattleId = null }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Health Records</h2>
        <HealthRecordDialog
          trigger={
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Health Record
            </Button>
          }
          onSuccess={() => setIsAddDialogOpen(false)}
        />
      </div>

      <HealthRecordMetrics cattleId={cattleId} />
      
      <Tabs defaultValue="records" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="records" className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200">
            All Health Records
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200">
            Calendar View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="records">
          <HealthRecordsList cattleId={cattleId} />
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="h-[400px] flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">Calendar view coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthRecordsView;
