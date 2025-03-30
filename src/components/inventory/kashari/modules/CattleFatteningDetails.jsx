
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Pencil, Clipboard, Scale, ChevronRight, Calendar, TrendingUp, ClipboardCheck } from 'lucide-react';
import { format, differenceInDays, differenceInMonths, addDays } from 'date-fns';
import { useKyalimaCattleFattening } from '@/hooks/useKyalimaCattleFattening';
import { supabase } from '@/integrations/supabase/supabase';

const CattleFatteningDetails = ({ cattleId, onBack }) => {
  const [cattleData, setCattleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weightHistory, setWeightHistory] = useState([]);
  const { completeFatteningProgram } = useKyalimaCattleFattening();
  const { toast } = useToast();
  
  // Fetch cattle details
  useEffect(() => {
    const fetchCattleDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('cattle_fattening')
          .select('*')
          .eq('id', cattleId)
          .single();
          
        if (error) throw error;
        setCattleData(data);
        
        // For demo purposes, generate sample weight history
        // In a real app, this would come from a separate weight tracking table
        if (data) {
          generateSampleWeightHistory(data);
        }
      } catch (err) {
        console.error('Error fetching cattle details:', err);
        toast({
          title: "Error",
          description: "Failed to load cattle details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCattleDetails();
  }, [cattleId]);
  
  // Generate sample weight history for demonstration
  const generateSampleWeightHistory = (cattle) => {
    if (!cattle.entry_date) return;
    
    const entryDate = new Date(cattle.entry_date);
    const currentDate = new Date();
    const entryWeight = parseFloat(cattle.entry_weight);
    const currentWeight = parseFloat(cattle.current_weight);
    
    const totalDays = differenceInDays(currentDate, entryDate);
    if (totalDays <= 0) return;
    
    const records = [];
    
    // Calculate average daily gain
    const totalGain = currentWeight - entryWeight;
    const avgDailyGain = totalGain / totalDays;
    
    // Generate records with some randomness to make the data look realistic
    let lastDate = new Date(entryDate);
    let lastWeight = entryWeight;
    records.push({
      date: format(lastDate, 'yyyy-MM-dd'),
      weight: entryWeight.toFixed(1),
      gainFromLast: 0,
      notes: "Initial weight at entry"
    });
    
    // Generate bi-weekly weight records
    while (differenceInDays(currentDate, lastDate) > 14) {
      lastDate = addDays(lastDate, 14);
      
      // Add some randomness to the daily gain
      const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
      const periodGain = (avgDailyGain * 14 * randomFactor);
      lastWeight += periodGain;
      
      records.push({
        date: format(lastDate, 'yyyy-MM-dd'),
        weight: lastWeight.toFixed(1),
        gainFromLast: periodGain.toFixed(1),
        notes: ""
      });
    }
    
    // Add current weight as last record if it's been at least a week since the last record
    if (differenceInDays(currentDate, lastDate) >= 7) {
      records.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        weight: currentWeight.toFixed(1),
        gainFromLast: (currentWeight - lastWeight).toFixed(1),
        notes: "Latest measurement"
      });
    }
    
    setWeightHistory(records);
  };
  
  const getAgeSummary = (dateOfBirth) => {
    if (!dateOfBirth) return "Not available";
    
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const months = differenceInMonths(now, dob);
    
    if (months < 1) {
      return `${differenceInDays(now, dob)} days`;
    } else if (months < 24) {
      return `${months} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} years${remainingMonths ? `, ${remainingMonths} months` : ''}`;
    }
  };
  
  const getStatusBadge = (status) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      sold: "bg-amber-100 text-amber-800",
      deceased: "bg-red-100 text-red-800",
      transferred: "bg-purple-100 text-purple-800"
    };
    
    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };
  
  const calculateProgress = () => {
    if (!cattleData) return 0;
    
    const currentWeight = parseFloat(cattleData.current_weight);
    const targetWeight = parseFloat(cattleData.target_weight);
    return ((currentWeight / targetWeight) * 100).toFixed(0);
  };
  
  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Are you sure you want to mark this cattle as ${newStatus}?`)) {
      let notes = cattleData.notes || '';
      
      if (newStatus === 'sold') {
        const saleDetails = window.prompt('Enter sale details (price, buyer, etc.):');
        if (saleDetails) {
          notes = notes ? `${notes}\n\nSold: ${saleDetails} on ${format(new Date(), 'yyyy-MM-dd')}` : `Sold: ${saleDetails} on ${format(new Date(), 'yyyy-MM-dd')}`;
        }
      }
      
      await completeFatteningProgram(cattleId, newStatus, notes);
      onBack(); // Return to the list after status change
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }
  
  if (!cattleData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Cattle not found</h3>
        <p className="mt-2 text-gray-600">The requested cattle record could not be found.</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }
  
  const progress = calculateProgress();
  const ageText = getAgeSummary(cattleData.date_of_birth);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold flex-1">
          {cattleData.name || `Cattle ${cattleData.tag_number}`}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => window.print()}
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Print Details
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 flex items-center"
            onClick={() => onBack(cattleData, true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Cattle
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main information card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Cattle Details</CardTitle>
                <CardDescription className="mt-1">
                  Tag Number: {cattleData.tag_number}
                </CardDescription>
              </div>
              {getStatusBadge(cattleData.status)}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Breed</p>
                <p className="mt-1">{cattleData.breed}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="mt-1">{ageText}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Entry Date</p>
                <p className="mt-1">{format(new Date(cattleData.entry_date), 'MMM d, yyyy')}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Entry Weight</p>
                <p className="mt-1">{cattleData.entry_weight} kg</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Current Weight</p>
                <p className="mt-1 font-medium">{cattleData.current_weight} kg</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Target Weight</p>
                <p className="mt-1">{cattleData.target_weight} kg</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Daily Gain</p>
                <p className="mt-1 text-green-600">{cattleData.daily_gain?.toFixed(2) || "-"} kg/day</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Weight Gain</p>
                <p className="mt-1 text-green-600">
                  +{(parseFloat(cattleData.current_weight) - parseFloat(cattleData.entry_weight)).toFixed(1)} kg
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Completion</p>
                <p className="mt-1">
                  {cattleData.expected_completion_date 
                    ? format(new Date(cattleData.expected_completion_date), 'MMM d, yyyy') 
                    : "-"}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Progress to Target</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-full bg-slate-100 h-2 rounded-full">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <span className="text-xs w-10">{progress}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Feeding Regime</p>
                <p className="mt-1 capitalize">{cattleData.feeding_regime}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Days in Program</p>
                <p className="mt-1">
                  {differenceInDays(new Date(), new Date(cattleData.entry_date))} days
                </p>
              </div>
            </div>
            
            {cattleData.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 whitespace-pre-line">{cattleData.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Status actions card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Actions</CardTitle>
            <CardDescription>Update status and actions</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Change Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  className="bg-amber-50 border-amber-200 hover:bg-amber-100"
                  onClick={() => handleStatusChange('sold')}
                  disabled={cattleData.status === 'sold'}
                >
                  Mark as Sold
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-blue-50 border-blue-200 hover:bg-blue-100"
                  onClick={() => handleStatusChange('completed')}
                  disabled={cattleData.status === 'completed'}
                >
                  Mark as Completed
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-purple-50 border-purple-200 hover:bg-purple-100"
                  onClick={() => handleStatusChange('transferred')}
                  disabled={cattleData.status === 'transferred'}
                >
                  Mark as Transferred
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-red-50 border-red-200 hover:bg-red-100 text-red-800"
                  onClick={() => handleStatusChange('deceased')}
                  disabled={cattleData.status === 'deceased'}
                >
                  Mark as Deceased
                </Button>
              </div>
              
              {cattleData.status !== 'active' && (
                <Button 
                  variant="outline"
                  className="w-full mt-2 bg-green-50 border-green-200 hover:bg-green-100"
                  onClick={() => handleStatusChange('active')}
                >
                  Reactivate (Mark as Active)
                </Button>
              )}
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-sm font-medium">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onBack(cattleData, true)}
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Update Weight Measurement
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Health Record
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Growth Chart
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Schedule Activity
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Weight history card */}
      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
          <CardDescription>
            Tracking of weight measurements over time
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Weight (kg)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Gain Since Last (kg)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Notes</th>
                </tr>
              </thead>
              <tbody>
                {weightHistory.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{record.date}</td>
                    <td className="px-4 py-3 font-medium">{record.weight}</td>
                    <td className="px-4 py-3">
                      {index > 0 ? (
                        <span className={parseFloat(record.gainFromLast) > 0 ? "text-green-600" : "text-red-600"}>
                          {parseFloat(record.gainFromLast) > 0 ? "+" : ""}{record.gainFromLast}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{record.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleFatteningDetails;
