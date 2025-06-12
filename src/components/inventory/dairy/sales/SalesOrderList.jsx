import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SalesOrderDetails from './SalesOrderDetails';
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@/components/ui/pagination';

const SalesOrderList = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust this value
  const { toast } = useToast();
  const { deleteSalesOrder, loading, fetchSalesOrders } = useSalesOrders();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchSalesOrders();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setSalesOrders(data);
      }
    };

    fetchData();
  }, [toast, fetchSalesOrders]);

  const handleEdit = (id) => {
    navigate(`/inventory/dairy/sales/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sales order?");
    if (!confirmDelete) return;

    const { success, error } = await deleteSalesOrder(id);

    if (success) {
      toast({
        title: "Success",
        description: "Sales order deleted successfully",
      });
      // Refresh sales orders after deletion
      const { data } = await fetchSalesOrders();
      setSalesOrders(data);
    } else if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredSalesOrders = salesOrders?.filter(order => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      order.customer_name?.toLowerCase().includes(searchTerm) ||
      order.order_number?.toLowerCase().includes(searchTerm) ||
      order.payment_status?.toLowerCase().includes(searchTerm) ||
      order.shipping_address?.toLowerCase().includes(searchTerm) ||
      order.customer_email?.toLowerCase().includes(searchTerm) ||
      order.customer_phone?.toLowerCase().includes(searchTerm)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSalesOrders = filteredSalesOrders?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Sales Orders</CardTitle>
        <Input
          type="search"
          placeholder="Search sales orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSalesOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{format(new Date(order.order_date || order.created_at), 'PPP')}</TableCell>
                  <TableCell>UGX {order.total_amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === 'paid' ? 'success' : 'default'}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>Sales Order Details</DialogTitle>
                            <DialogDescription>
                              View all the details of this sales order.
                            </DialogDescription>
                          </DialogHeader>
                          <SalesOrderDetails salesOrder={order} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(order.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id)} disabled={loading}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {currentSalesOrders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No sales orders found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredSalesOrders?.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredSalesOrders.length}
            onPageChange={paginate}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SalesOrderList;
