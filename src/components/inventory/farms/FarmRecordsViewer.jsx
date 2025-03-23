
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { useFarmInformation } from '@/hooks/useFarmInformation';
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";

const FarmRecordsViewer = ({ onBack, isKazo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchAllFarms } = useFarmInformation();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadFarms = async () => {
      try {
        setLoading(true);
        const farmData = await fetchAllFarms();
        setFarms(farmData);
      } catch (error) {
        console.error("Error loading farm records:", error);
        showErrorToast(toast, "Failed to load farm records");
      } finally {
        setLoading(false);
      }
    };
    
    loadFarms();
  }, []);
  
  const filteredFarms = farms.filter(farm => 
    farm.farm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.coffee_type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Farm Records</CardTitle>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search farms..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFarms.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farm Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Coffee Type</TableHead>
                    <TableHead>Size (Acres)</TableHead>
                    <TableHead>Monthly Production</TableHead>
                    <TableHead>Annual Production</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFarms.map((farm) => (
                    <TableRow key={farm.id}>
                      <TableCell className="font-medium">{farm.farm_name}</TableCell>
                      <TableCell>{farm.manager_name}</TableCell>
                      <TableCell className="capitalize">{farm.coffee_type}</TableCell>
                      <TableCell>{farm.farm_size}</TableCell>
                      <TableCell>{farm.monthly_production || '-'} kg</TableCell>
                      <TableCell>{farm.annual_production || '-'} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm ? "No farms match your search criteria" : "No farm records found"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmRecordsViewer;
