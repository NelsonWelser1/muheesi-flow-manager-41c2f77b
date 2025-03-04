
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const FormActions = ({ isEditing, resetForm }) => {
  return (
    <div className="flex justify-end gap-2 md:col-span-2 mt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={resetForm}
      >
        Cancel
      </Button>
      <Button type="submit" className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        {isEditing ? 'Update' : 'Save'}
      </Button>
    </div>
  );
};

export default FormActions;
