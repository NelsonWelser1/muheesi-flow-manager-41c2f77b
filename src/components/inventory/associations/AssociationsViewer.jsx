
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { useAssociationForm } from '@/hooks/useAssociationForm';
import { useToast } from "@/components/ui/use-toast";

const AssociationsViewer = ({ onBack, isKazo }) => {
  const { toast } = useToast();
  const { associations, loading, fetchAssociations } = useAssociationForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchAssociations();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAssociations = associations.filter(association =>
    association.association_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (association.registration_number && association.registration_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedAssociations = [...filteredAssociations].sort((a, b) => {
    if (sortField === 'created_at') {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'member_count') {
      const countA = a.member_count || 0;
      const countB = b.member_count || 0;
      return sortDirection === 'asc' ? countA - countB : countB - countA;
    } else {
      const valueA = (a[sortField] || '').toLowerCase();
      const valueB = (b[sortField] || '').toLowerCase();
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });

  const getAssociationTypeLabel = (type) => {
    switch (type) {
      case 'farmers': return 'Farmers Association';
      case 'cooperative': return 'Cooperative';
      case 'union': return 'Farmers Union';
      default: return type;
    }
  };

  const getCoffeeTypesLabel = (types) => {
    switch (types) {
      case 'arabica': return 'Arabica';
      case 'robusta': return 'Robusta';
      case 'both': return 'Arabica & Robusta';
      default: return types;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Registered Associations - {isKazo ? 'Kazo Coffee Development Project' : 'KAJON Coffee Limited'}
        </h3>
        <Button onClick={onBack} variant="outline" size="sm">
          Back to Form
        </Button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search by name or registration number..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sortedAssociations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No associations found. {searchTerm ? 'Try a different search term.' : 'Add some associations to get started.'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAssociations.map((association) => (
              <Card key={association.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-1 truncate">{association.association_name}</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{getAssociationTypeLabel(association.association_type)}</Badge>
                        <Badge variant="outline">{getCoffeeTypesLabel(association.coffee_types)}</Badge>
                      </div>
                      {association.registration_number && (
                        <p className="text-sm text-muted-foreground">
                          Reg #: {association.registration_number}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="font-medium">{association.member_count || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Farm Area</p>
                        <p className="font-medium">
                          {association.total_farm_area ? `${association.total_farm_area} acres` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex items-center mt-4 pt-4 border-t">
                      <Calendar className="h-3 w-3 mr-1" />
                      Registered: {format(new Date(association.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociationsViewer;
