
import React from 'react';

const ExpensesTracker = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Expenses Tracker</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Expense tracking records will be displayed here.</p>
        <div className="mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Record New Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpensesTracker;
