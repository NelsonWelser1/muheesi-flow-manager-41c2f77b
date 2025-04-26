
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Download, RefreshCw, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { format } from 'date-fns';

const CattleManagement = () => {
  // State for cattle list and form
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [cattleList, setCattleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filter and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    tag_number: '',
    name: '',
    type: '',
    breed: '',
    date_of_birth: '',
    weight: '',
    health_status: 'good',
    purchase_date: '',
    notes: '',
  });
  
  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { toast } = useToast();

  // Fetch cattle data
  const fetchCattleData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('farm_id', 'bukomero')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching cattle data:', error);
        setError(error);
        toast({
          title: "Error",
          description: "Failed to load cattle data",
          variant: "destructive",
        });
      } else {
        console.info('Fetched cattle data:', data);
        setCattleList(data || []);
      }
    } catch (err) {
      console.error('Error fetching cattle data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cattle data on component mount
  useEffect(() => {
    fetchCattleData();
  }, []);

  // Filter cattle based on search term and type filter
  const filteredCattle = cattleList.filter(cattle => {
    // Filter by search term
    const searchMatch = 
      cattle.tag_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cattle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cattle.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type
    const typeMatch = filterType === 'all' || cattle.type === filterType;
    
    return searchMatch && typeMatch;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if any
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handle select field changes
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if any
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.tag_number) errors.tag_number = "Tag number is required";
    if (!formData.type) errors.type = "Type is required";
    if (!formData.breed) errors.breed = "Breed is required";
    
    // Optional validation for numeric fields
    if (formData.weight && isNaN(parseFloat(formData.weight))) {
      errors.weight = "Weight must be a number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Form is valid if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare the data for submission
      const cattleData = {
        ...formData,
        farm_id: 'bukomero',
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };
      
      // Submit to Supabase
      const { data, error } = await supabase
        .from('cattle_inventory')
        .insert([cattleData])
        .select();
      
      if (error) {
        console.error('Error adding cattle:', error);
        toast({
          title: "Error",
          description: "Failed to register cattle",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Cattle registered successfully",
        });
        
        // Reset form
        setFormData({
          tag_number: '',
          name: '',
          type: '',
          breed: '',
          date_of_birth: '',
          weight: '',
          health_status: 'good',
          purchase_date: '',
          notes: '',
        });
        
        // Refresh cattle list
        fetchCattleData();
        
        // Switch back to list view
        setShowRegistrationForm(false);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cattle deletion
  const handleDeleteCattle = async (id) => {
    if (confirm("Are you sure you want to delete this cattle record?")) {
      try {
        const { error } = await supabase
          .from('cattle_inventory')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting cattle:', error);
          toast({
            title: "Error",
            description: "Failed to delete cattle record",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Cattle record deleted successfully",
          });
          fetchCattleData();
        }
      } catch (err) {
        console.error('Error deleting cattle:', err);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    
    return years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '< 1 year';
  };

  const cattleTypes = [
    "Dairy Cow", "Bull", "Heifer", "Calf", "Steer"
  ];

  const cattleBreeds = [
    "Holstein-Friesian", "Jersey", "Guernsey", "Ayrshire", "Brown Swiss",
    "Ankole", "Boran", "Sahiwal", "N'Dama", "Zebu", "Nganda", "Mixed-breed"
  ];

  return (
    <Card className="border-green-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Cattle Registry</CardTitle>
          <Button 
            onClick={() => setShowRegistrationForm(!showRegistrationForm)}
            className="flex items-center gap-2"
          >
            {showRegistrationForm ? 'View Cattle List' : (
              <>
                <PlusCircle className="h-4 w-4" />
                Register New Cattle
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showRegistrationForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag_number">Tag Number <span className="text-red-500">*</span></Label>
                <Input
                  id="tag_number"
                  name="tag_number"
                  placeholder="BD-2024-001"
                  value={formData.tag_number}
                  onChange={handleInputChange}
                  className={formErrors.tag_number ? "border-red-500" : ""}
                />
                {formErrors.tag_number && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.tag_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Cattle name (optional)"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className={formErrors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select cattle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cattleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.type && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">Breed <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.breed}
                  onValueChange={(value) => handleSelectChange("breed", value)}
                >
                  <SelectTrigger className={formErrors.breed ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select breed" />
                  </SelectTrigger>
                  <SelectContent>
                    {cattleBreeds.map((breed) => (
                      <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.breed && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.breed}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Weight in kg"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={formErrors.weight ? "border-red-500" : ""}
                />
                {formErrors.weight && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.weight}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="health_status">Health Status</Label>
                <Select 
                  value={formData.health_status}
                  onValueChange={(value) => handleSelectChange("health_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select health status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input
                  id="purchase_date"
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional information about the cattle"
                className="min-h-[100px]"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowRegistrationForm(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? "Registering..." : "Register Cattle"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search by tag, name or breed"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {cattleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={fetchCattleData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Tag #</th>
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 text-left font-medium">Type</th>
                    <th className="p-3 text-left font-medium">Breed</th>
                    <th className="p-3 text-left font-medium">Age</th>
                    <th className="p-3 text-left font-medium">Health</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="p-3 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Loading cattle data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="p-3 text-center text-red-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <p>Error loading cattle data</p>
                          <p className="text-sm">{error.message || "Unknown error"}</p>
                          <Button variant="outline" size="sm" onClick={fetchCattleData}>
                            Try Again
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCattle.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-3 text-center">
                        <p className="text-muted-foreground">No cattle records found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCattle.map((cattle) => (
                      <tr key={cattle.id} className="border-t hover:bg-muted/30">
                        <td className="p-3">{cattle.tag_number}</td>
                        <td className="p-3">{cattle.name || 'Unnamed'}</td>
                        <td className="p-3">{cattle.type}</td>
                        <td className="p-3">{cattle.breed}</td>
                        <td className="p-3">{calculateAge(cattle.date_of_birth)}</td>
                        <td className="p-3">
                          <Badge className={`
                            ${cattle.health_status === 'excellent' ? 'bg-green-100 text-green-800' :
                              cattle.health_status === 'good' ? 'bg-blue-100 text-blue-800' :
                              cattle.health_status === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                              cattle.health_status === 'poor' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'}
                          `}>
                            {cattle.health_status?.charAt(0).toUpperCase() + cattle.health_status?.slice(1) || 'Unknown'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteCattle(cattle.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredCattle.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Showing {filteredCattle.length} cattle record{filteredCattle.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CattleManagement;
