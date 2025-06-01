
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-48">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded col-span-1"></div>
          <div className="h-24 bg-gray-200 rounded col-span-1"></div>
          <div className="h-24 bg-gray-200 rounded col-span-1"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
