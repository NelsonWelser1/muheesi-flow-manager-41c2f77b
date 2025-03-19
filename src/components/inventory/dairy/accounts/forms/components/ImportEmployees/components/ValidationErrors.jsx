
import React from 'react';
import { AlertCircle } from "lucide-react";

const ValidationErrors = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
      <div className="flex items-center mb-2">
        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
        <span className="text-sm font-medium text-red-800">
          Please fix the following issues:
        </span>
      </div>
      <ul className="text-xs text-red-700 pl-6 list-disc">
        {errors.slice(0, 5).map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
        {errors.length > 5 && (
          <li>...and {errors.length - 5} more errors</li>
        )}
      </ul>
    </div>
  );
};

export default ValidationErrors;
