
/**
 * Utility functions for the coffee price calculator
 */

// Format currency amounts
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Calculate total pricing based on inputs
export const calculateCoffeePrice = ({
  coffeeType,
  grade,
  quantity,
  basePrice,
  processingCosts,
  transportCosts,
  certificationPremiums,
  marginPercentage
}) => {
  // Calculate components
  const baseTotal = basePrice * quantity;
  const processingTotal = processingCosts * quantity;
  const transportTotal = transportCosts;
  const certificationTotal = certificationPremiums * quantity;
  
  const subtotal = baseTotal + processingTotal + transportTotal + certificationTotal;
  const margin = subtotal * (marginPercentage / 100);
  const finalPrice = subtotal + margin;
  const pricePerKg = finalPrice / quantity;
  
  return {
    baseTotal,
    processingTotal,
    transportTotal,
    certificationTotal,
    subtotal,
    margin,
    finalPrice,
    pricePerKg
  };
};

// Market price reference data
export const MARKET_PRICE_REFERENCES = {
  arabica: {
    aa: { basePrice: 4.20, premiumFactor: 1.00 },
    a: { basePrice: 3.80, premiumFactor: 0.90 },
    pb: { basePrice: 3.90, premiumFactor: 0.93 },
    b: { basePrice: 3.40, premiumFactor: 0.81 },
    specialty: { basePrice: 5.50, premiumFactor: 1.31 },
    organic: { basePrice: 4.80, premiumFactor: 1.14 }
  },
  robusta: {
    screen18: { basePrice: 2.70, premiumFactor: 1.00 },
    screen15: { basePrice: 2.40, premiumFactor: 0.89 },
    screen12: { basePrice: 2.20, premiumFactor: 0.81 },
    organic: { basePrice: 3.20, premiumFactor: 1.19 },
    faq: { basePrice: 2.00, premiumFactor: 0.74 }
  },
  certification: {
    none: 0,
    organic: 0.45,
    fairtrade: 0.35,
    rainforest: 0.30,
    utz: 0.28,
    '4c': 0.20
  }
};

// Get suggested base price based on coffee type and grade
export const getSuggestedBasePrice = (coffeeType, grade) => {
  if (!coffeeType || !grade) return 0;
  
  try {
    return MARKET_PRICE_REFERENCES[coffeeType][grade].basePrice;
  } catch (e) {
    console.warn('Invalid coffee type or grade', { coffeeType, grade });
    return 0;
  }
};

// Export a CSV of calculation results
export const exportCalculationsToCSV = (calculations) => {
  if (!calculations || calculations.length === 0) return null;
  
  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add headers
  csvContent += "Date,Coffee Type,Grade,Quantity (kg),Base Price,Processing Cost,Transport Cost,Certification,Margin %,Final Price,Price per kg,Currency\n";
  
  // Add rows
  calculations.forEach(calc => {
    const row = [
      calc.date ? new Date(calc.date).toISOString().split('T')[0] : 'N/A',
      calc.coffeeType,
      calc.grade,
      calc.quantity,
      calc.basePrice,
      calc.processingCosts,
      calc.transportCosts,
      calc.certification,
      calc.marginPercentage,
      calc.finalPrice,
      calc.pricePerKg,
      calc.currency
    ];
    
    // Escape any commas in the data
    const escapedRow = row.map(field => {
      const stringField = String(field || '');
      return stringField.includes(',') ? `"${stringField}"` : stringField;
    });
    
    csvContent += escapedRow.join(',') + "\n";
  });
  
  return encodeURI(csvContent);
};
