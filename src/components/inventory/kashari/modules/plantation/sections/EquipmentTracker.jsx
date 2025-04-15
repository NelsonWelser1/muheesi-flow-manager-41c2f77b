
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Tractor, Wrench, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { usePlantationData } from '@/hooks/usePlantationData';

const EquipmentTracker = () => {
  const { equipmentData, loading, error } = usePlantationData();
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [status, setStatus] = useState('operational');
  const [notes, setNotes] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);

  const equipmentTypes = [
    { value: 'tractor', label: 'Tractor' },
    { value: 'plow', label: 'Plow' },
    { value: 'harvester', label: 'Harvester' },
    { value: 'sprayer', label: 'Sprayer' },
    { value: 'irrigation', label: 'Irrigation Equipment' },
    { value: 'hand-tools', label: 'Hand Tools' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'operational', label: 'Operational' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'repair', label: 'Needs Repair' },
    { value: 'retired', label: 'Retired/Disposed' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEquipment = {
      id: Date.now(),
      name: equipmentName,
      type: equipmentType,
      purchaseDate,
      lastMaintenanceDate,
      nextMaintenanceDate,
      status,
      notes
    };
    setEquipmentList([...equipmentList, newEquipment]);
    
    // Reset form
    setEquipmentName('');
    setEquipmentType('');
    setPurchaseDate('');
    setLastMaintenanceDate('');
    setNextMaintenanceDate('');
    setStatus('operational');
    setNotes('');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational':
        return <CheckCircle className="text-green-500" />;
      case 'maintenance':
        return <Wrench className="text-amber-500" />;
      case 'repair':
        return <AlertCircle className="text-red-500" />;
      case 'retired':
        return <Tractor className="text-gray-500" />;
      default:
        return <CheckCircle className="text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Equipment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="equipmentName" className="text-sm font-medium">Equipment Name</label>
                <Input
                  id="equipmentName"
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  placeholder="Enter equipment name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="equipmentType" className="text-sm font-medium">Equipment Type</label>
                <Select 
                  value={equipmentType} 
                  onValueChange={setEquipmentType}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="purchaseDate" className="text-sm font-medium">Purchase Date</label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastMaintenanceDate" className="text-sm font-medium">Last Maintenance Date</label>
                <Input
                  id="lastMaintenanceDate"
                  type="date"
                  value={lastMaintenanceDate}
                  onChange={(e) => setLastMaintenanceDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="nextMaintenanceDate" className="text-sm font-medium">Next Maintenance Date</label>
                <Input
                  id="nextMaintenanceDate"
                  type="date"
                  value={nextMaintenanceDate}
                  onChange={(e) => setNextMaintenanceDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select 
                  value={status} 
                  onValueChange={setStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes about the equipment"
                  rows={3}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Equipment
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {equipmentList.length === 0 && !loading && (
            <div className="text-center py-4 text-muted-foreground">
              No equipment records added yet. Use the form above to add equipment.
            </div>
          )}
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading equipment data...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 p-4 rounded-md text-destructive text-center">
              Error loading equipment data: {error}
            </div>
          )}
          
          {(equipmentList.length > 0 || (equipmentData && equipmentData.length > 0)) && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Next Maintenance</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentList.map(equipment => (
                    <tr key={equipment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{equipment.name}</td>
                      <td className="py-3 px-4">
                        {equipmentTypes.find(t => t.value === equipment.type)?.label || equipment.type}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(equipment.status)}
                          <span>{statusOptions.find(s => s.value === equipment.status)?.label || equipment.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{equipment.nextMaintenanceDate || 'Not scheduled'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {equipmentData && equipmentData.map(equipment => (
                    <tr key={equipment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{equipment.name}</td>
                      <td className="py-3 px-4">{equipment.type}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(equipment.status)}
                          <span>{equipment.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{equipment.next_maintenance_date || 'Not scheduled'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="font-medium flex items-center text-yellow-800">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Maintenance
              </h3>
              
              {equipmentList.filter(e => e.nextMaintenanceDate && new Date(e.nextMaintenanceDate) > new Date()).length === 0 && (
                <p className="mt-2 text-sm text-muted-foreground">No upcoming maintenance scheduled.</p>
              )}
              
              {equipmentList.filter(e => e.nextMaintenanceDate && new Date(e.nextMaintenanceDate) > new Date())
                .sort((a, b) => new Date(a.nextMaintenanceDate) - new Date(b.nextMaintenanceDate))
                .map(equipment => (
                  <div key={equipment.id} className="mt-2 border-t border-yellow-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{equipment.name}</span>
                      <span className="text-sm">{equipment.nextMaintenanceDate}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last maintenance: {equipment.lastMaintenanceDate || 'Not recorded'}
                    </p>
                  </div>
                ))
              }
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="font-medium flex items-center text-red-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                Needs Repair
              </h3>
              
              {equipmentList.filter(e => e.status === 'repair').length === 0 && (
                <p className="mt-2 text-sm text-muted-foreground">No equipment currently needs repair.</p>
              )}
              
              {equipmentList.filter(e => e.status === 'repair').map(equipment => (
                <div key={equipment.id} className="mt-2 border-t border-red-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{equipment.name}</span>
                    <span className="text-sm">{equipment.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{equipment.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentTracker;
