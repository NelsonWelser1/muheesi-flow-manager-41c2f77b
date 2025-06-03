
import React from 'react';

const PerformanceRating = ({ rating, showText = false }) => {
  const getRatingColor = (rating) => {
    if (!rating) return 'bg-gray-200';
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-blue-500';
    if (rating >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!rating) return <span className="text-gray-400">Not rated</span>;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div 
            key={star} 
            className={`h-2 w-2 rounded-full ${star <= rating ? getRatingColor(rating) : 'bg-gray-200'}`} 
          />
        ))}
      </div>
      {showText && <span className="text-sm text-gray-600">{rating}/5</span>}
    </div>
  );
};

export default PerformanceRating;
