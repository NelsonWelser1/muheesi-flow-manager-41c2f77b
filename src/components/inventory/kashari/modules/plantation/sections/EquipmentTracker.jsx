
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Search, Wrench, Tool, Tractor, AlertTriangle } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlantationData } from '@/hooks/usePlantationData';

const EquipmentTracker = () => {
  const { equipmentData, loading, error } = usePlantationData();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [status, setStatus] = useState('operational');
  const [notes, setNotes] = useState('');
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('add');
  
  // Maintenance records
  const [equipmentId, setEquipmentId] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState(null);
  const [maintenanceType, setMaintenanceType] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [maintenanceSearchTerm, setMaintenanceSearchTerm] = useState('');
  
  const equipmentTypes = [
    { value: 'tractor', label: 'Tractor' },
    { value: 'plow', label: 'Plow' },
    { value: 'harvester', label: 'Harvester' },
    { value: 'sprayer', label: 'Sprayer' },
    { value: 'irrigation', label: 'Irrigation Equipment' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'generator', label: 'Generator' },
    { value: 'hand_tool', label: 'Hand Tool' },
    { value: 'processing', label: 'Processing Equipment' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'operational', label: 'Operational' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'broken', label: 'Broken' },
    { value: 'retired', label: 'Retired' }
  ];

  const maintenanceTypes = [
    { value: 'routine', label: 'Routine Service' },
    { value: 'repair', label: 'Repair' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'overhaul', label: 'Overhaul' },
    { value: 'replacement', label: 'Part Replacement' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEquipment = {
      id: Date.now(),
      name,
      type,
      model,
      serialNumber,
      purchaseDate,
      purchasePrice: Number(purchasePrice),
      status,
      notes,
      createdAt: new Date()
    };
    setEquipment([...equipment, newEquipment]);
    
    // Reset form
    setName('');
    setType('');
    setModel('');
    setSerialNumber('');
    setPurchaseDate(null);
    setPurchasePrice('');
    setStatus('operational');
    setNotes('');
  };

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      equipmentId,
      equipmentName: [...equipment, ...equipmentData].find(eq => eq.id.toString() === equipmentId.toString())?.name || '',
      maintenanceDate,
      maintenanceType,
      description,
      cost: Number(cost),
      performedBy,
      notes: maintenanceNotes,
      createdAt: new Date()
    };
    setMaintenanceRecords([...maintenanceRecords, newRecord]);
    
    // Reset form
    setEquipmentId('');
    setMaintenanceDate(null);
    setMaintenanceType('');
    setDescription('');
    setCost('');
    setPerformedBy('');
    setMaintenanceNotes('');
  };

  const filteredEquipment = [...equipment, ...equipmentData].filter(item => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(search)) ||
      (item.type && equipmentTypes.find(t => t.value === item.type)?.label.toLowerCase().includes(search)) ||
      (item.model && item.model.toLowerCase().includes(search)) ||
      (item.serialNumber && item.serialNumber.toLowerCase().includes(search)) ||
      (item.notes && item.notes.toLowerCase().includes(search))
    );
  });

  const filteredMaintenanceRecords = maintenanceRecords.filter(record => {
    if (!maintenanceSearchTerm) return true;
    
    const search = maintenanceSearchTerm.toLowerCase();
    return (
      (record.equipmentName && record.equipmentName.toLowerCase().includes(search)) ||
      (record.maintenanceType && maintenanceTypes.find(t => t.value === record.maintenanceType)?.label.toLowerCase().includes(search)) ||
      (record.description && record.description.toLowerCase().includes(search)) ||
      (record.performedBy && record.performedBy.toLowerCase().includes(search)) ||
      (record.notes && record.notes.toLowerCase().includes(search))
    );
  });

  // Equipment that needs attention (under maintenance or broken)
  const needsAttention = [...equipment, ...equipmentData].filter(
    item => item.status === 'maintenance' || item.status === 'broken'
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Equipment</TabsTrigger>
          <TabsTrigger value="list">Equipment List</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Equipment Name</label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name of equipment"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">Equipment Type</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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
                    <label htmlFor="model" className="text-sm font-medium">Model/Make</label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Model or make"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="serialNumber" className="text-sm font-medium">Serial Number</label>
                    <Input
                      id="serialNumber"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="Serial or identification number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Purchase Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {purchaseDate ? format(purchaseDate, 'PPP') : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={purchaseDate}
                          onSelect={setPurchaseDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="purchasePrice" className="text-sm font-medium">Purchase Price (UGX)</label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      min="0"
                      step="1000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="Price in UGX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Current Status</label>
                    <Select value={status} onValueChange={setStatus}>
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
                  
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
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
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            {needsAttention.length > 0 && (
              <Card className="border-yellow-300 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-yellow-700">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    Equipment Needing Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {needsAttention.map(item => (
                      <div key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-yellow-200">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>Status: <span className="font-medium text-yellow-700">{statusOptions.find(s => s.value === item.status)?.label || item.status}</span></p>
                          <p>Type: {equipmentTypes.find(t => t.value === item.type)?.label || item.type || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          
            <Card>
              <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <CardTitle className="flex items-center">
                  <Tractor className="h-5 w-5 mr-2 text-primary" />
                  Equipment List
                </CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading equipment data...</div>
                ) : filteredEquipment.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {[...equipment, ...equipmentData].length === 0 
                      ? "No equipment added yet. Use the form to add equipment."
                      : "No matching equipment found. Try a different search term."}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Serial Number</TableHead>
                          <TableHead>Purchase Date</TableHead>
                          <TableHead>Price (UGX)</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEquipment.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              {equipmentTypes.find(t => t.value === item.type)?.label || item.type || 'N/A'}
                            </TableCell>
                            <TableCell>{item.model || 'N/A'}</TableCell>
                            <TableCell>{item.serialNumber || 'N/A'}</TableCell>
                            <TableCell>{item.purchaseDate ? format(new Date(item.purchaseDate), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                            <TableCell>{typeof item.purchasePrice === 'number' ? item.purchasePrice.toLocaleString() : item.purchasePrice || 'N/A'}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'operational' ? 'bg-green-100 text-green-800' : 
                                item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                                item.status === 'broken' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {statusOptions.find(s => s.value === item.status)?.label || item.status || 'N/A'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Maintenance Record</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="equipmentId" className="text-sm font-medium">Equipment</label>
                      <Select value={equipmentId} onValueChange={setEquipmentId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...equipment, ...equipmentData].map(item => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Maintenance Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {maintenanceDate ? format(maintenanceDate, 'PPP') : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={maintenanceDate}
                            onSelect={setMaintenanceDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="maintenanceType" className="text-sm font-medium">Maintenance Type</label>
                      <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {maintenanceTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description of maintenance performed"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="cost" className="text-sm font-medium">Cost (UGX)</label>
                      <Input
                        id="cost"
                        type="number"
                        min="0"
                        step="1000"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="Cost in UGX"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="performedBy" className="text-sm font-medium">Performed By</label>
                      <Input
                        id="performedBy"
                        value={performedBy}
                        onChange={(e) => setPerformedBy(e.target.value)}
                        placeholder="Person or company name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="maintenanceNotes" className="text-sm font-medium">Notes</label>
                      <Textarea
                        id="maintenanceNotes"
                        value={maintenanceNotes}
                        onChange={(e) => setMaintenanceNotes(e.target.value)}
                        placeholder="Additional notes"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Maintenance Record
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-col gap-4 justify-between items-start">
                <CardTitle className="flex items-center">
                  <Wrench className="h-5 w-5 mr-2 text-primary" />
                  Maintenance Records
                </CardTitle>
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search maintenance records..."
                    value={maintenanceSearchTerm}
                    onChange={(e) => setMaintenanceSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredMaintenanceRecords.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {maintenanceRecords.length === 0 
                      ? "No maintenance records added yet. Use the form to add records."
                      : "No matching records found. Try a different search term."}
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Equipment</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Cost (UGX)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMaintenanceRecords.map(record => (
                          <TableRow key={record.id}>
                            <TableCell>{record.maintenanceDate ? format(record.maintenanceDate, 'dd/MM/yyyy') : 'N/A'}</TableCell>
                            <TableCell>{record.equipmentName || 'N/A'}</TableCell>
                            <TableCell>
                              {maintenanceTypes.find(t => t.value === record.maintenanceType)?.label || record.maintenanceType || 'N/A'}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {record.description || 'N/A'}
                            </TableCell>
                            <TableCell>{record.cost.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentTracker;
