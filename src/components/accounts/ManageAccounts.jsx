import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
         AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, 
         AlertDialogAction } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, Edit, Clock, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

const statusColors = {
  Active: "bg-green-500",
  Pending: "bg-yellow-500",
  Deactivated: "bg-red-500"
};

const ManageAccounts = () => {
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['userAccounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('*')
        .order('date_created', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (userIds) => {
      const { error } = await supabase
        .from('user_accounts')
        .delete()
        .in('user_id', userIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('userAccounts');
      toast({
        title: "Accounts deleted successfully",
        description: `${selectedAccounts.length} account(s) have been removed.`
      });
      setSelectedAccounts([]);
      setShowDeleteDialog(false);
    }
  });

  const filteredAccounts = accounts?.filter(account => {
    const matchesSearch = account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'All' || account.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const handleStatusChange = async (userId, newStatus) => {
    const { error } = await supabase
      .from('user_accounts')
      .update({ status: newStatus })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    } else {
      queryClient.invalidateQueries('userAccounts');
      toast({
        title: "Status updated",
        description: `Account status changed to ${newStatus}`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Manage Accounts</h2>
        <Button onClick={() => {/* Implement new account creation */}}>
          <Plus className="w-4 h-4 mr-2" />
          New Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Account Management</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {selectedAccounts.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Companies</TabsTrigger>
              <TabsTrigger value="grand-berna">Grand Berna</TabsTrigger>
              <TabsTrigger value="kajon">KAJON Coffee</TabsTrigger>
              <TabsTrigger value="kyalima">Kyalima Farmers</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[500px] mt-4">
              <div className="space-y-4">
                {filteredAccounts?.map((account) => (
                  <Card key={account.user_id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedAccounts.includes(account.user_id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAccounts([...selectedAccounts, account.user_id]);
                            } else {
                              setSelectedAccounts(selectedAccounts.filter(id => id !== account.user_id));
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <div>
                          <h3 className="font-medium">{account.username}</h3>
                          <p className="text-sm text-muted-foreground">{account.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={statusColors[account.status]}>
                          {account.status}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Shield className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
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
              onClick={() => deleteMutation.mutate(selectedAccounts)}
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