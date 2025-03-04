
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/supabase";
import { Loader2, Search, FileText, Calendar } from "lucide-react";
import { format } from 'date-fns';

const ProductCataloguesDisplay = ({ onBack }) => {
  const [catalogs, setCatalogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCatalogs, setFilteredCatalogs] = useState([]);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching product catalogs...');
        
        const { data, error } = await supabase
          .from('product_catalogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching catalogs:', error);
          throw error;
        }

        console.log('Catalogs fetched:', data);
        setCatalogs(data || []);
        setFilteredCatalogs(data || []);
      } catch (error) {
        console.error('Error in fetchCatalogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCatalogs(catalogs);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = catalogs.filter(catalog => 
      catalog.catalog_name.toLowerCase().includes(lowercaseSearch) ||
      catalog.catalog_id.toLowerCase().includes(lowercaseSearch) ||
      catalog.status.toLowerCase().includes(lowercaseSearch)
    );
    
    setFilteredCatalogs(filtered);
  }, [searchTerm, catalogs]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Catalogs</CardTitle>
        <Button variant="outline" onClick={onBack}>Back</Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search catalogs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCatalogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No product catalogs found.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Catalog ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCatalogs.map((catalog) => (
                  <TableRow key={catalog.id}>
                    <TableCell className="font-medium">{catalog.catalog_id}</TableCell>
                    <TableCell>{catalog.catalog_name}</TableCell>
                    <TableCell>{getStatusBadge(catalog.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {catalog.effective_date ? format(new Date(catalog.effective_date), 'MMM d, yyyy') : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {catalog.expiry_date ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(catalog.expiry_date), 'MMM d, yyyy')}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {Array.isArray(catalog.products) ? catalog.products.length : 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCataloguesDisplay;
