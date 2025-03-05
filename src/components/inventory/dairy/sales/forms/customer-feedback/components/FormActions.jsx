
import React from 'react';
import { Button } from "@/components/ui/button";

const FormActions = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </div>
  );
};

export default FormActions;
