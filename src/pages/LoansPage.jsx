
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Home, Trash2, PenLine, Clock } from "lucide-react";
import { format } from 'date-fns';
import { useLoanData } from '@/hooks/useLoanData';
import { toast } from 'sonner';

const LoansPage = () => {
  const navigate = useNavigate();
  const { loansData, isLoading, deleteLoan } = useLoanData();
  
  const handleDeleteLoan = async (loanId) => {
    if (window.confirm(`Are you sure you want to delete loan ${loanId}?`)) {
      const success = await deleteLoan(loanId);
      if (success) {
        toast.success(`Loan ${loanId} deleted successfully`);
      }
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loan Management</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <Clock className="inline mr-2" />
            {format(new Date(), 'PPpp')}
          </div>
          <Button variant="outline" onClick={() => navigate('/home')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
      
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loans</CardTitle>
          <Button onClick={() => navigate('/loans/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Loan
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-4">Loading loan data...</div>
          ) : loansData.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-gray-500">No loans found</p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => navigate('/loans/add')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Loan
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loansData.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.displayId}</TableCell>
                    <TableCell>{loan.institution}</TableCell>
                    <TableCell>{loan.amount}</TableCell>
                    <TableCell>{loan.interest_rate}%</TableCell>
                    <TableCell>{format(new Date(loan.start_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(loan.due_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        loan.status === 'active' ? 'bg-green-100 text-green-800' :
                        loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        loan.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/loans/edit/${loan.displayId}`)}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteLoan(loan.displayId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoansPage;
