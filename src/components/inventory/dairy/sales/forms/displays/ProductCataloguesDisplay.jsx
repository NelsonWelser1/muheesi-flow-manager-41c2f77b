
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";

const ProductCataloguesDisplay = ({ onBack }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [catalogues, setCatalogues] = useState([]);

  useEffect(() => {
    const fetchCatalogues = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('product_catalogues')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          console.log('Catalogues fetched:', data);
          setCatalogues(data);
        }
      } catch (error) {
        console.error('Error fetching catalogues:', error);
        toast({
          title: "Error",
          description: "Failed to load catalogues: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogues();
  }, [toast]);

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Catalogues</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading catalogues...</p>
          ) : catalogues.length === 0 ? (
            <p>No catalogues found. Create your first product catalogue.</p>
          ) : (
            <p>Found {catalogues.length} catalogues. Full display UI coming soon.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCataloguesDisplay;
