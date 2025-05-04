
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, Trash, FileSpreadsheet, Eye } from "lucide-react";
import { format, parseISO } from 'date-fns';

const SavedCalculations = ({ viewOnly }) => {
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load saved calculations from localStorage
    const loadedCalculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
    setSavedCalculations(loadedCalculations);
  }, []);
  
  const handleDelete = (id) => {
    if (viewOnly) {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to delete calculations in view-only mode",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCalculations = savedCalculations.filter(calc => calc.id !== id);
    localStorage.setItem('savedCalculations', JSON.stringify(updatedCalculations));
    setSavedCalculations(updatedCalculations);
    
    toast({
      title: "Calculation Deleted",
      description: "The saved calculation has been removed"
    });
    
    // Clear selected calculation if it was the one deleted
    if (selectedCalculation && selectedCalculation.id === id) {
      setSelectedCalculation(null);
    }
  };
  
  const handleView = (calculation) => {
    setSelectedCalculation(calculation);
  };
  
  const handleExportAll = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Date,Coffee Type,Grade,Quantity (kg),Base Price,Processing Cost,Transport Cost,Certification,Margin %,Final Price,Price per kg,Currency\n";
    
    // Add rows
    savedCalculations.forEach(calc => {
      const row = [
        format(parseISO(calc.date), 'yyyy-MM-dd'),
        calc.coffeeType,
        calc.grade,
        calc.quantity,
        calc.basePrice,
        calc.processingCosts,
        calc.transportCosts,
        calc.certification,
        calc.marginPercentage,
        calc.finalPrice,
        calc.pricePerKg,
        calc.currency
      ];
      
      // Escape any commas in the data
      const escapedRow = row.map(field => {
        const stringField = String(field);
        return stringField.includes(',') ? `"${stringField}"` : stringField;
      });
      
      csvContent += escapedRow.join(',') + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `coffee-price-calculations-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const filteredCalculations = savedCalculations.filter(calc => {
    const searchLower = searchTerm.toLowerCase();
    return (
      calc.coffeeType.toLowerCase().includes(searchLower) ||
      calc.grade.toLowerCase().includes(searchLower) ||
      calc.certification.toLowerCase().includes(searchLower) ||
      String(calc.quantity).includes(searchTerm)
    );
  });
  
  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };
  
  const renderSelectedCalculation = () => {
    if (!selectedCalculation) return null;
    
    return (
      <Card className="p-4 mb-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Calculation Details</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedCalculation(null)}
          >
            Close
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-medium text-gray-700">Parameters</h4>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{format(parseISO(selectedCalculation.date), 'PPP')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Coffee Type:</span>
                <span>{selectedCalculation.coffeeType === 'arabica' ? 'Arabica' : 'Robusta'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Grade:</span>
                <span>{selectedCalculation.grade.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity:</span>
                <span>{selectedCalculation.quantity.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Certification:</span>
                <span>{selectedCalculation.certification === 'none' ? 'None' : selectedCalculation.certification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Margin:</span>
                <span>{selectedCalculation.marginPercentage}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700">Pricing ({selectedCalculation.currency})</h4>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Base Price:</span>
                <span>{formatCurrency(selectedCalculation.basePrice, selectedCalculation.currency)}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processing Cost:</span>
                <span>{formatCurrency(selectedCalculation.processingCosts, selectedCalculation.currency)}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transport Cost:</span>
                <span>{formatCurrency(selectedCalculation.transportCosts, selectedCalculation.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Certification Premium:</span>
                <span>{formatCurrency(selectedCalculation.certificationPremiums, selectedCalculation.currency)}/kg</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedCalculation.subtotal, selectedCalculation.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Margin:</span>
                <span>{formatCurrency(selectedCalculation.margin, selectedCalculation.currency)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Final Price:</span>
                <span>{formatCurrency(selectedCalculation.finalPrice, selectedCalculation.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price per kg:</span>
                <span>{formatCurrency(selectedCalculation.pricePerKg, selectedCalculation.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Saved Calculations</h3>
        {savedCalculations.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportAll}
          >
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Export All
          </Button>
        )}
      </div>
      
      {selectedCalculation && renderSelectedCalculation()}
      
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search calculations..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredCalculations.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No saved calculations found</p>
          {searchTerm && (
            <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
          )}
          {!searchTerm && (
            <p className="text-sm text-gray-400 mt-2">Use the calculator tab to create and save calculations</p>
          )}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Coffee Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price/kg</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalculations.map((calc) => (
                <TableRow key={calc.id}>
                  <TableCell>{format(parseISO(calc.date), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>
                    {calc.coffeeType === 'arabica' ? 'Arabica' : 'Robusta'} ({calc.grade.toUpperCase()})
                  </TableCell>
                  <TableCell>{calc.quantity.toLocaleString()} kg</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calc.pricePerKg, calc.currency)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(calc.finalPrice, calc.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(calc)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(calc.id)}
                        disabled={viewOnly}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SavedCalculations;
