import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
         AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, 
         AlertDialogAction } from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from 'lucide-react';
import { useAccountManagement } from '@/hooks/useAccountManagement';
import AccountListItem from './AccountListItem';
import AccountFilters from './AccountFilters';

const ManageAccounts = () => {
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const { accounts, isLoading, deleteAccount } = useAccountManagement();

  const handleAccountSelection = (accountId, isSelected) => {
    setSelectedAccounts(prev => 
      isSelected 
        ? [...prev, accountId]
        : prev.filter(id => id !== accountId)
    );
  };

  const handleDelete = async () => {
    try {
      await Promise.all(selectedAccounts.map(id => deleteAccount.mutateAsync(id)));
      toast({
        title: "Accounts deleted successfully",
        description: `${selectedAccounts.length} account(s) have been removed.`
      });
      setSelectedAccounts([]);
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error deleting accounts",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredAccounts = accounts?.filter(account => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      account.username.toLowerCase().includes(searchLower) ||
      account.email.toLowerCase().includes(searchLower) ||
      account.role.toLowerCase().includes(searchLower);
    const matchesCompany = selectedCompany === 'All' || account.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">System Administrator - Account Management</h2>
        <Button onClick={() => {/* Implement new account creation */}}>
          <Plus className="w-4 h-4 mr-2" />
          New Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Account Management</CardTitle>
            {selectedAccounts.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedAccounts.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <AccountFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCompany={selectedCompany}
            />
            
            <ScrollArea className="h-[600px] mt-4">
              <div className="space-y-4">
                {isLoading ? (
                  <p>Loading accounts...</p>
                ) : filteredAccounts?.map((account) => (
                  <AccountListItem
                    key={account.user_id}
                    account={account}
                    isSelected={selectedAccounts.includes(account.user_id)}
                    onSelect={handleAccountSelection}
                    onEdit={() => {/* Implement edit functionality */}}
                  />
                ))}
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected accounts
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageAccounts;
