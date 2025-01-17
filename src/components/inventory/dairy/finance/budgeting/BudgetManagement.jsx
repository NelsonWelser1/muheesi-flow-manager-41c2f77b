import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import BudgetAllocationForm from './components/BudgetAllocationForm';
import BudgetOverview from './components/BudgetOverview';

const budgetCategories = {
  'OPERATIONAL COSTS': [
    'Milk Purchase', 'Water Pumping bill', 'Electricity Bill', 'Heating',
    'Packaging', 'Rent', 'Office administration', 'Communication',
    'Stationary', 'Post harvest losses', 'Meetings', 'Internet',
    'Management system', 'Additives'
  ],
  'FIXED EXPENSES': [
    'Rent', 'Detergents', 'Plant equipment maintenance', 'Lab equipment and chemicals',
    'Safety and compliance', 'Security', 'Motor vehicle repairs', 'Electrical repairs'
  ],
  'HUMAN RESOURCE': [
    'Salaries and wages', 'Staff welfare', 'Operational safety and health',
    'NSSF', 'Allowances', 'Accommodation', 'Personal Protective Equipment',
    'Training', 'Recruitment'
  ],
  'MARKETING': [
    'Advertising', 'Brocures', 'Distribution', 'Allowance', 'Lunch'
  ],
  'CAPITAL EXPENDITURE': [
    'New equipment', 'Office Equipment'
  ],
  'LEGAL AND COMPLIANCE': [
    'Taxes', 'Penalties', 'Audit fees', 'Legal fees', 'PAYE',
    'Withholding tax', 'Trademark registration', 'Filing legal documents',
    'VAT', 'Trading Licence', 'GDA', 'UNBS Certification'
  ],
  'RESEARCH AND RESOURCE MOB': []
};

const initialBudget2025 = {
  department: 'OPERATIONAL COSTS',
  category: 'Milk Purchase',
  allocated: 691200000,
  spent: 0,
  fiscalYear: 2025,
  startDate: '2025-01-15',
  monthly: 57600000,
  weekly: 14400000
};

const BudgetManagement = () => {
  console.log('Rendering BudgetManagement component');
  
  const [budgets, setBudgets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('OPERATIONAL COSTS');
  const [newBudget, setNewBudget] = useState({
    department: '',
    category: '',
    allocated: '',
    spent: '',
    fiscalYear: 2025,
    startDate: '2025-01-15',
    monthly: '',
    weekly: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (budgets.length === 0) {
      setBudgets([initialBudget2025]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating new budget allocation:', newBudget);
    
    setBudgets([...budgets, { 
      ...newBudget, 
      id: Date.now(),
      allocated: parseFloat(newBudget.allocated),
      spent: parseFloat(newBudget.spent) || 0,
      monthly: parseFloat(newBudget.monthly) || 0,
      weekly: parseFloat(newBudget.weekly) || 0
    }]);
    
    setNewBudget({
      department: '',
      category: '',
      allocated: '',
      spent: '',
      fiscalYear: 2025,
      startDate: '2025-01-15',
      monthly: '',
      weekly: ''
    });
    
    toast({
      title: "Success",
      description: "Budget allocation created successfully",
    });
  };

  return (
    <div className="space-y-6">
      <BudgetAllocationForm
        budgetCategories={budgetCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        newBudget={newBudget}
        setNewBudget={setNewBudget}
        handleSubmit={handleSubmit}
      />
      <BudgetOverview 
        budgetCategories={budgetCategories}
        budgets={budgets}
      />
    </div>
  );
};

export default BudgetManagement;