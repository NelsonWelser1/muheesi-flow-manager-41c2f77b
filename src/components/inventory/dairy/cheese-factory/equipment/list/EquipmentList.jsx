import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, Clock, AlertOctagon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import EquipmentEntryForm from '../form/EquipmentEntryForm';

const EquipmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const {
    data: equipmentList,
    isLoading
  } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('equipment_maintenance').select('*').order('equipment_name');
      if (error) {
        console.error('Error fetching equipment:', error);
        throw error;
      }
      console.log('Fetched equipment:', data);
      return data;
    }
  });

  const getStatusIcon = status => {
    switch (status) {
      case 'operational':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEquipment = equipmentList?.filter(equipment => {
    const matchesSearch = equipment.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) || equipment.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
          </div>
        </div>
      </div>;
  }

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Equipment List</h2>
        <EquipmentEntryForm />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search equipment..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>
            All
          </Button>
          <Button variant={statusFilter === 'operational' ? 'default' : 'outline'} onClick={() => setStatusFilter('operational')} className="text-green-600">
            Operational
          </Button>
          <Button variant={statusFilter === 'maintenance' ? 'default' : 'outline'} onClick={() => setStatusFilter('maintenance')} className="text-yellow-600">
            Maintenance
          </Button>
          <Button variant={statusFilter === 'critical' ? 'default' : 'outline'} onClick={() => setStatusFilter('critical')} className="text-red-600">
            Critical
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment?.map(equipment => <Card key={equipment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {equipment.equipment_name}
              </CardTitle>
              {getStatusIcon(equipment.status)}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(equipment.status)}>
                    {equipment.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium">{equipment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Health Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${equipment.health_score >= 70 ? 'bg-green-500' : equipment.health_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                    width: `${equipment.health_score}%`
                  }} />
                    </div>
                    <span className="font-medium">{equipment.health_score}%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Maintenance</span>
                  <span className="text-sm">
                    {new Date(equipment.last_maintenance).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Next Due</span>
                  <span className="text-sm">
                    {new Date(equipment.next_maintenance).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {!filteredEquipment?.length && <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900">No equipment found</p>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'No equipment has been added yet'}
          </p>
        </div>}
    </div>;
};

export default EquipmentList;
