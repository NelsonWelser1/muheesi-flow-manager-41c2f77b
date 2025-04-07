
/**
 * Utilities for handling product data in coffee export contracts
 */

// Default product row for coffee contracts
export const createDefaultProductRow = () => ({
  code: "",
  description: "",
  quantity: "",
  pricePerUnit: "",
  unit: "MT", // Default unit (Metric Tons)
  amount: 0,
  comment: ""
});

// Default quality specification row
export const createDefaultQualitySpecRow = () => ({
  parameter: "",
  requirement: "",
  testMethod: "",
  notes: ""
});

// Coffee product codes and descriptions
export const COFFEE_PRODUCTS = {
  arabica: [
    { code: 'A-BugAA', name: 'Arabica Coffee: Bugisu AA' },
    { code: 'A-BugA', name: 'Arabica Coffee: Bugisu A' },
    { code: 'A-BugPB', name: 'Arabica Coffee: Bugisu PB' },
    { code: 'A-BugB', name: 'Arabica Coffee: Bugisu B' },
    { code: 'A-DRUG', name: 'Arabica Coffee: DRUGAR' },
    { code: 'A-PARCH', name: 'Arabica Coffee: Parchment Arabica' }
  ],
  robusta: [
    { code: 'R-FAQ', name: 'Robusta Coffee: FAQ' },
    { code: 'R-S18', name: 'Robusta Coffee: Screen 18' },
    { code: 'R-S15', name: 'Robusta Coffee: Screen 15' },
    { code: 'R-S12', name: 'Robusta Coffee: Screen 12' },
    { code: 'R-ORG', name: 'Robusta Coffee: Organic Robusta' }
  ]
};

// Common quality parameters for coffee
export const QUALITY_PARAMETERS = [
  { name: "Moisture Content", defaultRequirement: "10-12%", defaultTestMethod: "ISO 6673" },
  { name: "Screen Size", defaultRequirement: "15+", defaultTestMethod: "Visual Inspection" },
  { name: "Defects", defaultRequirement: "Max 5 per 300g", defaultTestMethod: "SCAA Protocol" },
  { name: "Cup Score", defaultRequirement: "80+ points", defaultTestMethod: "SCA Cupping Protocol" },
  { name: "Flavor Profile", defaultRequirement: "Clean, balanced, sweet", defaultTestMethod: "Sensory Evaluation" },
  { name: "Color", defaultRequirement: "Even, consistent", defaultTestMethod: "Visual Assessment" }
];

// Calculate the total contract value from product rows
export const calculateTotalContractValue = (products) => {
  if (!Array.isArray(products)) return 0;
  
  return products.reduce((total, product) => {
    const amount = parseFloat(product.amount) || 0;
    return total + amount;
  }, 0);
};

// Calculate the amount for a specific product row
export const calculateProductAmount = (product) => {
  const quantity = parseFloat(product.quantity) || 0;
  const pricePerUnit = parseFloat(product.pricePerUnit) || 0;
  return quantity * pricePerUnit;
};

// Update product amounts and totals
export const updateProductAmounts = (products) => {
  return products.map(product => ({
    ...product,
    amount: calculateProductAmount(product)
  }));
};

// Generate a new contract number with date-based prefix
export const generateContractNumber = (buyerPrefix = "KCL") => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${buyerPrefix}-${year}${month}-${randomNum}`;
};
